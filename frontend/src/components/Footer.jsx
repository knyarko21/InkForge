
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  PenLine,
  Sparkles,
} from "lucide-react";

function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.08] bg-[#09090b]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* =====================================================
            TOP SECTION
        ====================================================== */}

        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* BRAND */}

          <div className="max-w-md">
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-violet-500/30 blur-lg transition group-hover:bg-fuchsia-500/40" />

                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500">
                  <BookOpen
                    size={19}
                    strokeWidth={2.2}
                    className="text-white"
                  />
                </div>
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                InkForge
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-500">
              A modern space for writers, thinkers, and
              curious minds to share stories worth reading.
            </p>

            <Link
              to="/write"
              className="group mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-violet-500/30 hover:bg-violet-500/[0.08] hover:text-white"
            >
              <PenLine
                size={15}
                className="text-violet-400"
              />

              Start writing

              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* EXPLORE */}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300">
              Explore
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                to="/posts"
                className="block text-sm text-zinc-500 transition hover:text-white"
              >
                Community
              </Link>

              <Link
                to="/posts"
                className="block text-sm text-zinc-500 transition hover:text-white"
              >
                Latest stories
              </Link>

              <Link
                to="/posts"
                className="block text-sm text-zinc-500 transition hover:text-white"
              >
                Discover
              </Link>
            </div>
          </div>

          {/* CREATE */}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300">
              Create
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                to="/write"
                className="block text-sm text-zinc-500 transition hover:text-white"
              >
                Write a story
              </Link>

              <Link
                to="/register"
                className="block text-sm text-zinc-500 transition hover:text-white"
              >
                Create an account
              </Link>

              <Link
                to="/login"
                className="block text-sm text-zinc-500 transition hover:text-white"
              >
                Log in
              </Link>
            </div>
          </div>

          {/* PLATFORM */}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300">
              InkForge
            </h3>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Sparkles
                  size={14}
                  className="text-violet-400"
                />

                Built for writers
              </div>

              <p className="text-sm leading-6 text-zinc-600">
                Write freely. Share thoughtfully.
                Discover something new.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            DIVIDER
        ====================================================== */}

        <div className="my-10 h-px bg-white/[0.07]" />

        {/* =====================================================
            BOTTOM SECTION
        ====================================================== */}

        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-700">
            Stories worth reading.
          </span>

          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-violet-500/50" />

            <span className="text-xs text-zinc-700">
              Made for creators.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;