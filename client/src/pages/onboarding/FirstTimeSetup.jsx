import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../axios";

const ResumeModal = ({
  isOpen,
  onSkip,
  onUploaded,
  isUploading,
  uploadProgress,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
        <h3 className="text-center font-poppins text-2xl font-semibold text-brand-bee">
          Upload your resume
        </h3>
        <p className="font-roboto mt-2 text-center text-sm text-slate-600">
          Add your resume to get better job matches powered by AI. You can skip
          for now.
        </p>

        {isUploading ? (
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Processing resume...
                </span>
                <span className="text-sm text-slate-500">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-brand-honey h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center">
              Our AI is analyzing your skills and experience...
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-4">
            <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10 text-slate-600 hover:border-brand-honey hover:bg-brand-honey-50 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={onUploaded}
              />
              <div className="text-center">
                <div className="mx-auto w-12 h-12 mb-3 rounded-lg bg-brand-honey-50 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-brand-honey"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <span className="font-roboto font-medium">
                  Click to upload PDF/DOC/DOCX
                </span>
                <p className="font-roboto text-xs text-slate-500 mt-1">
                  Max file size: 10MB
                </p>
              </div>
            </label>
            <button
              onClick={onSkip}
              className="font-roboto text-sm text-slate-500 hover:text-brand-bee transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const FirstTimeSetup = () => {
  const [showModal, setShowModal] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleSkip = () => {
    navigate("/jobs", { replace: true });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, DOC, or DOCX file.");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 200);

      const response = await api.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 90) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Show success message
      setTimeout(() => {
        alert(
          "Resume uploaded successfully! Your job matches will now be personalized based on your skills."
        );
        navigate("/jobs", { replace: true });
      }, 500);
    } catch (error) {
      console.error("Error uploading resume:", error);
      setIsUploading(false);
      setUploadProgress(0);

      const errorMessage =
        error.response?.data?.error ||
        "Failed to upload resume. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ResumeModal
        isOpen={showModal}
        onSkip={handleSkip}
        onUploaded={handleFileUpload}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
      />
    </div>
  );
};

export default FirstTimeSetup;
