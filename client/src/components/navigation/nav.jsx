import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../modals/AuthModals";
import api from "/axios.js";
import logo from "../../assets/WorkHiveLogo.png";

const Navbar = () => {
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (_) {
        setUser(null);
      }
    }
    const onStorage = () => {
      const s = localStorage.getItem("authUser");
      setUser(s ? JSON.parse(s) : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!showLogoutConfirm) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShowLogoutConfirm(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLogoutConfirm]);

  const handleConfirmLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) {}
    localStorage.removeItem("authUser");
    setUser(null);
    setOpenMenu(false);
    setShowLogoutConfirm(false);
    navigate("/");
  };
  return (
    <nav className="w-full border-b bg-white py-2 md:py-3">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid min-h-[4.5rem] grid-cols-3 items-center gap-4 md:min-h-[5rem]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl p-2.5">
              <img src={logo} alt="Work Hive Logo" className="h-12 w-12" />
            </div>
            <span className="text-xl font-bold text-brand-bee">
              Work <span className="text-brand-honey">Hive</span>
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
            {!user ? (
              <>
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
              </>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu((v) => !v)}
                  className="flex items-center gap-2 rounded-full bg-white px-2 py-1 text-brand-bee hover:bg-brand-honey-50"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="3" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium">
                    {user?.username ?? "Profile"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {openMenu && (
                  <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
                    <button
                      onClick={() => {
                        setOpenMenu(false);
                        navigate("/dashboard");
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setOpenMenu(false);
                        navigate("/jobs");
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      Jobs
                    </button>
                    <button
                      onClick={() => {
                        setOpenMenu(false);
                        navigate("/my-jobs");
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      My Jobs
                    </button>
                    <button
                      onClick={() => {
                        setOpenMenu(false);
                        navigate("/calendar");
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      Calendar
                    </button>
                    <button
                      onClick={() => {
                        setOpenMenu(false);
                        navigate("/profile");
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setOpenMenu(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={Boolean(authMode)}
        mode={authMode ?? "signin"}
        onClose={() => setAuthMode(null)}
        onSwitchMode={(newMode) => setAuthMode(newMode)}
      />
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="font-poppins text-lg font-semibold text-brand-bee">
              Log out?
            </h3>
            <p className="font-roboto mt-2 text-sm text-slate-600">
              Are you sure you want to log out?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-brand-bee hover:bg-slate-50"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                onClick={handleConfirmLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
