"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

import dynamic from "next/dynamic";

const ContactMap = dynamic(() => import("@/components/ContactMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-100 dark:bg-slate-900 animate-pulse flex items-center justify-center text-slate-500">Loading Map...</div>,
});

const ContactPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>();

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Message sent successfully! We will get back to you soon.", {
                    duration: 5000,
                    position: "bottom-right",
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
                reset();
            } else {
                toast.error(result.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to send message. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 pt-28 pb-20">
            <Toaster />
            <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Let's <span className="text-primary italic">Connect</span>.
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">Have a question about a property? Or want to list your sanctuary with us? Our team is ready to assist you.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {[
                                { icon: "mail", label: "Email Us", val: "contact@aldiyar.com" },
                                { icon: "phone", label: "Call Us", val: "+880 123 456 789" },
                                { icon: "location_on", label: "Our Office", val: "Gulshan-2, Dhaka, Bangladesh" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-6 group">
                                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <span className="material-icons-round">{item.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{item.label}</p>
                                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{item.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Real Map */}
                        <div className="relative h-64 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                            <ContactMap />
                            <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold shadow-sm z-[1000] pointer-events-none">Gulshan-2, Dhaka, Bangladesh</div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-slate-900 p-10 lg:p-14 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-slate-800">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Name</label>
                                    <input
                                        {...register("name", { required: "Name is required" })}
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</label>
                                    <input
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^\S+@\S+\.\S+$/,
                                                message: "Invalid email address",
                                            },
                                        })}
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Subject</label>
                                <input
                                    {...register("subject", { required: "Subject is required" })}
                                    type="text"
                                    placeholder="How can we help?"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                />
                                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message</label>
                                <textarea
                                    {...register("message", { required: "Message is required" })}
                                    rows={5}
                                    placeholder="Tell us more about your inquiry..."
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                />
                                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                            </div>

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-3xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200 dark:shadow-none"
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
