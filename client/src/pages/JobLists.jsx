import React, { useState } from "react";
import Navbar from "../components/navigation/nav";

const JobLists = () => {
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "WorkHive Labs",
      location: "Makati, PH",
      workType: "Full-time · Remote",
      priceRange: "₱70k–₱100k / mo",
      experience: "Mid-Level",
      description:
        "We are seeking a Frontend Developer to build engaging UIs using React and Tailwind CSS. You will collaborate with designers and backend engineers to deliver performant, accessible features.",
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "Honeycomb Tech",
      location: "Quezon City, PH",
      workType: "Contract · Hybrid",
      priceRange: "₱90k–₱130k / mo",
      experience: "Senior",
      description:
        "Design and develop scalable APIs and services. Experience with Node.js, databases, and cloud deployments required. Security and performance mindset is a must.",
    },
    {
      id: 3,
      title: "Product Designer",
      company: "BeeLine Studio",
      location: "Taguig, PH",
      workType: "Full-time · Onsite",
      priceRange: "₱80k–₱110k / mo",
      experience: "Mid-Level",
      description:
        "Own the end-to-end product design process. Translate user insights into elegant solutions. Proficiency in Figma and design systems expected.",
    },
  ];

  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id ?? null);
  const selectedJob = jobs.find((j) => j.id === selectedJobId) || null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="font-poppins text-3xl font-bold text-brand-bee">
            Find your next role
          </h1>

          {/* Search Row */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="mb-2 block font-roboto text-sm text-brand-bee">
                Job title, keyword, or company
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 text-slate-500"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  className="w-full bg-transparent font-roboto text-sm text-brand-bee placeholder:text-slate-400 focus:outline-none"
                  placeholder="e.g. Frontend, Figma, WorkHive"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block font-roboto text-sm text-brand-bee">
                Location
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 text-slate-500"
                >
                  <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" />
                  <circle cx="12" cy="11" r="2" />
                </svg>
                <input
                  className="w-full bg-transparent font-roboto text-sm text-brand-bee placeholder:text-slate-400 focus:outline-none"
                  placeholder="City, region, or remote"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="space-y-3">
                {jobs.map((job) => {
                  const isActive = job.id === selectedJobId;
                  return (
                    <button
                      key={job.id}
                      type="button"
                      onClick={() => setSelectedJobId(job.id)}
                      className={`w-full rounded-xl border p-5 text-left shadow-sm transition-colors ${
                        isActive
                          ? "border-brand-honey bg-brand-honey/10"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-poppins text-base font-semibold text-brand-bee">
                            {job.title}
                          </h3>
                          <p className="font-roboto text-xs text-slate-600">
                            {job.company} · {job.location}
                          </p>
                        </div>
                        <span className="whitespace-nowrap rounded-full bg-brand-honey/30 px-3 py-1 text-[10px] font-medium text-brand-bee">
                          {job.experience}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">
                          {job.workType}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">
                          {job.priceRange}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-3">
              {selectedJob ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-poppins text-2xl font-bold text-brand-bee">
                        {selectedJob.title}
                      </h2>
                      <p className="font-roboto text-sm text-slate-600">
                        {selectedJob.company} · {selectedJob.location}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-brand-honey/30 px-2 py-1 text-xs font-medium text-brand-bee">
                        {selectedJob.experience}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
                        {selectedJob.workType}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
                        {selectedJob.priceRange}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 h-px w-full bg-slate-200" />

                  <div className="mt-5 space-y-4">
                    <h3 className="font-poppins text-lg font-semibold text-brand-bee">
                      About the role
                    </h3>
                    <p className="font-roboto text-sm leading-6 text-slate-700">
                      {selectedJob.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                  Select a job from the list to view details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobLists;
