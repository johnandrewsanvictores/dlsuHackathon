import React from "react";
import Navbar from "../components/navigation/nav";

const JobLists = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h1 className="font-poppins text-3xl font-bold text-brand-bee">
            Job Lists
          </h1>
          <p className="font-roboto mt-2 text-slate-600">
            Content coming soon.
          </p>
        </div>
      </div>
    </>
  );
};

export default JobLists;
