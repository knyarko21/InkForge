
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  PenLine,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";

import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  // ===============================
  // Form state
  // ===============================

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
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
  // Submit registration
  // ===============================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        firstName,
        lastName,
        username,
        email,
        password,
      });

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.data?.errors) {
        const validationErrors =
          error.response.data.errors;

        setError(
          validationErrors[0]?.message ||
            "Validation failed"
        );
      } else if (error.response?.data?.message) {
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
            {/* Decorative circles */}

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
                  Start creating
                </div>

                <h1 className="text-5xl font-black leading-[1.05] tracking-tight xl:text-6xl">
                  Your voice
                  <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                    deserves a place.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-base leading-8 text-zinc-400">
                  Create your InkForge account and turn your ideas,
                  experiences, and knowledge into stories worth sharing.
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

                Publish your own stories
              </div>

              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Users
                    size={16}
                    className="text-fuchsia-300"
                  />
                </div>

                Join a community of writers
              </div>

              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <ShieldCheck
                    size={16}
                    className="text-emerald-300"
                  />
                </div>

                Build your personal writing identity
              </div>
            </div>
          </section>

          {/* =====================================
              Registration panel
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
                  <UserPlus size={21} />
                </div>

                <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Create your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Join InkForge and start sharing your ideas with
                  the world.
                </p>
              </div>

              {/* =================================
                  Error
              ================================= */}

              {error && (
                <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-4 text-sm text-red-200">
                  <p className="font-semibold">
                    Registration failed
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
                      Account created
                    </p>

                    <p className="mt-1 text-emerald-200/70">
                      Redirecting you to login...
                    </p>
                  </div>
                </div>
              )}

              {/* =================================
                  Registration form
              ================================= */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* First name + Last name */}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-semibold text-zinc-300"
                    >
                      First name
                    </label>

                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(event) =>
                        setFirstName(event.target.value)
                      }
                      placeholder="John"
                      required
                      autoComplete="given-name"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-400/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-semibold text-zinc-300"
                    >
                      Last name
                    </label>

                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(event) =>
                        setLastName(event.target.value)
                      }
                      placeholder="Doe"
                      required
                      autoComplete="family-name"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-400/10"
                    />
                  </div>
                </div>

                {/* Username */}

                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-semibold text-zinc-300"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    placeholder="johndoe"
                    required
                    autoComplete="username"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-400/10"
                  />

                  <p className="mt-2 text-xs text-zinc-600">
                    This is how other writers will identify you.
                  </p>
                </div>

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
                      placeholder="At least 8 characters"
                      required
                      minLength={8}
                      autoComplete="new-password"
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

                  <p className="mt-2 text-xs text-zinc-600">
                    Use at least 8 characters for your password.
                  </p>
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

                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account

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
                  ALREADY A MEMBER?
                </span>

                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Login */}

              <Link
                to="/login"
                className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-semibold text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                Log in to your account
              </Link>

              <p className="mt-6 text-center text-xs leading-5 text-zinc-600">
                By creating an account, you're joining the
                InkForge writing community.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Register;