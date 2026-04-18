"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop",
    text: "Working with this team was a pleasure. They understood our needs and helped us find a property that so exceeded our expectations. We couldn't have done it without them!",
    author: "Martha M.D.",
    role: "CEO of Airbnb",
    rating: 5,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    text: "The most transparent real estate marketplace I've ever used. The AI recommendations were spot on, and the closing process was completely seamless.",
    author: "Jack Dorsey",
    role: "Founder of Twitter",
    rating: 5,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    text: "Experience and professionalism at its best. Al-Diyar helped me secure a prime commercial location in record time. Highly recommended for serious investors.",
    author: "Sarah Jenkins",
    role: "Real Estate Investor",
    rating: 5,
  },
];

const ClientsTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, 8000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, nextSlide]);

  const handleManualNav = (action: () => void) => {
    setIsAutoPlaying(false);
    action();
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  return (
    <section className="relative py-28 md:py-40 bg-white dark:bg-background-dark overflow-hidden transition-colors duration-500">
      {/* ─── Architectural Decorations ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
        
        {/* Subtle grid accent */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] dark:opacity-[0.04]" 
             style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-light font-bold text-xs uppercase tracking-[0.3em] mb-4"
          >
            Testimonials
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            Trusted by the <span className="text-slate-400 dark:text-slate-500 font-light">Industry Leaders.</span>
          </motion.h2>
        </div>

        {/* Main Testimonial Card */}
        <div className="relative min-h-[450px] flex flex-col items-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={{
                enter: (direction: number) => ({ opacity: 0, y: 20, scale: 0.98 }),
                center: { opacity: 1, y: 0, scale: 1 },
                exit: (direction: number) => ({ opacity: 0, y: -20, scale: 0.98 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center text-center"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-10">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className="fill-primary-light text-primary-light" 
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium text-slate-800 dark:text-slate-200 leading-[1.4] mb-12 max-w-4xl tracking-tight">
                "{testimonials[currentIndex].text}"
              </blockquote>

              {/* Author */}
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 mb-6 group">
                  <div className="absolute inset-0 rounded-full border-2 border-slate-100 dark:border-slate-800 scale-110 group-hover:scale-125 transition-transform duration-500" />
                  <div className="relative h-full w-full rounded-full overflow-hidden shadow-lg border border-white dark:border-slate-700">
                    <Image
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].author}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
                  {testimonials[currentIndex].author}
                </h4>
                <p className="text-slate-500 dark:text-slate-500 text-sm font-semibold uppercase tracking-wider">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
            <button
              onClick={() => handleManualNav(prevSlide)}
              className="pointer-events-auto h-14 w-14 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary-light hover:border-primary-light dark:hover:border-primary-light transition-all duration-300 -translate-x-4 md:-translate-x-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => handleManualNav(nextSlide)}
              className="pointer-events-auto h-14 w-14 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary-light hover:border-primary-light dark:hover:border-primary-light transition-all duration-300 translate-x-4 md:translate-x-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="mt-16 flex justify-center gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
              className="group relative h-1.5 transition-all duration-500 ease-out"
              style={{ width: index === currentIndex ? "40px" : "12px" }}
            >
              <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                index === currentIndex 
                  ? "bg-primary-light" 
                  : "bg-slate-200 dark:bg-slate-800 group-hover:bg-slate-300 dark:group-hover:bg-slate-700"
              }`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsTestimonials;
