"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Linkedin, Facebook, Clock, ArrowUpRight } from "lucide-react";

const channels = [
  {
    icon: Phone,
    title: "Direct Line",
    value: "+880 123 456 789",
    description: "Available Mon-Fri, 9am - 6pm",
    color: "text-blue-600",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
  },
  {
    icon: Mail,
    title: "Email Inquiry",
    value: "hello@aldiyar.com",
    description: "Response within 24 hours",
    color: "text-emerald-600",
    bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
  },
  {
    icon: MapPin,
    title: "Headquarters",
    value: "Gulshan 2, Dhaka 1212",
    description: "Al-Diyar Tower, Level 14",
    color: "text-orange-600",
    bg: "bg-orange-50/50 dark:bg-orange-950/20",
  },
];

const social = [
  { icon: Instagram, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Facebook, href: "#" },
];

const ContactPage = () => {
  return (
    <div className="bg-[#FCFCFD] dark:bg-slate-950 transition-colors duration-500 overflow-hidden font-display selection:bg-primary selection:text-white">
      
      {/* --- Premium Hero Section --- */}
      <section className="relative min-h-[85vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/contact/hero.png" 
            alt="Elite Interior" 
            className="w-full h-full object-cover grayscale-[0.3] scale-105"
          />
          {/* Layered Overlays for depth */}
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/90 backdrop-blur-[3px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 dark:via-slate-950/50 to-white dark:to-slate-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 text-primary font-bold text-xs uppercase tracking-[0.4em] mb-10">
              <span className="w-12 h-[2px] bg-primary animate-pulse" />
              Get in Touch
            </div>
            <h1 className="text-7xl md:text-[110px] font-black text-slate-900 dark:text-white mb-10 tracking-tighter leading-[0.85]">
              Elite <span className="text-primary italic font-serif">Spaces,</span> <br />
              Human <span className="underline decoration-primary/30 underline-offset-8">Connection.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-12 max-w-lg border-l-2 border-primary/20 pl-6">
              Whether you are looking for a luxury penthouse or a cozy apartment, our consultants are ready to guide you.
            </p>
            
            <div className="flex items-center gap-6">
              {social.map((item, i) => (
                <motion.a 
                  key={i}
                  href={item.href}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:text-primary transition-all"
                >
                  <item.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Main Content Section --- */}
      <div className="max-w-7xl mx-auto px-6 pb-32 relative z-20">
        
        {/* Contact Channels with Float Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 mb-40">
          {channels.map((channel, i) => (
            <motion.div
              key={channel.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/20 dark:border-white/5 group hover:-translate-y-3 transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-2xl ${channel.bg} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 ${channel.color}`}>
                <channel.icon size={28} />
              </div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{channel.title}</h3>
              <p className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors tracking-tight">{channel.value}</p>
              <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                {channel.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32 items-start">
          
          {/* Left Side: Context & Branding */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32"
          >
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-10">
              Your vision, <br />
              <span className="text-primary italic">our priority.</span>
            </h2>
            <div className="space-y-10 mb-16">
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                We believe real estate is about more than just transactions—it's about finding where your life happens. Our premium support ensures you're never left in the dark.
              </p>
              
              <div className="p-8 rounded-3xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">Priority Support</h4>
                  <p className="text-slate-500 text-sm mb-2">Our agents are online and active.</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                    Avg Response: 45 Mins
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Map Preview */}
            <div className="relative group rounded-[2.5rem] overflow-hidden aspect-video border-8 border-white dark:border-slate-900 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
                className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 transition-transform duration-1000"
                alt="Dhaka Map"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-5 h-5 bg-primary rounded-full relative z-10 shadow-[0_0_30px_rgba(30,64,175,1)]" />
                  <div className="absolute inset-0 bg-primary/40 rounded-full animate-ping" />
                </div>
              </div>
              <div className="absolute top-6 right-6">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white shadow-xl flex items-center gap-2">
                  <MapPin size={12} className="text-primary" />
                  Gulshan 2, Dhaka
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Elevated Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-900 p-8 md:p-16 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-800/50 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <div className="relative z-10">
              <div className="mb-14">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-3">Send a Message</h3>
                <p className="text-slate-500 font-medium">Tell us about your dream property.</p>
              </div>

              <form className="space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">First Name</label>
                    <input 
                      type="text" 
                      placeholder="John"
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe"
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Work Email</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Project Details</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe the property or service you're interested in..."
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] px-6 py-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-slate-900 dark:text-white resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-primary text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.3em] hover:shadow-[0_20px_40px_rgba(30,64,175,0.3)] transition-all flex items-center justify-center gap-4 group"
                >
                  Send Inquiry
                  <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </motion.button>

                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Secure & Confidential • <span className="text-slate-300">Privacy Policy</span>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;