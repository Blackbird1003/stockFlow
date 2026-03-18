import Link from "next/link";

function StockFlowLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      <rect width="36" height="36" rx="10" fill="url(#termsLogoGrad)" />
      <path d="M11 13.5C11 11.567 12.567 10 14.5 10H21.5C23.433 10 25 11.567 25 13.5C25 15.433 23.433 17 21.5 17H14.5C12.567 17 11 18.567 11 20.5C11 22.433 12.567 24 14.5 24H21.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 21.5L21.5 24L19 26.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="termsLogoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-slate-400 mb-10">Last updated: March 2026</p>

          <div className="space-y-8 text-slate-600 text-sm leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using StockFlow (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
                If you do not agree to these terms, you may not use the Service. These terms apply to all users,
                including business owners, team members, and anyone who creates an account on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">2. Description of Service</h2>
              <p>
                StockFlow is a cloud-based inventory management platform that provides tools for tracking products,
                managing stock across multiple locations, recording sales, generating reports, and accessing
                AI-powered business insights. The Service is provided &quot;as is&quot; and we reserve the right to
                modify, update, or discontinue features at any time.
              </p>
              <p className="mt-3">
                The Service is currently provided free of charge. We reserve the right to introduce paid plans
                or pricing changes in the future, with reasonable notice to existing users.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">3. Account Registration</h2>
              <p>
                To use StockFlow, you must create an account with a valid email address and password. You are
                responsible for:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Providing accurate and truthful registration information</li>
                <li>Keeping your login credentials confidential and secure</li>
                <li>All activity that occurs under your account</li>
                <li>Notifying us immediately of any unauthorized access to your account</li>
              </ul>
              <p className="mt-3">
                You may not share your account credentials with unauthorized parties or create accounts
                on behalf of others without their knowledge.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">4. Acceptable Use</h2>
              <p>You agree to use StockFlow only for lawful business purposes. You must not:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Use the Service to store or manage data related to illegal goods or activities</li>
                <li>Attempt to gain unauthorized access to other users&apos; accounts or data</li>
                <li>Reverse-engineer, decompile, or tamper with any part of the platform</li>
                <li>Use automated bots or scripts to scrape or overload the Service</li>
                <li>Upload malicious files, code, or content of any kind</li>
                <li>Misrepresent your identity or business information</li>
                <li>Violate any applicable local, national, or international laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">5. Your Data and Content</h2>
              <p>
                You retain full ownership of all business data you enter into StockFlow — including products,
                categories, sales records, and inventory information. By using the Service, you grant StockFlow
                a limited licence to process and store your data solely for the purpose of providing the Service to you.
              </p>
              <p className="mt-3">
                You are responsible for the accuracy and legality of the data you input. StockFlow is not
                liable for decisions made based on incorrect or incomplete data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">6. AI Features (Blackbird)</h2>
              <p>
                StockFlow includes an AI business assistant called Blackbird, powered by Google&apos;s Gemini API.
                When you use Blackbird, a snapshot of your inventory data and your question are sent to Google&apos;s
                API to generate a response. AI-generated responses are for informational and advisory purposes only
                and should not be treated as professional financial, legal, or business advice.
              </p>
              <p className="mt-3">
                StockFlow does not guarantee the accuracy of AI responses. You are responsible for verifying
                any AI-generated insights before acting on them.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">7. Intellectual Property</h2>
              <p>
                All elements of StockFlow — including the platform design, codebase, logo, branding, and
                the Blackbird AI concept — are the intellectual property of StockFlow and its creators.
                You may not copy, reproduce, or distribute any part of the platform without prior written permission.
              </p>
              <p className="mt-3">
                Your business data remains yours. We do not claim ownership over any content or data you input.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">8. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, StockFlow and its creators shall not be liable for:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Any indirect, incidental, or consequential damages arising from your use of the Service</li>
                <li>Loss of business data due to technical failures, provided reasonable backups are maintained</li>
                <li>Decisions made based on inaccurate AI-generated insights</li>
                <li>Service downtime or interruptions beyond our reasonable control</li>
                <li>Unauthorized access resulting from failure to secure your own credentials</li>
              </ul>
              <p className="mt-3">
                The Service is provided &quot;as is&quot; without warranties of any kind, express or implied,
                including fitness for a particular purpose.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">9. Account Termination</h2>
              <p>
                You may delete your account at any time by contacting us. Upon deletion, all your data will
                be permanently removed within 30 days.
              </p>
              <p className="mt-3">
                We reserve the right to suspend or terminate your account without prior notice if you violate
                these Terms of Service, engage in abusive behaviour, or use the Service in a way that harms
                other users or the integrity of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">10. Changes to These Terms</h2>
              <p>
                We may update these Terms of Service from time to time. Changes will be reflected by the
                &quot;Last updated&quot; date at the top of this page. Continued use of StockFlow after changes
                constitutes your acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">11. Contact</h2>
              <p>
                If you have any questions about these Terms of Service, please reach out to us:
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
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} StockFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
