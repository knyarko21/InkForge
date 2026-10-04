
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  PenLine,
  Sparkles,
  User,
  Users
} from "lucide-react";

import api from "../services/api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");

        const fetchedPosts =
          response.data.posts || [];

        setPosts(fetchedPosts.slice(0, 3));
      } catch (error) {
        console.error(
          "Failed to load featured posts:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
    <div className="overflow-hidden bg-[#09090b] text-white">

      {/* =====================================
          HERO
      ===================================== */}

      <section className="relative">
        <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[600px] w-[850px] -translate-x-1/2 rounded-full bg-violet-600/[0.12] blur-[160px]" />

        <div className="pointer-events-none absolute left-[5%] top-[35%] h-40 w-40 rounded-full bg-fuchsia-500/[0.08] blur-[100px]" />

        <div className="pointer-events-none absolute right-[5%] top-[45%] h-32 w-32 rounded-full bg-violet-500/[0.08] blur-[90px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pb-32">

          <div className="mx-auto max-w-5xl text-center">

            {/* Eyebrow */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.08] px-4 py-2 text-xs font-medium tracking-wide text-violet-300 backdrop-blur">
              <Sparkles size={14} />

              A modern home for writers
            </div>

            {/* Heading */}

            <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl">
              Write what matters.
              <span className="mt-2 block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                Share what moves you.
              </span>
            </h1>

            {/* Description */}

            <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              InkForge is a modern publishing space for
              writers, thinkers, and curious minds to turn
              ideas into stories worth discovering.
            </p>

            {/* Actions */}

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">

              <Link
                to="/write"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-xl shadow-white/[0.04] transition hover:-translate-y-0.5 hover:bg-zinc-200 sm:w-auto"
              >
                <PenLine size={17} />

                Start writing

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/posts"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white sm:w-auto"
              >
                <BookOpen size={17} />

                Explore stories
              </Link>

            </div>
          </div>

          {/* Hero stats */}

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 border-y border-white/[0.07] py-7">

            <div className="text-center">

              <div className="flex items-center justify-center gap-2">
                <BookOpen
                  size={15}
                  className="text-violet-400"
                />

                <span className="text-sm font-semibold text-white">
                  Stories
                </span>
              </div>

              <p className="mt-1 text-xs text-zinc-600">
                Ideas worth reading
              </p>

            </div>

            <div className="border-x border-white/[0.07] text-center">

              <div className="flex items-center justify-center gap-2">
                <Users
                  size={15}
                  className="text-fuchsia-400"
                />

                <span className="text-sm font-semibold text-white">
                  Writers
                </span>
              </div>

              <p className="mt-1 text-xs text-zinc-600">
                Voices worth hearing
              </p>

            </div>

            <div className="text-center">

              <div className="flex items-center justify-center gap-2">
                <Sparkles
                  size={15}
                  className="text-pink-400"
                />

                <span className="text-sm font-semibold text-white">
                  Ideas
                </span>
              </div>

              <p className="mt-1 text-xs text-zinc-600">
                Perspectives worth sharing
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================
          FEATURED STORIES
      ===================================== */}

      <section className="border-t border-white/[0.06] bg-[#0b0b0f]">

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Discover
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
                Stories from the community
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
                Explore ideas, experiences, and perspectives
                shared by writers on InkForge.
              </p>

            </div>

            <Link
              to="/posts"
              className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              View all stories

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>

          {/* =====================================
              LOADING
          ===================================== */}

          {loading && (
            <div className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">

              <div className="animate-pulse overflow-hidden rounded-[2rem] border border-white/[0.07] bg-white/[0.025]">

                <div className="h-72 bg-white/[0.05] sm:h-96" />

                <div className="p-7">

                  <div className="h-4 w-20 rounded bg-white/[0.07]" />

                  <div className="mt-5 h-8 w-4/5 rounded bg-white/[0.07]" />

                  <div className="mt-3 h-4 w-full rounded bg-white/[0.05]" />

                  <div className="mt-2 h-4 w-3/4 rounded bg-white/[0.05]" />

                </div>

              </div>

              <div className="grid gap-5">

                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse overflow-hidden rounded-[2rem] border border-white/[0.07] bg-white/[0.025]"
                  >
                    <div className="h-40 bg-white/[0.05]" />

                    <div className="p-5">

                      <div className="h-4 w-20 rounded bg-white/[0.07]" />

                      <div className="mt-4 h-6 w-4/5 rounded bg-white/[0.07]" />

                      <div className="mt-3 h-4 w-full rounded bg-white/[0.05]" />

                    </div>
                  </div>
                ))}

              </div>

            </div>
          )}

          {/* =====================================
              POSTS
          ===================================== */}

          {!loading && posts.length > 0 && (
            <div className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">

              {/* Featured story */}

              {posts[0] && (
                <Link
                  to={`/posts/${posts[0].id}`}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.025] transition duration-500 hover:-translate-y-1 hover:border-violet-500/30"
                >

                  <div className="relative h-72 overflow-hidden sm:h-96">

                    {posts[0].imageUrl ? (
                      <img
                        src={posts[0].imageUrl}
                        alt={posts[0].title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-950/40 via-zinc-900 to-fuchsia-950/30">
                        <BookOpen
                          size={42}
                          className="text-violet-400/50"
                        />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    <div className="absolute left-6 top-6">
                      <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
                        Featured
                      </span>
                    </div>

                  </div>

                  <div className="p-7 sm:p-8">

                    <div className="flex items-center gap-3">

                      <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-300">
                        {posts[0].category ||
                          "Story"}
                      </span>

                      <span className="text-xs text-zinc-700">
                        {formatDate(
                          posts[0].createdAt
                        )}
                      </span>

                    </div>

                    <h3 className="mt-5 max-w-2xl text-2xl font-bold leading-tight tracking-[-0.025em] text-white transition group-hover:text-violet-200 sm:text-3xl">
                      {posts[0].title}
                    </h3>

                    <p className="mt-4 line-clamp-3 max-w-2xl text-sm leading-7 text-zinc-500">
                      {posts[0].content}
                    </p>

                    <div className="mt-7 flex items-center justify-between border-t border-white/[0.06] pt-5">

                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                          <User size={13} />
                        </div>

                        {getAuthorName(posts[0])}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 transition group-hover:text-white">

                        Read story

                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />

                      </div>

                    </div>

                  </div>

                </Link>
              )}

              {/* Supporting stories */}

              <div className="grid gap-5">

                {posts.slice(1, 3).map((post) => (
                  <Link
                    key={post.id}
                    to={`/posts/${post.id}`}
                    className="group overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.025] transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.04]"
                  >

                    <div className="relative h-40 overflow-hidden">

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
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-900 via-violet-950/30 to-fuchsia-950/20">
                          <BookOpen
                            size={30}
                            className="text-violet-400/40"
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    </div>

                    <div className="p-5">

                      <div className="flex items-center justify-between gap-3">

                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                          {post.category ||
                            "Story"}
                        </span>

                        <ArrowRight
                          size={15}
                          className="text-zinc-700 transition group-hover:translate-x-1 group-hover:text-violet-400"
                        />

                      </div>

                      <h3 className="mt-4 line-clamp-2 text-lg font-semibold leading-6 text-white transition group-hover:text-violet-200">
                        {post.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-600">
                        {post.content}
                      </p>

                      <div className="mt-5 flex items-center gap-2 text-[11px] text-zinc-700">

                        <CalendarDays size={12} />

                        {formatDate(
                          post.createdAt
                        )}

                      </div>

                    </div>

                  </Link>
                ))}

              </div>

            </div>
          )}

          {/* =====================================
              EMPTY STATE
          ===================================== */}

          {!loading && posts.length === 0 && (
            <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <BookOpen
                  size={21}
                  className="text-zinc-500"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                The first story could be yours.
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Start writing and share something meaningful
                with the InkForge community.
              </p>

              <Link
                to="/write"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                <PenLine size={16} />

                Write a story

                <ArrowRight size={15} />
              </Link>

            </div>
          )}

        </div>
      </section>

      {/* =====================================
          WHY INKFORGE
      ===================================== */}

      <section className="border-t border-white/[0.06] bg-[#09090b]">

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                <PenLine
                  size={19}
                  className="text-violet-400"
                />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-white">
                Write freely
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Turn your thoughts, experiences, and ideas
                into stories without getting in the way of
                your creative process.
              </p>

            </div>

            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/10">
                <Users
                  size={19}
                  className="text-fuchsia-400"
                />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-white">
                Find your readers
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Share your perspective with a community
                built around discovering thoughtful writing.
              </p>

            </div>

            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10">
                <Sparkles
                  size={19}
                  className="text-pink-400"
                />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-white">
                Make ideas discoverable
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Give meaningful ideas a place where they can
                be read, discussed, and remembered.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          CTA
      ===================================== */}

      <section className="relative overflow-hidden border-t border-white/[0.06]">

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.12] blur-[130px]" />

        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
            <PenLine
              size={23}
              className="text-violet-300"
            />
          </div>

          <h2 className="mt-7 text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
            Your ideas deserve a place.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
            Whether you're writing your first story or
            your hundredth, InkForge gives your ideas a
            place to become something people can discover.
          </p>

          <Link
            to="/write"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-zinc-200"
          >
            Start writing

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;