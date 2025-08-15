import React from "react";

const Footer = () => {
  return (
    <footer className="bg-brand-bee text-brand-soft">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-3">
              <div className="rounded-xl bg-brand-honey p-2.5 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M6 7h12a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2Z" />
                  <path d="M9 7V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v1" />
                </svg>
              </div>
              <span className="font-poppins text-lg font-semibold">
                Work Hive
              </span>
            </div>
            <p className="font-roboto max-w-lg text-brand-gray">
              Empowering you with AI-driven interview preparation to boost your
              confidence and land your dream job.
            </p>

            <nav className="mt-8 flex flex-wrap items-center gap-6">
              <a href="#home" className="font-roboto hover:text-brand-honey">
                Home
              </a>
              <a href="#start" className="font-roboto hover:text-brand-honey">
                Search Jobs
              </a>
              <a href="#about" className="font-roboto hover:text-brand-honey">
                About
              </a>
            </nav>

            <div className="mt-8 flex items-center gap-4">
              <a
                href="#"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-gray text-brand-soft hover:text-brand-honey"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M13 10h3l-1 4h-2v7h-4v-7H7v-4h2V8a4 4 0 0 1 4-4h3v4h-3a1 1 0 0 0-1 1v1Z" />
                </svg>
              </a>
              <a
                href="#"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-gray text-brand-soft hover:text-brand-honey"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M6 9H3V21H6V9ZM4.5 3C3.67 3 3 3.67 3 4.5C3 5.33 3.67 6 4.5 6C5.33 6 6 5.33 6 4.5C6 3.67 5.33 3 4.5 3ZM21 21H18V14.5C18 12.84 16.66 11.5 15 11.5C13.34 11.5 12 12.84 12 14.5V21H9V9H12V10.4C12.69 9.29 14.07 8.5 15.6 8.5C18.09 8.5 20 10.41 20 12.9V21H21Z" />
                </svg>
              </a>
              <a
                href="#"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-gray text-brand-soft hover:text-brand-honey"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M22 5.95c-.7.3-1.46.5-2.25.6a3.77 3.77 0 0 0 1.64-2.08 7.52 7.52 0 0 1-2.4.92 3.75 3.75 0 0 0-6.39 3.43A10.64 10.64 0 0 1 3.1 4.9a3.74 3.74 0 0 0 1.16 5 3.7 3.7 0 0 1-1.7-.47v.05a3.75 3.75 0 0 0 3 3.68 3.8 3.8 0 0 1-1.69.06 3.77 3.77 0 0 0 3.5 2.6A7.53 7.53 0 0 1 2 18.08a10.64 10.64 0 0 0 5.76 1.69c6.92 0 10.71-5.73 10.71-10.71 0-.16 0-.31-.01-.47A7.55 7.55 0 0 0 22 5.95Z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-slate-700 bg-brand-bee p-6 shadow md:p-8">
              <h3 className="font-poppins text-2xl font-semibold">
                Get in Touch
              </h3>

              <form className="mt-6 space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      className="font-roboto mb-2 block text-sm"
                      htmlFor="firstName"
                    >
                      First Name <span className="text-brand-honey">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      className="w-full rounded-lg border border-slate-700 bg-transparent px-3 py-2 font-roboto text-brand-soft placeholder-brand-gray outline-none focus:border-brand-honey focus:ring-2 focus:ring-brand-honey"
                    />
                  </div>
                  <div>
                    <label
                      className="font-roboto mb-2 block text-sm"
                      htmlFor="lastName"
                    >
                      Last Name <span className="text-brand-honey">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      className="w-full rounded-lg border border-slate-700 bg-transparent px-3 py-2 font-roboto text-brand-soft placeholder-brand-gray outline-none focus:border-brand-honey focus:ring-2 focus:ring-brand-honey"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="font-roboto mb-2 block text-sm"
                    htmlFor="email"
                  >
                    Email <span className="text-brand-honey">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full rounded-lg border border-slate-700 bg-transparent px-3 py-2 font-roboto text-brand-soft placeholder-brand-gray outline-none focus:border-brand-honey focus:ring-2 focus:ring-brand-honey"
                  />
                </div>
                <div>
                  <label
                    className="font-roboto mb-2 block text-sm"
                    htmlFor="message"
                  >
                    Message <span className="text-brand-honey">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    placeholder="Tell us how we can help you..."
                    className="w-full rounded-lg border border-slate-700 bg-transparent px-3 py-2 font-roboto text-brand-soft placeholder-brand-gray outline-none focus:border-brand-honey focus:ring-2 focus:ring-brand-honey"
                  />
                </div>
                <button
                  type="button"
                  className="w-full rounded-lg bg-brand-honey px-4 py-3 font-roboto font-medium text-brand-bee transition-colors hover:bg-brand-honey-600"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-700 pt-6 text-sm text-brand-gray md:flex-row">
          <div className="font-roboto">
            © {new Date().getFullYear()} Work Hive. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-brand-honey">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-brand-honey">
              Terms of Use
            </a>
            <a href="#cookie" className="hover:text-brand-honey">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
