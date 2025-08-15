import React, { useState, useEffect } from "react";
import Navbar from "../components/navigation/nav";
import api from "../../axios";

const JobCard = ({ job, onApply }) => {
  const getWorkArrangementColor = (arrangement) => {
    switch (arrangement) {
      case 'remote': return 'bg-green-100 text-green-800';
      case 'hybrid': return 'bg-blue-100 text-blue-800';
      case 'onSite': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmploymentTypeColor = (type) => {
    switch (type) {
      case 'fullTime': return 'bg-purple-100 text-purple-800';
      case 'partTime': return 'bg-yellow-100 text-yellow-800';
      case 'contract': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatEmploymentType = (type) => {
    switch (type) {
      case 'fullTime': return 'Full Time';
      case 'partTime': return 'Part Time';
      case 'contract': return 'Contract';
      case 'internship': return 'Internship';
      default: return type;
    }
  };

  const formatWorkArrangement = (arrangement) => {
    switch (arrangement) {
      case 'onSite': return 'On-site';
      case 'remote': return 'Remote';
      case 'hybrid': return 'Hybrid';
      case 'flexTime': return 'Flex Time';
      default: return arrangement;
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-poppins text-lg font-semibold text-slate-900 mb-2">
            {job.jobTitle}
          </h3>
          <p className="font-roboto text-slate-700 mb-2">{job.companyName}</p>
          <p className="font-roboto text-sm text-slate-600 mb-3">{job.location}</p>
        </div>
        {job.matchScore && (
          <div className="ml-4">
            <div className="rounded-full bg-brand-honey-50 px-3 py-1">
              <span className="text-sm font-medium text-brand-bee">
                {Math.round(job.matchScore)}% match
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getWorkArrangementColor(job.workArrangement)}`}>
          {formatWorkArrangement(job.workArrangement)}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEmploymentTypeColor(job.employmentType)}`}>
          {formatEmploymentType(job.employmentType)}
        </span>
        {job.postedDate && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {new Date(job.postedDate).toLocaleDateString()}
          </span>
        )}
        {(job.salaryRange?.minimum || job.salaryRange?.maximum) && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {job.salaryRange?.minimum && job.salaryRange?.maximum 
              ? `₱${job.salaryRange.minimum.toLocaleString()} - ₱${job.salaryRange.maximum.toLocaleString()}`
              : job.salaryRange?.minimum 
                ? `₱${job.salaryRange.minimum.toLocaleString()}+`
                : `Up to ₱${job.salaryRange.maximum.toLocaleString()}`
            }
          </span>
        )}
      </div>

      {job.shortDescription && (
        <p className="font-roboto text-sm text-slate-600 mb-4 line-clamp-3">
          {job.shortDescription}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {job.applicationLink && (
            <a
              href={job.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-honey hover:text-brand-honey-600 font-medium"
            >
              View Original →
            </a>
          )}
        </div>
        <button
          onClick={() => onApply(job)}
          className="rounded-lg bg-brand-honey px-4 py-2 text-sm font-medium text-brand-bee transition-colors hover:bg-brand-honey-600"
        >
          Apply & Track
        </button>
      </div>
    </div>
  );
};

const ApplyJobModal = ({ isOpen, job, onClose, onApply }) => {
  const [resumeExists, setResumeExists] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [enhancedResume, setEnhancedResume] = useState('');
  const [showEnhancement, setShowEnhancement] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkResumeStatus();
    }
  }, [isOpen]);

  const checkResumeStatus = async () => {
    try {
      const response = await api.get('/user/profile');
      const hasResume = response.data.resumeContext && response.data.resumeContext.length > 0;
      setResumeExists(hasResume);
      setResumeText(response.data.resumeContext || '');
    } catch (error) {
      console.error('Error checking resume status:', error);
      setResumeExists(false);
    }
  };

  const enhanceResume = async () => {
    if (!resumeText || !job) return;
    
    setLoading(true);
    try {
      const prompt = `
        Based on this job posting and the user's current resume, provide specific enhancement tips and suggestions:
        
        Job Title: ${job.jobTitle}
        Company: ${job.companyName}
        Job Description: ${job.shortDescription || 'N/A'}
        Work Arrangement: ${job.workArrangement}
        Employment Type: ${job.employmentType}
        
        Current Resume:
        ${resumeText}
        
        Please provide:
        1. 3-5 specific improvement suggestions
        2. Keywords to add based on the job requirements
        3. Skills that should be highlighted or added
        4. Format improvements
        
        Format the response as a JSON object with these fields:
        {
          "improvements": ["tip1", "tip2", "tip3"],
          "keywords": ["keyword1", "keyword2"],
          "skills": ["skill1", "skill2"],
          "formatting": ["format tip1", "format tip2"]
        }
      `;

      const encodedPrompt = encodeURIComponent(prompt);
      const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`);
      const data = await response.text();
      
      // Try to parse JSON from the response
      const jsonMatch = data.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const enhancementData = JSON.parse(jsonMatch[0]);
        setEnhancedResume(enhancementData);
        setShowEnhancement(true);
      } else {
        setEnhancedResume({
          improvements: ["Focus on quantifiable achievements", "Tailor skills to job requirements", "Optimize for ATS systems"],
          keywords: ["Based on job posting", "Industry-specific terms"],
          skills: ["Technical skills from job posting", "Soft skills mentioned"],
          formatting: ["Use bullet points", "Keep sections organized"]
        });
        setShowEnhancement(true);
      }
    } catch (error) {
      console.error('Error enhancing resume:', error);
      setEnhancedResume({
        improvements: ["Error getting AI suggestions. Please try again."],
        keywords: [],
        skills: [],
        formatting: []
      });
      setShowEnhancement(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyNow = async () => {
    if (!resumeExists) {
      alert('Please upload a resume first before applying.');
      return;
    }

    setApplyLoading(true);
    try {
      await onApply(job);
      onClose();
    } catch (error) {
      console.error('Error applying to job:', error);
    } finally {
      setApplyLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="font-poppins text-xl font-semibold text-slate-900">
              Apply to {job?.jobTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {job?.companyName} • {job?.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Resume Status */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-2">Resume Status</h3>
              {resumeExists ? (
                <div className="flex items-center text-green-700">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Resume uploaded and ready</span>
                </div>
              ) : (
                <div className="flex items-center text-red-700">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">No resume uploaded</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Use Current Resume */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Current Resume</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Use your uploaded resume for this application
                </p>
                <button
                  disabled={!resumeExists}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    resumeExists
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {resumeExists ? 'Use Current Resume' : 'No Resume Available'}
                </button>
              </div>

              {/* Enhance Resume */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Enhance Resume</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Get AI tips to improve your resume for this job
                </p>
                <button
                  onClick={enhanceResume}
                  disabled={!resumeExists || loading}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    resumeExists && !loading
                      ? 'bg-brand-honey text-brand-bee hover:bg-brand-honey-600'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Analyzing...' : 'Get Enhancement Tips'}
                </button>
              </div>

              {/* Apply Now */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Apply Now</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Submit your application and track it
                </p>
                <button
                  onClick={handleApplyNow}
                  disabled={!resumeExists || applyLoading}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    resumeExists && !applyLoading
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {applyLoading ? 'Applying...' : 'Apply Now'}
                </button>
              </div>
            </div>

            {/* Enhancement Results */}
            {showEnhancement && enhancedResume && (
              <div className="bg-brand-honey-50 border border-brand-honey-200 rounded-lg p-6">
                <h3 className="font-medium text-brand-bee mb-4">🤖 AI Resume Enhancement Tips</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">📈 Improvements</h4>
                    <ul className="space-y-1">
                      {enhancedResume.improvements?.map((tip, index) => (
                        <li key={index} className="text-sm text-slate-700 flex items-start">
                          <span className="text-brand-honey mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">🔑 Keywords to Add</h4>
                    <div className="flex flex-wrap gap-2">
                      {enhancedResume.keywords?.map((keyword, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">⚡ Skills to Highlight</h4>
                    <div className="flex flex-wrap gap-2">
                      {enhancedResume.skills?.map((skill, index) => (
                        <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">📄 Formatting Tips</h4>
                    <ul className="space-y-1">
                      {enhancedResume.formatting?.map((tip, index) => (
                        <li key={index} className="text-sm text-slate-700 flex items-start">
                          <span className="text-brand-honey mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const JobLists = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    workArrangement: 'all',
    employmentType: 'all',
    experienceLevel: 'all',
    industry: 'all',
    salaryMin: '',
    salaryMax: '',
    location: '',
    searchWithResume: false
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0
  });
  const [resumeSkills, setResumeSkills] = useState([]);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [pagination.currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      if (filters.searchWithResume) {
        // Use resume-based filtering endpoint with additional filters
        const additionalFilters = {};
        
        // Only add filters that have values
        if (filters.search) additionalFilters.search = filters.search;
        if (filters.workArrangement !== 'all') additionalFilters.workArrangement = filters.workArrangement;
        if (filters.employmentType !== 'all') additionalFilters.employmentType = filters.employmentType;
        if (filters.experienceLevel !== 'all') additionalFilters.experienceLevel = filters.experienceLevel;
        if (filters.industry !== 'all') additionalFilters.industry = filters.industry;
        if (filters.location) additionalFilters.location = filters.location;
        if (filters.salaryMin) additionalFilters.salaryMin = parseInt(filters.salaryMin);
        if (filters.salaryMax) additionalFilters.salaryMax = parseInt(filters.salaryMax);

        console.log('Sending resume filter request:', { additionalFilters, page: pagination.currentPage, limit: 12 });
        
        const response = await api.post('/resume/filter-jobs', {
          additionalFilters,
          page: pagination.currentPage,
          limit: 12
        });
        
        console.log('Resume filter response:', response.data);
        
        setJobs(response.data.filteredJobs || []);
        setFilteredJobs(response.data.filteredJobs || []);
        setResumeSkills(response.data.resumeSkills || []);
        
        // Create pagination from response
        const total = response.data.matchedJobsCount || 0;
        setPagination({
          currentPage: pagination.currentPage,
          totalPages: Math.ceil(total / 12),
          totalJobs: total,
          hasNextPage: pagination.currentPage < Math.ceil(total / 12),
          hasPrevPage: pagination.currentPage > 1
        });
      } else {
        // Regular job search
        const params = new URLSearchParams({
          page: pagination.currentPage,
          limit: 12,
          ...(filters.search && { search: filters.search }),
          ...(filters.workArrangement !== 'all' && { workArrangement: filters.workArrangement }),
          ...(filters.employmentType !== 'all' && { employmentType: filters.employmentType }),
          ...(filters.experienceLevel !== 'all' && { experienceLevel: filters.experienceLevel }),
          ...(filters.industry !== 'all' && { industry: filters.industry }),
          ...(filters.location && { location: filters.location }),
          ...(filters.salaryMin && { salaryMin: filters.salaryMin }),
          ...(filters.salaryMax && { salaryMax: filters.salaryMax })
        });

        const response = await api.get(`/jobs?${params}`);
        
        setJobs(response.data.jobInfos || []);
        setFilteredJobs(response.data.jobInfos || []);
        setPagination(response.data.pagination || {});
        setResumeSkills([]);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.error || 'Failed to fetch jobs');
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setApplyModalOpen(true);
  };

  const handleConfirmApply = async (job) => {
    try {
      // Add job to user's tracked applications
      const payload = {
        jobInfo: {
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          location: job.location,
          workArrangement: job.workArrangement,
          employmentType: job.employmentType,
          applicationLink: job.applicationLink,
          shortDescription: job.shortDescription
        },
        myJob: {
          status: 'applied'
        },
        moreInfo: {
          sourceSite: 'scraped',
          sourceUrl: job.applicationLink,
          originalJobId: job._id
        }
      };

      await api.post('/jobs', payload);
      alert('Job added to your applications!');
    } catch (err) {
      console.error('Error applying to job:', err);
      alert('Failed to add job to applications');
    }
  };

  const triggerScraping = async () => {
    try {
      setLoading(true);
      await api.post('/jobs/scrape');
      alert('Job scraping started! New jobs will appear shortly.');
      setTimeout(() => {
        fetchJobs();
      }, 5000);
    } catch (err) {
      console.error('Error triggering scraping:', err);
      alert('Failed to start job scraping');
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4">
              <div>
                <h1 className="font-poppins text-3xl font-bold text-slate-900">
                  Job Opportunities
                </h1>
                <p className="font-roboto mt-2 text-slate-600">
                  Discover jobs from multiple platforms, matched to your skills and preferences
                </p>
              </div>
            </div>

            {/* Advanced Search & Filters */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="font-poppins text-lg font-semibold text-slate-900 mb-4">
                  Search & Filter Jobs
                </h3>
                
                {/* Search Options */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.searchWithResume}
                        onChange={(e) => handleFilterChange('searchWithResume', e.target.checked)}
                        className="form-checkbox h-4 w-4 text-brand-honey rounded focus:ring-brand-honey"
                      />
                      <span className="ml-2 text-sm font-medium text-slate-700">
                        Search using my resume
                      </span>
                    </label>
                  </div>
                  
                  {filters.searchWithResume && (
                    <div className="bg-brand-honey-50 border border-brand-honey-200 rounded-lg p-3">
                      <p className="text-sm text-brand-bee">
                        <span className="font-medium">Resume Search Active:</span> Jobs will be matched based on your uploaded resume skills and experience.
                      </p>
                    </div>
                  )}
                </div>

                {/* Search and Basic Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Search Keywords
                    </label>
                    <input
                      type="text"
                      placeholder="Job title, company, skills..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-honey focus:border-brand-honey"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="City, state, country..."
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-honey focus:border-brand-honey"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Work Arrangement
                    </label>
                    <select
                      value={filters.workArrangement}
                      onChange={(e) => handleFilterChange('workArrangement', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-honey focus:border-brand-honey"
                    >
                      <option value="all">All Work Types</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onSite">On-site</option>
                      <option value="flexTime">Flex Time</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Employment Type
                    </label>
                    <select
                      value={filters.employmentType}
                      onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-honey focus:border-brand-honey"
                    >
                      <option value="all">All Job Types</option>
                      <option value="fullTime">Full Time</option>
                      <option value="partTime">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="selfEmployed">Self Employed</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </div>

                {/* Advanced Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Experience Level
                    </label>
                    <select
                      value={filters.experienceLevel}
                      onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-honey focus:border-brand-honey"
                    >
                      <option value="all">All Levels</option>
                      <option value="Entry">Entry Level</option>
                      <option value="Mid">Mid Level</option>
                      <option value="Senior">Senior Level</option>
                      <option value="Executive">Executive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Industry
                    </label>
                    <select
                      value={filters.industry}
                      onChange={(e) => handleFilterChange('industry', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-honey focus:border-brand-honey"
                    >
                      <option value="all">All Industries</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="marketing">Marketing</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="consulting">Consulting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Min Salary
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 50000"
                      value={filters.salaryMin}
                      onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-honey focus:border-brand-honey"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Max Salary
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 100000"
                      value={filters.salaryMax}
                      onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-honey focus:border-brand-honey"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={fetchJobs}
                      className="rounded-lg bg-brand-honey px-6 py-2 text-sm font-medium text-brand-bee transition-colors hover:bg-brand-honey-600 focus:outline-none focus:ring-2 focus:ring-brand-honey"
                    >
                      Search Jobs
                    </button>
                    
                    <button
                      onClick={() => {
                        setFilters({
                          search: '',
                          workArrangement: 'all',
                          employmentType: 'all',
                          experienceLevel: 'all',
                          industry: 'all',
                          salaryMin: '',
                          salaryMax: '',
                          location: '',
                          searchWithResume: false
                        });
                        setPagination(prev => ({ ...prev, currentPage: 1 }));
                      }}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                  
                  <div className="text-sm text-slate-500">
                    {Object.values(filters).filter(v => v && v !== 'all' && v !== false).length} filters active
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="relative">
              {/* Loading Overlay */}
              <div className="flex items-center justify-center py-16">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm mx-auto">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-brand-honey-200 rounded-full animate-spin"></div>
                      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-brand-honey border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900 font-poppins">
                      {filters.searchWithResume ? 'Matching Jobs to Your Resume' : 'Searching Jobs'}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 text-center">
                      {filters.searchWithResume 
                        ? 'Analyzing your skills and finding the best matches...'
                        : 'Finding the perfect opportunities for you...'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Skeleton Cards (faded background) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-30">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="rounded-lg border border-slate-200 bg-white p-6">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="rounded-lg bg-red-50 border border-red-200 p-6 max-w-md mx-auto">
                <p className="text-red-700 font-medium">{error}</p>
                <button
                  onClick={fetchJobs}
                  className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="rounded-lg bg-slate-100 p-8 max-w-md mx-auto">
                <p className="text-slate-600 mb-4">
                  {filters.searchWithResume 
                    ? "No jobs match your resume skills. Try uploading a better resume or adjusting your filters."
                    : "No jobs found. Try different filters or refresh job listings."
                  }
                </p>
                <button
                  onClick={fetchJobs}
                  className="rounded-lg bg-brand-honey px-4 py-2 text-sm font-medium text-brand-bee hover:bg-brand-honey-600"
                >
                  Refresh Job Listings
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-slate-600">
                  Showing {filteredJobs.length} of {pagination.totalJobs} jobs
                  {filters.searchWithResume && " (matched to your resume)"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onApply={handleApply}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <span className="px-4 py-2 text-sm text-slate-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Apply Job Modal */}
      <ApplyJobModal
        isOpen={applyModalOpen}
        job={selectedJob}
        onClose={() => {
          setApplyModalOpen(false);
          setSelectedJob(null);
        }}
        onApply={handleConfirmApply}
      />
    </>
  );
};

export default JobLists;
