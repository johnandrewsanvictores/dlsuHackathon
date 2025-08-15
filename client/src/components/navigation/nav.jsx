import React, { useState } from "react";
import AuthModal from "../modals/AuthModals";

const Navbar = () => {
  const [authMode, setAuthMode] = useState(null);
  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid h-16 grid-cols-3 items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-brand-honey p-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                stroke="white"
                className="h-6 w-6"
              >
                <path d="M6 7h12a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2Z" />
                <path d="M9 7V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v1" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-brand-bee">
              WorkHive
            </span>
          </div>

          <div className="hidden items-center justify-center gap-8 md:flex">
            <a
              href="#"
              className="text-slate-700 transition-colors hover:text-slate-900"
            >
              Homepage
            </a>
            <a
              href="#billing"
              className="text-slate-700 transition-colors hover:text-slate-900"
            >
              Billing
            </a>
            <a
              href="#about"
              className="text-slate-700 transition-colors hover:text-slate-900"
            >
              About
            </a>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setAuthMode("signup")}
              className="rounded-lg border border-brand-honey px-4 py-2 text-sm font-medium text-brand-bee transition-colors hover:bg-brand-honey-50"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("signin")}
              className="rounded-lg bg-brand-honey px-4 py-2 text-sm font-medium text-brand-bee transition-colors hover:bg-brand-honey-600"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={Boolean(authMode)}
        mode={authMode ?? "signin"}
        onClose={() => setAuthMode(null)}
      />
    </nav>
  );
};

export default Navbar;
