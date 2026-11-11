"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { authClient } from "../lib/auth-client";
import { Spotlight } from "@/components/ui/spotlight";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    await authClient.signIn.email(
      {
        email,
        password,
        rememberMe: true,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          router.replace("/dashboard");
        },
        onError: (ctx) => {
          setIsLoading(false);
          setErrorMessage(ctx.error.message || "Invalid email or password");
        },
      }
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#0a0a0c] text-white ...">
        {/* Aceternity Spotlight */}
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />

        <div className="relative z-10 w-full max-w-md">
          {/* Brand Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3 border border-indigo-400/20">
              <Pencil className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-linear-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              SketchIt
            </span>
          </div>

          {/* Card */}
          <div className="p-8 rounded-3xl border border-white/8 bg-[#121318]/90 shadow-2xl backdrop-blur-2xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                Welcome back
              </h1>
              <p className="text-sm text-neutral-400">
                Enter your details to access your workspaces.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl text-sm border border-white/10 bg-white/4 text-white placeholder-neutral-500 outline-none transition focus:bg-white/[0.07] focus:ring-1 "
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl text-sm border border-white/10 bg-white/4 text-white placeholder-neutral-500 outline-none transition focus:bg-white/[0.07] focus:ring-1 "
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 mt-6 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 bg-gray-300 hover:bg-white text-black hover:text-black shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
  );
}