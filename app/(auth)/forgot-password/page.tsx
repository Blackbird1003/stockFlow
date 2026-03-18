"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Simulate sending email (real implementation would call an API)
    await new Promise((r) => setTimeout(r, 1500));
    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
        <p className="text-slate-400 text-sm mb-6">
          If an account exists for that email, we&apos;ve sent password reset instructions.
        </p>
        <Link href="/login">
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-white">Reset Password</h1>
        <p className="text-sm text-slate-400 mt-1">
          Enter your email to receive reset instructions
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">Email Address</Label>
          <Input
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
          />
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-11" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : "Send Reset Link"}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back to login
        </Link>
      </p>
    </div>
  );
}
