
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  PenLine,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Delete state
  const [postToDelete, setPostToDelete] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/users/me/posts"
      );

      setPosts(response.data.posts || []);
    } catch (error) {
      console.error(
        "Failed to fetch dashboard posts:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load your posts."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // OPEN DELETE MODAL
  // =========================================

  const openDeleteModal = (post) => {
    setDeleteError("");
    setPostToDelete(post);
  };

  // =========================================
  // CLOSE DELETE MODAL
  // =========================================

  const closeDeleteModal = () => {
    if (deletingPostId) {
      return;
    }

    setPostToDelete(null);
    setDeleteError("");
  };

  // =========================================
  // DELETE POST
  // =========================================

  const handleDelete = async () => {
    if (!postToDelete) {
      return;
    }

    try {
      setDeleteError("");
      setDeletingPostId(postToDelete.id);

      await api.delete(
        `/posts/${postToDelete.id}`
      );

      setPosts((currentPosts) =>
        currentPosts.filter(
          (post) =>
            post.id !== postToDelete.id
        )
      );

      setPostToDelete(null);
    } catch (error) {
      console.error(
        "Failed to delete post:",
        error
      );

      setDeleteError(
        error.response?.data?.message ||
          "Unable to delete this story. Please try again."
      );
    } finally {
      setDeletingPostId(null);
    }
  };

  const totalPosts = posts.length;

  const publishedPosts = posts.filter(
    (post) => post.status === "published"
  ).length;

  const draftPosts = posts.filter(
    (post) => post.status === "draft"
  ).length;

  const postsWithImages = posts.filter(
    (post) => post.imageUrl
  ).length;

  const filteredPosts = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return posts;
    }

    return posts.filter((post) => {
      return (
        post.title
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        post.category
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        post.status
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        post.content
          ?.toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [posts, searchTerm]);

  const latestPost = posts[0];

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const getInitials = () => {
    const first =
      user?.firstName?.charAt(0) || "";

    const last =
      user?.lastName?.charAt(0) || "";

    return `${first}${last}`.toUpperCase();
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white">

      {/* =========================================
          HERO
      ========================================= */}

      <section className="relative overflow-hidden border-b border-white/[0.06]">

        <div className="pointer-events-none absolute left-[25%] top-[-180px] h-[420px] w-[420px] rounded-full bg-violet-600/[0.10] blur-[130px]" />

        <div className="pointer-events-none absolute right-[-100px] top-[80px] h-[360px] w-[360px] rounded-full bg-fuchsia-600/[0.08] blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:px-8 lg:pb-16 lg:pt-16">

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-3.5 py-2 text-xs font-medium text-violet-300">

                <Sparkles size={14} />

                Creator workspace

              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl">

                Welcome back,

                <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                  {user?.firstName || "Creator"}.
                </span>

              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base sm:leading-8">
                Your ideas deserve a place to grow.
                Manage your stories, continue writing,
                and build your voice on InkForge.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-zinc-600">

                <div className="flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/30" />

                  Workspace active

                </div>

                <div className="hidden h-3 w-px bg-white/10 sm:block" />

                <span>
                  {totalPosts}{" "}
                  {totalPosts === 1
                    ? "story"
                    : "stories"}{" "}
                  created
                </span>

              </div>

            </div>

            <Link
              to="/write"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-black shadow-xl shadow-white/[0.04] transition duration-300 hover:-translate-y-1 hover:bg-zinc-200"
            >
              <PenLine size={17} />

              Write a story

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>

        </div>

      </section>

      {/* =========================================
          MAIN
      ========================================= */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* =======================================
            OVERVIEW
        ======================================= */}

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">

          {/* PROFILE */}

          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6">

            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-lg font-bold shadow-xl shadow-violet-500/10">
                  {getInitials() || "IF"}
                </div>

                <div className="min-w-0">

                  <h2 className="truncate font-semibold text-white">
                    {user?.firstName}{" "}
                    {user?.lastName}
                  </h2>

                  <p className="mt-1 truncate text-sm text-zinc-500">
                    @{user?.username || "creator"}
                  </p>

                </div>

              </div>

              <div className="mt-7 border-t border-white/[0.07] pt-6">

                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                  Publishing activity
                </p>

                <div className="mt-4 space-y-3">

                  <ActivityRow
                    label="Published"
                    value={publishedPosts}
                    className="bg-emerald-400/10 text-emerald-300"
                  />

                  <ActivityRow
                    label="Drafts"
                    value={draftPosts}
                    className="bg-amber-400/10 text-amber-300"
                  />

                  <ActivityRow
                    label="Cover images"
                    value={postsWithImages}
                    className="bg-violet-400/10 text-violet-300"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* STATS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              icon={<FileText size={19} />}
              label="Total stories"
              value={totalPosts}
              description="Everything you've created"
              iconClass="text-violet-400 bg-violet-400/10"
            />

            <StatCard
              icon={<CheckCircle2 size={19} />}
              label="Published"
              value={publishedPosts}
              description="Live for the community"
              iconClass="text-emerald-400 bg-emerald-400/10"
            />

            <StatCard
              icon={<Clock3 size={19} />}
              label="Drafts"
              value={draftPosts}
              description="Still being worked on"
              iconClass="text-amber-400 bg-amber-400/10"
            />

            <StatCard
              icon={<ImageIcon size={19} />}
              label="Image stories"
              value={postsWithImages}
              description="Stories with cover images"
              iconClass="text-fuchsia-400 bg-fuchsia-400/10"
            />

          </div>

        </div>

        {/* =======================================
            FEATURED LATEST STORY
        ======================================= */}

        {latestPost && (
          <div className="mt-6">

            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-r from-white/[0.035] to-white/[0.015]">

              <div className="grid lg:grid-cols-[1.15fr_1fr]">

                {/* IMAGE */}

                <div className="relative min-h-[260px] overflow-hidden bg-zinc-950">

                  {latestPost.imageUrl ? (
                    <img
                      src={latestPost.imageUrl}
                      alt={latestPost.title}
                      className="h-full w-full object-cover transition duration-700 hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full min-h-[260px] items-center justify-center bg-gradient-to-br from-violet-950/30 via-zinc-950 to-fuchsia-950/20">

                      <FileText
                        size={42}
                        className="text-violet-400/30"
                      />

                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#09090b]/80 lg:block" />

                </div>

                {/* CONTENT */}

                <div className="flex flex-col justify-center p-7 sm:p-9">

                  <div className="flex items-center gap-2">

                    <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                      Latest story
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
                        latestPost.status ===
                        "published"
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-amber-400/10 text-amber-300"
                      }`}
                    >
                      {latestPost.status ===
                      "published"
                        ? "Published"
                        : "Draft"}
                    </span>

                  </div>

                  <h2 className="mt-5 text-2xl font-bold leading-tight tracking-[-0.025em] text-white sm:text-3xl">
                    {latestPost.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500">
                    {latestPost.content}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-600">

                    <span className="flex items-center gap-1.5">

                      <CalendarDays size={13} />

                      {formatDate(
                        latestPost.createdAt
                      )}

                    </span>

                    {latestPost.category && (
                      <span>
                        {latestPost.category}
                      </span>
                    )}

                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">

                    <Link
                      to={`/posts/${latestPost.id}`}
                      className="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-200"
                    >
                      View story

                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>

                    <Link
                      to={`/posts/${latestPost.id}/edit`}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.07] hover:text-white"
                    >
                      <PenLine size={14} />

                      Edit story
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* =======================================
            CREATOR INSIGHT
        ======================================= */}

        <div className="relative mt-6 overflow-hidden rounded-[1.5rem] border border-violet-500/15 bg-gradient-to-r from-violet-500/[0.08] via-fuchsia-500/[0.04] to-transparent p-5">

          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                <Sparkles size={18} />
              </div>

              <div>

                <p className="text-sm font-semibold text-white">
                  Creator insight
                </p>

                {draftPosts > 0 ? (
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    You have{" "}
                    <span className="font-semibold text-violet-300">
                      {draftPosts}{" "}
                      {draftPosts === 1
                        ? "draft"
                        : "drafts"}
                    </span>{" "}
                    waiting. Keep the momentum going.
                  </p>
                ) : (
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    No unfinished drafts. Your
                    workspace is clean — maybe it is
                    time for a new idea.
                  </p>
                )}

              </div>

            </div>

            <Link
              to="/write"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
            >
              {draftPosts > 0
                ? "Continue writing"
                : "Start writing"}

              <ArrowRight size={14} />
            </Link>

          </div>

        </div>

        {/* =======================================
            QUICK ACTIONS
        ======================================= */}

        <div className="mt-10">

          <div className="mb-5">

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
              Shortcuts
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-tight">
              Quick actions
            </h2>

          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <QuickAction
              icon={<Plus size={20} />}
              title="Create a story"
              description="Turn your next idea into something worth reading."
              to="/write"
            />

            <QuickAction
              icon={<BarChart3 size={20} />}
              title="Review your work"
              description="Manage your published stories and drafts."
              to="#your-stories"
            />

            <QuickAction
              icon={<MessageSquare size={20} />}
              title="Explore community"
              description="Discover stories and perspectives from other writers."
              to="/posts"
            />

          </div>

        </div>

        {/* =======================================
            STORIES
        ======================================= */}

        <div
          id="your-stories"
          className="mt-14"
        >

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400">
                Your workspace
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">

                <h2 className="text-2xl font-bold tracking-tight">
                  Your stories
                </h2>

                {!loading && (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-zinc-500">
                    {filteredPosts.length}{" "}
                    {filteredPosts.length === 1
                      ? "result"
                      : "results"}
                  </span>
                )}

              </div>

              <p className="mt-2 text-sm text-zinc-500">
                Manage everything you've written
                on InkForge.
              </p>

            </div>

            {/* SEARCH */}

            <div className="group relative w-full lg:w-80">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 transition group-focus-within:text-violet-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search your stories..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:bg-white/[0.05] focus:border-violet-500/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-500/10"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchTerm("")
                  }
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-zinc-500 transition hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}

            </div>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.025]"
                >

                  <div className="h-52 animate-pulse bg-white/[0.05]" />

                  <div className="space-y-4 p-6">

                    <div className="h-3 w-24 animate-pulse rounded bg-white/[0.06]" />

                    <div className="h-6 w-4/5 animate-pulse rounded bg-white/[0.06]" />

                    <div className="h-10 w-full animate-pulse rounded bg-white/[0.05]" />

                    <div className="h-10 w-full animate-pulse rounded bg-white/[0.05]" />

                  </div>

                </div>
              ))}

            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="mt-7 rounded-[2rem] border border-red-500/15 bg-red-500/[0.035] p-10 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <FileText size={20} />
              </div>

              <h3 className="mt-4 font-semibold text-white">
                Something went wrong
              </h3>

              <p className="mt-2 text-sm text-red-300/70">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchMyPosts}
                className="mt-5 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium transition hover:bg-white/[0.09]"
              >
                Try again
              </button>

            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            filteredPosts.length === 0 && (
              <div className="mt-7 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 text-violet-400">

                  {searchTerm ? (
                    <Search size={24} />
                  ) : (
                    <PenLine size={24} />
                  )}

                </div>

                <h3 className="mt-5 text-lg font-semibold">

                  {searchTerm
                    ? "No stories found"
                    : "Your workspace is empty"}

                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">

                  {searchTerm
                    ? `We couldn't find anything matching "${searchTerm}". Try another search term.`
                    : "Start writing your first story and share your ideas with the InkForge community."}

                </p>

                {searchTerm ? (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchTerm("")
                    }
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.09]"
                  >
                    <X size={16} />

                    Clear search
                  </button>
                ) : (
                  <Link
                    to="/write"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
                  >
                    <Plus size={17} />

                    Write your first story
                  </Link>
                )}

              </div>
            )}

          {/* POSTS */}

          {!loading &&
            !error &&
            filteredPosts.length > 0 && (
              <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {filteredPosts.map((post) => (
                  <DashboardPostCard
                    key={post.id}
                    post={post}
                    onDelete={openDeleteModal}
                    deletingPostId={
                      deletingPostId
                    }
                    formatDate={formatDate}
                  />
                ))}

              </div>
            )}

        </div>

      </section>

      {/* =========================================
          DELETE CONFIRMATION MODAL
      ========================================= */}

      {postToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deletingPostId
            ) {
              closeDeleteModal();
            }
          }}
        >

          <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#111113] shadow-2xl shadow-black/50">

            {/* TOP */}

            <div className="relative p-6 sm:p-7">

              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" />

              <div className="relative">

                <div className="flex items-start justify-between gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/10 text-red-400">
                    <AlertTriangle size={21} />
                  </div>

                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    disabled={Boolean(
                      deletingPostId
                    )}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Close delete dialog"
                  >
                    <X size={18} />
                  </button>

                </div>

                <h2 className="mt-6 text-xl font-bold tracking-tight text-white">
                  Delete this story?
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  This action cannot be undone. The
                  story will be permanently removed
                  from your InkForge workspace.
                </p>

                {/* STORY PREVIEW */}

                <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">

                  <div className="flex items-center gap-3">

                    {postToDelete.imageUrl ? (
                      <img
                        src={
                          postToDelete.imageUrl
                        }
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                        <FileText size={20} />
                      </div>
                    )}

                    <div className="min-w-0">

                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
                        Story
                      </p>

                      <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-white">
                        {postToDelete.title ||
                          "Untitled story"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* ERROR */}

                {deleteError && (
                  <div className="mt-4 rounded-xl border border-red-500/15 bg-red-500/[0.05] px-4 py-3 text-sm text-red-300">
                    {deleteError}
                  </div>
                )}

                {/* ACTIONS */}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    disabled={Boolean(
                      deletingPostId
                    )}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={Boolean(
                      deletingPostId
                    )}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/10 transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingPostId ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />

                        Delete story
                      </>
                    )}
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

