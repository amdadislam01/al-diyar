import Image from "next/image";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    await dbConnect();
    const blog = await Blog.findOne({ slug, status: "published" });

    if (!blog) {
        notFound();
    }

    // Update view count (simple background update)
    Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } }).exec().catch(() => { });

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">


            <main className="grow pt-32 pb-20">
                <article className="max-w-10/12 mx-auto px-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-widest mb-8">
                        <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                        <span className="material-icons-outlined text-sm">chevron_right</span>
                        <span className="text-slate-600 dark:text-slate-300">{blog.category}</span>
                    </div>

                    {/* Title & Meta */}
                    <header className="space-y-6 mb-12">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                                    {blog.author.image ? (
                                        <Image src={blog.author.image} alt={blog.author.name} width={48} height={48} className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <span className="material-icons-outlined text-xl">person</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">{blog.author.name}</p>
                                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mt-0.5">
                                        <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                        <span>5 min read</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
                                    <span className="material-icons-outlined text-xl">share</span>
                                </button>
                                <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
                                    <span className="material-icons-outlined text-xl">favorite_border</span>
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Cover Image */}
                    {blog.coverImage && (
                        <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl">
                            <Image
                                src={blog.coverImage}
                                alt={blog.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg prose-slate dark:prose-invert max-w-none 
            prose-headings:font-black prose-headings:tracking-tight
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-3xl prose-blockquote:border-primary prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900/50 prose-blockquote:p-6 prose-blockquote:rounded-2xl prose-blockquote:not-italic"
                    >
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </div>

                    {/* Footer / Tags */}
                    <footer className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag: string) => (
                                <span key={tag} className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-500 dark:text-slate-400">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="mt-12 bg-primary rounded-3xl p-8 md:p-12 text-center text-white space-y-6">
                            <h3 className="text-2xl md:text-3xl font-bold">Interested in learning more?</h3>
                            <p className="text-white/80 max-w-xl mx-auto">
                                Subscribe to our newsletter to receive the latest real estate tips and market updates directly in your inbox.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 focus:bg-white/20 focus:outline-none placeholder:text-white/50"
                                />
                                <button className="px-8 py-4 bg-white text-primary rounded-2xl font-bold hover:bg-slate-50 transition-colors">
                                    Join Now
                                </button>
                            </div>
                        </div>
                    </footer>
                </article>
            </main>
        </div>
    );
}
