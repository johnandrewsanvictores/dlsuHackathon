import mongoose from 'mongoose';
import jobsInfo from '../models/jobsInfoModel.js';
import jobsMoreInfo from '../models/jobsMoreInfoModel.js';
import connectDbB from '../config/db.js';

const sampleJobs = [
    {
        jobTitle: "Senior Frontend Developer",
        companyName: "TechCorp Inc.",
        location: "Metro Manila, Philippines",
        workArrangement: "hybrid",
        employmentType: "fullTime",
        postedDate: new Date(),
        shortDescription: "We are looking for a Senior Frontend Developer with expertise in React, TypeScript, and modern web technologies. Join our dynamic team and help build next-generation web applications.",
        applicationLink: "https://example.com/jobs/senior-frontend-dev",
        industry: "Technology",
        experienceLevel: "Senior"
    },
    {
        jobTitle: "Full Stack JavaScript Developer",
        companyName: "StartupXYZ",
        location: "Makati, Philippines",
        workArrangement: "remote",
        employmentType: "fullTime",
        postedDate: new Date(),
        shortDescription: "Join our growing startup as a Full Stack Developer. Work with Node.js, React, MongoDB, and AWS. Experience with microservices and cloud deployment preferred.",
        applicationLink: "https://example.com/jobs/fullstack-js-dev",
        industry: "Technology",
        experienceLevel: "Mid-level"
    },
    {
        jobTitle: "React Developer",
        companyName: "Digital Solutions Ltd",
        location: "Cebu City, Philippines",
        workArrangement: "onSite",
        employmentType: "fullTime",
        postedDate: new Date(),
        shortDescription: "We're seeking a talented React Developer to join our frontend team. Must have strong skills in React, Redux, and modern JavaScript frameworks.",
        applicationLink: "https://example.com/jobs/react-developer",
        industry: "Technology",
        experienceLevel: "Mid-level"
    },
    {
        jobTitle: "Node.js Backend Developer",
        companyName: "CloudTech Solutions",
        location: "Quezon City, Philippines",
        workArrangement: "hybrid",
        employmentType: "fullTime",
        postedDate: new Date(),
        shortDescription: "Looking for an experienced Node.js developer to build scalable backend services. Experience with Express, MongoDB, and RESTful APIs required.",
        applicationLink: "https://example.com/jobs/nodejs-backend",
        industry: "Technology",
        experienceLevel: "Mid-level"
    },
    {
        jobTitle: "Python Django Developer",
        companyName: "DataFlow Systems",
        location: "Taguig, Philippines",
        workArrangement: "remote",
        employmentType: "fullTime",
        postedDate: new Date(),
        shortDescription: "Join our data-driven company as a Python Django Developer. Work on building robust web applications and APIs. Experience with PostgreSQL and Docker is a plus.",
        applicationLink: "https://example.com/jobs/python-django",
        industry: "Technology",
        experienceLevel: "Mid-level"
    },
    {
        jobTitle: "Frontend React Intern",
        companyName: "InnovateNow",
        location: "Pasig, Philippines",
        workArrangement: "onSite",
        employmentType: "internship",
        postedDate: new Date(),
        shortDescription: "Internship opportunity for students or fresh graduates interested in frontend development. Learn React, JavaScript, and modern web development practices.",
        applicationLink: "https://example.com/jobs/react-intern",
        industry: "Technology",
        experienceLevel: "Entry-level"
    },
    {
        jobTitle: "DevOps Engineer",
        companyName: "CloudOps Pro",
        location: "Alabang, Philippines",
        workArrangement: "hybrid",
        employmentType: "fullTime",
        postedDate: new Date(),
        shortDescription: "We need a DevOps Engineer to manage our cloud infrastructure. Experience with AWS, Docker, Kubernetes, and CI/CD pipelines required.",
        applicationLink: "https://example.com/jobs/devops-engineer",
        industry: "Technology",
        experienceLevel: "Senior"
    },
    {
        jobTitle: "UI/UX Designer & Frontend Developer",
        companyName: "Design Studio Plus",
        location: "BGC, Taguig",
        workArrangement: "hybrid",
        employmentType: "fullTime",
        postedDate: new Date(),
        shortDescription: "Dual role combining UI/UX design with frontend development. Must be proficient in Figma, React, and have an eye for modern design principles.",
        applicationLink: "https://example.com/jobs/ui-ux-frontend",
        industry: "Design & Technology",
        experienceLevel: "Mid-level"
    },
    {
        jobTitle: "Mobile App Developer (React Native)",
        companyName: "MobileFirst Solutions",
        location: "Ortigas, Pasig",
        workArrangement: "onSite",
        employmentType: "fullTime",
        postedDate: new Date(),
        shortDescription: "Build cross-platform mobile applications using React Native. Experience with iOS and Android development, plus knowledge of native modules preferred.",
        applicationLink: "https://example.com/jobs/react-native-dev",
        industry: "Technology",
        experienceLevel: "Mid-level"
    },
    {
        jobTitle: "Junior Web Developer",
        companyName: "WebCraft Agency",
        location: "Mandaluyong, Philippines",
        workArrangement: "onSite",
        employmentType: "fullTime",
        postedDate: new Date(),
        shortDescription: "Entry-level position for fresh graduates. Learn web development with HTML, CSS, JavaScript, and popular frameworks. Great learning environment.",
        applicationLink: "https://example.com/jobs/junior-web-dev",
        industry: "Technology",
        experienceLevel: "Entry-level"
    }
];

async function setupSampleData() {
    try {
        // Only connect if not already connected
        if (mongoose.connection.readyState === 0) {
            console.log('Connecting to database...');
            await connectDbB();
        }
        
        console.log('Clearing existing sample data...');
        // Clear existing sample data
        await jobsMoreInfo.deleteMany({ sourceSite: 'sample' });
        await jobsInfo.deleteMany({ 
            applicationLink: { $regex: 'example.com' }
        });
        
        console.log('Inserting sample jobs...');
        
        for (const jobData of sampleJobs) {
            // Create job info
            const createdJobInfo = await jobsInfo.create(jobData);
            
            // Create more info
            await jobsMoreInfo.create({
                jobInfold: createdJobInfo._id,
                sourceSite: 'sample',
                sourceUrl: jobData.applicationLink,
                originalJobId: `sample-${createdJobInfo._id}`
            });
            
            console.log(`Created job: ${jobData.jobTitle} at ${jobData.companyName}`);
        }
        
        console.log(`✅ Successfully created ${sampleJobs.length} sample jobs!`);
        
        // Get total job count
        const totalJobs = await jobsInfo.countDocuments();
        console.log(`📊 Total jobs in database: ${totalJobs}`);
        
        return { success: true, count: sampleJobs.length, total: totalJobs };
        
    } catch (error) {
        console.error('❌ Error setting up sample data:', error);
        throw error;
    }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    setupSampleData().finally(() => {
        mongoose.connection.close();
        console.log('Database connection closed.');
    });
}

export default setupSampleData;
