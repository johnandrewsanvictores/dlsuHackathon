import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "/axios.js";

/**
 * UploadResumeModal
 * Props:
 * - isOpen: boolean
 * - onClose?: () => void
 * - onSkip?: () => void
 * - onUploaded?: (data?: unknown) => void
 */
const UploadResumeModal = ({ isOpen, onClose, onSkip, onUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (onClose) onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const maxSizeBytes = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!file) return "";
    if (!allowedTypes.includes(file.type)) {
      return "Only PDF, DOC, DOCX files are accepted.";
    }
    if (file.size > maxSizeBytes) {
      return "Maximum file size is 5MB.";
    }
    return "";
  };

  const handleFiles = useCallback((file) => {
    const validationMessage = validateFile(file);
    if (validationMessage) {
      setError(validationMessage);
      setSelectedFile(null);
    } else {
      setError("");
      setSelectedFile(file);
    }
  }, []);

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFiles(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFiles(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const upload = async () => {
    if (!selectedFile || isUploading) return;
    setIsUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);

      const res = await api.post("/resume/filter-jobs-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (onUploaded) onUploaded(res?.data);
    } catch (err) {
      const msg = err?.response?.data?.error || "Upload failed";
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          <h2 className="font-poppins text-h4 font-extrabold leading-tight text-brand-bee text-center">
            Upload Your Resume
          </h2>
          <p className="font-roboto mt-2 text-center text-sm text-slate-600 max-w-md">
            Upload your resume so our AI can better understand your background
            and tailor interview questions based on your experience, skills, and
            goals.
          </p>

          <div
            className="mt-8 w-full rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center transition-colors hover:border-brand-honey"
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={onInputChange}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mx-auto flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 font-roboto text-sm text-slate-700 hover:bg-slate-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path d="M12 16v-8m0 0l-3 3m3-3l3 3" />
                <rect x="3" y="12" width="18" height="8" rx="2" />
              </svg>
              Choose file
            </button>

            {selectedFile ? (
              <p className="font-roboto mt-3 text-sm text-brand-bee">
                {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </p>
            ) : (
              <p className="font-roboto mt-3 text-sm text-slate-500">
                Drag and drop here or click to browse
              </p>
            )}

            <div className="font-roboto mt-6 text-xs text-slate-500">
              <p>Accepted formats: PDF · DOC · DOCX</p>
              <p className="mt-1">Maximum file size: 5MB</p>
            </div>
          </div>

          {error && (
            <p className="font-roboto mt-4 text-sm text-red-600">{error}</p>
          )}

          <div className="mt-8 flex w-full items-center justify-between">
            <button
              type="button"
              onClick={onSkip}
              className="font-roboto text-sm text-slate-500 hover:text-brand-bee"
            >
              Skip for now
            </button>
            <button
              type="button"
              onClick={upload}
              disabled={!selectedFile || isUploading}
              className="inline-flex items-center justify-center rounded-lg bg-brand-honey px-5 py-2.5 font-roboto text-sm font-medium text-brand-bee transition-colors hover:bg-brand-honey-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? (
                <>
                  <svg
                    className="-ml-0.5 mr-2 h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadResumeModal;
