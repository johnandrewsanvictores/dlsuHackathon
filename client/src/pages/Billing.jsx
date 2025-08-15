import React, { useState } from "react";
import Navbar from "../components/navigation/nav";

const Billing = () => {
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [billingCycle, setBillingCycle] = useState("one-time");

  const creditPackages = [
    {
      id: "starter",
      name: "Starter Pack",
      credits: 25,
      bonusCredits: 0,
      totalCredits: 25,
      price: 50,
      effectivePrice: 2.00,
      popular: false,
      features: [
        "25 AI job matches",
        "Basic resume analysis",
        "Email support",
        "30-day validity"
      ]
    },
    {
      id: "explorer",
      name: "Explorer Pack",
      credits: 50,
      bonusCredits: 5,
      totalCredits: 55,
      price: 95,
      effectivePrice: 1.73,
      popular: false,
      features: [
        "55 AI job matches",
        "Advanced resume analysis",
        "Priority email support",
        "60-day validity",
        "5 bonus credits"
      ]
    },
    {
      id: "job-hunter",
      name: "Job Hunter Pack",
      credits: 100,
      bonusCredits: 15,
      totalCredits: 115,
      price: 180,
      effectivePrice: 1.57,
      popular: true,
      features: [
        "115 AI job matches",
        "Premium resume analysis",
        "Priority support",
        "90-day validity",
        "15 bonus credits",
        "Interview preparation tips"
      ]
    },
    {
      id: "super-career",
      name: "Super Career Pack",
      credits: 200,
      bonusCredits: 40,
      totalCredits: 240,
      price: 350,
      effectivePrice: 1.46,
      popular: false,
      features: [
        "240 AI job matches",
        "Advanced AI analysis",
        "24/7 priority support",
        "120-day validity",
        "40 bonus credits",
        "Career coaching sessions",
        "Resume optimization"
      ]
    }
  ];

  const selectedPackage = creditPackages.find(pkg => pkg.id === selectedPlan);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-honey-50 to-brand-honey-100 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h1 className="font-poppins text-4xl font-bold text-slate-900 md:text-5xl">
              Choose Your <span className="text-brand-honey">Credit Package</span>
            </h1>
            <p className="font-roboto mt-4 max-w-2xl mx-auto text-lg text-slate-600">
              Get the perfect amount of AI-powered job matches for your career journey. 
              More credits = better value per match.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          {/* Billing Toggle */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm border">
              <button
                onClick={() => setBillingCycle("one-time")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === "one-time"
                    ? "bg-brand-honey text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                One-Time Purchase
              </button>
              <button
                onClick={() => setBillingCycle("subscription")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === "subscription"
                    ? "bg-brand-honey text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly Subscription
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creditPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-xl border-2 p-6 shadow-sm transition-all hover:shadow-md ${
                  selectedPlan === pkg.id
                    ? "border-brand-honey ring-2 ring-brand-honey-20"
                    : "border-slate-200 hover:border-brand-honey-300"
                } ${pkg.popular ? "ring-2 ring-brand-honey" : ""}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-honey text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="font-poppins text-xl font-semibold text-slate-900 mb-2">
                    {pkg.name}
                  </h3>
                  
                  {/* Credits Display */}
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-slate-900">
                      {pkg.totalCredits}
                    </div>
                    <div className="text-sm text-slate-600">Total Credits</div>
                    {pkg.bonusCredits > 0 && (
                      <div className="text-xs text-brand-honey font-medium mt-1">
                        +{pkg.bonusCredits} Bonus
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-slate-900">
                      ₱{pkg.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600">
                      ₱{pkg.effectivePrice.toFixed(2)} per credit
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6 text-left">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-4 h-4 text-brand-honey mt-0.5 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Select Button */}
                  <button
                    onClick={() => setSelectedPlan(pkg.id)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      selectedPlan === pkg.id
                        ? "bg-brand-honey text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-brand-honey hover:text-white"
                    }`}
                  >
                    {selectedPlan === pkg.id ? "Selected" : "Select Plan"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Plan Details */}
      {selectedPackage && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4">
            <div className="bg-gradient-to-r from-brand-honey-50 to-brand-honey-100 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="font-poppins text-2xl font-bold text-slate-900 mb-2">
                  You've Selected: {selectedPackage.name}
                </h2>
                <p className="font-roboto text-slate-600">
                  Perfect choice for your job search needs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {selectedPackage.totalCredits}
                  </div>
                  <div className="text-sm text-slate-600">Total Credits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    ₱{selectedPackage.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600">Total Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    ₱{selectedPackage.effectivePrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-600">Per Credit</div>
                </div>
              </div>

              <div className="text-center">
                <button className="bg-brand-honey text-white px-8 py-4 rounded-lg font-medium hover:bg-brand-honey-600 transition-colors">
                  Purchase Credits
                </button>
                <p className="text-xs text-slate-500 mt-2">
                  Secure payment powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="font-roboto text-slate-600">
              Everything you need to know about our credit system
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How do credits work?",
                answer: "Each credit allows you to use our AI-powered job matching feature. Upload your resume and get personalized job recommendations based on your skills and experience."
              },
              {
                question: "Do credits expire?",
                answer: "Yes, credits have a validity period depending on your package. Starter Pack: 30 days, Explorer Pack: 60 days, Job Hunter Pack: 90 days, Super Career Pack: 120 days."
              },
              {
                question: "Can I get a refund?",
                answer: "We offer a 30-day money-back guarantee. If you're not satisfied with our service, contact our support team for a full refund."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, debit cards, and digital wallets including GCash, PayMaya, and GrabPay for Philippine customers."
              },
              {
                question: "Can I upgrade my package?",
                answer: "Yes! You can upgrade to a larger package at any time. We'll credit the remaining value of your current package towards the new one."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="font-poppins text-lg font-semibold text-slate-900 mb-2">
                  {faq.question}
                </h3>
                <p className="font-roboto text-slate-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-honey py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-poppins text-3xl font-bold text-slate-900 mb-4">
            Ready to Accelerate Your Job Search?
          </h2>
          <p className="font-roboto text-lg text-slate-600 mb-8">
            Join thousands of job seekers who have found their dream careers with AI-powered matching
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-brand-honey px-8 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors">
              Start with Starter Pack
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-brand-honey transition-colors">
              View All Plans
            </button>
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
                <li><a href="/billing" className="hover:text-white transition-colors">Billing</a></li>
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

export default Billing;
