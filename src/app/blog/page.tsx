"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    category: string;
    author: { name: string; image: string };
    createdAt: string;
}

export default function BlogListingPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("All");

    const categories = ["All", "Real Estate", "Home Decor", "Market Trends", "Investment", "Lifestyle"];

    useEffect(() => {
        fetchBlogs();
    }, [category]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/blogs?category=${category}`);
            const data = await res.json();
            if (res.ok) {
                setBlogs(data.blogs);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            <Navbar />

            <main className="grow pt-32 pb-20">
                <div className="max-w-10/12 mx-auto px-6 lg:px-10">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                            Insights & Guides
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400">
                            Expert advice, local market updates, and home improvement tips from the Al-Diyar team.
                        </p>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${category === cat
                                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Blog Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-pulse">
                                    <div className="aspect-video bg-slate-200 dark:bg-slate-800" />
                                    <div className="p-6 space-y-4">
                                        <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded" />
                                        <div className="h-6 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                                        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                            <span className="material-icons-outlined text-5xl text-slate-300 mb-4">article</span>
                            <p className="text-lg text-slate-500 dark:text-slate-400">No articles found in this category.</p>
                            <button
                                onClick={() => setCategory("All")}
                                className="mt-4 text-primary font-bold hover:underline"
                            >
                                View all articles
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog) => (
                                <Link
                                    key={blog._id}
                                    href={`/blog/${blog.slug}`}
                                    className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <Image
                                            src={blog.coverImage || "/aldiyarlogo.png"}
                                            alt={blog.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider shadow-sm">
                                                {blog.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                            <div className="flex items-center gap-1">
                                                <span className="material-icons-outlined text-sm">calendar_today</span>
                                                {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                            {blog.excerpt}
                                        </p>

                                        <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
                                                    {blog.author.image ? (
                                                        <Image src={blog.author.image} alt={blog.author.name} width={32} height={32} />
                                                    ) : (
                                                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                            <span className="material-icons-outlined text-sm">person</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{blog.author.name}</span>
                                            </div>
                                            <span className="material-icons-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
