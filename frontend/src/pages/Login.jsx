import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const { login, status } = useAuthStore();
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loading = status === "loading";

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await login(email, password);
    if (result.ok) {
      navigate("/app");
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void-950 px-4 py-12 text-slate-200">
      {/* Scoped background, no AppLayout here */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)]" />
        <div className="animate-float absolute -left-32 top-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="animate-float absolute right-[-10%] bottom-[-10%] h-[480px] w-[480px] rounded-full bg-violet-500/20 blur-[120px] [animation-delay:1.2s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link
          to="/"
          className="focus-ring mb-8 flex items-center justify-center gap-2 rounded-lg"
          aria-label="Nexora home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-violet-400 to-fuchsia-400">
            <Hexagon className="h-5 w-5 text-void-950" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-slate-100">
            Nexora
          </span>
        </Link>

        <GlassCard strong glow="cyan" className="p-8">
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-semibold text-slate-50">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              {mode === "signin"
                ? "Sign in to your Nexora workspace"
                : "Start aggregating your APIs in minutes"}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="glass mb-6 grid grid-cols-2 gap-1 rounded-xl p-1">
            {["signin", "signup"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`focus-ring relative rounded-lg py-2 text-sm font-medium transition-colors cursor-pointer ${
                  mode === m ? "text-void-950" : "text-slate-400 hover:text-slate-100"
                }`}
              >
                {mode === m && (
                  <motion.span
                    layoutId="login-mode-pill"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {m === "signin" ? "Sign In" : "Create Account"}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <Input
              label="Password"
              type="password"
              required
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />

            {mode === "signin" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="focus-ring rounded text-xs text-cyan-300 hover:text-cyan-200"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
              icon={
                loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )
              }
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          <AnimatePresence>
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300"
                role="alert"
              >
                Something went wrong. Please try again.
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-6 flex items-center gap-3 text-xs text-slate-500">
            <div className="h-px flex-1 bg-white/10" />
            or continue with
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="secondary"
              className="justify-center"
              onClick={() => login("demo@nexora.dev", "demo")}
              aria-label="Continue with Google (demo)"
            >
              <Mail className="h-4 w-4" /> Google
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="justify-center"
              onClick={() => login("demo@nexora.dev", "demo")}
              aria-label="Continue with GitHub (demo)"
            >
              <Lock className="h-4 w-4" /> GitHub
            </Button>
          </div>
        </GlassCard>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/" className="focus-ring rounded text-slate-400 hover:text-slate-200">
            &larr; Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
