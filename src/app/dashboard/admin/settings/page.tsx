"use client";

import { useState } from "react";
import Image from "next/image";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [siteName, setSiteName] = useState("Al-Diyar");
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    const tabs = [
        { id: "general", label: "General", icon: "settings" },
        { id: "branding", label: "Branding", icon: "palette" },
        { id: "notifications", label: "Notifications", icon: "notifications" },
        { id: "security", label: "Security", icon: "security_update_good" },
    ];

    return (
        <div className="p-6 space-y-10 min-h-screen pb-20">
            {/* Header  */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-text-main tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                        Platform Control
                    </h1>
                    <p className="text-base text-text-muted mt-2 font-medium">
                        Configure global parameters, visual identity, and security protocols
                    </p>
                </div>

                <div className="flex bg-slate-100/80 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner backdrop-blur-sm overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-white dark:bg-primary text-primary dark:text-white shadow-md scale-[1.02] transform"
                                    : "text-text-muted hover:text-text-main hover:bg-white/40 dark:hover:bg-white/5"
                                }`}
                        >
                            <span className="material-icons-outlined text-lg">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500">
                <div className="p-8 md:p-12">
                    {activeTab === "general" && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <span className="material-icons-outlined text-primary text-2xl">tune</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-text-main">General Configuration</h2>
                                    <p className="text-sm text-text-muted font-medium">Core platform identification and status</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Site Identity</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <span className="material-icons-outlined text-slate-400 group-focus-within:text-primary transition-colors">language</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={siteName}
                                            onChange={(e) => setSiteName(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-white/5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base font-semibold"
                                            placeholder="Enter portal name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Traffic Control</label>
                                    <div className={`flex items-center gap-6 p-6 rounded-[2rem] border transition-all duration-300 ${maintenanceMode
                                            ? "bg-amber-50/50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800"
                                            : "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800"
                                        }`}>
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${maintenanceMode ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                                            }`}>
                                            <span className="material-icons-outlined text-3xl">
                                                {maintenanceMode ? "engineering" : "bolt"}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-lg font-extrabold ${maintenanceMode ? "text-amber-800 dark:text-amber-400" : "text-emerald-800 dark:text-emerald-400"}`}>
                                                {maintenanceMode ? "Maintenance Mode" : "System Live"}
                                            </p>
                                            <p className="text-xs font-medium text-text-muted mt-0.5 leading-snug">
                                                {maintenanceMode ? "Users are seeing a maintenance page" : "Platform is operational and accepting traffic"}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setMaintenanceMode(!maintenanceMode)}
                                            className={`w-16 h-8 rounded-full relative transition-all duration-500 shadow-inner ${maintenanceMode ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
                                                }`}
                                        >
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-500 ease-in-out ${maintenanceMode ? "translate-x-9" : "translate-x-1"
                                                }`}></div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-6">
                                <div className="flex items-center gap-2">
                                    <span className="h-px flex-1 bg-slate-100 dark:bg-white/5"></span>
                                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.3em] px-4">Social Ecosystem</h3>
                                    <span className="h-px flex-1 bg-slate-100 dark:bg-white/5"></span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { name: "Facebook", icon: "facebook", color: "hover:border-blue-500" },
                                        { name: "Instagram", icon: "camera_alt", color: "hover:border-pink-500" },
                                        { name: "Twitter", icon: "alternate_email", color: "hover:border-slate-800" }
                                    ].map((social) => (
                                        <div key={social.name} className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                                <span className={`material-icons-outlined text-slate-300 group-focus-within:text-text-main transition-colors text-lg`}>{social.icon}</span>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder={social.name}
                                                className={`w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/5 focus:outline-none focus:ring-4 focus:ring-slate-100 dark:focus:ring-white/5 transition-all text-sm font-semibold ${social.color}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "branding" && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                                    <span className="material-icons-outlined text-indigo-600 text-2xl">auto_fix_high</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-text-main">Visual Identity</h2>
                                    <p className="text-sm text-text-muted font-medium">Manage Al-Diyar's brand assets and style</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Main Brand Logo</label>
                                    <div className="group relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center bg-slate-50/30 dark:bg-white/5 hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer">
                                        <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl flex items-center justify-center mb-6 ring-8 ring-slate-100/50 dark:ring-white/5 group-hover:scale-110 transition-transform duration-500">
                                            <span className="material-icons-outlined text-4xl text-primary">cloud_upload</span>
                                        </div>
                                        <p className="text-lg font-extrabold text-text-main">Upload Corporate Logo</p>
                                        <p className="text-xs text-text-muted mt-2 max-w-[200px] leading-relaxed font-medium">Best results with SVG, PNG Transparent (Max. 2MB)</p>
                                        <div className="mt-8 flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Site Favicon</label>
                                    <div className="group relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center bg-slate-50/30 dark:bg-white/5 hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer">
                                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-lg flex items-center justify-center mb-6 ring-8 ring-slate-100/50 dark:ring-white/5 group-hover:scale-110 transition-transform duration-500">
                                            <span className="material-icons-outlined text-3xl text-primary">crop_original</span>
                                        </div>
                                        <p className="text-lg font-extrabold text-text-main">Update Favicon</p>
                                        <p className="text-xs text-text-muted mt-2 font-medium">Standard 32x32px .ico or .png</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "notifications" && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                                    <span className="material-icons-outlined text-amber-600 text-2xl">notifications_active</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-text-main">Global Alerts</h2>
                                    <p className="text-sm text-text-muted font-medium">Fine-tune system communication channels</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {[
                                    { title: "Smart Property Alerts", desc: "Push & Email notifications for matching property listings", icon: "explore", active: true },
                                    { title: "Escalation Protocols", desc: "Automated triggers for urgent booking requests", icon: "priority_high", active: true },
                                    { title: "Verification Queue", desc: "Admin digest for pending seller/agent credentials", icon: "verified_user", active: false }
                                ].map((n, i) => (
                                    <div key={i} className="flex items-center justify-between p-7 rounded-[2rem] bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary/20 hover:bg-white dark:hover:bg-white/[0.07] transition-all duration-300 group shadow-sm">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-105 ${n.active ? "bg-primary/10 text-primary" : "bg-slate-200 dark:bg-white/10 text-slate-400"}`}>
                                                <span className="material-icons-outlined text-2xl">{n.icon}</span>
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-text-main leading-none">{n.title}</p>
                                                <p className="text-[13px] text-text-muted mt-2 font-medium">{n.desc}</p>
                                            </div>
                                        </div>
                                        <button className={`w-14 h-7 rounded-full relative transition-all duration-300 ${n.active ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"}`}>
                                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ease-elastic ${n.active ? "translate-x-8" : "translate-x-1"}`}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center">
                                    <span className="material-icons-outlined text-rose-600 text-2xl">shield</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-text-main">Security Infrastructure</h2>
                                    <p className="text-sm text-text-muted font-medium">Protect platform data and administrative access</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-surface-dark border border-indigo-100 dark:border-indigo-900/30 shadow-xl overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                        <span className="material-icons-outlined text-8xl text-indigo-600">security</span>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                                                <span className="material-icons-outlined text-indigo-600 dark:text-indigo-400">devices</span>
                                            </div>
                                            <h4 className="text-lg font-extrabold text-indigo-900 dark:text-indigo-200">Modern Auth (MFA)</h4>
                                        </div>
                                        <p className="text-sm font-medium text-indigo-700/70 dark:text-indigo-300/60 leading-relaxed mb-8">
                                            Enforce 2FA via Authenticator Apps for all internal staff and high-tier agents to prevent unauthorized entries.
                                        </p>
                                        <button className="w-full py-4 bg-indigo-600 text-white rounded-[1.25rem] text-sm font-extrabold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:-translate-y-1 transition-all">
                                            Enable Global MFA
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-surface-dark border border-rose-100 dark:border-rose-900/30 shadow-xl overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                        <span className="material-icons-outlined text-8xl text-rose-600">block</span>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                                                <span className="material-icons-outlined text-rose-600 dark:text-rose-400">gpp_maybe</span>
                                            </div>
                                            <h4 className="text-lg font-extrabold text-rose-900 dark:text-rose-200">Network Firewall</h4>
                                        </div>
                                        <p className="text-sm font-medium text-rose-700/70 dark:text-rose-300/60 leading-relaxed mb-8">
                                            Lock dashboard access to trusted IP addresses only. Automatically blocks suspicious VPN activity.
                                        </p>
                                        <button className="w-full py-4 bg-rose-600 text-white rounded-[1.25rem] text-sm font-extrabold shadow-lg shadow-rose-200 dark:shadow-none hover:bg-rose-700 hover:-translate-y-1 transition-all">
                                            Setup IP Whitelist
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom Action Bar */}
                    <div className="mt-16 pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-rose-50 dark:bg-rose-900/10 text-rose-600">
                            <span className="material-icons-outlined text-xl">report_problem</span>
                            <p className="text-xs font-extrabold tracking-wide uppercase">Changes require re-deployment of cached assets</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="px-8 py-4 text-sm font-bold text-text-muted hover:text-text-main transition-colors">
                                Reset Defaults
                            </button>
                            <button className="group bg-primary text-white px-12 py-4 rounded-[1.5rem] font-extrabold hover:bg-primary-dark transition-all shadow-xl hover:shadow-primary/30 hover:-translate-y-1 flex items-center gap-3">
                                <span className="material-icons-outlined text-lg group-hover:rotate-12 transition-transform">save</span>
                                Update Global Policy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
