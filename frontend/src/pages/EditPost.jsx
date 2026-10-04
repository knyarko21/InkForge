
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Save,
  Send,
  Sparkles,
  X
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [currentStatus, setCurrentStatus] =
    useState("draft");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [saveType, setSaveType] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================
  // Load Post
  // =====================================

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(`/posts/${id}`);

        const post =
          response.data.post;

        if (!post) {
          setError("Post not found.");
          return;
        }

        // Check ownership
        if (
          !user ||
          Number(post.userId) !==
            Number(user.id)
        ) {
          setError(
            "You are not allowed to edit this post."
          );

          return;
        }

        setTitle(post.title || "");
        setCategory(post.category || "");
        setContent(post.content || "");

        setImageUrl(
          post.imageUrl || ""
        );

        setImagePreview(
          post.imageUrl || ""
        );

        setCurrentStatus(
          post.status || "draft"
        );
      } catch (error) {
        console.error(
          "Fetch post error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Something went wrong while loading the post.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPost();
    }
  }, [id, user]);

  // =====================================
  // Image Preview
  // =====================================

  useEffect(() => {
    const url = imageUrl.trim();

    if (!url) {
      setImagePreview("");
      return;
    }

    setImagePreview(url);
  }, [imageUrl]);

  // =====================================
  // Update Post
  // =====================================

  const handleSubmit = async (
    event,
    selectedStatus
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedTitle =
      title.trim();

    const trimmedContent =
      content.trim();

    const trimmedCategory =
      category.trim();

    const trimmedImageUrl =
      imageUrl.trim();

    // Frontend validation
    if (trimmedTitle.length < 3) {
      setError(
        "Title must be at least 3 characters long."
      );

      return;
    }

    if (trimmedContent.length < 10) {
      setError(
        "Content must be at least 10 characters long."
      );

      return;
    }

    try {
      setSaving(true);
      setSaveType(selectedStatus);

      const postData = {
        title: trimmedTitle,

        content: trimmedContent,

        category:
          trimmedCategory || undefined,

        status: selectedStatus,

        imageUrl:
          trimmedImageUrl || undefined
      };

      const response =
        await api.put(
          `/posts/${id}`,
          postData
        );

      const updatedPost =
        response.data.post;

      setCurrentStatus(
        updatedPost.status
      );

      setSuccess(
        selectedStatus === "published"
          ? "Your post has been published successfully."
          : "Your draft has been saved successfully."
      );

      // Give the success message
      // a moment before navigating.
      setTimeout(() => {
        navigate(`/posts/${id}`);
      }, 900);
    } catch (error) {
      console.error(
        "Update post error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Something went wrong while updating your post.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // Loading State
  // =====================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090b] text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={36}
            className="animate-spin text-violet-400"
          />

          <p className="text-sm text-zinc-500">
            Loading your post...
          </p>
        </div>
      </main>
    );
  }

  // =====================================
  // Main UI
  // =====================================

  return (
    <main className="min-h-screen bg-[#09090b] text-white">

      {/* Background decoration */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="absolute right-[-10%] top-[20%] h-96 w-96 rounded-full bg-fuchsia-600/15 blur-3xl" />

        <div className="absolute bottom-[-10%] left-[30%] h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Top bar */}

        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={18} />

            Dashboard
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300 sm:flex">
            <Sparkles size={16} />

            Editing your publication
          </div>
        </div>

        {/* Heading */}

        <section className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300">
            <Sparkles size={14} />

            Edit publication
          </div>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Refine your story.

            <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Make it even better.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-500">
            Update your article, refine its cover image,
            or switch between draft and published status.
          </p>
        </section>

        {/* Success */}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-emerald-300">
            <CheckCircle2 size={20} />

            <span className="text-sm font-medium">
              {success}
            </span>
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-red-300">
            <X size={20} />

            <span className="text-sm font-medium">
              {error}
            </span>
          </div>
        )}

        {/* Form */}

        <form
          onSubmit={(event) =>
            handleSubmit(
              event,
              "published"
            )
          }
          className="grid gap-8 lg:grid-cols-[1fr_340px]"
        >

          {/* Main editor */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">

            {/* Title */}

            <div className="mb-7">
              <label
                htmlFor="title"
                className="mb-3 block text-sm font-semibold text-zinc-200"
              >
                Post title
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
                placeholder="Give your article a powerful title..."
                maxLength={200}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-xl font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/50 focus:bg-black/30 focus:ring-4 focus:ring-violet-500/10"
              />

              <div className="mt-2 flex justify-end text-xs text-zinc-600">
                {title.length}/200
              </div>
            </div>

            {/* Category */}

            <div className="mb-7">
              <label
                htmlFor="category"
                className="mb-3 block text-sm font-semibold text-zinc-200"
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
                placeholder="Technology, Business, Design..."
                maxLength={100}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
              />
            </div>

            {/* Content */}

            <div>
              <label
                htmlFor="content"
                className="mb-3 block text-sm font-semibold text-zinc-200"
              >
                Your story
              </label>

              <textarea
                id="content"
                value={content}
                onChange={(event) =>
                  setContent(
                    event.target.value
                  )
                }
                placeholder="Start writing your thoughts..."
                rows={20}
                className="min-h-[420px] w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-5 py-5 text-base leading-8 text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
              />

              <div className="mt-2 flex justify-end text-xs text-zinc-600">
                {content.length} characters
              </div>
            </div>
          </section>

          {/* Sidebar */}

          <aside className="space-y-6">

            {/* Image */}

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 backdrop-blur-xl">

              <div className="mb-6">
                <h2 className="text-lg font-bold text-white">
                  Cover image
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Update the image that represents your story.
                </p>
              </div>

              <label
                htmlFor="imageUrl"
                className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-300"
              >
                <ImageIcon
                  size={17}
                  className="text-violet-400"
                />

                Cover image URL
              </label>

              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(event) =>
                  setImageUrl(
                    event.target.value
                  )
                }
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
              />

              {imagePreview && (
                <div className="group relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black">

                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="aspect-video w-full object-cover transition duration-700 group-hover:scale-105"
                    onError={() =>
                      setError(
                        "The image URL could not be loaded. Make sure it points directly to an image."
                      )
                    }
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">

                    <span className="rounded-lg bg-black/50 px-2.5 py-1.5 text-xs text-white backdrop-blur-md">
                      Live preview
                    </span>

                    <a
                      href={imagePreview}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-white/10 p-2 text-white backdrop-blur-md transition hover:bg-white/20"
                    >
                      <ExternalLink
                        size={15}
                      />
                    </a>

                  </div>
                </div>
              )}

              {imageUrl && (
                <button
                  type="button"
                  onClick={() =>
                    setImageUrl("")
                  }
                  className="mt-3 text-xs font-medium text-red-400 transition hover:text-red-300"
                >
                  Remove image
                </button>
              )}
            </section>

            {/* Publish */}

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 backdrop-blur-xl">

              <h2 className="mb-2 text-lg font-bold text-white">
                Publish
              </h2>

              <p className="mb-5 text-sm leading-6 text-zinc-500">
                Current status:{" "}
                <span className="font-semibold capitalize text-zinc-300">
                  {currentStatus}
                </span>
              </p>

              {/* Save draft */}

              <button
                type="button"
                disabled={saving}
                onClick={(event) =>
                  handleSubmit(
                    event,
                    "draft"
                  )
                }
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving &&
                saveType === "draft" ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={18} />
                )}

                Save draft
              </button>

              {/* Publish */}

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.01] hover:from-violet-400 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {saving &&
                saveType === "published" ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Send size={18} />
                )}

                Publish changes
              </button>
            </section>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default EditPost;