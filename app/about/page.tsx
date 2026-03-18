import Link from "next/link";
import { ArrowRight, CheckCircle, Package, Target, Users, Zap } from "lucide-react";
import { ContactButton } from "@/components/contact-button";

function StockFlowLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      <rect width="36" height="36" rx="10" fill="url(#aboutLogoGrad)" />
      <path d="M11 13.5C11 11.567 12.567 10 14.5 10H21.5C23.433 10 25 11.567 25 13.5C25 15.433 23.433 17 21.5 17H14.5C12.567 17 11 18.567 11 20.5C11 22.433 12.567 24 14.5 24H21.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 21.5L21.5 24L19 26.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="aboutLogoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const values = [
  { icon: Target, title: "Built with Purpose", description: "StockFlow was built to solve a real problem: helping business owners spend less time counting and more time growing." },
  { icon: Users, title: "Made for Real Businesses", description: "Whether you run a small shop or manage multiple warehouses, StockFlow adapts to how your business actually works." },
  { icon: Zap, title: "Simple by Design", description: "We believe powerful tools don't have to be complicated. Every feature in StockFlow is designed to be intuitive and fast." },
  { icon: Package, title: "Always Improving", description: "We listen to our users and continuously ship improvements. Your feedback shapes every update we release." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <StockFlowLogo size={32} />
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-bold tracking-tight text-slate-900">stock<span className="text-indigo-500">Flow</span></span>
              <span className="text-[9px] text-slate-400 tracking-widest uppercase font-medium">Inventory</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">Log In</Link>
            <Link href="/register" className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors">Sign Up</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">About StockFlow</h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              StockFlow is a modern inventory management platform built for small and growing businesses.
              We make it simple to track your stock, manage multiple locations, record sales, and get
              real-time insights, all without needing an accounting degree or a big team.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-indigo-600 rounded-2xl p-10 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-indigo-100 text-lg leading-relaxed max-w-2xl mx-auto">
                To give every business owner, regardless of size or technical background, a powerful,
                clean, and intelligent tool to manage their inventory with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">What We Stand For</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((v) => (
                <div key={v.title} className="bg-white border border-slate-100 rounded-2xl p-6">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                    <v.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features highlight */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">What StockFlow Gives You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Real-time inventory tracking across all products",
                "Multi-location stock management",
                "Automatic low stock and out-of-stock alerts",
                "Sales recording and revenue analytics",
                "Best seller and slow mover identification",
                "AI-powered business insights with Blackbird",
                "Detailed inventory and sales reports",
                "Secure, role-based access for your team",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Get in Touch</h2>
            <p className="text-slate-500 mb-6">
              Have a question, suggestion, or want to learn more? We would love to hear from you.
            </p>
            <ContactButton className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Contact Us <ArrowRight className="w-4 h-4" />
            </ContactButton>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <StockFlowLogo size={24} />
            <span className="text-sm font-semibold text-white">StockFlow</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} StockFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
