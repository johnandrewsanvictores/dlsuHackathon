import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import User from "../models/userModel.js";
import axios from "../config/axios.js";
import {getJobs} from "./jobInfoController.js";
import Fuse from 'fuse.js';

async function getSkills(parsedText) {
    const prompt = `
    This is parsed raw text from a resume PDF using pdfjs-dist. The content is jumbled and lacks structure. Please analyze the text and extract only the skills, prioritizing technical/hard skills from a dedicated skills section if available, and if no skills section exists, infer technical skills from other parts of the resume such as summary, experience, projects, or objectives; if no technical skills can be identified anywhere, extract soft skills instead. Send the output in valid JSON format like {"hardSkills":"skill1, skill2, skill3",and soft skills if any {"softSkills":"skill1, skill2, skill3"}, including only the skill names separated by commas, and leave the value empty if no matching skills are found. This is the raw text: ${parsedText}
    `

    const encodedPrompt = encodeURIComponent(prompt);
    const pollinationsURL = `https://text.pollinations.ai/${encodedPrompt}`;

    const pollRes = await axios.get(pollinationsURL);

    return pollRes;
}

export const getResumeContext = async (req, res) => {
    try {
        const buffer = await fs.readFile(req.file.path);
        const uint8Array = new Uint8Array(buffer); // ✅ Convert Buffer to Uint8Array

        const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
        const loadingTask = getDocument({ data: uint8Array });
        const pdf = await loadingTask.promise;

        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            text += strings.join(' ') + '\n';
        }

        await getSkills(text);

        await fs.unlink(req.file.path);

        const _id = req.user.userId;

        const addResumeContext = await User.findByIdAndUpdate(
            _id,
            { $set: {resumeContext: text} },
            { new: true }
        );

        res.json({ text });
    } catch (err) {
        console.error('🔥 PDF PARSE ERROR:', err);
        res.status(500).json({ error: 'Failed to parse PDF' });
    }
}


export const filterListingByResume = async (req, res) => {
    try {

        const data = await getJobs({limit: 100});

        if(data.success == false) {
            return res.status(500).json({ error: 'Failed to parse PDF' });
        }

        var jobs = data.jobInfos;

        const resumeContext = await User.findOne({
            _id: req.user.userId
        }).select('resumeContext -_id');

        if(!resumeContext) {
            return res.status(400).json({ error: 'Resume not found' });
        }

        const resumeSkillsData = await getSkills(resumeContext);
        const resumeSkillsString = resumeSkillsData.data?.hardSkills || '';
        const resumeSkills = resumeSkillsString.split(',').map(skill => skill.trim());

        // Preprocess text helper
        const preprocessText = (text) => text.toLowerCase().replace(/[^\w\s]/gi, '');

        // Fuse.js instance
        const fuse = new Fuse(resumeSkills, {
            includeScore: true,
            threshold: 0.5 // adjust fuzziness
        });

        // Function to match one job
        const matchJobSkills = async (job) => {
            const jobText = preprocessText(job.shortDescription);

            const matchedSkills = resumeSkills.filter(skill =>
                fuse.search(jobText).some(result => result.item === skill)
            );

            const score = (matchedSkills.length / resumeSkills.length) * 100;

            return score > 0 ? { job, score, matchedSkills } : null;
        };

        jobs = [
            {
                shortDescription: "This is reactjs"
            },
            {
                shortDescription: "This is node js"
            }
        ]
        // Process all jobs in parallel
        const results = await Promise.all(jobs.map(matchJobSkills));
        const filteredJobs = results
            .filter(r => r !== null)
            .sort((a, b) => b.score - a.score); // highest match first

        return res.status(200).json({ filteredJobs });
    }catch (err) {
        res.status(500).json({ error: 'Server error' + err});
    }
}