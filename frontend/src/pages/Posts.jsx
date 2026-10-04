
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Search,
  Sparkles,
  User,
  X
} from "lucide-react";

import api from "../services/api";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/posts");

        setPosts(response.data.posts || []);
      } catch (error) {
        console.error(
          "Failed to load posts:",
          error
        );

        setError(
          "We couldn't load the community stories."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    const query =
      searchTerm.trim().toLowerCase();

    if (!query) {
      return posts;
    }

    return posts.filter((post) => {
      const title =
        post.title?.toLowerCase() || "";

      const content =
        post.content?.toLowerCase() || "";

      const category =
        post.category?.toLowerCase() || "";

      const firstName =
        post.User?.firstName?.toLowerCase() || "";

      const lastName =
        post.User?.lastName?.toLowerCase() || "";

      const username =
        post.User?.username?.toLowerCase() || "";

      return (
        title.includes(query) ||
        content.includes(query) ||
        category.includes(query) ||
        firstName.includes(query) ||
        lastName.includes(query) ||
        username.includes(query)
      );
    });
  }, [posts, searchTerm]);

  const getAuthorName = (post) => {
    if (!post?.User) {
      return "InkForge Writer";
    }

    const firstName =
      post.User.firstName || "";

    const lastName =
      post.User.lastName || "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    return (
      fullName ||
      post.User.username ||
      "InkForge Writer"
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric"
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">

      {/* =====================================
          HEADER
      ===================================== */}

      <section className="relative overflow-hidden border-b border-white/[0.06]">

        <div className="pointer-events-none absolute left-1/2 top-[-240px] h-[540px] w-[760px] -translate-x-1/2 rounded-full bg-violet-600/[0.11] blur-[150px]" />

        <div className="pointer-events-none absolute right-[8%] top-[45%] h-32 w-32 rounded-full bg-fuchsia-500/[0.07] blur-[90px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.08] px-3.5 py-2 text-xs font-medium text-violet-300">
              <Sparkles size={14} />

              InkForge Community
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              Stories worth
              <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                discovering.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base sm:leading-8">
              Explore ideas, experiences, lessons,
              and perspectives shared by writers
              in the InkForge community.
            </p>

          </div>

          {/* Search */}

          <div className="mt-10 max-w-2xl">

            <div className="group relative">

              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition group-focus-within:text-violet-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search stories, topics, or writers..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-12 pr-12 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-violet-500/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-violet-500/10"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchTerm("")
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-600 transition hover:bg-white/[0.06] hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* =====================================
          CONTENT
      ===================================== */}

      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        {/* Result heading */}

        {!loading && !error && (
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-medium text-zinc-300">
                {searchTerm
                  ? `${filteredPosts.length} ${
                      filteredPosts.length === 1
                        ? "story"
                        : "stories"
                    } found`
                  : `${posts.length} ${
                      posts.length === 1
                        ? "story"
                        : "stories"
                    } in the community`}
              </p>

              {searchTerm && (
                <p className="mt-1 text-xs text-zinc-600">
                  Results for "{searchTerm}"
                </p>
              )}

            </div>

            <Link
              to="/write"
              className="group inline-flex items-center gap-2 text-sm font-medium text-violet-400 transition hover:text-violet-300"
            >
              Write a story

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>
        )}

        {/* =====================================
            LOADING
        ===================================== */}

        {loading && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-[2rem] border border-white/[0.07] bg-white/[0.025]"
                >

                  <div className="h-48 bg-white/[0.05]" />

                  <div className="p-6">

                    <div className="h-4 w-20 rounded-full bg-white/[0.07]" />

                    <div className="mt-5 h-6 w-4/5 rounded bg-white/[0.07]" />

                    <div className="mt-3 h-4 w-full rounded bg-white/[0.05]" />

                    <div className="mt-2 h-4 w-5/6 rounded bg-white/[0.05]" />

                    <div className="mt-6 border-t border-white/[0.05] pt-5">

                      <div className="h-3 w-28 rounded bg-white/[0.05]" />

                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        )}

        {/* =====================================
            ERROR
        ===================================== */}

        {!loading && error && (
          <div className="rounded-[2rem] border border-red-500/10 bg-red-500/[0.03] px-6 py-20 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/10 bg-red-500/[0.05]">
              <BookOpen
                size={20}
                className="text-red-400"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              Something went wrong
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Try again
            </button>

          </div>
        )}

        {/* =====================================
            POSTS
        ===================================== */}

        {!loading &&
          !error &&
          filteredPosts.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.id}`}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-white/[0.025] transition duration-500 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.04]"
                >

                  {/* Image */}

                  <div className="relative h-52 overflow-hidden">

                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-950/40 via-zinc-900 to-fuchsia-950/30">
                        <BookOpen
                          size={36}
                          className="text-violet-400/40"
                        />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div className="absolute left-5 top-5">

                      <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                        {post.category ||
                          "Story"}
                      </span>

                    </div>

                    <div className="absolute right-5 top-5">

                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/60 backdrop-blur-md transition group-hover:text-white">
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </div>

                    </div>

                  </div>

                  {/* Content */}

                  <div className="p-6">

                    <h2 className="line-clamp-2 text-xl font-semibold leading-7 tracking-[-0.02em] text-white transition group-hover:text-violet-200">
                      {post.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500">
                      {post.content}
                    </p>

                    {/* Author */}

                    <div className="mt-6 flex items-center gap-3">

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                        <User
                          size={13}
                          className="text-zinc-500"
                        />
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-xs font-medium text-zinc-300">
                          {getAuthorName(post)}
                        </p>

                        <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-zinc-700">

                          <CalendarDays size={11} />

                          {formatDate(
                            post.createdAt
                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                </Link>
              ))}

            </div>
          )}

        {/* =====================================
            EMPTY
        ===================================== */}

        {!loading &&
          !error &&
          filteredPosts.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <Search
                  size={21}
                  className="text-zinc-500"
                />
              </div>

              <h2 className="mt-6 text-xl font-semibold text-white">
                No stories found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                {searchTerm
                  ? "Try a different search term or clear your search."
                  : "There are no published stories yet."}
              </p>

              {searchTerm ? (
                <button
                  type="button"
                  onClick={() =>
                    setSearchTerm("")
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <X size={15} />

                  Clear search
                </button>
              ) : (
                <Link
                  to="/write"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  Write the first story

                  <ArrowRight size={15} />
                </Link>
              )}

            </div>
          )}

      </main>

    </div>
  );
}

export default Posts;