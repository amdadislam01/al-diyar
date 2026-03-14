"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const CLOUDS = [
  // Background clouds (behind building & heading)
  {
    id: 1,
    top: "12%",
    width: "w-64 md:w-80",
    opacity: "opacity-70",
    blur: "blur-[2px]",
    speed: 75,
    startProgress: 0.1,
    yDrift: 4,
    zIndex: "z-0",
  },
  {
    id: 2,
    top: "42%",
    width: "w-80 md:w-96",
    opacity: "opacity-50",
    blur: "blur-[4px]",
    speed: 90,
    startProgress: 0.6,
    yDrift: 5,
    zIndex: "z-0",
  },
  {
    id: 3,
    top: "5%",
    width: "w-48 md:w-64",
    opacity: "opacity-60",
    blur: "blur-[1px]",
    speed: 65,
    startProgress: 0.8,
    yDrift: 3,
    zIndex: "z-0",
  },

  // Foreground clouds (in front of building, over heading)
  {
    id: 4,
    top: "25%",
    width: "w-80 md:w-[28rem]",
    opacity: "opacity-85",
    blur: "blur-0",
    speed: 50,
    startProgress: 0.3,
    yDrift: 3,
    zIndex: "z-30",
  },
  {
    id: 5,
    top: "55%",
    width: "w-60 md:w-72",
    opacity: "opacity-90",
    blur: "blur-0",
    speed: 55,
    startProgress: 0.7,
    yDrift: 2,
    zIndex: "z-30",
  },
  {
    id: 6,
    top: "14%",
    width: "w-52 md:w-64",
    opacity: "opacity-80",
    blur: "blur-[1px]",
    speed: 60,
    startProgress: 0.15,
    yDrift: 4,
    zIndex: "z-30",
  },
  {
    id: 7,
    top: "38%",
    width: "w-96 md:w-[32rem]",
    opacity: "opacity-75",
    blur: "blur-[2px]",
    speed: 70,
    startProgress: 0.9,
    yDrift: 5,
    zIndex: "z-30",
  },
];

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buildingRef = useRef<HTMLDivElement>(null);
  const statLeftRef = useRef<HTMLDivElement>(null);
  const statRightRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const mobileCountRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Heading reveal
      tl.fromTo(
        headingRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0 },
        0.2,
      );

      // 2. Building scale up
      tl.fromTo(
        buildingRef.current,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.1 },
        0.4,
      );

      // 3. Side stats fade in
      tl.fromTo(
        statLeftRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9 },
        0.7,
      );
      tl.fromTo(
        statRightRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9 },
        0.7,
      );

      // 4. Search bar elastic bounce
      tl.fromTo(
        searchRef.current,
        { y: 30, opacity: 0, scale: 0.92, xPercent: -50, left: "50%" },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "back.out(2)",
          xPercent: -50,
          left: "50%",
        },
        1.0,
      );

      // 4.1 Count-up animation
      const countTarget = { val: 0 };
      tl.to(
        countTarget,
        {
          val: 2450,
          duration: 3,
          ease: "power2.out",
          onUpdate: () => {
            const formatted = Math.floor(countTarget.val).toLocaleString();
            if (countRef.current) countRef.current.innerText = formatted + "+";
            if (mobileCountRef.current)
              mobileCountRef.current.innerText = formatted + "+";
          },
        },
        0.8,
      );

      // 5. Cloud Anti-Gravity & Marquee
      const clouds = gsap.utils.toArray<HTMLElement>(".floating-cloud");

      clouds.forEach((cloud, i) => {
        const speed = parseFloat(cloud.dataset.speed || "60");
        const progress = parseFloat(cloud.dataset.progress || "0");
        const yDrift = parseFloat(cloud.dataset.ydrift || "3");

        // Marquee (Left to Right)
        const marqueeTl = gsap.timeline({ repeat: -1 });
        marqueeTl.fromTo(
          cloud,
          { x: "-50vw" },
          { x: "120vw", duration: speed, ease: "none" },
        );
        marqueeTl.progress(progress);

        // Anti-gravity drift (Up & Down)
        gsap.fromTo(
          cloud,
          { y: -yDrift },
          {
            y: yDrift,
            duration: 3 + (i % 3),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: (i % 2) * 1.5,
          },
        );
      });

      // 6. Bird Flapping & Bobbing
      const birds = gsap.utils.toArray<HTMLElement>(".bird-group");

      birds.forEach((bird, i) => {
        const path = bird.querySelector("path");
        if (path) {
          // Wing flap (Morphing path d attribute)
          // Original: "M4 11C9 5 15 5 22 11C29 5 35 5 40 11"
          // Flap Down: "M4 11C9 17 15 17 22 11C29 17 35 17 40 11"
          gsap.to(path, {
            attr: { d: "M4 11C9 17 15 17 22 11C29 17 35 17 40 11" },
            duration: 0.4 + i * 0.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        // Body bobbing (Up/Down)
        gsap.fromTo(
          bird,
          { y: -4 },
          {
            y: 4,
            duration: 2 + i,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.5,
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-linear-to-b from-blue-50 via-blue-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20 transition-colors duration-500"
    >
      {/* ─── Background Layer ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grid Pattern */}
        <div
          style={{
            backgroundImage:
              "linear-gradient(var(--grid-color, #0ea5e9) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color, #0ea5e9) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
          className="absolute inset-0 opacity-[0.12] dark:opacity-[0.07] [--grid-color:#0ea5e9] dark:[--grid-color:#6ed1ff]"
        />

        {/* Static clouds replaced by floating marquee */}

        {/* Birds */}
        <div className="absolute top-[20%] left-[18%] opacity-30 dark:opacity-100">
          <svg
            width="44"
            height="22"
            viewBox="0 0 44 22"
            fill="none"
            className="bird-group"
          >
            <path
              d="M4 11C9 5 15 5 22 11C29 5 35 5 40 11"
              stroke="currentColor"
              className="text-sky-700 dark:text-sky-400/40"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="absolute top-[30%] right-[16%] opacity-20 scale-75 rotate-6 dark:opacity-100">
          <svg
            width="44"
            height="22"
            viewBox="0 0 44 22"
            fill="none"
            className="bird-group"
          >
            <path
              d="M4 11C9 5 15 5 22 11C29 5 35 5 40 11"
              stroke="currentColor"
              className="text-sky-700 dark:text-sky-400/40"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* ─── Page Content ─── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* ─── Floating Clouds Layer ─── */}
        <div className="absolute inset-0 pointer-events-none">
          {CLOUDS.map((cloud) => (
            <img
              key={cloud.id}
              src="/images/cloude.png"
              alt=""
              aria-hidden="true"
              className={`floating-cloud absolute ${cloud.width} ${cloud.opacity} ${cloud.blur} ${cloud.zIndex} drop-shadow-lg select-none`}
              style={{ top: cloud.top, left: "-30vw" }}
              data-speed={cloud.speed}
              data-progress={cloud.startProgress}
              data-ydrift={cloud.yDrift}
            />
          ))}
        </div>

        {/* Headline */}
        <div className="relative z-20 w-full max-w-4xl mb-10 md:mb-14">
          <h1
            ref={headingRef}
            className="text-[clamp(3rem,6vw,6rem)] md:text-[clamp(2.8rem,6vw,6rem)] text-slate-900 dark:text-white leading-[0.8] absolute top-16 md:-top-6 left-0 w-full text-center transition-colors duration-300"
            style={{
              fontFamily:
                "'PPRightGrotesk', system-ui, sans-serif",
              fontWeight: 900,
            }}
          >
            Find Your Dream Home <br className="hidden md:block" />
            Quickly with Al-Diyar
          </h1>
        </div>

        {/* ─── Central 3-column grid ─── */}
        <div className="relative w-full max-w-6xl flex items-end justify-center">
          {/* Left – Stats */}
          <div
            ref={statLeftRef}
            className="hidden lg:flex flex-col items-start gap-7 absolute left-0 bottom-44 w-72 text-left z-40"
          >
            <p className="text-slate-600 dark:text-slate-400 text-base font-medium leading-relaxed max-w-[240px] transition-colors duration-300">
              Discover homes that fit your life. Simple search, trusted
              listings, and a smarter way to find where you belong.
            </p>
            <div>
              <p className="text-6xl font-black text-slate-900 dark:text-white leading-none tracking-tighter transition-colors duration-300">
                <span ref={countRef}>0+</span>
              </p>
              <p className="text-slate-500 dark:text-slate-500 font-semibold text-xs uppercase tracking-widest mt-2 transition-colors duration-300">
                Homes Sold Last Month
              </p>
            </div>
          </div>

          {/* Center – Building with arch */}
          <div
            ref={buildingRef}
            className="relative z-10 w-full max-w-[480px] md:max-w-[560px] lg:max-w-[640px]"
          >
            {/* Arch background — full rounded top, no overflow-hidden so building can pop out */}
            {/* <div className="relative h-auto"> */}

            {/* Building image – overflows the arch top */}
            <img
              src="/images/building.png"
              alt="Premium Building"
              className="relative z-10 w-full h-[650px] object-contain drop-shadow-2xl top-26"
            />
            {/* </div> */}

            {/* Floating Search Bar */}
            <div
              ref={searchRef}
              className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 w-[92%] md:w-[110%] bg-white dark:bg-slate-900/90 rounded-full shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] p-2 flex items-center border border-slate-100/80 dark:border-slate-800 z-50 backdrop-blur-sm"
            >
              <div className="flex-1 flex items-center px-5 md:px-8">
                <input
                  type="text"
                  placeholder="City, address, School, Agent, Zip"
                  className="w-full bg-transparent border-none outline-none text-sm md:text-base font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-300 placeholder:font-normal"
                />
              </div>
              <button className="flex-none bg-slate-900 dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-200 active:scale-95 text-white dark:text-slate-900 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg m-0.5">
                <span className="material-icons-round text-xl">search</span>
              </button>
            </div>
          </div>

          {/* Right – Agents */}
          <div
            ref={statRightRef}
            className="hidden lg:flex flex-col items-end gap-5 absolute right-0 bottom-44 w-72 text-right z-40"
          >
            {/* Overlapping avatars */}
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-[3px] border-white dark:border-slate-800 overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-lg transition-colors duration-300"
                >
                  <img
                    src={`https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop`}
                    alt={`Agent`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Stars */}
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="material-icons-round text-slate-900 dark:text-sky-400 text-lg transition-colors duration-300"
                >
                  star
                </span>
              ))}
            </div>

            <div className="flex flex-col items-end gap-0.5 -mt-1">
              <span className="text-slate-900 dark:text-white font-black text-sm tracking-[0.18em] uppercase transition-colors duration-300">
                Top Rated
              </span>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-xs tracking-wide transition-colors duration-300">
                Professional Property Agents
              </p>
            </div>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Hero;
