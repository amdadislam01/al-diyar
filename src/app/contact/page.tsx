"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Globe, MessageSquare } from "lucide-react";

const contactDetails = [
  {
    icon: Phone,
    title: "Call Us",
    detail: "+880 123 456 789",
    subDetail: "Available Mon-Fri, 9am - 6pm",
    color: "bg-blue-500",
  },
  {
    icon: Mail,
    title: "Email Us",
    detail: "aldiyarmarketplace@gmail.com",
    subDetail: "Expect a response within 24h",
    color: "bg-emerald-500",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "Gulshan 2, Dhaka 1212",
    subDetail: "Headquarters, Al-Diyar Tower",
    color: "bg-amber-500",
  },
];

const ContactPage = () => {
  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-500 pt-32 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light text-xs font-bold uppercase tracking-widest mb-6">
              Connect with us
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
              Let's Start a <span className="text-gradient">Conversation.</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Have a question about a property, or want to join our team of elite agents?
              Reach out and our specialists will be in touch shortly.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          {contactDetails.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 hover:shadow-premium transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-white mb-8 shadow-lg transition-transform group-hover:scale-110`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest">{item.title}</h3>
              <p className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">{item.detail}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">{item.subDetail}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-full"
          >
            <div className="bg-slate-900 rounded-[4rem] p-12 md:p-16 text-white h-full relative overflow-hidden flex flex-col justify-between">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <h2 className="text-4xl font-black mb-8 tracking-tighter">Why Reach Out?</h2>
                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Expert Advice</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">Consult with our property experts to find the perfect home within your budget and requirements.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                      <Globe className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Global Network</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">Access an exclusive directory of off-market properties across the most prestigious neighborhoods.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-16 mt-auto">
                <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                    <img src="https://ui-avatars.com/api/?name=Agent&background=1e40af&color=fff" alt="Agent" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Need immediate help?</p>
                    <p className="text-primary text-xs font-black uppercase tracking-widest">Chat with an expert</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-2">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all font-bold placeholder:font-normal placeholder:opacity-50"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all font-bold placeholder:font-normal placeholder:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-2">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all font-bold placeholder:font-normal placeholder:opacity-50"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-2">Matter of concern</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all font-bold appearance-none">
                  <option>Buying Property</option>
                  <option>Selling Property</option>
                  <option>Agent Partnership</option>
                  <option>General Inquiry</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-2">Message</label>
                <textarea
                  rows={6}
                  placeholder="Tell us about your requirements..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl px-6 py-4 outline-none focus:border-primary transition-all font-bold placeholder:font-normal placeholder:opacity-50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 group"
              >
                Send Message
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
