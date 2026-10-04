
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  LogOut,
  Menu,
  PenLine,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchTerm.trim();

    if (!query) {
      navigate("/posts");
      setMobileOpen(false);
      return;
    }

    navigate(`/posts?search=${encodeURIComponent(query)}`);

    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();

    setProfileOpen(false);
    setMobileOpen(false);

    navigate("/");
  };

  const getInitials = () => {
    const first = user?.firstName?.charAt(0) || "";
    const last = user?.lastName?.charAt(0) || "";

    return `${first}${last}`.toUpperCase();
  };

  const desktopNavLinkClass = ({ isActive }) =>
    `group relative flex items-center gap-2 text-sm font-medium transition ${
      isActive
        ? "text-white"
        : "text-zinc-400 hover:text-white"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-white/[0.08] text-white"
        : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#09090b]/90 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between gap-4">
          {/* =====================================================
              BRAND
          ====================================================== */}

          <Link
            to="/"
            onClick={() => {
              setMobileOpen(false);
              setProfileOpen(false);
            }}
            className="group flex shrink-0 items-center gap-2.5"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-violet-500/30 blur-lg transition duration-300 group-hover:bg-fuchsia-500/40" />

              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
                <BookOpen
                  size={18}
                  strokeWidth={2.2}
                  className="text-white"
                />
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="text-[17px] font-bold tracking-[-0.02em] text-white">
                InkForge
              </div>

              <div className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                Stories worth reading
              </div>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP SEARCH
          ====================================================== */}

          <form
            onSubmit={handleSearch}
            className="hidden flex-1 md:block"
          >
            <div className="mx-auto max-w-md">
              <div className="group relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 transition group-focus-within:text-violet-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search stories..."
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.035] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/[0.12] hover:bg-white/[0.05] focus:border-violet-500/40 focus:bg-white/[0.06] focus:ring-4 focus:ring-violet-500/[0.06]"
                />
              </div>
            </div>
          </form>

          {/* =====================================================
              DESKTOP NAVIGATION
          ====================================================== */}

          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink
              to="/posts"
              className={desktopNavLinkClass}
            >
              {({ isActive }) => (
                <>
                  <span className="px-3 py-2">
                    Community
                  </span>

                  <span
                    className={`absolute bottom-[-1.48rem] left-3 right-3 h-px bg-gradient-to-r from-violet-500 to-fuchsia-500 transition ${
                      isActive
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                </>
              )}
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink
                  to="/dashboard"
                  className={desktopNavLinkClass}
                >
                  {({ isActive }) => (
                    <>
                      <span className="px-3 py-2">
                        Dashboard
                      </span>

                      <span
                        className={`absolute bottom-[-1.48rem] left-3 right-3 h-px bg-gradient-to-r from-violet-500 to-fuchsia-500 transition ${
                          isActive
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    </>
                  )}
                </NavLink>

                {/* WRITE BUTTON */}

                <Link
                  to="/write"
                  className="group ml-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-white/[0.04] transition hover:-translate-y-0.5 hover:bg-zinc-100"
                >
                  <PenLine
                    size={15}
                    strokeWidth={2.3}
                  />

                  Write

                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </>
            )}

            {!isAuthenticated && (
              <div className="ml-3 flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-zinc-100"
                >
                  Start writing
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* =================================================
                PROFILE
            ================================================== */}

            {isAuthenticated && (
              <div className="relative ml-3">
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen(
                      (current) => !current
                    )
                  }
                  className={`group flex items-center gap-2 rounded-xl border px-2 py-1.5 transition ${
                    profileOpen
                      ? "border-violet-500/30 bg-violet-500/[0.08]"
                      : "border-white/[0.08] bg-white/[0.035] hover:border-white/[0.14] hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-lg bg-violet-500/20 blur-md" />

                    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[10px] font-bold text-white">
                      {getInitials() || "IF"}
                    </div>
                  </div>

                  <ChevronDown
                    size={14}
                    className={`text-zinc-500 transition ${
                      profileOpen
                        ? "rotate-180 text-zinc-300"
                        : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#111113]/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
                    {/* PROFILE HEADER */}

                    <div className="border-b border-white/[0.08] bg-white/[0.02] px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
                          {getInitials() || "IF"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {user?.firstName}{" "}
                            {user?.lastName}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-zinc-500">
                            @{user?.username}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* PROFILE LINKS */}

                    <div className="p-1.5">
                      <Link
                        to="/dashboard"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                          <User size={15} />
                        </div>

                        <div>
                          <p className="font-medium">
                            Dashboard
                          </p>

                          <p className="text-[11px] text-zinc-600">
                            Your writing space
                          </p>
                        </div>
                      </Link>

                      <Link
                        to="/write"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                          <PenLine size={15} />
                        </div>

                        <div>
                          <p className="font-medium">
                            Write a story
                          </p>

                          <p className="text-[11px] text-zinc-600">
                            Share something new
                          </p>
                        </div>
                      </Link>

                      <div className="my-1.5 border-t border-white/[0.06]" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/[0.06]">
                          <LogOut size={15} />
                        </div>

                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* =====================================================
              MOBILE MENU BUTTON
          ====================================================== */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                (current) => !current
              )
            }
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition lg:hidden ${
              mobileOpen
                ? "border-violet-500/30 bg-violet-500/10 text-white"
                : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]"
            }`}
            aria-label={
              mobileOpen
                ? "Close menu"
                : "Open menu"
            }
          >
            {mobileOpen ? (
              <X size={19} />
            ) : (
              <Menu size={19} />
            )}
          </button>
        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ====================================================== */}

        {mobileOpen && (
          <div className="border-t border-white/[0.08] py-4 lg:hidden">
            {/* MOBILE SEARCH */}

            <form
              onSubmit={handleSearch}
              className="mb-4"
            >
              <div className="group relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                  placeholder="Search stories..."
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.035] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/40 focus:ring-4 focus:ring-violet-500/[0.06]"
                />
              </div>
            </form>

            {/* MOBILE LINKS */}

            <div className="space-y-1">
              <NavLink
                to="/posts"
                onClick={() =>
                  setMobileOpen(false)
                }
                className={mobileNavLinkClass}
              >
                <span>Community</span>

                <ArrowRight
                  size={15}
                  className="text-zinc-700"
                />
              </NavLink>

              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={mobileNavLinkClass}
                  >
                    <span>Dashboard</span>

                    <ArrowRight
                      size={15}
                      className="text-zinc-700"
                    />
                  </NavLink>

                  {/* MOBILE WRITE */}

                  <Link
                    to="/write"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="group mt-3 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-100"
                  >
                    <PenLine size={16} />

                    Write a story

                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>

                  {/* MOBILE PROFILE */}

                  <div className="mt-4 border-t border-white/[0.08] pt-4">
                    <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.025] p-3">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-xl bg-violet-500/20 blur-md" />

                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
                          {getInitials() || "IF"}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {user?.firstName}{" "}
                          {user?.lastName}
                        </p>

                        <p className="truncate text-xs text-zinc-500">
                          @{user?.username}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      <LogOut size={16} />

                      Log out
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center text-sm font-medium text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    Log in
                  </Link>

                  <Link
                    to="/register"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-zinc-100"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;