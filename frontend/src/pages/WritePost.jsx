
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ImageIcon,
  Loader2,
  PenLine,
  Send,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const categories = [
  "Technology",
  "Business",
  "Education",
  "Health",
  "Agriculture",
  "Finance",
  "Lifestyle",
  "Programming",
  "Career",
  "Other",
];

function getWordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function getReadingTime(words) {
  if (!words) return 1;

  return Math.max(1, Math.ceil(words / 200));
}

function getInitials(user) {
  if (!user) return "IN";

  const first =
    user.firstName?.trim()?.charAt(0)?.toUpperCase() || "";

  const last =
    user.lastName?.trim()?.charAt(0)?.toUpperCase() || "";

  return `${first}${last}` || user.username?.charAt(0)?.toUpperCase() || "IN";
}

export default function WritePost() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "Technology",
    status: "Published",
    imageUrl: "",
    videoUrl: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const wordCount = useMemo(
    () => getWordCount(form.content),
    [form.content]
  );

  const readingTime = useMemo(
    () => getReadingTime(wordCount),
    [wordCount]
  );

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setError("");
  };

  const validateForm = () => {
    const errors = {};

    if (!form.title.trim()) {
      errors.title = "Give your post a title.";
    } else if (form.title.trim().length < 5) {
      errors.title = "The title should be at least 5 characters.";
    }

    if (!form.content.trim()) {
      errors.content = "Write something before publishing.";
    } else if (form.content.trim().length < 20) {
      errors.content = "Your content is too short.";
    }

    if (!form.category.trim()) {
      errors.category = "Choose a category.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        category: form.category,
        status: form.status,
        imageUrl: form.imageUrl.trim(),
        videoUrl: form.videoUrl.trim(),
      };

      const response = await api.post("/posts", payload);

      const createdPost = response.data?.post || response.data;

      if (createdPost?.id) {
        navigate(`/posts/${createdPost.id}`);
      } else {
        navigate("/posts");
      }
    } catch (err) {
      console.error("Create post error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "We couldn't publish your post. Please try again.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const clearImage = () => {
    updateField("imageUrl", "");
  };

  const clearVideo = () => {
    updateField("videoUrl", "");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute right-0 top-80 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top navigation */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/posts"
            className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to stories
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-sm text-zinc-500 sm:flex">
              <Clock3 size={16} />
              {readingTime} min read
            </div>

            <div className="hidden h-5 w-px bg-white/10 sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold">
                {getInitials(user)}
              </div>

              <span className="hidden text-sm text-zinc-300 sm:block">
                {user?.firstName || user?.username || "Creator"}
              </span>
            </div>
          </div>
        </div>

        {/* Page heading */}
        <div className="mb-8 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            <PenLine size={14} />
            Writing Studio
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Create something
            <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              worth reading.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Turn your ideas into a story your readers will remember.
            Add your perspective, organize your thoughts, and publish when
            you're ready.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-4 text-sm text-red-200">
            <X size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1 text-red-200/80">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* Main editor */}
            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
              {/* Editor header */}
              <div className="border-b border-white/10 px-5 py-4 sm:px-7">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Sparkles size={16} className="text-violet-400" />
                    New story
                  </div>

                  <div className="text-xs text-zinc-500">
                    {wordCount} {wordCount === 1 ? "word" : "words"}
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8">
                {/* Title */}
                <div className="mb-8">
                  <label
                    htmlFor="title"
                    className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500"
                  >
                    Title
                  </label>

                  <input
                    id="title"
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    placeholder="Write a title that makes people curious..."
                    className="w-full border-0 bg-transparent text-3xl font-black leading-tight tracking-tight text-white outline-none placeholder:text-zinc-700 sm:text-5xl"
                  />

                  {fieldErrors.title && (
                    <p className="mt-3 text-sm text-red-400">
                      {fieldErrors.title}
                    </p>
                  )}
                </div>

                {/* Content */}
                <div>
                  <label
                    htmlFor="content"
                    className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500"
                  >
                    Your story
                  </label>

                  <textarea
                    id="content"
                    value={form.content}
                    onChange={(event) =>
                      updateField("content", event.target.value)
                    }
                    placeholder="Start writing your story..."
                    rows={18}
                    className="min-h-[420px] w-full resize-y border-0 bg-transparent text-base leading-8 text-zinc-200 outline-none placeholder:text-zinc-700 sm:text-lg"
                  />

                  {fieldErrors.content && (
                    <p className="mt-2 text-sm text-red-400">
                      {fieldErrors.content}
                    </p>
                  )}
                </div>

                {/* Writing stats */}
                <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-5 text-xs text-zinc-500">
                  <span>{wordCount} words</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-700" />
                  <span>{readingTime} min read</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-700" />
                  <span>{form.content.length} characters</span>
                </div>
              </div>
            </section>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Publishing */}
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10">
                <div className="mb-5">
                  <h2 className="text-sm font-bold text-white">
                    Publishing
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Control how your story appears on InkForge.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
                    >
                      Category
                    </label>

                    <select
                      id="category"
                      value={form.category}
                      onChange={(event) =>
                        updateField("category", event.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10"
                    >
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-zinc-900"
                        >
                          {category}
                        </option>
                      ))}
                    </select>

                    {fieldErrors.category && (
                      <p className="mt-2 text-xs text-red-400">
                        {fieldErrors.category}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label
                      htmlFor="status"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
                    >
                      Status
                    </label>

                    <select
                      id="status"
                      value={form.status}
                      onChange={(event) =>
                        updateField("status", event.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10"
                    >
                      <option value="Published" className="bg-zinc-900">
                        Published
                      </option>

                      <option value="Draft" className="bg-zinc-900">
                        Draft
                      </option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Cover image */}
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                    <ImageIcon size={18} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Cover image
                    </h2>

                    <p className="text-xs text-zinc-500">
                      Use an online image URL.
                    </p>
                  </div>
                </div>

                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(event) =>
                    updateField("imageUrl", event.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10"
                />

                {form.imageUrl && (
                  <div className="relative mt-4 overflow-hidden rounded-xl border border-white/10">
                    <img
                      src={form.imageUrl}
                      alt="Cover preview"
                      className="aspect-video w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />

                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/70 text-white backdrop-blur transition hover:bg-black"
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </section>

              {/* Video */}
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-400/10 text-fuchsia-300">
                    <Video size={18} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Video
                    </h2>

                    <p className="text-xs text-zinc-500">
                      Optional video URL.
                    </p>
                  </div>
                </div>

                <input
                  type="url"
                  value={form.videoUrl}
                  onChange={(event) =>
                    updateField("videoUrl", event.target.value)
                  }
                  placeholder="https://youtube.com/..."
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-400/10"
                />

                {form.videoUrl && (
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <span className="max-w-[220px] truncate text-xs text-zinc-400">
                      {form.videoUrl}
                    </span>

                    <button
                      type="button"
                      onClick={clearVideo}
                      className="ml-2 text-zinc-500 transition hover:text-white"
                      aria-label="Remove video"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </section>

              {/* Publish actions */}
              <section className="rounded-[2rem] border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent p-5">
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={17}
                      className="text-violet-300"
                    />

                    <h2 className="text-sm font-bold text-white">
                      Ready to publish?
                    </h2>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    Your story will appear in the InkForge community once
                    published.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      {form.status === "Draft"
                        ? "Save Draft"
                        : "Publish Story"}
                    </>
                  )}
                </button>

                <Link
                  to="/posts"
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-zinc-400 transition hover:border-white/20 hover:text-white"
                >
                  Cancel
                </Link>
              </section>
            </aside>
          </div>
        </form>
      </main>
    </div>
  );
}