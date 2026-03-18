"use client";

import { useSession } from "next-auth/react";
import { NotificationsDropdown } from "./notifications/notifications-dropdown";

interface TopbarProps {
  title: string;
  description?: string;
  alertCount?: number;
}

export function Topbar({ title, description }: TopbarProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {description && (
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <NotificationsDropdown />

          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
            <span>Hello,</span>
            <span className="font-semibold text-slate-800">
              {session?.user?.name?.split(" ")[0]}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
