"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-3">
          <svg width="44" height="44" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="url(#lgl1)" />
            <path
              d="M11 13.5C11 11.567 12.567 10 14.5 10H21.5C23.433 10 25 11.567 25 13.5C25 15.433 23.433 17 21.5 17H14.5C12.567 17 11 18.567 11 20.5C11 22.433 12.567 24 14.5 24H21.5"
              stroke="white" strokeWidth="2.5" strokeLinecap="round"
            />
            <path d="M19 21.5L21.5 24L19 26.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="lgl1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div>
            <div className="text-xl font-bold text-white leading-none">
              stock<span className="text-indigo-300">Flow</span>
            </div>
            <div className="text-[10px] text-indigo-400 tracking-widest uppercase mt-0.5">
              Inventory
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-white">Welcome back</h1>
        <p className="text-sm text-slate-400 mt-1">Sign in to your account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-slate-300 text-sm">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@stockflow.com"
            autoComplete="email"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-slate-300 text-sm">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-11 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
          disabled={loading}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {/* Quick-fill demo credentials */}
      <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
        <p className="text-xs text-indigo-300 font-medium mb-1.5">Demo Credentials (click to fill):</p>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => { setEmail("admin@stockflow.com"); setPassword("Admin123!"); setError(""); }}
            className="w-full text-left text-xs text-slate-400 hover:text-indigo-300 transition-colors py-0.5"
          >
            🔑 Admin: admin@stockflow.com / Admin123!
          </button>
          <button
            type="button"
            onClick={() => { setEmail("staff@stockflow.com"); setPassword("Staff123!"); setError(""); }}
            className="w-full text-left text-xs text-slate-400 hover:text-indigo-300 transition-colors py-0.5"
          >
            👤 Staff: staff@stockflow.com / Staff123!
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-slate-400 mt-6">
        No account?{" "}
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}
