import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";

const AuthModal = ({ isOpen, mode, onClose, onSwitchMode }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuth?.() ?? { user: null, setUser: () => {} };
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
  const heading = isSignin ? "Welcome back!" : "Create your account";
  const switchPrompt = isSignin
    ? { text: "Don't have an account?", linkText: "Sign up", href: "#signup" }
    : {
        text: "Already have an account?",
        linkText: "Sign in",
        href: "#signin",
      };

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

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
        <div className="relative mb-6">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
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

          <div className="flex items-center justify-center gap-3">
            <div className="rounded-lg bg-brand-honey p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                stroke="white"
                className="h-5 w-5"
              >
                <path d="M6 7h12a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2Z" />
                <path d="M9 7V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v1" />
              </svg>
            </div>
            <span className="font-poppins text-2xl font-bold text-brand-bee">
              Work <span className="text-brand-honey">Hive</span>
            </span>
          </div>
        </div>

        <h2 className="font-poppins text-3xl font-extrabold leading-tight text-brand-bee text-center">
          {heading}
        </h2>

        <form
          className="mt-6 space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const username = form.querySelector('input[name="username"]').value;
            const password = form.querySelector('input[name="password"]').value;
            setError("");
            setIsLoading(true);
            try {
              if (isSignin) {
                console.log(isSignin);
                const res = await api.post("/auth/signin", {
                  username,
                  password,
                });
                const data = res.data;
                const loggedInUser = data?.user;
                if (loggedInUser) {
                  setUser(loggedInUser);
                  // Clear form
                  form.reset();
                  onClose?.();
                }
              } else {
                const firstName = form.querySelector(
                  'input[name="firstName"]'
                ).value;
                const lastName = form.querySelector(
                  'input[name="lastName"]'
                ).value;
                const email = form.querySelector('input[name="email"]').value;
                const confirmPassword = form.querySelector(
                  'input[name="confirmPassword"]'
                ).value;
                if (password !== confirmPassword) {
                  setError("Passwords do not match");
                  setIsLoading(false);
                  return;
                }
                const res = await api.post("/user/create", {
                  firstName,
                  lastName,
                  email,
                  username,
                  password,
                });
                const createdUser = res.data?.user;
                if (createdUser) {
                  setUser(createdUser);
                  form.reset();
                  onClose?.();
                  navigate("/onboarding");
                }
              }
            } catch (err) {
              const msg =
                err?.response?.data?.error ||
                "An error occurred. Please try again." + err;
              setError(msg);
            }
            setIsLoading(false);
          }}
        >
          {!isSignin && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block font-roboto text-sm text-brand-bee">
                  First name<span className="text-brand-honey"> *</span>
                </label>
                <input
                  name="firstName"
                  type="text"
                  placeholder="Type your first name"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-brand-bee placeholder:text-slate-400 focus:border-brand-honey focus:outline-none focus:ring-2 focus:ring-brand-honey/40"
                />
              </div>
              <div>
                <label className="mb-1 block font-roboto text-sm text-brand-bee">
                  Last name<span className="text-brand-honey"> *</span>
                </label>
                <input
                  name="lastName"
                  type="text"
                  placeholder="Type your last name"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-brand-bee placeholder:text-slate-400 focus:border-brand-honey focus:outline-none focus:ring-2 focus:ring-brand-honey/40"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block font-roboto text-sm text-brand-bee">
                  Email<span className="text-brand-honey"> *</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-brand-bee placeholder:text-slate-400 focus:border-brand-honey focus:outline-none focus:ring-2 focus:ring-brand-honey/40"
                />
              </div>
              <div>
                <label className="mb-1 block font-roboto text-sm text-brand-bee">
                  Confirm password<span className="text-brand-honey"> *</span>
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-type your password"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-brand-bee placeholder:text-slate-400 focus:border-brand-honey focus:outline-none focus:ring-2 focus:ring-brand-honey/40"
                />
              </div>
            </div>
          )}
          <div>
            <label className="mb-1 block font-roboto text-sm text-brand-bee">
              Username<span className="text-brand-honey"> *</span>
            </label>
            <input
              name="username"
              type="text"
              placeholder="Type your username"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-brand-bee placeholder:text-slate-400 focus:border-brand-honey focus:outline-none focus:ring-2 focus:ring-brand-honey/40"
            />
          </div>

          <div>
            <label className="mb-1 block font-roboto text-sm text-brand-bee">
              Password<span className="text-brand-honey"> *</span>
            </label>
            <input
              name="password"
              type="password"
              placeholder="Type your password"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-brand-bee placeholder:text-slate-400 focus:border-brand-honey focus:outline-none focus:ring-2 focus:ring-brand-honey/40"
            />
            <div className="mt-2 text-right">
              <a
                href="#forgot"
                className="font-roboto text-xs text-slate-500 hover:text-brand-bee"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-brand-honey px-4 py-3 font-roboto text-sm font-medium text-brand-bee transition-colors hover:bg-brand-honey-600 disabled:opacity-50"
          >
            {isSignin
              ? isLoading
                ? "Signing in..."
                : "Sign in"
              : isLoading
              ? "Creating..."
              : "Create account"}
          </button>

          {error && (
            <p className="font-roboto text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <p className="font-roboto mt-2 text-center text-sm text-slate-600 pt-8">
            {switchPrompt.text}{" "}
            <a
              href={switchPrompt.href}
              className="text-brand-honey hover:underline"
              onClick={(e) => {
                e.preventDefault();
                if (onSwitchMode) {
                  onSwitchMode(isSignin ? "signup" : "signin");
                }
              }}
            >
              {switchPrompt.linkText}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
