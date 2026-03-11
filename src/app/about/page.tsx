"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const AboutPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const missionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animation
            gsap.from(".hero-content > *", {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power4.out",
            });

            gsap.from(".hero-image", {
                scale: 1.2,
                opacity: 0,
                duration: 1.5,
                ease: "power2.out",
            });

            // Mission Section Animation
            gsap.from(".mission-card", {
                scrollTrigger: {
                    trigger: ".mission-section",
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.3,
                ease: "back.out(1.7)",
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 pt-20">
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center overflow-hidden">
                <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
                    <div className="hero-content space-y-6">
                        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
                            Redefining <span className="text-primary">Luxury</span> Living.
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">At Al-Diyar, we don't just find houses; we discover sanctuaries. Our mission is to connect you with extraordinary properties that resonate with your lifestyle.</p>
                        <div className="flex gap-4">
                            <Link href={"/property"}>
                                <button className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold hover:scale-105 transition-transform">Explore Properties</button>
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                        <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" alt="Luxury Home" fill className="object-cover" />
                    </div>
                </div>
                {/* Background Decorative Element */}
                <div className="absolute top-1/2 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Properties Sold", value: "2,500+" },
                            { label: "Happy Clients", value: "1,800+" },
                            { label: "Expert Agents", value: "50+" },
                            { label: "Awards Won", value: "12" },
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <h3 className="text-4xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                                <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="mission-section py-24">
                <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Our Core Mission</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Guided by integrity and innovation, we strive to simplify the real estate journey while maintaining the highest standards of excellence.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Excellence",
                                desc: "We pursue perfection in every detail of our service and listings.",
                                icon: "verified",
                            },
                            {
                                title: "Transparency",
                                desc: "Honest communication is the foundation of every relationship we build.",
                                icon: "visibility",
                            },
                            {
                                title: "Innovation",
                                desc: "Leveraging cutting-edge technology to transform how you find home.",
                                icon: "auto_awesome",
                            },
                        ].map((card, i) => (
                            <div key={i} className="mission-card p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-shadow group">
                                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-icons-round">{card.icon}</span>
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{card.title}</h4>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Facilities Section */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Our Facilities</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Tailored experiences for every member of the Al-Diyar community.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {[
                            {
                                role: "For Buyers",
                                icon: "search",
                                features: ["AI-Powered Discovery", "Virtual Tours", "Legal Support", "Mortgage Calculators"],
                                color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
                            },
                            {
                                role: "For Agents",
                                icon: "business_center",
                                features: ["Smart CRM Tools", "Global Lead Access", "Automated Marketing", "Performance Analytics"],
                                color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600",
                            },
                            {
                                role: "For Sellers",
                                icon: "sell",
                                features: ["Free Valuation", "Professional Photography", "Direct Buyer Matching", "Secure Transactions"],
                                color: "bg-green-50 dark:bg-green-900/20 text-green-600",
                            },
                        ].map((facility, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${facility.color}`}>
                                    <span className="material-icons-round text-3xl">{facility.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{facility.role}</h3>
                                <ul className="space-y-4">
                                    {facility.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                            <span className="material-icons-round text-primary text-sm">check_circle</span>
                                            <span className="font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* User Reviews / Testimonials */}
            <section className="py-24">
                <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">What People Say</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto italic">"Al-Diyar changed how I look at real estate. The attention to detail is unmatched."</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Jenkins",
                                role: "Exclusive Member",
                                quote: "I found my dream villa in less than a week. The premium service is truly world-class.",
                                avatar: "https://i.pravatar.cc/150?u=sarah",
                            },
                            {
                                name: "David Chen",
                                role: "Luxury Seller",
                                quote: "As a seller, the visibility and serious inquiries I received through Al-Diyar were incredible.",
                                avatar: "https://i.pravatar.cc/150?u=david",
                            },
                            {
                                name: "Michael Ross",
                                role: "Partner Agent",
                                quote: "The CRM tools provided here make my workflow 10x faster. Best platform for serious agents.",
                                avatar: "https://i.pravatar.cc/150?u=michael",
                            },
                        ].map((review, i) => (
                            <div key={i} className="review-card p-10 bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] border border-transparent hover:border-primary/20 transition-all">
                                <div className="flex items-center gap-1 text-primary mb-6">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span key={s} className="material-icons-round text-sm">
                                            star
                                        </span>
                                    ))}
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-8">"{review.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-800">
                                        <Image src={review.avatar} alt={review.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-900 dark:text-white">{review.name}</h5>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{review.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-24">
                <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 dark:bg-white rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center">
                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl lg:text-5xl font-bold text-white dark:text-slate-900">Ready to find your dream sanctuary?</h2>
                            <p className="text-slate-400 dark:text-slate-500 max-w-xl mx-auto text-lg lowercase">Whether you are buying, selling, or just curious, our experts are here to guide you every step of the way.</p>
                            <Link href={"/contact"}>
                                <button className="px-10 py-4 bg-primary text-white rounded-full font-bold hover:scale-105 transition-transform">Contact Our Team</button>
                            </Link>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
