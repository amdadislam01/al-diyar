"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import PropertyCard from "@/components/PropertyCard";

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  country?: string;
  image?: string;
}

export default function AgentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const res = await fetch(`/api/agents/${id}`);
        if (!res.ok) throw new Error("Agent not found");
        
        const data = await res.json();
        if (data.agent) {
          setAgent(data.agent);
          setListings(data.listings || []);
        }
      } catch (error) {
        console.error("Failed to fetch agent details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAgentDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-slate-50 dark:bg-slate-950 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Agent Not Found</h2>
        <Link href="/agents" className="text-primary hover:underline">Return to Agents List</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Agent Profile Header */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-premium border border-slate-100 dark:border-slate-800 mb-16 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="w-48 h-48 md:w-56 md:h-56 shrink-0 relative rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-950 shadow-xl z-10 transition-transform duration-500 hover:scale-105">
            <Image
              src={agent.image || "/images/placeholder-agent.png"}
              alt={agent.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 space-y-6 z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light text-xs font-bold uppercase tracking-widest mb-4">
                Real Estate Expert
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white line-clamp-2">
                {agent.name}
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {agent.companyName || "Independent Agent"}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary">
                  <span className="material-icons-round text-lg">email</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Email</span>
                  <span className="font-semibold">{agent.email}</span>
                </div>
              </div>

              {agent.phone && (
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary">
                    <span className="material-icons-round text-lg">phone</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Phone</span>
                    <span className="font-semibold">{agent.phone}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agent Listings */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
            Listed <span className="text-gradient">Properties</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            {listings.length} active {listings.length === 1 ? 'property' : 'properties'} managed by {agent.name.split(' ')[0]}
          </p>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing: any, index: number) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PropertyCard
                  id={listing._id}
                  title={listing.title}
                  price={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(listing.price)}
                  location={listing.location?.address || listing.country || "Location not specified"}
                  beds={listing.bedrooms || 0}
                  baths={listing.bathrooms || 0}
                  sqft={listing.size?.toLocaleString() || "0"}
                  image={listing.images?.[0] || "/images/placeholder-property.jpg"}
                  type={listing.type === "Sale" ? "For Sale" : "For Rent"}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-icons-round text-4xl text-slate-300 dark:text-slate-600">domain_disabled</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Properties Found</h3>
            <p className="text-slate-500 dark:text-slate-400">
              This agent doesn't have any active property listings at the moment.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
