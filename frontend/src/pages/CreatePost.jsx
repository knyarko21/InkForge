
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Save,
  Sparkles,
  Type,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [status, setStatus] = useState("draft");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [imageError, setImageError] = useState(false);

  /* =========================================
     WRITING STATS
  ========================================= */

  const wordCount = useMemo(() => {
    const trimmed = content.trim();

    if (!trimmed) {
      return 0;
    }

    return trimmed.split(/\s+/).length;
  }, [content]);

  const characterCount = content.length;

  const readingTime = Math.max(
    1,
    Math.ceil(wordCount / 200)
  );

  const completionScore = useMemo(() => {
    let score = 0;

    if (title.trim().length >= 3) {
      score += 25;
    }

    if (content.trim().length >= 10) {
      score += 40;
    }

    if (category.trim()) {
      score += 15;
    }

    if (imageUrl.trim() && !imageError) {
      score += 20;
    }

    return score;
  }, [
    title,
    content,
    category,
    imageUrl,
    imageError,
  ]);

  /* =========================================
     IMAGE
  ========================================= */

  const handleImageChange = (value) => {
    setImageUrl(value);
    setImageError(false);
  };

  const removeImage = () => {
    setImageUrl("");
    setImageError(false);
  };

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = async (
    event,
    selectedStatus
  ) => {
    event.preventDefault();

    setError("");

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const trimmedCategory = category.trim();
    const trimmedImageUrl = imageUrl.trim();

    if (!trimmedTitle) {
      setError(
        "Please give your story a title."
      );
      return;
    }

    if (trimmedTitle.length < 3) {
      setError(
        "Your title must be at least 3 characters long."
      );
      return;
    }

    if (!trimmedContent) {
      setError(
        "Your story content cannot be empty."
      );
      return;
    }

    if (trimmedContent.length < 10) {
      setError(
        "Your story should contain at least 10 characters."
      );
      return;
    }

    if (
      trimmedImageUrl &&
      !isValidUrl(trimmedImageUrl)
    ) {
      setError(
        "Please enter a valid image URL."
      );
      return;
    }

    try {
      setSubmitting(true);

      const postData = {
        title: trimmedTitle,
        content: trimmedContent,
        category:
          trimmedCategory || undefined,
        status: selectedStatus,
        imageUrl:
          trimmedImageUrl || undefined,
      };

      const response = await api.post(
        "/posts",
        postData
      );

      const createdPost =
        response.data.post;

      navigate(
        `/posts/${createdPost.id}`
      );
    } catch (error) {
      console.error(
        "Create post error:",
        error
      );

      const validationErrors =
        error.response?.data?.errors;

      if (
        Array.isArray(
          validationErrors
        ) &&
        validationErrors.length > 0
      ) {
        setError(
          validationErrors
            .map(
              (item) =>
                item.message
            )
            .join(" ")
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to create your story."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = (event) => {
    handleSubmit(
      event,
      "draft"
    );
  };

  const handlePublish = (event) => {
    handleSubmit(
      event,
      "published"
    );
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white">

      {/* =========================================
          TOP BAR
      ========================================= */}

      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#09090b]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft
              size={16}
              className="transition group-hover:-translate-x-0.5"
            />

            <span className="hidden sm:inline">
              Back to dashboard
            </span>

            <span className="sm:hidden">
              Dashboard
            </span>
          </Link>

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 text-xs text-zinc-600 sm:flex">
              <FileText size={14} />

              {wordCount} words

              <span className="text-zinc-800">
                •
              </span>

              {readingTime} min read
            </div>

            <div className="h-4 w-px bg-white/10" />

            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold text-zinc-500">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  status === "published"
                    ? "bg-emerald-400"
                    : "bg-amber-400"
                }`}
              />

              {status === "published"
                ? "Ready to publish"
                : "Draft"}
            </span>
          </div>
        </div>
      </header>

      {/* =========================================
          HERO
      ========================================= */}

      <section className="relative overflow-hidden border-b border-white/[0.06]">

        <div className="pointer-events-none absolute left-1/2 top-[-240px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="pointer-events-none absolute right-[-100px] top-20 h-72 w-72 rounded-full bg-fuchsia-600/[0.06] blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.06] px-3 py-1.5 text-xs font-medium text-violet-300">
              <Sparkles size={13} />

              Creator studio
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
              Create something
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                {" "}worth reading.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
              Write freely, add a visual identity,
              and share your perspective with the
              InkForge community.
            </p>

          </div>

          {/* PROGRESS */}

          <div className="mt-8 max-w-xl">

            <div className="flex items-center justify-between text-[11px]">

              <span className="font-medium text-zinc-500">
                Story completion
              </span>

              <span className="font-semibold text-violet-400">
                {completionScore}%
              </span>

            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 transition-all duration-500"
                style={{
                  width: `${completionScore}%`,
                }}
              />

            </div>

          </div>

        </div>
      </section>

      {/* =========================================
          EDITOR
      ========================================= */}

      <form
        onSubmit={handlePublish}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
      >

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.05] px-4 py-4 text-sm text-red-300">

            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />

            <p>{error}</p>

          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">

          {/* =======================================
              WRITING AREA
          ======================================= */}

          <section className="min-w-0">

            <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.02] shadow-2xl shadow-black/10">

              {/* TITLE */}

              <div className="border-b border-white/[0.07] px-5 py-7 sm:px-8 sm:py-9">

                <label
                  htmlFor="title"
                  className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600"
                >
                  <Type size={12} />

                  Story title
                </label>

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  placeholder="Give your story a title..."
                  maxLength={200}
                  className="w-full bg-transparent text-3xl font-bold leading-tight tracking-[-0.03em] text-white outline-none placeholder:text-zinc-800 sm:text-4xl lg:text-5xl"
                />

                <div className="mt-5 flex items-center justify-between text-[11px] text-zinc-700">

                  <span>
                    Make it clear and memorable.
                  </span>

                  <span>
                    {title.length}/200
                  </span>

                </div>
              </div>

              {/* CONTENT */}

              <div className="px-5 py-7 sm:px-8 sm:py-9">

                <label
                  htmlFor="content"
                  className="sr-only"
                >
                  Story content
                </label>

                <textarea
                  id="content"
                  value={content}
                  onChange={(event) =>
                    setContent(
                      event.target.value
                    )
                  }
                  placeholder="Start writing your story..."
                  className="min-h-[560px] w-full resize-y bg-transparent text-[17px] leading-[1.9] text-zinc-300 outline-none placeholder:text-zinc-800 sm:text-[18px]"
                />

                {/* WRITING FOOTER */}

                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.07] pt-5 text-[11px] text-zinc-600">

                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400/60" />
                    {wordCount} words
                  </div>

                  <span>
                    {characterCount} characters
                  </span>

                  <span>
                    {readingTime} minute
                    {readingTime !== 1
                      ? "s"
                      : ""}{" "}
                    read
                  </span>

                </div>
              </div>

            </div>

            {/* EDITOR NOTE */}

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Sparkles size={15} />
              </div>

              <div>
                <p className="text-xs font-semibold text-zinc-300">
                  Keep the reader moving
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  Strong openings, short paragraphs,
                  and clear ideas make longer stories
                  easier to read.
                </p>
              </div>

            </div>

          </section>

          {/* =======================================
              SIDEBAR
          ======================================= */}

          <aside className="space-y-5">

            {/* =====================================
                PUBLISH
            ===================================== */}

            <div className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03] p-5">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Publishing
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Ready to share?
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
                  <Save
                    size={17}
                    className="text-zinc-400"
                  />
                </div>

              </div>

              {/* STATUS SELECTOR */}

              <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl border border-white/[0.06] bg-black/20 p-1">

                <button
                  type="button"
                  onClick={() =>
                    setStatus("draft")
                  }
                  className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                    status === "draft"
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-zinc-600 hover:text-zinc-300"
                  }`}
                >
                  Save as draft
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setStatus("published")
                  }
                  className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                    status === "published"
                      ? "bg-violet-500/15 text-violet-300"
                      : "text-zinc-600 hover:text-zinc-300"
                  }`}
                >
                  Publish
                </button>

              </div>

              <div className="mt-4 space-y-2">

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Save size={15} />

                  {submitting &&
                  status === "draft"
                    ? "Saving..."
                    : "Save draft"}
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={submitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CheckCircle2 size={16} />

                  {submitting &&
                  status === "published"
                    ? "Publishing..."
                    : "Publish story"}
                </button>

              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-zinc-700">
                <Check size={12} />
                Your story can be edited later.
              </div>

            </div>

            {/* =====================================
                CATEGORY
            ===================================== */}

            <div className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03] p-5">

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                  Discovery
                </p>

                <h2 className="mt-1 font-semibold">
                  Category
                </h2>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  Help readers understand what your
                  story is about.
                </p>
              </div>

              <label
                htmlFor="category"
                className="sr-only"
              >
                Category
              </label>

              <input
                id="category"
                type="text"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                placeholder="e.g. Technology"
                className="mt-4 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-violet-500/40 focus:bg-black/30"
              />

              <div className="mt-3 flex flex-wrap gap-2">

                {[
                  "Technology",
                  "Business",
                  "Education",
                  "Lifestyle",
                  "Ideas",
                ].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() =>
                        setCategory(
                          suggestion
                        )
                      }
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition ${
                        category === suggestion
                          ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
                          : "border-white/10 text-zinc-600 hover:border-violet-500/30 hover:text-violet-300"
                      }`}
                    >
                      {suggestion}
                    </button>
                  )
                )}

              </div>

            </div>

            {/* =====================================
                COVER IMAGE
            ===================================== */}

            <div className="overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03]">

              <div className="p-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <ImageIcon size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                      Visual identity
                    </p>

                    <h2 className="mt-1 font-semibold">
                      Cover image
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                      Add a direct online image URL.
                    </p>
                  </div>

                </div>

                <div className="relative mt-5">

                  <LinkIcon
                    size={15}
                    className="pointer-events-none absolute left-3 top-3.5 text-zinc-700"
                  />

                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(event) =>
                      handleImageChange(
                        event.target.value
                      )
                    }
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-9 pr-10 text-xs text-white outline-none placeholder:text-zinc-700 transition focus:border-violet-500/40"
                  />

                  {imageUrl && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white/5 hover:text-white"
                      aria-label="Remove image"
                    >
                      <X size={14} />
                    </button>
                  )}

                </div>

              </div>

              {/* IMAGE PREVIEW */}

              {imageUrl && !imageError && (
                <div className="border-t border-white/[0.07] bg-black/20">

                  <div className="relative aspect-[16/10] overflow-hidden">

                    <img
                      src={imageUrl}
                      alt="Cover preview"
                      className="h-full w-full object-cover transition duration-500"
                      onError={() =>
                        setImageError(true)
                      }
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60">
                          Preview
                        </p>

                        <p className="mt-1 text-xs font-medium text-white">
                          Your story cover
                        </p>
                      </div>

                      <span className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-[9px] text-zinc-300 backdrop-blur-md">
                        16:10
                      </span>

                    </div>

                  </div>

                </div>
              )}

              {imageError && (
                <div className="border-t border-red-500/10 bg-red-500/[0.03] px-5 py-4">

                  <p className="text-xs leading-5 text-red-400">
                    This image could not be loaded.
                    Check that the URL points directly
                    to an online image.
                  </p>

                </div>
              )}

            </div>

            {/* =====================================
                STORY CHECKLIST
            ===================================== */}

            <div className="rounded-[1.5rem] border border-white/[0.07] bg-white/[0.02] p-5">

              <div className="flex items-center gap-2">

                <Sparkles
                  size={15}
                  className="text-violet-400"
                />

                <h2 className="text-sm font-semibold">
                  Story checklist
                </h2>

              </div>

              <div className="mt-4 space-y-3">

                <ChecklistItem
                  label="Title"
                  complete={
                    title.trim().length >= 3
                  }
                />

                <ChecklistItem
                  label="Story content"
                  complete={
                    content.trim().length >= 10
                  }
                />

                <ChecklistItem
                  label="Category"
                  complete={
                    Boolean(category.trim())
                  }
                />

                <ChecklistItem
                  label="Cover image"
                  complete={
                    Boolean(
                      imageUrl.trim()
                    ) && !imageError
                  }
                />

              </div>

            </div>

          </aside>
        </div>
      </form>
    </main>
  );
}

/* =========================================
   CHECKLIST ITEM
========================================= */

function ChecklistItem({
  label,
  complete,
}) {
  return (
    <div className="flex items-center gap-3">

      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
          complete
            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
            : "border-white/10 text-transparent"
        }`}
      >
        <Check size={11} />
      </div>

      <span
        className={`text-xs ${
          complete
            ? "text-zinc-300"
            : "text-zinc-600"
        }`}
      >
        {label}
      </span>

      {complete && (
        <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider text-emerald-400/70">
          Ready
        </span>
      )}

    </div>
  );
}

/* =========================================
   URL VALIDATION
========================================= */

function isValidUrl(value) {
  try {
    new URL(value);

    return true;
  } catch {
    return false;
  }
}

export default CreatePost;