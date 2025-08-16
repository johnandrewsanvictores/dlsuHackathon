import axios from 'axios';

class AdzunaClient {
    constructor() {
        this.appId = process.env.ADZUNA_APP_ID;
        this.appKey = process.env.ADZUNA_API_KEY;
        this.baseUrl = 'https://api.adzuna.com/v1/api/jobs/gb/search';
    }

    // Normalize Adzuna job data to match our database schema
    normalizeJobData(adzunaJob) { 
        // Map work arrangement
        const workArrangementMap = {
            'remote': 'remote',
            'hybrid': 'hybrid',
            'on-site': 'onSite',
            'onsite': 'onSite'
        };

        // Map employment type
        const employmentTypeMap = {
            'permanent': 'fullTime',
            'contract': 'contract',
            'part-time': 'partTime',
            'parttime': 'partTime',
            'internship': 'internship',
            'freelance': 'selfEmployed'
        };

        // Determine work arrangement based on location and description
        let workArrangement = 'onSite'; // default
        const description = (adzunaJob.description || '').toLowerCase();
        const title = (adzunaJob.title || '').toLowerCase();
        
        if (description.includes('remote') || title.includes('remote')) {
            workArrangement = 'remote';
        } else if (description.includes('hybrid') || title.includes('hybrid')) {
            workArrangement = 'hybrid';
        }

        // Determine employment type
        let employmentType = 'fullTime'; // default
        if (adzunaJob.contract_type) {
            employmentType = employmentTypeMap[adzunaJob.contract_type] || 'fullTime';
        }

        // Determine experience level from title and description
        let experienceLevel = 'entry'; // default
        const expKeywords = {
            'senior': 'senior',
            'lead': 'senior',
            'principal': 'senior',
            'junior': 'entry',
            'graduate': 'entry',
            'entry': 'entry',
            'mid': 'mid',
            'intermediate': 'mid'
        };

        const combinedText = `${title} ${description}`.toLowerCase();
        for (const [keyword, level] of Object.entries(expKeywords)) {
            if (combinedText.includes(keyword)) {
                experienceLevel = level;
                break;
            }
        }

        // Determine industry from category
        let industry = 'Technology'; // default
        if (adzunaJob.category && adzunaJob.category.label) {
            const categoryLabel = adzunaJob.category.label.toLowerCase();
            if (categoryLabel.includes('finance') || categoryLabel.includes('banking')) {
                industry = 'Finance';
            } else if (categoryLabel.includes('health') || categoryLabel.includes('medical')) {
                industry = 'Healthcare';
            } else if (categoryLabel.includes('education')) {
                industry = 'Education';
            } else if (categoryLabel.includes('retail') || categoryLabel.includes('sales')) {
                industry = 'Retail';
            } else if (categoryLabel.includes('marketing') || categoryLabel.includes('advertising')) {
                industry = 'Marketing';
            }
        }

        return {
            jobTitle: adzunaJob.title || 'Unknown Position',
            companyName: adzunaJob.company?.display_name || 'Unknown Company',
            location: adzunaJob.location?.display_name || 'Unknown Location',
            workArrangement,
            employmentType,
            postedDate: adzunaJob.created ? new Date(adzunaJob.created) : new Date(),
            shortDescription: adzunaJob.description || '',
            applicationLink: adzunaJob.redirect_url || '',
            salaryRange: {
                minimum: adzunaJob.salary_min || null,
                maximum: adzunaJob.salary_max || null
            },
            industry,
            experienceLevel
        };
    }

    // Fetch jobs from Adzuna API
    async fetchJobs(page = 1, what = 'javascript developer', where = 'london', resultsPerPage = 20) {
        try {
            const url = `${this.baseUrl}/${page}`;
            const params = {
                app_id: this.appId,
                app_key: this.appKey,
                what: encodeURIComponent(what),
                where: encodeURIComponent(where),
                results_per_page: resultsPerPage
            };

            const response = await axios.get(url, { params });
            
            if (response.data && response.data.results) {
                return {
                    success: true,
                    data: {
                        count: response.data.count,
                        mean: response.data.mean,
                        results: response.data.results.map(job => ({
                            ...this.normalizeJobData(job),
                            adzunaData: {
                                id: job.id,
                                adref: job.adref,
                                category: job.category,
                                contract_time: job.contract_time,
                                salary_is_predicted: job.salary_is_predicted,
                                latitude: job.latitude,
                                longitude: job.longitude
                            }
                        }))
                    }
                };
            }

            return {
                success: false,
                error: 'No results found in API response'
            };

        } catch (error) {
            console.error('Error fetching jobs from Adzuna:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Fetch multiple pages
    async fetchMultiplePages(startPage = 1, endPage = 5, what = 'javascript developer', where = 'london') {
        const allJobs = [];
        const errors = [];

        for (let page = startPage; page <= endPage; page++) {
            try {
                console.log(`Fetching page ${page}...`);
                const result = await this.fetchJobs(page, what, where);
                
                if (result.success && result.data.results.length > 0) {
                    allJobs.push(...result.data.results);
                } else if (!result.success) {
                    errors.push(`Page ${page}: ${result.error}`);
                }

                // Add a small delay to be respectful to the API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                errors.push(`Page ${page}: ${error.message}`);
            }
        }

        return {
            success: errors.length === 0,
            data: {
                jobs: allJobs,
                totalJobs: allJobs.length,
                errors
            }
        };
    }
}

export default AdzunaClient;
