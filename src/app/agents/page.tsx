"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  country?: string;
  image?: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const countries = Array.from(new Set(agents.map((a) => a.country).filter(Boolean))) as string[];

  const filteredAgents = agents.filter((agent) => {
    const matchSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       (agent.companyName && agent.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCountry = !selectedCountry || agent.country === selectedCountry;
    return matchSearch && matchCountry;
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/agents");
        const data = await res.json();
        setAgents(data.agents || []);
      } catch (err) {
        console.error("Error fetching agents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-34 pb-20 transition-colors duration-500">
      {/* Background Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center justify-center gap-2">
            Meet Our Agents
            <span className="material-icons-round text-sky-500 text-3xl">
              verified_user
            </span>
          </h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
            Professional, verified experts ready to guide you in your property
            search and asset acquisitions.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 max-w-3xl mx-auto">
          <div className="relative w-full sm:w-2/3">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input 
              type="text" 
              placeholder="Search agents by name or company..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100/80 dark:border-slate-800 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition" 
            />
          </div>
          <div className="relative w-full sm:w-1/3">
            <select 
              value={selectedCountry} 
              onChange={e => setSelectedCountry(e.target.value)} 
              className="w-full pl-4 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-100/80 dark:border-slate-800 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-slate-800 dark:text-slate-100 appearance-none cursor-pointer transition"
            >
              <option value="">All Locations</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          ) : filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => <AgentCard key={agent._id} agent={agent} />)
          ) : (
            <p className="col-span-full text-center text-slate-500 text-sm">
              No agents match your criteria.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:border-sky-500/30 hover:shadow-sky-500/5 transition-all duration-500 group flex flex-col items-center">
      {/* Avatar Section */}
      <div className="relative w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 shadow-lg overflow-hidden group-hover:scale-105 transition-transform duration-500 group-hover:ring-4 ring-sky-500/20">
        {agent.image ? (
          <Image
            src={agent.image}
            alt={agent.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-3xl font-black uppercase">
            {agent.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Content Identity */}
      <div className="text-center mt-4 w-full flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight truncate w-full">
            {agent.name}
          </h3>
          {agent.companyName && (
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 truncate w-full">
              {agent.companyName}
            </p>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {agent.country && (
            <div className="flex items-center justify-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs font-semibold">
              <span className="material-icons-round text-sky-500 text-sm">
                location_on
              </span>
              {agent.country}
            </div>
          )}
          <div className="flex items-center justify-center gap-1">
            <span className="inline-block text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 mt-6 pt-5 flex justify-center gap-3 w-full">
        <a
          href={`mailto:${agent.email}`}
          className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 text-slate-600 dark:text-slate-400 transition-all duration-300 flex items-center justify-center hover:scale-110 shadow-sm"
          title="Send Email"
        >
          <span className="material-icons-round text-lg">mail</span>
        </a>
        {agent.phone && (
          <a
            href={`tel:${agent.phone}`}
            className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 text-slate-600 dark:text-slate-400 transition-all duration-300 flex items-center justify-center hover:scale-110 shadow-sm"
            title="Call Agent"
          >
            <span className="material-icons-round text-lg">phone</span>
          </a>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100/80 dark:border-slate-800 shadow-xl animate-pulse flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-2/3 mt-5" />
      <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-full w-1/3 mt-2" />
      <div className="h-2 bg-slate-100 dark:bg-slate-800/60 rounded-full w-1/2 mt-4" />
      <div className="border-t border-slate-100 dark:border-slate-800/80 w-full mt-6 pt-5 flex justify-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}
