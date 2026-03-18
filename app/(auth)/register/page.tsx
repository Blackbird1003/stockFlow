"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validate(name: string, email: string, password: string, confirmPassword: string): FormErrors {
  const errors: FormErrors = {};
  if (!name.trim() || name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Valid email is required";
  if (!password || password.length < 6) errors.password = "Password must be at least 6 characters";
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("STAFF");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationErrors = validate(name, email, password, confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Registration failed");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Account Created!</h2>
        <p className="text-slate-400 text-sm">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="url(#lgr2)" />
            <path d="M11 13.5C11 11.567 12.567 10 14.5 10H21.5C23.433 10 25 11.567 25 13.5C25 15.433 23.433 17 21.5 17H14.5C12.567 17 11 18.567 11 20.5C11 22.433 12.567 24 14.5 24H21.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M19 21.5L21.5 24L19 26.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="lgr2" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div>
            <span className="text-lg font-bold text-white">stock<span className="text-indigo-300">Flow</span></span>
          </div>
        </div>
      </div>

      <div className="text-center mb-5">
        <h1 className="text-xl font-bold text-white">Create Account</h1>
        <p className="text-sm text-slate-400 mt-1">Join stockFlow today</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">Full Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
          />
          {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STAFF">Staff — View &amp; manage stock</SelectItem>
              <SelectItem value="ADMIN">Admin — Full access</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">Confirm Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
          />
          {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-11 transition-all"
          disabled={submitting}
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
