"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Search, 
  ChevronRight, 
  Filter,
  Newspaper,
  Clock
} from "lucide-react";

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
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
            <main className="grow pt-32 pb-24 md:pt-48 md:pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light text-xs font-bold uppercase tracking-widest mb-6">
                                Al-Diyar Journal
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">
                                Insights & <span className="text-primary">Inspiration.</span>
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                                Expert perspectives on real estate, design, and lifestyle to help you build your best life.
                            </p>
                        </motion.div>
                    </div>

                    {/* Filters Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 pb-8 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-tight transition-all duration-300 ${category === cat
                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105"
                                            : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        
                        <div className="relative w-full md:w-auto min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search articles..."
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-12 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Blog Grid */}
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                            >
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="space-y-6 animate-pulse">
                                        <div className="aspect-16/10 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem]" />
                                        <div className="space-y-3">
                                            <div className="h-4 w-1/4 bg-slate-100 dark:bg-slate-900 rounded-full" />
                                            <div className="h-8 w-full bg-slate-100 dark:bg-slate-900 rounded-2xl" />
                                            <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-900 rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ) : blogs.length === 0 ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-[4rem] border border-dashed border-slate-200 dark:border-slate-800"
                            >
                                <Newspaper size={48} className="mx-auto text-slate-300 mb-6" />
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No Stories Yet</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">We haven't published anything in this category yet.</p>
                                <button
                                    onClick={() => setCategory("All")}
                                    className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                >
                                    Explore all articles
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="grid"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16"
                            >
                                {blogs.map((blog, idx) => (
                                    <motion.div
                                        key={blog._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    >
                                        <Link
                                            href={`/blog/${blog.slug}`}
                                            className="group block space-y-6"
                                        >
                                            {/* Image Container */}
                                            <div className="relative aspect-16/10 overflow-hidden rounded-[3rem] shadow-premium bg-slate-100 dark:bg-slate-900">
                                                <Image
                                                    src={blog.coverImage || "/aldiyarlogo.png"}
                                                    alt={blog.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                />
                                                <div className="absolute top-6 left-6">
                                                    <span className="bg-white/90 dark:bg-black/70 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] shadow-lg dark:text-white">
                                                        {blog.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="space-y-4 px-2">
                                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={12} className="text-primary" />
                                                        {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={12} className="text-primary" />
                                                        5 min read
                                                    </div>
                                                </div>
                                                
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight line-clamp-2 dark:group-hover:text-white">
                                                    {blog.title}
                                                </h3>
                                                
                                                <p className="text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed text-sm">
                                                    {blog.excerpt}
                                                </p>

                                                <div className="pt-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm relative">
                                                            {blog.author.image ? (
                                                                <Image 
                                                                    src={blog.author.image} 
                                                                    alt={blog.author.name} 
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                                                                    <User size={16} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{blog.author.name}</span>
                                                    </div>
                                                    
                                                    <div className="w-10 h-10 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                                                        <ArrowRight size={18} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
