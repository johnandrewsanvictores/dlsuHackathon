import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import User from "../models/userModel.js";
import axios from "axios";
import { getJobs } from "./jobInfoController.js";
import Fuse from "fuse.js";

async function getSkills(parsedText) {
  try {
    const prompt = `
    This is parsed raw text from a resume PDF using pdfjs-dist. The content is jumbled and lacks structure. Please analyze the text and extract only the skills, prioritizing technical/hard skills from a dedicated skills section if available, and if no skills section exists, infer technical skills from other parts of the resume such as summary, experience, projects, or objectives; if no technical skills can be identified anywhere, extract soft skills instead. Send the output in valid JSON format like {"hardSkills":"skill1, skill2, skill3",and soft skills if any {"softSkills":"skill1, skill2, skill3"}, including only the skill names separated by commas, and leave the value empty if no matching skills are found. This is the raw text: ${parsedText}
    `;

    const encodedPrompt = encodeURIComponent(prompt);
    const pollinationsURL = `https://text.pollinations.ai/${encodedPrompt}`;

    const pollRes = await axios.get(pollinationsURL);

    // Handle different response types
    let responseText = "";
    if (typeof pollRes.data === "string") {
      responseText = pollRes.data;
    } else if (pollRes.data && typeof pollRes.data === "object") {
      // If it's already an object with the skills, use it directly
      if (pollRes.data.hardSkills || pollRes.data.softSkills) {
        return { data: pollRes.data };
      }
      responseText = JSON.stringify(pollRes.data);
    } else {
      responseText = String(pollRes.data);
    }

    // Try to extract JSON from the response
    let skillsData = { hardSkills: "" };

    try {
      // Look for JSON pattern in response
      const jsonMatch = responseText.match(/\{[^}]*"hardSkills"[^}]*\}/);
      if (jsonMatch) {
        skillsData = JSON.parse(jsonMatch[0]);
      } else {
        // Try to parse the entire response as JSON
        try {
          const parsed = JSON.parse(responseText);
          if (parsed.hardSkills) {
            skillsData = parsed;
          }
        } catch (e) {
          // Fallback: extract skills manually from common patterns
          const skillPatterns = [
            /(?:javascript|js|react|node|python|java|c\+\+|html|css|sql|mongodb|express|angular|vue|php|mysql|unity|asp\.net)/gi,
          ];

          const foundSkills = [];
          skillPatterns.forEach((pattern) => {
            const matches = responseText.match(pattern);
            if (matches) {
              foundSkills.push(...matches.map((s) => s.toLowerCase()));
            }
          });

          if (foundSkills.length > 0) {
            skillsData.hardSkills = [...new Set(foundSkills)].join(", ");
          }
        }
      }
    } catch (parseError) {
      console.log("JSON parsing failed, using fallback:", parseError);
      console.log("Response was:", responseText);
    }

    return { data: skillsData };
  } catch (error) {
    console.error("Error getting skills:", error);
    return { data: { hardSkills: "" } };
  }
}

export const getResumeContext = async (req, res) => {
  try {
    const buffer = await fs.readFile(req.file.path);
    const uint8Array = new Uint8Array(buffer); // ✅ Convert Buffer to Uint8Array

    const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const loadingTask = getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      text += strings.join(" ") + "\n";
    }

    await getSkills(text);

    await fs.unlink(req.file.path);

    const _id = req.user.userId;

    const addResumeContext = await User.findByIdAndUpdate(
      _id,
      { $set: { resumeContext: text } },
      { new: true }
    );

    res.json({ text });
  } catch (err) {
    console.error("🔥 PDF PARSE ERROR:", err);
    res.status(500).json({ error: "Failed to parse PDF" });
  }
};

