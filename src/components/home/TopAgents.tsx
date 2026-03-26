"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AgentCard from "../AgentCard";
import { motion } from "framer-motion";

interface Agent {
  _id: string;
  name: string;
  email: string;
  companyName?: string;
  image?: string;
}

const TopAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/agents?limit=3&sort=new");
        const data = await res.json();
        if (data.agents) {
          setAgents(data.agents);
        }
      } catch (error) {
        console.error("Failed to fetch top agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Our Agents
          </h2>
          <Link 
            href="/agents" 
            className="hidden md:block text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-6 py-2.5 rounded-full uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all transition-colors duration-300"
          >
            See more
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-900 rounded-4xl h-[400px] animate-pulse" />
            ))}
          </div>
        ) : agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {agents.map((agent, index) => (
              <motion.div
                key={agent._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AgentCard 
                  name={agent.name} 
                  image={agent.image || "/images/placeholder-agent.png"} 
                  specialty={agent.companyName || "Real Estate Expert"} 
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">No agents found.</p>
          </div>
        )}

        <Link 
          href="/agents" 
          className="md:hidden block w-full mt-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm text-center"
        >
          See more
        </Link>
      </div>
    </section>
  );
};

export default TopAgents;
