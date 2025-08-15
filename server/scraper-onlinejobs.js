import puppeteer from 'puppeteer';

export const scrapeOnlineJobs = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://www.onlinejobs.ph/jobseekers/jobsearch', { waitUntil: 'domcontentloaded' });

    const jobs = await page.$$eval('.jobpost-cat-box', cards => {
        return cards.map(card => {
            // Ensure we get the parent <a>
            const anchor = card.closest('a');
            const link = anchor ? anchor.href : null; // full URL

            const titleEl = card.querySelector('h4.fs-16.fw-700');
            const employerEl = card.querySelector('p.fs-13.mb-0');
            const salaryEl = card.querySelector('dl.row.fs-14.no-gutters dd.col');
            const descEl = card.querySelector('.desc');
            const tagEls = card.querySelectorAll('.job-tag .badge');

            const title = titleEl ? titleEl.childNodes[0].textContent.trim() : null;

            return {
                title: title || null,
                link, // correct URL
                employer: employerEl ? employerEl.textContent.split('•')[0].trim() : null,
                posted: employerEl ? (employerEl.querySelector('em')?.textContent.trim() || null) : null,
                salary: salaryEl ? salaryEl.textContent.trim() : null,
                description: descEl ? descEl.textContent.trim().replace(/\s+/g, ' ') : null,
                tags: tagEls.length ? Array.from(tagEls).map(t => t.textContent.trim()) : []
            };
        });
    });

    console.log(jobs);
    await browser.close();
};
