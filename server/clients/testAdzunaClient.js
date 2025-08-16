import AdzunaClient from './adzunaClient.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testAdzunaClient() {
    console.log('Testing Adzuna Client...');
    
    // Check if environment variables are set
    if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_API_KEY) {
        console.error('❌ ADZUNA_APP_ID and ADZUNA_API_KEY environment variables are required');
        return;
    }

    const client = new AdzunaClient();
    
    try {
        console.log('📡 Fetching single page of jobs...');
        const singlePageResult = await client.fetchJobs(1, 'javascript developer', 'london', 5);
        
        if (singlePageResult.success) {
            console.log('✅ Single page fetch successful');
            console.log(`📊 Found ${singlePageResult.data.results.length} jobs`);
            console.log(`📈 Total available: ${singlePageResult.data.count}`);
            console.log(`💰 Average salary: £${singlePageResult.data.mean?.toFixed(2) || 'N/A'}`);
            
            // Show first job details
            if (singlePageResult.data.results.length > 0) {
                const firstJob = singlePageResult.data.results[0];
                console.log('\n📋 Sample job:');
                console.log(`   Title: ${firstJob.jobTitle}`);
                console.log(`   Company: ${firstJob.companyName}`);
                console.log(`   Location: ${firstJob.location}`);
                console.log(`   Work Arrangement: ${firstJob.workArrangement}`);
                console.log(`   Employment Type: ${firstJob.employmentType}`);
                console.log(`   Experience Level: ${firstJob.experienceLevel}`);
                console.log(`   Industry: ${firstJob.industry}`);
                console.log(`   Salary: £${firstJob.salaryRange.minimum || 'N/A'} - £${firstJob.salaryRange.maximum || 'N/A'}`);
            }
        } else {
            console.error('❌ Single page fetch failed:', singlePageResult.error);
        }

        console.log('\n📡 Testing multiple pages fetch (pages 1-2)...');
        const multiPageResult = await client.fetchMultiplePages(1, 2, 'javascript developer', 'london');
        
        if (multiPageResult.success) {
            console.log('✅ Multiple pages fetch successful');
            console.log(`📊 Total jobs fetched: ${multiPageResult.data.totalJobs}`);
            if (multiPageResult.data.errors.length > 0) {
                console.log(`⚠️  Errors encountered: ${multiPageResult.data.errors.length}`);
            }
        } else {
            console.error('❌ Multiple pages fetch failed');
            console.error('Errors:', multiPageResult.data.errors);
        }

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

// Run the test
testAdzunaClient();
