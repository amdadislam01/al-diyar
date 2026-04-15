"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

/**
 * Premium Clients Testimonials Section
 * Features:
 * - Glassmorphism card design
 * - Framer Motion transitions
 * - Interactive pagination with progress bars
 * - Dynamic background decorations
 */

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
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 1.05,
    }),
  };

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
      autoPlayRef.current = setInterval(nextSlide, 6000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, nextSlide]);

  const handleManualNav = (action: () => void) => {
    setIsAutoPlaying(false);
    action();
    // Restart auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-background-soft dark:bg-background-dark transition-colors duration-500">
      {/* ─── Background Decorations ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] aspect-square rounded-full bg-primary-light/10 dark:bg-primary/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] aspect-square rounded-full bg-primary-light/10 dark:bg-primary/10 blur-[120px] animate-pulse-slow" />
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{ 
            backgroundImage: "radial-gradient(var(--color-primary-light) 0.5px, transparent 0.5px)", 
            backgroundSize: "24px 24px" 
          }} 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-800 shadow-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary-light animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">
              Trusted Excellence
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-text-main leading-[1.1] mb-6"
            style={{ fontFamily: "'PPRightGrotesk', system-ui, sans-serif" }}
          >
            Voices of Our <span className="text-primary-light">Global Community</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-lg max-w-2xl mx-auto font-medium"
          >
            Discover why industry leaders and homeowners trust Al-Diyar for their most significant real estate investments.
          </motion.p>
        </div>

        <div className="relative group/container">
          <div className="absolute inset-0 bg-linear-to-r from-sky-500/5 to-blue-500/5 rounded-[4rem] blur-3xl -z-10 opacity-0 group-hover/container:opacity-100 transition-opacity duration-700" />
          
          <div className="bg-surface/80 dark:bg-surface-dark/60 backdrop-blur-xl rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 border border-white/50 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] relative flex flex-col lg:flex-row items-center gap-12 md:gap-20 transition-all duration-500">
            
            {/* Decorative Quote Mark */}
            <div className="absolute top-12 right-12 text-primary-light/10 dark:text-primary-light/5 pointer-events-none hidden md:block">
              <Quote size={180} strokeWidth={1.5} />
            </div>

            {/* Left Column: Image with double ring effect */}
            <div className="w-full lg:w-2/5 flex justify-center">
              <div className="relative w-full max-w-[320px] aspect-[4/5]">
                <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-primary-light/10 scale-105 rotate-3" />
                <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-slate-100 dark:border-slate-800 scale-105 -rotate-2" />
                
                <div className="relative h-full w-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl z-10 group">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.img
                      key={currentIndex}
                      custom={direction}
                      variants={{
                        enter: { opacity: 0, scale: 1.2 },
                        center: { opacity: 1, scale: 1 },
                        exit: { opacity: 0, scale: 0.9 },
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].author}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="w-full lg:w-3/5">
              <div className="relative h-auto md:min-h-[300px] flex flex-col justify-center">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                  >
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={18} 
                          className={i < testimonials[currentIndex].rating ? "fill-primary-light text-primary-light" : "text-slate-200 dark:text-slate-700"} 
                        />
                      ))}
                    </div>

                    <p className="text-2xl md:text-3xl font-medium text-text-main leading-relaxed italic mb-10">
                      "{testimonials[currentIndex].text}"
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="h-10 w-1 bg-primary-light rounded-full" />
                      <div>
                        <h4 className="text-xl md:text-2xl font-black text-text-main" style={{ fontFamily: "'PPRightGrotesk', system-ui, sans-serif" }}>
                          {testimonials[currentIndex].author}
                        </h4>
                        <p className="text-primary-light text-sm font-bold uppercase tracking-wider">
                          {testimonials[currentIndex].role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation and Progress Indicators */}
              <div className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center gap-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleManualNav(prevSlide)}
                    className="group w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-300 flex items-center justify-center text-text-muted hover:bg-primary-light hover:text-white transition-all duration-300 active:scale-90"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => handleManualNav(nextSlide)}
                    className="group w-12 h-12 rounded-full bg-text-main dark:bg-light flex items-center justify-center text-light dark:text-text-main hover:bg-primary-light dark:hover:bg-primary-light hover:text-white transition-all duration-300 shadow-xl active:scale-90"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                <div className="flex-1 flex gap-3 w-full sm:w-auto">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                        setIsAutoPlaying(false);
                        setTimeout(() => setIsAutoPlaying(true), 10000);
                      }}
                      className="relative h-1 flex-1 bg-surface-100 dark:bg-surface-300 rounded-full overflow-hidden group/dot"
                    >
                      <motion.div 
                        initial={false}
                        animate={{ 
                          width: index === currentIndex ? "100%" : "0%",
                          transition: { duration: index === currentIndex && isAutoPlaying ? 6 : 0.4, ease: "linear" }
                        }}
                        className={`absolute inset-0 bg-primary-light rounded-full`}
                      />
                      {index === currentIndex && !isAutoPlaying && (
                        <div className="absolute inset-0 bg-primary-light" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsTestimonials;
