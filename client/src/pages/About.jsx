import React from "react";
import Navbar from "../components/navigation/nav";

const About = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former HR executive with 10+ years experience in talent acquisition and career development.",
      avatar: "👩‍💼"
    },
    {
      name: "Michael Chen",
      role: "CTO & Lead Developer",
      bio: "Full-stack developer passionate about AI and creating intuitive user experiences.",
      avatar: "👨‍💻"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      bio: "Product strategist focused on building tools that make job searching less stressful.",
      avatar: "👩‍🎨"
    },
    {
      name: "David Kim",
      role: "Lead Data Scientist",
      bio: "AI specialist developing intelligent job matching algorithms and resume analysis tools.",
      avatar: "👨‍🔬"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "100K+", label: "Jobs Matched" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" }
  ];

  const values = [
    {
      icon: "🎯",
      title: "User-First Design",
      description: "Every feature is built with job seekers in mind, prioritizing simplicity and effectiveness."
    },
    {
      icon: "🤖",
      title: "AI-Powered Intelligence",
      description: "Advanced algorithms that understand your skills and match you with the perfect opportunities."
    },
    {
      icon: "🔒",
      title: "Privacy & Security",
      description: "Your data is encrypted and protected with industry-standard security measures."
    },
    {
      icon: "🌱",
      title: "Continuous Innovation",
      description: "We're constantly improving our platform based on user feedback and industry trends."
    }
  ];

  const timeline = [
    {
      year: "2023",
      title: "Work Hive Founded",
      description: "Started with a simple mission: make job searching organized and stress-free."
    },
    {
      year: "2024",
      title: "AI Job Matching Launched",
      description: "Introduced intelligent resume analysis and job matching algorithms."
    },
    {
      year: "2024",
      title: "Mobile App Released",
      description: "Launched iOS and Android apps for job searching on the go."
    },
    {
      year: "2024",
      title: "Enterprise Features",
      description: "Added team collaboration and advanced analytics for career coaches."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-honey-50 to-brand-honey-100 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h1 className="font-poppins text-4xl font-bold text-slate-900 md:text-6xl">
              About <span className="text-brand-honey">Work Hive</span>
            </h1>
            <p className="font-roboto mt-6 max-w-3xl mx-auto text-lg text-slate-600 md:text-xl">
              We're revolutionizing how people find and manage their careers. 
              Our AI-powered platform makes job searching organized, intelligent, and stress-free.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-poppins text-3xl font-bold text-slate-900 mb-6">
                Our Mission
              </h2>
              <p className="font-roboto text-lg text-slate-600 mb-6">
                We believe everyone deserves to find meaningful work that aligns with their skills, 
                values, and career goals. Traditional job searching is fragmented, time-consuming, 
                and often overwhelming.
              </p>
              <p className="font-roboto text-lg text-slate-600 mb-6">
                Work Hive brings everything together in one intelligent platform. From resume 
                optimization to application tracking, we use AI to match you with opportunities 
                that truly fit your profile.
              </p>
              <p className="font-roboto text-lg text-slate-600">
                Our goal is simple: help you land your dream job faster, with less stress, 
                and more confidence.
              </p>
            </div>
            <div className="relative">
              <div className="bg-brand-honey-50 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏢</div>
                  <h3 className="font-poppins text-xl font-semibold text-slate-900 mb-2">
                    The Future of Job Searching
                  </h3>
                  <p className="font-roboto text-slate-600">
                    AI-powered matching, intelligent tracking, and personalized insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-brand-honey py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl font-bold text-slate-900 mb-4">
              Trusted by Job Seekers Worldwide
            </h2>
            <p className="font-roboto text-slate-600">
              Our platform is helping thousands of people find their dream careers
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-poppins text-3xl font-bold text-slate-900 mb-2">
                  {stat.number}
                </div>
                <div className="font-roboto text-sm text-slate-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl font-bold text-slate-900 mb-4">
              Our Core Values
            </h2>
            <p className="font-roboto text-lg text-slate-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-poppins text-xl font-semibold text-slate-900 mb-3">
                  {value.title}
                </h3>
                <p className="font-roboto text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl font-bold text-slate-900 mb-4">
              Meet Our Team
            </h2>
            <p className="font-roboto text-lg text-slate-600">
              The passionate people behind Work Hive
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm text-center">
                <div className="text-4xl mb-4">{member.avatar}</div>
                <h3 className="font-poppins text-lg font-semibold text-slate-900 mb-1">
                  {member.name}
                </h3>
                <p className="font-roboto text-sm text-brand-honey mb-3">
                  {member.role}
                </p>
                <p className="font-roboto text-sm text-slate-600">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl font-bold text-slate-900 mb-4">
              Our Journey
            </h2>
            <p className="font-roboto text-lg text-slate-600">
              From startup to trusted career platform
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-brand-honey-200"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="font-poppins text-sm font-semibold text-brand-honey mb-2">
                        {item.year}
                      </div>
                      <h3 className="font-poppins text-lg font-semibold text-slate-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="font-roboto text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-brand-honey rounded-full border-4 border-white shadow-sm"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-honey py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-poppins text-3xl font-bold text-slate-900 mb-4">
            Ready to Transform Your Job Search?
          </h2>
          <p className="font-roboto text-lg text-slate-600 mb-8">
            Join thousands of job seekers who have found their dream careers with Work Hive
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/jobs"
              className="inline-block bg-white text-brand-honey px-8 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors"
            >
              Start Job Searching
            </a>
            <a
              href="/profile"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-brand-honey transition-colors"
            >
              Create Profile
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-brand-honey p-2.5">
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
                <span className="font-poppins text-xl font-semibold text-white">
                  Work Hive
                </span>
              </div>
              <p className="font-roboto text-slate-400 mb-4">
                Organize your career journey with our comprehensive job tracking platform. 
                From application to offer, we help you stay in control.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  🐦 Twitter
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  💼 LinkedIn
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  💬 Discord
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-poppins text-sm font-semibold text-white mb-4">
                Product
              </h4>
              <ul className="font-roboto space-y-2 text-sm text-slate-400">
                <li><a href="/jobs" className="hover:text-white transition-colors">Job Search</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/profile" className="hover:text-white transition-colors">Profile</a></li>
                <li><a href="/calendar" className="hover:text-white transition-colors">Calendar</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-poppins text-sm font-semibold text-white mb-4">
                Company
              </h4>
              <ul className="font-roboto space-y-2 text-sm text-slate-400">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="font-roboto text-sm text-slate-400">
              © {new Date().getFullYear()} Work Hive. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;