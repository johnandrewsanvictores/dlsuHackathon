// Example usage of Adzuna API integration
// This script demonstrates how to use the new Adzuna endpoints

import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/job-info';

// Example 1: Get jobs from Adzuna without storing in database
async function getAdzunaJobs() {
    try {
        console.log('📡 Fetching jobs from Adzuna (read-only)...');
        
        const response = await axios.get(`${BASE_URL}/adzuna`, {
            params: {
                page: 1,
                what: 'javascript developer',
                where: 'london',
                resultsPerPage: 5
            }
        });

        if (response.data.success) {
            console.log('✅ Successfully fetched jobs from Adzuna');
            console.log(`📊 Found ${response.data.data.results.length} jobs`);
            console.log(`📈 Total available: ${response.data.data.count}`);
            
            // Show first job
            if (response.data.data.results.length > 0) {
                const job = response.data.data.results[0];
                console.log('\n📋 Sample job:');
                console.log(`   Title: ${job.jobTitle}`);
                console.log(`   Company: ${job.companyName}`);
                console.log(`   Location: ${job.location}`);
                console.log(`   Salary: £${job.salaryRange.minimum || 'N/A'} - £${job.salaryRange.maximum || 'N/A'}`);
            }
        } else {
            console.error('❌ Failed to fetch jobs:', response.data.error);
        }
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Example 2: Fetch and store jobs from Adzuna (requires authentication)
async function fetchAndStoreAdzunaJobs(token) {
    try {
        console.log('📡 Fetching and storing jobs from Adzuna...');
        
        const response = await axios.post(`${BASE_URL}/adzuna/fetch`, {
            startPage: 1,
            endPage: 2, // Only fetch 2 pages for demo
            what: 'python developer',
            where: 'manchester'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            console.log('✅ Successfully processed jobs from Adzuna');
            console.log(`📊 Saved: ${response.data.data.savedJobs} jobs`);
            console.log(`⏭️  Skipped: ${response.data.data.skippedJobs} jobs`);
            console.log(`📈 Total processed: ${response.data.data.totalProcessed} jobs`);
            
            if (response.data.data.savedJobDetails.length > 0) {
                console.log('\n💾 Sample saved jobs:');
                response.data.data.savedJobDetails.slice(0, 3).forEach(job => {
                    console.log(`   - ${job.title} at ${job.company} (ID: ${job.id})`);
                });
            }
        } else {
            console.error('❌ Failed to process jobs:', response.data.error);
        }
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Example 3: Test different search parameters
async function testDifferentSearches() {
    const searches = [
        { what: 'react developer', where: 'leeds' },
        { what: 'data scientist', where: 'birmingham' },
        { what: 'devops engineer', where: 'edinburgh' }
    ];

    for (const search of searches) {
        try {
            console.log(`\n🔍 Testing search: ${search.what} in ${search.where}`);
            
            const response = await axios.get(`${BASE_URL}/adzuna`, {
                params: {
                    page: 1,
                    what: search.what,
                    where: search.where,
                    resultsPerPage: 3
                }
            });

            if (response.data.success) {
                console.log(`✅ Found ${response.data.data.results.length} jobs`);
                console.log(`📈 Total available: ${response.data.data.count}`);
            } else {
                console.log(`❌ No results for ${search.what} in ${search.where}`);
            }
        } catch (error) {
            console.error(`❌ Error searching for ${search.what}:`, error.response?.data || error.message);
        }
    }
}

// Main execution
async function main() {
    console.log('🚀 Adzuna API Integration Examples\n');
    
    // Example 1: Get jobs (no authentication required)
    await getAdzunaJobs();
    
    // Example 3: Test different searches
    await testDifferentSearches();
    
    // Example 2: Fetch and store jobs (requires authentication)
    // Uncomment and provide a valid token to test this
    /*
    const token = 'your_jwt_token_here';
    await fetchAndStoreAdzunaJobs(token);
    */
    
    console.log('\n✨ Examples completed!');
}

// Run examples
main().catch(console.error);
