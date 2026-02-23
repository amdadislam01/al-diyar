"use client";

import React from "react";

const Loading = ({ fullScreen = false }: { fullScreen?: boolean }) => {
    const containerClasses = fullScreen
        ? "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md"
        : "flex flex-col items-center justify-center p-8 w-full h-full";

    return (
        <div className={containerClasses}>
            <div className="relative flex items-center justify-center">
                {/* Animated Rings */}
                <div className="absolute w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute w-20 h-20 border-4 border-accent/20 border-b-accent rounded-full animate-spin duration-[2s]"></div>

                {/* House Icon */}
                <div className="relative z-10 w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-premium flex items-center justify-center animate-pulse-slow">
                    <span className="material-icons-round text-primary text-3xl">domain</span>
                </div>
            </div>

            {/* Text Content */}
            <div className="mt-8 text-center space-y-2 animate-reveal">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Al-Diyar
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm animate-pulse">
                    Finding your dream home...
                </p>
            </div>

            {/* Progress Line */}
            <div className="mt-6 w-48 h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-gradient-to-r from-primary to-primary-light rounded-full animate-marquee"></div>
            </div>
        </div>
    );
};

export default Loading;