/* =========================================
   ACTIVITY ROW
========================================= */

function ActivityRow({
  label,
  value,
  className,
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-sm text-zinc-400">
        {label}
      </span>

      <span
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
      >
        {value}
      </span>

    </div>
  );
}

/* =========================================
   STAT CARD
========================================= */

function StatCard({
  icon,
  label,
  value,
  description,
  iconClass,
}) {
  return (
    <div className="group rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.04]">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <span className="text-2xl font-bold tracking-tight text-white">
          {value}
        </span>

      </div>

      <p className="mt-5 text-sm font-medium text-zinc-200">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-zinc-600">
        {description}
      </p>

    </div>
  );
}

/* =========================================
   QUICK ACTION
========================================= */

function QuickAction({
  icon,
  title,
  description,
  to,
}) {
  const isAnchor = to.startsWith("#");

  const content = (
    <>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition duration-300 group-hover:bg-violet-500/15 group-hover:text-violet-300">
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <h3 className="font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-5 text-zinc-600">
          {description}
        </p>

      </div>

      <ArrowRight
        size={17}
        className="shrink-0 text-zinc-700 transition duration-300 group-hover:translate-x-1 group-hover:text-zinc-300"
      />
    </>
  );

  const className =
    "group flex items-center gap-4 rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-500/20 hover:bg-white/[0.045]";

  if (isAnchor) {
    return (
      <a
        href={to}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={className}
    >
      {content}
    </Link>
  );
}

/* =========================================
   DASHBOARD POST CARD
========================================= */

function DashboardPostCard({
  post,
  onDelete,
  deletingPostId,
  formatDate,
}) {
  const isPublished =
    post.status === "published";

  const isDeleting =
    deletingPostId === post.id;

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.025] transition duration-500 hover:-translate-y-1 hover:border-violet-500/20 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-black/20">

      {/* =====================================
          COVER
      ===================================== */}

      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-violet-950/20 via-zinc-950 to-fuchsia-950/20">

        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title || "Post image"}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">

            <div className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03]">
                <FileText
                  size={25}
                  className="text-zinc-700"
                />
              </div>

              <p className="mt-3 text-xs text-zinc-600">
                No cover image
              </p>

            </div>

          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* STATUS */}

        <div className="absolute left-4 top-4">

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-semibold backdrop-blur-md ${
              isPublished
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                : "border-amber-400/20 bg-amber-400/10 text-amber-300"
            }`}
          >

            {isPublished ? (
              <CheckCircle2 size={11} />
            ) : (
              <Clock3 size={11} />
            )}

            {isPublished
              ? "Published"
              : "Draft"}

          </span>

        </div>

        {/* IMAGE ICON */}

        {post.imageUrl && (
          <div className="absolute bottom-4 right-4">

            <span
              title="Has cover image"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white/70 backdrop-blur-md"
            >
              <ImageIcon size={13} />
            </span>

          </div>
        )}

      </div>

      {/* =====================================
          CONTENT
      ===================================== */}

      <div className="p-6">

        <div className="flex items-center justify-between gap-3">

          <div className="flex min-w-0 items-center gap-1.5 text-xs text-zinc-600">

            <CalendarDays size={13} />

            <span>
              {formatDate(post.createdAt)}
            </span>

          </div>

          {post.category && (
            <span className="max-w-[130px] truncate rounded-full border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-zinc-500">
              {post.category}
            </span>
          )}

        </div>

        <h3 className="mt-4 line-clamp-2 text-lg font-semibold leading-7 tracking-[-0.015em] text-white transition group-hover:text-violet-300">
          {post.title || "Untitled story"}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
          {post.content ||
            "No content available."}
        </p>

        {/* ACTIONS */}

        <div className="mt-6 flex items-center gap-2 border-t border-white/[0.07] pt-4">

          {/* VIEW */}

          <Link
            to={`/posts/${post.id}`}
            className="group/view flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/[0.05] px-3 py-2.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.09]"
          >
            View

            <ArrowRight
              size={13}
              className="transition-transform group-hover/view:translate-x-0.5"
            />

          </Link>

          {/* EDIT */}

          <Link
            to={`/posts/${post.id}/edit`}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-semibold text-zinc-400 transition hover:border-violet-500/20 hover:bg-violet-500/[0.05] hover:text-violet-300"
          >
            <PenLine size={13} />

            Edit
          </Link>

          {/* DELETE */}

          <button
            type="button"
            onClick={() =>
              onDelete(post)
            }
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/15 bg-red-500/[0.04] px-3 py-2.5 text-xs font-semibold text-red-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            title={
              isDeleting
                ? "Deleting..."
                : "Delete story"
            }
          >

            {isDeleting ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-400/30 border-t-red-400" />
            ) : (
              <Trash2 size={14} />
            )}

            <span>
              {isDeleting
                ? "Deleting..."
                : "Delete"}
            </span>

          </button>

        </div>

      </div>

    </article>
  );
}

export default Dashboard;