import Navbar from "../components/navigation/nav";
import Footer from "../components/navigation/footer";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col items-center justify-center px-4 text-center bg-white">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
          Your Career, <span className="text-brand-honey">Organized</span>
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600 md:text-xl">
          Track, Apply, and Land Your Dream Job — All in One Place. No more lost
          applications. No more confusion. Just career clarity.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="#apply"
            className="rounded-lg bg-brand-honey px-6 py-3 text-sm font-medium text-brand-bee transition-colors hover:bg-brand-honey-600 md:text-base"
          >
            Apply Jobs
          </a>
          <a
            href="#learn-more"
            className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 md:text-base"
          >
            Learn More
          </a>
        </div>
      </section>

      <section className="w-full bg-brand-honey">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center">
          <h2 className="font-poppins text-3xl font-semibold text-slate-900 md:text-4xl">
            Where Opportunities Gather and Careers Take Flight
          </h2>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <h2 className="font-poppins text-4xl font-bold text-slate-900">
              How It Works
            </h2>
            <p className="font-roboto mt-3 text-slate-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="mt-16 space-y-16">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-14 w-14 items-center justify-ce  nter rounded-full bg-brand-honey text-brand-bee">
                    <span className="text-lg font-bold">01</span>
                  </span>
                  <span
                    className="hidden h-[2px] w-20 md:block"
                    style={{ background: "#E5E7EB" }}
                  />
                </div>
                <h3 className="mt-6 font-poppins text-3xl font-semibold text-slate-900 md:text-4xl">
                  Upload Resume
                </h3>
                <p className="font-roboto mt-3 max-w-xl text-slate-600">
                  Upload your resume and let our AI analyze your skills and
                  experience.
                </p>
              </div>
              <div>
                <div className="relative rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
                  <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-brand-honey-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-10 w-10 text-brand-honey-600"
                    >
                      <path d="M8 6v12l10-6-10-6z" />
                    </svg>
                  </div>
                  <p className="mt-6 text-center font-roboto text-brand-honey-600">
                    Interview.Mp4 Demo
                  </p>
                </div>
              </div>
            </div>

            <div className="grid items-center gap-10 md:grid-cols-2">
              <div className="order-2 md:order-1">
                <div className="relative rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
                  <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-brand-honey-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-10 w-10 text-brand-honey-600"
                    >
                      <path d="M8 6v12l10-6-10-6z" />
                    </svg>
                  </div>
                  <p className="mt-6 text-center font-roboto text-brand-honey-600">
                    UploadResume.Mp4 Demo
                  </p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-honey text-brand-bee">
                    <span className="text-lg font-bold">02</span>
                  </span>
                  <span
                    className="hidden h-[2px] w-20 md:block"
                    style={{ background: "#E5E7EB" }}
                  />
                </div>
                <h3 className="mt-6 font-poppins text-3xl font-semibold text-slate-900 md:text-4xl">
                  View Matched Jobs
                </h3>
                <p className="font-roboto mt-3 max-w-xl text-slate-600">
                  Browse roles matched to your profile and career goals.
                </p>
              </div>
            </div>

            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-honey text-brand-bee">
                    <span className="text-lg font-bold">03</span>
                  </span>
                  <span
                    className="hidden h-[2px] w-20 md:block"
                    style={{ background: "#E5E7EB" }}
                  />
                </div>
                <h3 className="mt-6 font-poppins text-3xl font-semibold text-slate-900 md:text-4xl">
                  Track Applications
                </h3>
                <p className="font-roboto mt-3 max-w-xl text-slate-600">
                  Manage all applications in one place with status updates and
                  reminders.
                </p>
              </div>
              <div>
                <div className="relative rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
                  <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-brand-honey-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-10 w-10 text-brand-honey-600"
                    >
                      <path d="M8 6v12l10-6-10-6z" />
                    </svg>
                  </div>
                  <p className="mt-6 text-center font-roboto text-brand-honey-600">
                    Tracking.Mp4 Demo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-brand-honey">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="text-center">
            <h2 className="font-poppins text-3xl font-bold text-slate-900 md:text-4xl">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="font-roboto mt-3 text-slate-600">
              Powerful features designed for modern job seekers
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "AI Resume Matching",
                desc: "Smart algorithm matches your skills with relevant job opportunities automatically.",
                icon: "🔎",
              },
              {
                title: "Centralized Job Tracking",
                desc: "Keep all your applications organized in one professional dashboard.",
                icon: "📂",
              },
              {
                title: "Interview Calendar",
                desc: "Never miss an interview with integrated calendar management.",
                icon: "📅",
              },
              {
                title: "Application Status Updates",
                desc: "Real-time tracking of your application progress from submission to offer.",
                icon: "🔔",
              },
              {
                title: "Professional Network",
                desc: "Connect with recruiters and expand your professional network.",
                icon: "👥",
              },
              {
                title: "Secure & Private",
                desc: "Your data is encrypted and protected with industry-standard security.",
                icon: "🔒",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div
                  className="mb-4 inline-flex rounded-md p-2"
                  style={{ background: "#FFF3C6", color: "#1C1C1C" }}
                >
                  <span className="text-xl" aria-hidden>
                    {f.icon}
                  </span>
                </div>
                <h3 className="font-poppins text-lg font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="font-roboto mt-2 text-sm text-slate-600">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 py-14 text-center text-brand-bee">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="font-poppins text-2xl font-semibold md:text-3xl">
            Ready to Organize Your Career?
          </h2>
          <p className="font-roboto mt-2 opacity-90">
            Join thousands of job seekers who have simplified their job search
          </p>
          <a
            href="#start"
            className="bg-brand-honey mt-6 inline-block rounded-md bg-white px-5 py-3 font-roboto text-sm font-medium text-brand-bee shadow hover:bg-slate-100"
          >
            Apply Jobs
          </a>
        </div>
      </section>

      <footer className="bg-white py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-3">
          <div>
            <div className="mb-3 inline-flex items-center gap-2">
              <div
                className="rounded-xl p-2.5"
                style={{ background: "#FFC93C" }}
              >
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
              <span className="font-poppins text-lg font-semibold text-slate-900">
                JobSeeker
              </span>
            </div>
            <p className="font-roboto max-w-md text-sm text-slate-600">
              Organize your career journey with our comprehensive job tracking
              platform. From application to offer, we help you stay in control.
            </p>
            <div className="mt-4 flex gap-3 text-slate-500">
              <span>🐦</span>
              <span>💼</span>
              <span>💬</span>
            </div>
          </div>
          <div>
            <h4 className="font-poppins text-sm font-semibold text-slate-900">
              Company
            </h4>
            <ul className="font-roboto mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <a href="/about" className="hover:text-slate-900">
                  About
                </a>
              </li>
              <li>
                <a href="/billing" className="hover:text-slate-900">
                  Billing
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-slate-900">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-poppins text-sm font-semibold text-slate-900">
              Legal
            </h4>
            <ul className="font-roboto mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <a href="#privacy" className="hover:text-slate-900">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-slate-900">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#cookie" className="hover:text-slate-900">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl px-4">
          <div className="border-t pt-6 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} JobSeeker. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
