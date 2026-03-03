"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";

import Swal from "sweetalert2";

interface Blog {
    _id: string;
    title: string;
    slug: string;
    status: string;
    category: string;
    createdAt: string;
}

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch("/api/admin/blogs");
            const data = await res.json();
            if (res.ok) {
                setBlogs(data);
            } else {
                toast.error(data.error || "Failed to fetch blogs");
            }
        } catch (error) {
            toast.error("An error occurred while fetching blogs");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            background: document.documentElement.classList.contains("dark") ? "#0f172a" : "#fff",
            color: document.documentElement.classList.contains("dark") ? "#fff" : "#000",
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/admin/blogs/${id}`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "The blog post has been deleted.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                        background: document.documentElement.classList.contains("dark") ? "#0f172a" : "#fff",
                        color: document.documentElement.classList.contains("dark") ? "#fff" : "#000",
                    });
                    fetchBlogs();
                } else {
                    const data = await res.json();
                    toast.error(data.error || "Failed to delete blog");
                }
            } catch (error) {
                toast.error("An error occurred while deleting the blog");
            }
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Manage Blogs</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Create, edit, and publish blog posts.
                    </p>
                </div>
                <Link
                    href="/dashboard/admin/blogs/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <span className="material-icons-outlined text-sm">add</span>
                    Add New Post
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full" />
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No blogs found. Click "Add New Post" to create one.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Title</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {blogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium truncate max-w-xs">{blog.title}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{blog.slug}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">{blog.category}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${blog.status === "published"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                    }`}
                                            >
                                                {blog.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/dashboard/admin/blogs/edit/${blog._id}`}
                                                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                    title="Edit"
                                                >
                                                    <span className="material-icons-outlined text-lg">edit</span>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(blog._id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <span className="material-icons-outlined text-lg">delete</span>
                                                </button>
                                                <Link
                                                    href={`/blog/${blog.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                                    title="View"
                                                >
                                                    <span className="material-icons-outlined text-lg">visibility</span>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
