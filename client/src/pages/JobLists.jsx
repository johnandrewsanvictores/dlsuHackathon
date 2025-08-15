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

const JobLists = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    workArrangement: 'all',
    employmentType: 'all',
    showAIFiltered: false
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0
  });
  const [resumeSkills, setResumeSkills] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, [filters.showAIFiltered, pagination.currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 12,
        ...(filters.search && { search: filters.search }),
        ...(filters.workArrangement !== 'all' && { workArrangement: filters.workArrangement }),
        ...(filters.employmentType !== 'all' && { employmentType: filters.employmentType })
      });

      const endpoint = filters.showAIFiltered ? '/jobs/ai-filtered' : '/jobs';
      const response = await api.get(`${endpoint}?${params}`);
      
      setJobs(response.data.jobInfos || []);
      setFilteredJobs(response.data.jobInfos || []);
      setPagination(response.data.pagination || {});
      
      if (response.data.resumeSkills) {
        setResumeSkills(response.data.resumeSkills);
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

  const handleApply = async (job) => {
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-poppins text-3xl font-bold text-slate-900">
                  Job Opportunities
          </h1>
          <p className="font-roboto mt-2 text-slate-600">
                  Discover jobs from multiple platforms, matched to your skills
                </p>
              </div>
              <button
                onClick={triggerScraping}
                disabled={loading}
                className="rounded-lg bg-brand-honey px-4 py-2 text-sm font-medium text-brand-bee transition-colors hover:bg-brand-honey-600 disabled:opacity-50"
              >
                {loading ? 'Scraping...' : 'Update Jobs'}
              </button>
            </div>

            {/* AI Filter Toggle */}
            <div className="mb-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showAIFiltered}
                  onChange={(e) => handleFilterChange('showAIFiltered', e.target.checked)}
                  className="form-checkbox h-4 w-4 text-brand-honey"
                />
                <span className="ml-2 text-sm font-medium text-slate-700">
                  Show only AI-matched jobs {resumeSkills.length > 0 && `(based on: ${resumeSkills.slice(0, 3).join(', ')}${resumeSkills.length > 3 ? '...' : ''})`}
                </span>
              </label>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-honey"
                />
              </div>
              <div>
                <select
                  value={filters.workArrangement}
                  onChange={(e) => handleFilterChange('workArrangement', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-honey"
                >
                  <option value="all">All Work Types</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onSite">On-site</option>
                </select>
              </div>
              <div>
                <select
                  value={filters.employmentType}
                  onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-honey"
                >
                  <option value="all">All Job Types</option>
                  <option value="fullTime">Full Time</option>
                  <option value="partTime">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <button
                  onClick={() => {
                    setFilters({
                      search: '',
                      workArrangement: 'all',
                      employmentType: 'all',
                      showAIFiltered: false
                    });
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {filters.showAIFiltered 
                    ? "No jobs match your resume skills. Try uploading a resume or disable AI filtering."
                    : "No jobs found. Try different filters or update job listings."
                  }
                </p>
                <button
                  onClick={triggerScraping}
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
                  {filters.showAIFiltered && " (AI-filtered)"}
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
    </>
  );
};

export default JobLists;
