import Link from "next/link";

function StockFlowLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      <rect width="36" height="36" rx="10" fill="url(#privacyLogoGrad)" />
      <path d="M11 13.5C11 11.567 12.567 10 14.5 10H21.5C23.433 10 25 11.567 25 13.5C25 15.433 23.433 17 21.5 17H14.5C12.567 17 11 18.567 11 20.5C11 22.433 12.567 24 14.5 24H21.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 21.5L21.5 24L19 26.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="privacyLogoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function PrivacyPage() {
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

      <main className="flex-1 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-400 mb-10">Last updated: March 2026</p>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 text-sm leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">1. Introduction</h2>
              <p>
                StockFlow (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your personal information. This Privacy Policy
                explains what data we collect, how we use it, and the choices you have regarding your data when you
                use the StockFlow platform at stockflow.app and related services.
              </p>
              <p className="mt-3">
                By creating an account or using our platform, you agree to the collection and use of information
                in accordance with this policy. If you do not agree, please discontinue use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">2. Information We Collect</h2>
              <p className="font-medium text-slate-700 mb-2">Account information:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your full name and email address (provided during registration)</li>
                <li>Your password (stored as a secure, hashed value — never in plain text)</li>
                <li>Your account role (Administrator or Staff)</li>
                <li>Optional profile picture you choose to upload</li>
              </ul>
              <p className="font-medium text-slate-700 mb-2 mt-4">Business data you enter:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Product names, SKUs, categories, quantities, and pricing</li>
                <li>Inventory locations and stock distribution</li>
                <li>Sales records and transaction history</li>
                <li>Product images you upload</li>
              </ul>
              <p className="font-medium text-slate-700 mb-2 mt-4">Usage data (automatically collected):</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Browser type and device information</li>
                <li>Pages visited and features used (for improving the service)</li>
                <li>Session timestamps and login activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Provide, operate, and maintain the StockFlow service</li>
                <li>Authenticate your identity and secure your account</li>
                <li>Generate inventory insights, reports, and analytics for your business</li>
                <li>Power the Blackbird AI assistant with your live inventory data (processed per-request, not stored)</li>
                <li>Send important service notifications (account changes, security alerts)</li>
                <li>Improve platform features and user experience based on usage patterns</li>
                <li>Respond to your support requests or inquiries</li>
              </ul>
              <p className="mt-3">
                We do not sell, rent, or share your personal data with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">4. Third-Party Services</h2>
              <p>StockFlow uses the following third-party services to operate:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <span className="font-medium text-slate-700">PostgreSQL Database</span> — Your inventory data is stored
                  securely in a PostgreSQL database. Data is encrypted at rest and in transit.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Google Gemini AI</span> — When you use the Blackbird AI
                  assistant, your question and a snapshot of your inventory data are sent to Google&apos;s Gemini API to
                  generate a response. This data is not stored by Google for training purposes under our API usage terms.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Vercel / Hosting Provider</span> — The application is
                  hosted on a cloud platform. Standard server logs may be retained for security and debugging.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">5. Data Security</h2>
              <p>
                We take data security seriously. We implement the following measures to protect your information:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Passwords are hashed using bcrypt before storage — they are never stored in plain text</li>
                <li>All data is transmitted over HTTPS (SSL/TLS encryption)</li>
                <li>Session tokens are signed and verified using secure JWT standards</li>
                <li>Access to your data is restricted to authenticated sessions only</li>
                <li>All inventory data is scoped to your account — other users cannot access your data</li>
              </ul>
              <p className="mt-3">
                While we do our best to protect your data, no system is 100% immune to breaches. In the event
                of a security incident affecting your data, we will notify you promptly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">6. Data Retention</h2>
              <p>
                We retain your data for as long as your account is active. If you request account deletion,
                all your personal data and business data will be permanently removed from our systems within 30 days,
                except where retention is required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">7. Your Rights</h2>
              <p>You have the following rights regarding your data:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><span className="font-medium text-slate-700">Access:</span> Request a copy of the data we hold about you</li>
                <li><span className="font-medium text-slate-700">Correction:</span> Update your name or profile information directly in Settings</li>
                <li><span className="font-medium text-slate-700">Deletion:</span> Request that we delete your account and all associated data</li>
                <li><span className="font-medium text-slate-700">Portability:</span> Request an export of your inventory and sales data</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:motunrayoobipehin@gmail.com" className="text-indigo-600 hover:underline">
                  motunrayoobipehin@gmail.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">8. Cookies</h2>
              <p>
                StockFlow uses session cookies to keep you logged in securely. These are essential cookies
                required for the service to function. We do not use advertising or tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">9. Children&apos;s Privacy</h2>
              <p>
                StockFlow is not intended for users under the age of 13. We do not knowingly collect personal
                information from children. If you believe a child has provided us with their information,
                please contact us and we will delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. When we do, we will update the
                &quot;Last updated&quot; date at the top of this page. Continued use of the service after changes
                constitutes your acceptance of the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <p className="mt-2">
                Email:{" "}
                <a href="mailto:motunrayoobipehin@gmail.com" className="text-indigo-600 hover:underline">
                  motunrayoobipehin@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-6 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <StockFlowLogo size={24} />
            <span className="text-sm font-semibold text-white">StockFlow</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} StockFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
