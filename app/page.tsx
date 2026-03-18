import Link from "next/link";
import {
  MapPin,
  AlertTriangle,
  BarChart3,
  FileText,
  Bot,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Package,
} from "lucide-react";
import { ContactButton } from "@/components/contact-button";

// Inline the dashboard SVG logo so it's identical to the sidebar
function StockFlowLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      <rect width="36" height="36" rx="10" fill="url(#landingLogoGrad)" />
      <path
        d="M11 13.5C11 11.567 12.567 10 14.5 10H21.5C23.433 10 25 11.567 25 13.5C25 15.433 23.433 17 21.5 17H14.5C12.567 17 11 18.567 11 20.5C11 22.433 12.567 24 14.5 24H21.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 21.5L21.5 24L19 26.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="landingLogoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const features = [
  {
    icon: Package,
    title: "Inventory Management",
    description:
      "Track every product with SKU, categories, cost price, and selling price. Stay on top of your stock at all times.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: MapPin,
    title: "Multi-Location Inventory",
    description:
      "Manage stock across multiple warehouses or stores. Know exactly where each unit is located.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: AlertTriangle,
    title: "Low Stock Alerts",
    description:
      "Set minimum stock thresholds and get instant alerts when products are running low or out of stock.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description:
      "Record sales and track revenue over time. Identify best sellers and slow-moving inventory instantly.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: FileText,
    title: "Reports",
    description:
      "Generate detailed inventory and sales reports. Export data to make informed business decisions.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Bot,
    title: "AI Business Assistant",
    description:
      "Meet Blackbird, your AI assistant that analyzes your inventory and gives actionable insights in seconds.",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <StockFlowLogo size={32} />
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-bold tracking-tight text-slate-900">
                stock<span className="text-indigo-500">Flow</span>
              </span>
              <span className="text-[9px] text-slate-400 tracking-widest uppercase font-medium">
                Inventory
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
              <CheckCircle className="w-3.5 h-3.5" />
              Currently free to use
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Smart Inventory Management
              <br className="hidden sm:block" /> for{" "}
              <span className="text-indigo-600">Modern Businesses</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
              StockFlow helps you track stock, manage multiple locations, monitor
              sales and get AI-powered insights. All in one clean dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base w-full sm:w-auto justify-center"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-semibold px-8 py-3.5 rounded-xl transition-colors text-base w-full sm:w-auto justify-center"
              >
                Log In
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Everything you need to run your inventory
              </h2>
              <p className="text-slate-500 text-base max-w-xl mx-auto">
                Built for small and growing businesses that need reliable,
                real-time inventory control.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="p-6 border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-sm transition-all bg-white"
                >
                  <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <TrendingUp className="w-3.5 h-3.5" />
              Product Demo
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">See How It Works</h2>
            <p className="text-slate-500 mb-10">
              Watch how StockFlow simplifies your inventory management workflow
              in just a few clicks.
            </p>
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video shadow-xl">
              {/* Replace src with your actual video URL when ready */}
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="StockFlow Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 px-6 bg-indigo-600">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to take control of your inventory?
            </h2>
            <p className="text-indigo-200 mb-8">
              Join businesses already using StockFlow to manage their stock smarter.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-indigo-600 font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
            >
              Start Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <StockFlowLogo size={28} />
                <div className="flex flex-col leading-none">
                  <span className="text-[14px] font-bold tracking-tight text-white">
                    stock<span className="text-indigo-400">Flow</span>
                  </span>
                  <span className="text-[9px] text-slate-500 tracking-widest uppercase font-medium">
                    Inventory
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                Built for modern businesses. Smart inventory management that
                scales with you.
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" /> Currently free to use
              </span>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="/about" className="hover:text-white transition-colors">About Us</a>
                </li>
                <li>
                  <ContactButton className="hover:text-white transition-colors text-sm text-left">
                    Contact
                  </ContactButton>
                </li>
              </ul>
            </div>

            {/* Product + Resources */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm mb-6">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">Features</a>
                </li>
              </ul>
              <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <ContactButton
                    subject="StockFlow Help Request"
                    className="hover:text-white transition-colors text-sm text-left"
                  >
                    Help
                  </ContactButton>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © {new Date().getFullYear()} StockFlow. All rights reserved.
            </p>
            <a
              href="https://instagram.com/otakustore_ng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-white transition-colors"
            >
              Instagram: @otakustore_ng
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
