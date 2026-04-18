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
    color: "text-primary",
    bg: "bg-slate-50 dark:bg-slate-900",
  },
  {
    icon: Mail,
    title: "Email Inquiry",
    value: "hello@aldiyar.com",
    description: "Response within 24 hours",
    color: "text-primary",
    bg: "bg-slate-50 dark:bg-slate-900",
  },
  {
    icon: MapPin,
    title: "Headquarters",
    value: "Gulshan 2, Dhaka 1212",
    description: "Al-Diyar Tower, Level 14",
    color: "text-primary",
    bg: "bg-slate-50 dark:bg-slate-900",
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
      
      {/* --- Professional Hero Section --- */}
      <section className="relative min-h-[75vh] flex items-center pt-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/contact/hero.png" 
            alt="Elite Interior" 
            className="w-full h-full object-cover"
          />
          {/* Refined Overlays */}
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/85 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 dark:from-slate-950 dark:via-slate-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 text-primary font-bold text-[10px] uppercase tracking-[0.5em] mb-8">
              <span className="w-8 h-[1px] bg-primary" />
              Contact Al-Diyar
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[0.95]">
              Let&apos;s build your <br />
              <span className="text-primary">legacy together.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-10 max-w-lg">
              Our consultants are ready to guide you through our exclusive portfolio of luxury penthouses and prime real estate.
            </p>
            
            <div className="flex items-center gap-4">
              {social.map((item, i) => (
                <motion.a 
                  key={i}
                  href={item.href}
                  whileHover={{ y: -2 }}
                  className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors"
                >
                  <item.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Main Content Section --- */}
      <div className="max-w-7xl mx-auto px-6 pb-32 relative z-20">
        
        {/* Contact Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-20 mb-32">
          {channels.map((channel, i) => (
            <motion.div
              key={channel.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-primary/30 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300 ${channel.color}`}>
                <channel.icon size={24} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">{channel.title}</h3>
              <p className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{channel.value}</p>
              <p className="text-sm text-slate-500 font-medium">
                {channel.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32 items-start">
          
          {/* Left Side: Context & Branding */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-8">
              Expertise that <br />
              <span className="text-primary">moves with you.</span>
            </h2>
            <div className="space-y-8 mb-12">
              <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                We provide bespoke real estate solutions for the discerning client. Our team ensures transparent communication and data-driven insights at every step of your journey.
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Priority Inquiries</span>
                  <span className="text-[10px] text-slate-500 font-medium">Avg Response: 45 Minutes</span>
                </div>
              </div>
            </div>

            {/* Premium Map Preview */}
            <div className="relative group rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800 shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt="Dhaka Map"
              />
              <div className="absolute inset-0 bg-slate-900/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(30,64,175,0.5)] border-2 border-white" />
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
                  <MapPin size={10} className="text-primary" />
                  Gulshan 2, Dhaka
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Elevated Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative"
          >
            <div className="relative z-10">
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Send a Message</h3>
                <p className="text-sm text-slate-500 font-medium">Connect with our specialized consultants.</p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                    <input 
                      type="text" 
                      placeholder="John"
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe"
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-slate-900 dark:text-white resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 group"
                >
                  Confirm Inquiry
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </motion.button>

                <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                  Confidential Inquiry • <span className="underline cursor-pointer">Privacy Policy</span>
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