export const filterListingByResume = async (req, res) => {
  try {
    // Handle both body and query parameters for compatibility
    const body = req.body || {};
    const { additionalFilters = {}, page = 1, limit = 12 } = body;

    console.log("Resume filter request received:", {
      hasAdditionalFilters: !!additionalFilters,
      additionalFiltersCount: Object.keys(additionalFilters || {}).length,
      page,
      limit,
    });

    const data = await getJobs({});
    if (data.success === false) {
      return res.status(500).json({ error: "Failed to get jobs" });
    }

    let jobs = data.jobInfos;

    // Apply additional filters first (only if they exist and have values)
    if (
      additionalFilters &&
      typeof additionalFilters === "object" &&
      Object.keys(additionalFilters).length > 0
    ) {
      jobs = jobs.filter((job) => {
        // Search filter
        if (additionalFilters.search) {
          const searchTerm = additionalFilters.search.toLowerCase();
          const searchMatch =
            job.jobTitle?.toLowerCase().includes(searchTerm) ||
            job.companyName?.toLowerCase().includes(searchTerm) ||
            job.shortDescription?.toLowerCase().includes(searchTerm);
          if (!searchMatch) return false;
        }

        // Work arrangement filter
        if (
          additionalFilters.workArrangement &&
          additionalFilters.workArrangement !== "all"
        ) {
          if (job.workArrangement !== additionalFilters.workArrangement)
            return false;
        }

        // Employment type filter
        if (
          additionalFilters.employmentType &&
          additionalFilters.employmentType !== "all"
        ) {
          if (job.employmentType !== additionalFilters.employmentType)
            return false;
        }

        // Experience level filter
        if (
          additionalFilters.experienceLevel &&
          additionalFilters.experienceLevel !== "all"
        ) {
          if (job.experienceLevel !== additionalFilters.experienceLevel)
            return false;
        }

        // Industry filter
        if (
          additionalFilters.industry &&
          additionalFilters.industry !== "all"
        ) {
          if (job.industry !== additionalFilters.industry) return false;
        }

        // Location filter
        if (additionalFilters.location) {
          const locationMatch = job.location
            ?.toLowerCase()
            .includes(additionalFilters.location.toLowerCase());
          if (!locationMatch) return false;
        }

        // Salary range filters
        if (additionalFilters.salaryMin) {
          const minSalary = parseInt(additionalFilters.salaryMin);
          if (job.salaryRange?.minimum && job.salaryRange.minimum < minSalary)
            return false;
          if (job.salaryRange?.maximum && job.salaryRange.maximum < minSalary)
            return false;
        }

        if (additionalFilters.salaryMax) {
          const maxSalary = parseInt(additionalFilters.salaryMax);
          if (job.salaryRange?.minimum && job.salaryRange.minimum > maxSalary)
            return false;
        }

        return true;
      });
    }

    const resumeContext = await User.findOne({ _id: req.user.userId }).select(
      "resumeContext -_id"
    );
    if (!resumeContext) {
      return res.status(400).json({ error: "Resume not found" });
    }

    const resumeSkillsData = await getSkills(resumeContext.resumeContext);
    const resumeSkillsString = resumeSkillsData.data?.hardSkills || "";
    const resumeSkills = resumeSkillsString
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (resumeSkills.length === 0) {
      return res.status(200).json({
        filteredJobs: [],
        message:
          "No skills found in resume. Please upload a more detailed resume or manually search for jobs.",
        resumeSkills: [],
        matchedJobsCount: 0,
        totalJobsProcessed: jobs.length,
      });
    }

    // Preprocess resume skills and job descriptions once
    const resumeSkillsSet = new Set(
      resumeSkills.map((skill) => skill.toLowerCase())
    );

    // Preprocess text helper
    const preprocessText = (text) =>
      text.toLowerCase().replace(/[^\w\s]/gi, "");

    // Function to match one job
    const matchJobSkills = (job) => {
      const jobText = preprocessText(
        `${job.jobTitle || ""} ${job.shortDescription || ""} ${
          job.companyName || ""
        }`
      );

      let matchedSkills = [];
      let score = 0;

      // Check direct matches first
      resumeSkills.forEach((skill) => {
        const skillLower = skill.toLowerCase();
        if (jobText.includes(skillLower)) {
          matchedSkills.push(skill);
          score += 2; // Direct match gets higher score
        }
      });

      // Perform fuzzy matching if no direct match found
      resumeSkills.forEach((skill) => {
        const skillLower = skill.toLowerCase();
        if (!matchedSkills.includes(skill)) {
          const words = jobText.split(/\s+/);
          const skillWords = skillLower.split(/\s+/);

          for (const word of words) {
            for (const skillWord of skillWords) {
              if (skillWord.length > 2 && word.includes(skillWord)) {
                matchedSkills.push(skill);
                score += 1;
                break;
              }
            }
          }
        }
      });

      const finalScore =
        resumeSkills.length > 0 ? (score / (resumeSkills.length * 2)) * 100 : 0;

      if (finalScore > 10) {
        // Ensure we return a clean object without Mongoose metadata
        const cleanJob = job.toObject ? job.toObject() : { ...job };
        return {
          ...cleanJob,
          matchScore: Math.min(100, finalScore),
          matchedSkills: [...new Set(matchedSkills)], // Remove duplicates
        };
      }
      return null;
    };

    console.log("Resume skills found:", resumeSkills);
    console.log("Total jobs to process:", jobs.length);

    // Use Promise.all to parallelize job processing
    const results = await Promise.all(jobs.map((job) => matchJobSkills(job)));

    const allFilteredJobs = results
      .filter((r) => r !== null)
      .sort((a, b) => b.matchScore - a.matchScore); // highest match first

    console.log("Filtered jobs count:", allFilteredJobs.length);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = allFilteredJobs.slice(startIndex, endIndex);

    return res.status(200).json({
      filteredJobs: paginatedJobs,
      resumeSkills,
      totalJobsProcessed: jobs.length,
      matchedJobsCount: allFilteredJobs.length,
      currentPage: page,
      totalPages: Math.ceil(allFilteredJobs.length / limit),
      hasNextPage: endIndex < allFilteredJobs.length,
      hasPrevPage: page > 1,
      message:
        allFilteredJobs.length > 0
          ? "Jobs matched successfully"
          : "No matching jobs found",
    });
  } catch (err) {
    console.error("Resume filtering error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};
