"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Target, Users, Landmark, Github, Linkedin } from "lucide-react";

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const stats = [
  { label: "Properties Sold", value: "2,500+" },
  { label: "Active Agents", value: "150+" },
  { label: "Satisfied Clients", value: "10k+" },
  { label: "Years Experience", value: "12+" },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To revolutionize the real estate experience through innovation, transparency, and unwavering commitment to client success.",
  },
  {
    icon: Users,
    title: "Client First",
    description: "We believe in building lasting relationships based on trust, integrity, and personalized service tailored to your unique needs.",
  },
  {
    icon: Landmark,
    title: "Excellence",
    description: "Setting the standard for premium property management and architectural distinction in every project we represent.",
  },
];

const team = [
  {
    name: "MD Amdad Islam",
    role: "Team Leader & Lead Developer",
    image: "https://i.ibb.co.com/yKfSbvJ/gig-profile.png",
    bio: "Passionate about building scalable web solutions and premium user experiences.",
    social: { github: "https://github.com/amdadislam01", linkedin: "https://www.linkedin.com/in/amdadislam01/", twitter: "https://twitter.com/amdad_vai__01" }
  },
  {
    name: "Obaidullah Miazi",
    role: "Front-end Developer",
    image: "https://i.ibb.co.com/jYt4FNb/my-pic.jpg",
    bio: "Focused on creating visually stunning and intuitive interfaces for modern platforms.",
    social: { github: "https://github.com/obaidullah-miazi-dev ", linkedin: "https://www.linkedin.com/in/obaidullah-miazi/", twitter: "https://twitter.com/Obaidullah_dev" }
  },
  {
    name: "MD. Shahidul Islam",
    role: "Front-end Developer",
    image: "https://avatars.githubusercontent.com/u/218454300?v=4",
    bio: "Expert in building robust frontends and dynamic user interfaces.",
    social: { github: "https://github.com/sohid7254", linkedin: "https://www.linkedin.com/in/shahidulislam01/", twitter: "https://twitter.com/shahidulislam01" }
  },
];

const AboutPage = () => {
  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light text-xs font-bold uppercase tracking-widest mb-6">
              Our Legacy
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">
              Redefining <span className="text-primary">Living</span> <br />
              Since 2012.
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium">
              Al-Diyar is more than a property platform. We are architects of dreams, 
              connecting people with spaces that inspire, comfort, and endure.
            </p>
          </motion.div>
        </div>

        {/* Floating Elements Background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-10/12 mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-10/12 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800">
                <Image
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                  alt="Modern Architecture"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-10 -right-10 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-premium border border-slate-100 dark:border-slate-800 max-w-[240px] hidden md:block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                    <CheckCircle2 size={24} />
                  </div>
                  <span className="font-black text-slate-900 dark:text-white">Premium Quality</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  We hand-verify every single listing for absolute peace of mind.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <span className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block">Where we started</span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
                  Crafting a New Era of <span className="text-gradient">Real Estate.</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Founded in Dhaka, Al-Diyar began with a simple observation: the real estate process was broken. 
                  Complexity, lack of transparency, and disconnected experiences were the norm. 
                  We set out to build a platform that prioritizes people over property.
                </p>
              </div>

              <div className="space-y-6 pt-4">
                {[
                  "Expert-vetted luxury properties",
                  "Blockchain-powered transaction transparency",
                  "AI-driven personal property matchmakers",
                  "Seamless end-to-end digital processing",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-bold text-sm tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 md:py-32 bg-slate-950 text-white relative">
         <div className="absolute inset-0 opacity-10">
            <div
              style={{
                backgroundImage:
                  "linear-gradient(var(--grid-color, #0ea5e9) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color, #0ea5e9) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
              className="absolute inset-0 [--grid-color:#fff]"
            />
         </div>

        <div className="max-w-10/12 mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">Our Core Foundations.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              The principles that drive every decision we make and every relationship we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] hover:bg-white/10 transition-colors group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-8 shadow-xl shadow-primary/20 transition-transform group-hover:scale-110">
                  <v.icon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-4">{v.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block">The Visionaries</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Meet Our Team.</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium">
                The talented individuals behind Al-Diyar, dedicated to redefining your property experience.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative aspect-4/5 rounded-[3rem] overflow-hidden mb-8 shadow-premium ring-1 ring-slate-100 dark:ring-slate-800 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                    <div className="flex gap-4">
                      <Link
                        href={member.social.github}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all"
                      >
                        <Github size={18} />
                      </Link>
                      <Link
                        href={member.social.linkedin}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all"
                      >
                        <Linkedin size={18} />
                      </Link>
                      <Link
                        href={member.social.twitter}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all"
                      >
                        <XIcon size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 text-center">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{member.name}</h3>
                  <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4">{member.role}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed line-clamp-2">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-primary rounded-[4rem] px-8 py-20 text-white shadow-2xl shadow-primary/30 relative overflow-hidden"
          >
            {/* Background art */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            
            <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10">Ready to find your <br /> next chapter?</h2>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <Link href={'/property'} className="bg-white text-primary px-10 py-4 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-slate-100 transition-colors shadow-lg">
                Explore Properties
              </Link>
              <Link href={'/contact'} className="bg-transparent border border-white/30 text-white px-10 py-4 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-white hover:text-primary transition-colors cursor-pointer">
                Contact Our Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
