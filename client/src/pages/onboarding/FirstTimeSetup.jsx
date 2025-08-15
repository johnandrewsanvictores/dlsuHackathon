import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResumeModal = ({ isOpen, onSkip, onUploaded }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
        <h3 className="text-center font-poppins text-2xl font-semibold text-brand-bee">
          Upload your resume
        </h3>
        <p className="font-roboto mt-2 text-center text-sm text-slate-600">
          Add your resume to get better job matches. You can skip for now.
        </p>
        <div className="mt-6 flex flex-col items-center gap-4">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10 text-slate-600 hover:border-brand-honey hover:bg-brand-honey-50">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={onUploaded}
            />
            <span className="font-roboto">Click to upload PDF/DOC/DOCX</span>
          </label>
          <button
            onClick={onSkip}
            className="font-roboto text-sm text-slate-500 hover:text-brand-bee"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

const FirstTimeSetup = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const handleDone = () => {
    navigate("/jobs", { replace: true });
  };

  return (
    <div className="min-h-screen bg-white">
      <ResumeModal
        isOpen={showModal}
        onSkip={handleDone}
        onUploaded={handleDone}
      />
    </div>
  );
};

export default FirstTimeSetup;
