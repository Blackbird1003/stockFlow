"use client";

import { useState } from "react";
import { X, Mail } from "lucide-react";

interface ContactButtonProps {
  children: React.ReactNode;
  className?: string;
  subject?: string;
}

export function ContactButton({ children, className, subject }: ContactButtonProps) {
  const [open, setOpen] = useState(false);
  const email = "motunrayoobipehin@gmail.com";
  const mailtoUrl = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Get in Touch</h3>
                <p className="text-xs text-slate-400">We would love to hear from you</p>
              </div>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              Send us an email and we will get back to you as soon as possible.
            </p>

            <div className="bg-slate-50 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs text-slate-400 mb-1">Email address</p>
              <p className="text-sm font-medium text-slate-800 break-all">{email}</p>
            </div>

            <a
              href={mailtoUrl}
              className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
              onClick={() => setOpen(false)}
            >
              <Mail className="w-4 h-4" />
              Open Email Client
            </a>
          </div>
        </div>
      )}
    </>
  );
}
