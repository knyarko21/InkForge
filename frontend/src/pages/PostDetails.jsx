
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
  MessageCircle,
  Send,
  Sparkles,
  Trash2,
  User,
  X
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function PostDetails() {
  const { id } = useParams();

  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [commentError, setCommentError] =
    useState("");

  const [submittingComment, setSubmittingComment] =
    useState(false);

  const [deletingCommentId, setDeletingCommentId] =
    useState(null);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  /* =========================================
     FETCH POST
  ========================================= */

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/posts/${id}`
      );

      setPost(response.data.post);
    } catch (error) {
      console.error(
        "Failed to load post:",
        error
      );

      setError(
        "We couldn't load this story."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     FETCH COMMENTS
  ========================================= */

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      setCommentError("");

      const response = await api.get(
        `/posts/${id}/comments`
      );

      setComments(
        response.data.comments || []
      );
    } catch (error) {
      console.error(
        "Failed to load comments:",
        error
      );

      setCommentError(
        "We couldn't load the discussion."
      );
    } finally {
      setCommentsLoading(false);
    }
  };

  /* =========================================
     CREATE COMMENT
  ========================================= */

  const handleSubmitComment = async (
    event
  ) => {
    event.preventDefault();

    const trimmedComment =
      commentText.trim();

    if (!trimmedComment) {
      return;
    }

    try {
      setSubmittingComment(true);
      setCommentError("");

      const response = await api.post(
        `/posts/${id}/comments`,
        {
          content: trimmedComment
        }
      );

      setComments(
        (previousComments) => [
          ...previousComments,
          response.data.comment
        ]
      );

      setCommentText("");
    } catch (error) {
      console.error(
        "Failed to create comment:",
        error
      );

      setCommentError(
        error.response?.data?.message ||
          "Unable to post your comment."
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  /* =========================================
     DELETE COMMENT
  ========================================= */

  const handleDeleteComment = async (
    commentId
  ) => {
    try {
      setDeletingCommentId(commentId);
      setCommentError("");

      await api.delete(
        `/comments/${commentId}`
      );

      setComments(
        (previousComments) =>
          previousComments.filter(
            (comment) =>
              comment.id !== commentId
          )
      );
    } catch (error) {
      console.error(
        "Failed to delete comment:",
        error
      );

      setCommentError(
        error.response?.data?.message ||
          "Unable to delete this comment."
      );
    } finally {
      setDeletingCommentId(null);
    }
  };

  /* =========================================
     AUTHOR HELPERS
  ========================================= */

  const getAuthorName = () => {
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

  const getCommentAuthor = (
    comment
  ) => {
    if (!comment.User) {
      return "InkForge Writer";
    }

    const firstName =
      comment.User.firstName || "";

    const lastName =
      comment.User.lastName || "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    return (
      fullName ||
      comment.User.username ||
      "Writer"
    );
  };

  const getInitials = (
    firstName,
    lastName,
    fallback = "I"
  ) => {
    const first =
      firstName?.trim()?.[0] || "";

    const last =
      lastName?.trim()?.[0] || "";

    const initials =
      `${first}${last}`.toUpperCase();

    return initials || fallback;
  };

  const getAuthorInitials = () => {
    if (!post?.User) {
      return "IW";
    }

    return getInitials(
      post.User.firstName,
      post.User.lastName,
      "IW"
    );
  };

  /* =========================================
     DATE
  ========================================= */

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    );
  };

  /* =========================================
     READING TIME
  ========================================= */

  const readingTime = useMemo(() => {
    if (!post?.content) {
      return 1;
    }

    const words =
      post.content
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;

    return Math.max(
      1,
      Math.ceil(words / 200)
    );
  }, [post]);

  /* =========================================
     LOADING STATE
  ========================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white">

        <div className="border-b border-white/[0.06]">

          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

            <div className="animate-pulse">

              <div className="h-4 w-28 rounded bg-white/[0.06]" />

              <div className="mt-10 h-5 w-20 rounded-full bg-white/[0.06]" />

              <div className="mt-6 h-12 w-full max-w-4xl rounded bg-white/[0.07]" />

              <div className="mt-3 h-12 w-3/4 rounded bg-white/[0.05]" />

              <div className="mt-8 h-4 w-64 rounded bg-white/[0.05]" />

            </div>

          </div>

        </div>

        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="animate-pulse">

            <div className="aspect-[16/8] rounded-[2rem] bg-white/[0.04]" />

            <div className="mx-auto mt-14 max-w-3xl space-y-5">

              <div className="h-5 rounded bg-white/[0.04]" />

              <div className="h-5 rounded bg-white/[0.04]" />

              <div className="h-5 w-5/6 rounded bg-white/[0.04]" />

              <div className="h-5 rounded bg-white/[0.04]" />

              <div className="h-5 w-4/6 rounded bg-white/[0.04]" />

            </div>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================
     ERROR STATE
  ========================================= */

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#09090b] px-4 py-20 text-white sm:px-6 lg:px-8">

        <div className="mx-auto max-w-xl text-center">

          <div className="relative mx-auto flex h-16 w-16 items-center justify-center">

            <div className="absolute inset-0 rounded-2xl bg-violet-500/10 blur-xl" />

            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/10 bg-red-500/[0.05]">
              <BookOpen
                size={22}
                className="text-red-400"
              />
            </div>

          </div>

          <h1 className="mt-7 text-2xl font-bold tracking-tight">
            Story unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {error ||
              "This story could not be found."}
          </p>

          <Link
            to="/posts"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            <ArrowLeft size={16} />
            Back to community
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">

      {/* =========================================
          ARTICLE HERO
      ========================================= */}

      <article>

        <header className="relative overflow-hidden border-b border-white/[0.06]">

          {/* Glow */}

          <div className="pointer-events-none absolute left-1/2 top-[-300px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[160px]" />

          <div className="pointer-events-none absolute right-[-150px] top-40 h-[400px] w-[400px] rounded-full bg-fuchsia-600/[0.06] blur-[130px]" />

          <div className="relative mx-auto max-w-5xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8 lg:pt-16">

            {/* Back */}

            <Link
              to="/posts"
              className="group inline-flex items-center gap-2 text-sm text-zinc-600 transition hover:text-white"
            >
              <ArrowLeft
                size={15}
                className="transition-transform group-hover:-translate-x-1"
              />

              Back to community
            </Link>

            {/* Category */}

            <div className="mt-10">

              <div className="flex flex-wrap items-center gap-2">

                <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-300">

                  <Sparkles size={12} />

                  {post.category ||
                    "Story"}

                </span>

                <span className="text-zinc-800">
                  •
                </span>

                <span className="text-[11px] text-zinc-600">
                  {readingTime} min read
                </span>

              </div>

              {/* Title */}

              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.06] tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl">
                {post.title}
              </h1>

              {/* Intro metadata */}

              <div className="mt-9 flex flex-wrap items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 text-xs font-bold text-violet-300">
                  {getAuthorInitials()}
                </div>

                <div>

                  <p className="text-sm font-semibold text-zinc-200">
                    {getAuthorName()}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-600">

                    <span>
                      Published{" "}
                      {formatDate(
                        post.createdAt
                      )}
                    </span>

                    <span className="text-zinc-800">
                      •
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={12} />
                      {readingTime} min read
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </header>

        {/* =========================================
            ARTICLE BODY
        ========================================= */}

        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

          {/* =======================================
              COVER
          ======================================= */}

          {post.imageUrl && (
            <div className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.02] shadow-2xl shadow-black/30">

              <div className="absolute -inset-10 -z-10 bg-violet-500/10 blur-3xl" />

              <div className="relative overflow-hidden">

                <img
                  src={post.imageUrl}
                  alt={
                    post.title ||
                    "Story cover"
                  }
                  className="max-h-[680px] w-full object-cover transition duration-700 group-hover:scale-[1.01]"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/[0.04]" />

              </div>

              <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.015] px-5 py-3">

                <div className="flex items-center gap-2 text-[11px] text-zinc-600">
                  <ImageIcon size={13} />
                  Story cover
                </div>

                <span className="text-[10px] text-zinc-700">
                  InkForge
                </span>

              </div>

            </div>
          )}

          {/* =======================================
              ARTICLE CONTENT
          ======================================= */}

          <div className="mx-auto mt-14 max-w-3xl sm:mt-16">

            <div className="prose-invert">

              {post.content
                ?.split("\n")
                .map(
                  (
                    paragraph,
                    index
                  ) => {

                    if (
                      !paragraph.trim()
                    ) {
                      return (
                        <div
                          key={index}
                          className="h-4"
                        />
                      );
                    }

                    return (
                      <p
                        key={index}
                        className="mb-7 text-[17px] leading-[1.9] tracking-[-0.005em] text-zinc-300 sm:text-[18px] sm:leading-[1.95]"
                      >
                        {paragraph}
                      </p>
                    );
                  }
                )}

            </div>

            {/* Article ending */}

            <div className="mt-14 border-t border-white/[0.07] pt-8">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                    <CheckCircle2
                      size={15}
                      className="text-violet-400"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-zinc-400">
                      You've reached the end.
                    </p>

                    <p className="mt-0.5 text-[11px] text-zinc-700">
                      Thanks for reading this story.
                    </p>
                  </div>

                </div>

                <Link
                  to="/posts"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-white"
                >
                  Discover more stories

                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

              </div>

            </div>

          </div>

        </div>

      </article>

      {/* =========================================
          DISCUSSION
      ========================================= */}

      <section className="border-t border-white/[0.06] bg-[#0b0b0f]">

        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

          {/* Discussion heading */}

          <div className="flex items-end justify-between gap-5">

            <div>

              <div className="flex items-center gap-2">

                <MessageCircle
                  size={18}
                  className="text-violet-400"
                />

                <h2 className="text-xl font-semibold">
                  Discussion
                </h2>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                  {comments.length}
                </span>

              </div>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                What did this story make you think about?
              </p>

            </div>

          </div>

          {/* =======================================
              COMMENT FORM
          ======================================= */}

          {user ? (
            <form
              onSubmit={
                handleSubmitComment
              }
              className="mt-8"
            >

              <div className="overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] transition focus-within:border-violet-500/30 focus-within:bg-white/[0.035]">

                <div className="flex gap-3 p-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/10 text-[10px] font-bold text-violet-300">
                    {getInitials(
                      user.firstName,
                      user.lastName,
                      "ME"
                    )}
                  </div>

                  <textarea
                    value={commentText}
                    onChange={(event) =>
                      setCommentText(
                        event.target.value
                      )
                    }
                    placeholder="Share your thoughts..."
                    rows={4}
                    className="min-h-[100px] w-full resize-none bg-transparent pt-1 text-sm leading-7 text-white outline-none placeholder:text-zinc-700"
                  />

                </div>

                <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">

                  <span className="hidden text-[11px] text-zinc-700 sm:block">
                    Be thoughtful. Be constructive.
                  </span>

                  <span className="text-[11px] text-zinc-700 sm:hidden">
                    {commentText.length} chars
                  </span>

                  <button
                    type="submit"
                    disabled={
                      submittingComment ||
                      !commentText.trim()
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send size={14} />

                    {submittingComment
                      ? "Posting..."
                      : "Post comment"}
                  </button>

                </div>

              </div>

            </form>
          ) : (
            <div className="relative mt-8 overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] p-6">

              <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/[0.08] blur-3xl" />

              <div className="relative">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                  <MessageCircle
                    size={17}
                    className="text-violet-400"
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-white">
                  Join the conversation
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
                  Sign in to share your thoughts,
                  respond to the story, and become
                  part of the InkForge community.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">

                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-200"
                  >
                    Log in
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    Create account
                  </Link>

                </div>

              </div>

            </div>
          )}

          {/* =======================================
              COMMENT ERROR
          ======================================= */}

          {commentError && (
            <div className="mt-4 flex items-start justify-between gap-4 rounded-xl border border-red-500/10 bg-red-500/[0.04] px-4 py-3">

              <p className="text-xs leading-5 text-red-300">
                {commentError}
              </p>

              <button
                type="button"
                onClick={() =>
                  setCommentError("")
                }
                className="shrink-0 text-red-400 transition hover:text-white"
                aria-label="Dismiss error"
              >
                <X size={15} />
              </button>

            </div>
          )}

          {/* =======================================
              COMMENTS
          ======================================= */}

          <div className="mt-10">

            {commentsLoading ? (
              <div className="space-y-3">

                {[1, 2, 3].map(
                  (item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-5"
                    >

                      <div className="flex items-center gap-3">

                        <div className="h-9 w-9 rounded-full bg-white/[0.06]" />

                        <div>
                          <div className="h-3 w-28 rounded bg-white/[0.06]" />
                          <div className="mt-2 h-2.5 w-20 rounded bg-white/[0.04]" />
                        </div>

                      </div>

                      <div className="mt-5 h-3 w-full rounded bg-white/[0.04]" />

                      <div className="mt-2 h-3 w-4/5 rounded bg-white/[0.04]" />

                    </div>
                  )
                )}

              </div>
            ) : comments.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.015] px-6 py-16 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <MessageCircle
                    size={20}
                    className="text-zinc-600"
                  />
                </div>

                <h3 className="mt-5 text-sm font-semibold text-white">
                  No discussion yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-zinc-600">
                  Be the first reader to share a
                  thoughtful perspective on this story.
                </p>

              </div>
            ) : (
              <div className="space-y-3">

                {comments.map(
                  (comment) => {

                    const isOwner =
                      user &&
                      Number(
                        comment.userId
                      ) ===
                        Number(user.id);

                    const commentInitials =
                      getInitials(
                        comment.User
                          ?.firstName,
                        comment.User
                          ?.lastName,
                        "IW"
                      );

                    return (
                      <article
                        key={comment.id}
                        className="group rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-white/[0.1] hover:bg-white/[0.025]"
                      >

                        <div className="flex items-start gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[10px] font-bold text-zinc-400">
                            {commentInitials}
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-4">

                              <div>

                                <p className="text-sm font-semibold text-zinc-200">
                                  {getCommentAuthor(
                                    comment
                                  )}
                                </p>

                                <p className="mt-1 text-[10px] text-zinc-700">
                                  {formatDate(
                                    comment.createdAt
                                  )}
                                </p>

                              </div>

                              {isOwner && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteComment(
                                      comment.id
                                    )
                                  }
                                  disabled={
                                    deletingCommentId ===
                                    comment.id
                                  }
                                  className="rounded-lg p-2 text-zinc-700 opacity-100 transition hover:bg-red-500/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
                                  aria-label="Delete comment"
                                >
                                  <Trash2
                                    size={14}
                                  />
                                </button>
                              )}

                            </div>

                            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-400">
                              {comment.content}
                            </p>

                          </div>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </div>

      </section>

    </div>
  );
}

export default PostDetails;