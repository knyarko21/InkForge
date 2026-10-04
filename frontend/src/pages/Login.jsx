
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  PenLine,
  Sparkles,
  LoaderCircle,
  ShieldCheck,
  Users,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  // ===============================
  // Form state
  // ===============================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ===============================
  // UI state
  // ===============================

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===============================
  // Submit login form
  // ===============================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store authentication through AuthContext
      login(token, user);

      setSuccess("Login successful!");

      setTimeout(() => {
        navigate("/posts");
      }, 800);
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Unable to connect to the server. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-[#09090b] text-white">
      {/* =========================================
          Background effects
      ========================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-[120px]" />

        <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-fuchsia-600/10 blur-[120px]" />

        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-[100px]" />
      </div>

      {/* =========================================
          Main layout
      ========================================= */}

      <div className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] shadow-2xl shadow-black/30 lg:grid-cols-2">
          {/* =====================================
              Left branding panel
          ===================================== */}

          <section className="relative hidden overflow-hidden border-r border-white/10 bg-gradient-to-br from-violet-500/[0.12] via-transparent to-fuchsia-500/[0.08] p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            {/* Decorative circle */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-violet-400/10" />

            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-violet-400/10" />

            <div>
              {/* Brand */}
              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
                  <PenLine size={21} />
                </div>

                <span className="text-xl font-black tracking-tight">
                  InkForge
                </span>
              </Link>

              {/* Heading */}
              <div className="mt-20 max-w-lg">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                  <Sparkles size={13} />
                  Your ideas matter
                </div>

                <h1 className="text-5xl font-black leading-[1.05] tracking-tight xl:text-6xl">
                  Come back to
                  <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                    your words.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-base leading-8 text-zinc-400">
                  Continue writing, discover new perspectives, and
                  share ideas with a community of curious minds.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-16 space-y-4">
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <PenLine
                    size={16}
                    className="text-violet-300"
                  />
                </div>

                Write and publish your stories
              </div>

              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Users
                    size={16}
                    className="text-fuchsia-300"
                  />
                </div>

                Connect with other writers
              </div>

              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <ShieldCheck
                    size={16}
                    className="text-emerald-300"
                  />
                </div>

                Your account stays protected
              </div>
            </div>
          </section>

          {/* =====================================
              Login panel
          ===================================== */}

          <section className="flex items-center p-6 sm:p-10 lg:p-12 xl:p-16">
            <div className="mx-auto w-full max-w-md">
              {/* Mobile brand */}
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
                  <PenLine size={21} />
                </div>

                <span className="text-xl font-black">
                  InkForge
                </span>
              </div>

              {/* Header */}
              <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
                  <LockKeyhole size={21} />
                </div>

                <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Welcome back
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Log in to continue your InkForge journey.
                </p>
              </div>

              {/* =================================
                  Error
              ================================= */}

              {error && (
                <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-4 text-sm text-red-200">
                  <p className="font-semibold">
                    Login failed
                  </p>

                  <p className="mt-1 text-red-200/80">
                    {error}
                  </p>
                </div>
              )}

              {/* =================================
                  Success
              ================================= */}

              {success && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-4 text-sm text-emerald-200">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="font-semibold">
                      {success}
                    </p>

                    <p className="mt-1 text-emerald-200/70">
                      Taking you to the community...
                    </p>
                  </div>
                </div>
              )}

              {/* =================================
                  Form
              ================================= */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Email */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-zinc-300"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-400/10"
                  />
                </div>

                {/* Password */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-zinc-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-400/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-400 hover:to-fuchsia-400 hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />

                      Logging in...
                    </>
                  ) : (
                    <>
                      Log in

                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs text-zinc-600">
                  NEW TO INKFORGE?
                </span>

                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Register */}

              <Link
                to="/register"
                className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-semibold text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                Create your account
              </Link>

              <p className="mt-6 text-center text-xs leading-5 text-zinc-600">
                By continuing, you agree to use InkForge
                responsibly and respect the community.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Login;