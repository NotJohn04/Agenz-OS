"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, TrendingUp, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Avg ROAS", value: "3x", icon: TrendingUp, color: "#10b981" },
  { label: "Lower CAC", value: "40%", icon: Target, color: "#3b82f6" },
  { label: "Clients Served", value: "20+", icon: Users, color: "#8b5cf6" },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    router.push("/dashboard");
  };

  const handleDemo = () => {
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 500);
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#3b82f6]/8 blur-3xl" />
          <div className="absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full bg-[#8b5cf6]/6 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 h-[400px] w-[400px] rounded-full bg-[#06b6d4]/6 blur-3xl" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/logo.png" alt="Agenz OS" width={160} height={40} className="h-10 w-auto" />
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          {/* Main tagline */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/20 bg-[#3b82f6]/10 px-3 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <span className="text-[11px] font-medium text-[#3b82f6]">AI-Powered Growth Engine · Malaysia</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Revolutionizing the Art of
              <br />
              <span className="bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#8b5cf6] bg-clip-text text-transparent">
                Acquiring Customers
              </span>
              <br />
              with AI.
            </h1>
            <p className="text-base text-white/50 leading-relaxed max-w-md">
              We engineer autonomous growth systems that acquire customers while you sleep.
              Track every constraint, every lead, every ringgit.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/5 bg-white/3 p-4 backdrop-blur-sm"
              >
                <div
                  className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl border border-white/5 bg-white/3 p-5 backdrop-blur-sm">
            <p className="text-sm text-white/70 italic leading-relaxed">
              &ldquo;Since joining Agenz OS, our CPL dropped from RM 34 to RM 16 in 60 days. The constraint diagnostic told us exactly what to fix.&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-xs font-bold text-white">
                MT
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Marcus Tan</p>
                <p className="text-[10px] text-white/40">TechMart Online · Advanced Plan</p>
              </div>
              <div className="ml-auto flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-[#f59e0b] text-xs">★</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-white/20">
            © 2026 Agenz MY · L5-15, IKON Connaught, KL · agenz.my
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12 bg-[#0d0d0d]">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center lg:hidden">
            <Image src="/logo.png" alt="Agenz OS" width={120} height={32} className="h-8 w-auto" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="mt-1 text-sm text-white/50">Sign in to your Agenz OS account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-white/70">Email address</Label>
              <Input
                type="email"
                placeholder="you@business.my"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#3b82f6] focus:ring-[#3b82f6]/20 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-white/70">Password</Label>
                <button type="button" className="text-[11px] text-[#3b82f6] hover:text-[#06b6d4] transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#3b82f6] focus:ring-[#3b82f6]/20 rounded-xl pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/8" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0d0d0d] px-3 text-[11px] text-white/30">or</span>
            </div>
          </div>

          {/* Demo access */}
          <button
            onClick={handleDemo}
            className="w-full h-11 rounded-xl border border-white/10 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all duration-200"
          >
            Continue as Demo ✦
          </button>

          <p className="text-center text-xs text-white/30">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#3b82f6] hover:text-[#06b6d4] transition-colors font-medium">
              Get started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
