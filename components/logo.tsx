"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <Link href="/dashboard" className={cn("flex items-center gap-2.5 group", className)}>
      {/* SVG Icon */}
      <div className="relative flex-shrink-0">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Background hexagon */}
          <rect width="36" height="36" rx="10" fill="url(#logoGrad)" />
          {/* S letter / flow symbol */}
          <path
            d="M11 13.5C11 11.567 12.567 10 14.5 10H21.5C23.433 10 25 11.567 25 13.5C25 15.433 23.433 17 21.5 17H14.5C12.567 17 11 18.567 11 20.5C11 22.433 12.567 24 14.5 24H21.5"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrow */}
          <path
            d="M19 21.5L21.5 24L19 26.5"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Wordmark */}
      {!collapsed && (
        <div className="flex flex-col leading-none">
          <span className="text-[15px] font-bold tracking-tight text-white">
            stock<span className="text-indigo-300">Flow</span>
          </span>
          <span className="text-[9px] text-indigo-400 tracking-widest uppercase font-medium">
            Inventory
          </span>
        </div>
      )}
    </Link>
  );
}
