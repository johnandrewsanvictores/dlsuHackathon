import React, { useEffect } from "react";

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="h-5 w-5"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303C33.602 31.91 29.28 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.156 7.961 3.039l5.657-5.657C34.869 5.053 29.706 3 24 3 12.955 3 4 11.955 4 23s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.818C14.35 16.104 18.822 13 24 13c3.059 0 5.842 1.156 7.961 3.039l5.657-5.657C34.869 5.053 29.706 3 24 3 16.318 3 9.656 7.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 43c5.207 0 9.899-1.993 13.432-5.243l-6.199-5.238C29.206 34.859 26.76 36 24 36c-5.246 0-9.545-3.34-11.141-7.988l-6.553 5.047C9.616 38.556 16.227 43 24 43z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-1.084 3.085-3.311 5.508-6.07 7.019.002-.001 6.199 5.238 6.199 5.238l.428.031C39.701 36.689 44 30.591 44 23c0-1.341-.138-2.651-.389-3.917z"
    />
  </svg>
);

const AuthModal = ({ isOpen, mode, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSignin = mode === "signin";
  const title = isSignin ? "Sign In" : "Sign Up";
  const cta = isSignin ? "Sign in with Google" : "Sign up with Google";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="font-poppins text-2xl font-semibold text-slate-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
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
        </div>

        <p className="font-roboto mb-6 text-slate-600">
          {isSignin
            ? "Welcome back! Continue with your account."
            : "Create your account to get started."}
        </p>

        <button
          className="font-roboto flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
          onClick={() => {
            // Hook up Google OAuth here
          }}
        >
          <GoogleIcon />
          {cta}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
