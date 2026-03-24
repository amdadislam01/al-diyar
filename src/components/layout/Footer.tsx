"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Github, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Send,
  Code2,
  Camera,
  Globe
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 pt-24  overflow-hidden transition-colors duration-500">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-10/12 mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Info */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-premium transition-transform duration-500 group-hover:scale-110">
                <Image src="/aldiyarlogo.png" alt="Logo" width={32} height={32} className="object-contain p-1" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
                Al-Diyar
              </span>
            </Link>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 opacity-80 hover:opacity-100 transition-opacity">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm leading-relaxed">
                  Gulshan 2, Dhaka 1212<br />
                  Bangladesh
                </p>
              </div>
              <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm">+880 123 456 789</p>
              </div>
              <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm">contact@aldiyar.com</p>
              </div>
            </div>
          </div>

          {/* Sell Property */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-black text-xs mb-8 uppercase tracking-[0.2em]">
              Sell Property
            </h4>
            <ul className="space-y-5">
              {[
                { label: "How it works", href: "/sell" },
                { label: "Pricing", href: "/pricing" },
                { label: "Reviews", href: "/reviews" },
                { label: "Stories", href: "/stories" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors uppercase tracking-widest"
                  >
                    <ArrowRight className="w-0 h-4 group-hover:w-4 transition-all duration-300 opacity-0 group-hover:opacity-100 text-primary" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Buy Property */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-black text-xs mb-8 uppercase tracking-[0.2em]">
              Buy Property
            </h4>
            <ul className="space-y-5">
              {[
                { label: "Featured listings", href: "/buy" },
                { label: "Popular cities", href: "/cities" },
                { label: "Meet agents", href: "/agents" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors uppercase tracking-widest"
                  >
                    <ArrowRight className="w-0 h-4 group-hover:w-4 transition-all duration-300 opacity-0 group-hover:opacity-100 text-primary" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow us */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-black text-xs mb-8 uppercase tracking-[0.2em]">
              Connect
            </h4>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Github, href: "https://github.com/amdadislam01/al-diyar", label: "GitHub" },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all duration-300 group shadow-sm hover:shadow-md hover:-translate-y-1"
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                >
                  <social.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
              © {currentYear} Al-Diyar. All rights reserved.
            </p>
           
          </div>

          <div className="flex items-center gap-8">
            <div className="flex gap-6">
              <p className="text-xs opacity-50">
                Developed by Merge Conflict Team
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full h-56 mt-18">
         <Image 
          src="/footer-art.png" 
          alt="Technical Drawing" 
          fill
          className="object-contain object-bottom"
        />
      </div>
    </footer>
  );
};

export default Footer;
