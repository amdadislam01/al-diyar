"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import ImageUpload from "@/components/dashboard/ImageUpload";

export default function BlogFormPage() {
    const router = useRouter();
    const { id } = useParams();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        coverImage: "",
        category: "Real Estate",
        status: "draft",
        tags: "",
    });
    const [images, setImages] = useState<(string | File)[]>([]);

    useEffect(() => {
        if (isEdit) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            const res = await fetch(`/api/admin/blogs/${id}`);
            if (!res.ok) throw new Error("Failed to fetch blog");
            const blog = await res.json();

            setFormData({
                title: blog.title || "",
                slug: blog.slug || "",
                content: blog.content || "",
                excerpt: blog.excerpt || "",
                coverImage: blog.coverImage || "",
                category: blog.category || "Real Estate",
                status: blog.status || "draft",
                tags: blog.tags?.join(", ") || "",
            });

            if (blog.coverImage) {
                setImages([blog.coverImage]);
            }
        } catch (error) {
            toast.error("Failed to fetch blog data");
        } finally {
            setFetching(false);
        }
    };

    const uploadToCloudinary = async (file: File) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            console.error("Cloudinary configuration missing:", { cloudName, uploadPreset });
            throw new Error("Cloudinary configuration is missing. Please check your environment variables.");
        }

        const data = new FormData();
        data.append("upload_preset", uploadPreset);
        data.append("file", file);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: data,
                }
            );

            const result = await response.json();

            if (!response.ok) {
                console.error("Cloudinary Upload Error:", result);
                throw new Error(result.error?.message || "Upload failed");
            }

            return result.secure_url as string;
        } catch (error: any) {
            console.error("Fetch Error:", error);
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setUploading(true);

        try {
            // 1. Upload new files to Cloudinary if any
            const uploadPromises = images.map(async (item) => {
                if (typeof item === "string") return item;
                return await uploadToCloudinary(item);
            });

            const imageUrls = await Promise.all(uploadPromises);
            setUploading(false);

            const url = isEdit ? `/api/admin/blogs/${id}` : "/api/admin/blogs";
            const method = isEdit ? "PUT" : "POST";

            const payload = {
                ...formData,
                coverImage: imageUrls[0] || "", // Use first image as cover
                tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success(isEdit ? "Blog updated successfully" : "Blog created successfully");
                router.push("/dashboard/admin/blogs");
                router.refresh();
            } else {
                const data = await res.json();
                toast.error(data.error || "Something went wrong");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    if (fetching) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold">{isEdit ? "Edit Blog" : "Create New Blog"}</h1>
                <p className="text-slate-500 text-sm mt-1">
                    {isEdit ? "Update your blog post details below." : "Fill in the details to create a new blog post."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Title</label>
                        <input
                            required
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                            placeholder="e.g. 5 Tips for Buying Your First Home"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Slug (Optional)</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                            placeholder="e.g. tips-buying-first-home"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                        >
                            <option value="Real Estate">Real Estate</option>
                            <option value="Home Decor">Home Decor</option>
                            <option value="Market Trends">Market Trends</option>
                            <option value="Investment">Investment</option>
                            <option value="Lifestyle">Lifestyle</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Cover Image</label>
                    <ImageUpload
                        value={images}
                        onChange={(items) => setImages(items)}
                        onRemove={(item) => setImages(images.filter(i => i !== item))}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Excerpt</label>
                    <textarea
                        rows={2}
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                        placeholder="Brief summary of the post..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Content (Markdown/HTML supported)</label>
                    <textarea
                        required
                        rows={10}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent font-mono text-sm"
                        placeholder="Write your content here..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Tags (comma separated)</label>
                    <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                        placeholder="realestate, guide, tips"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
                    >
                        {loading ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
