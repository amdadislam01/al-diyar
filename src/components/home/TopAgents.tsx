import AgentCard from "../AgentCard";

const agents = [
  {
    name: "Samuel Iron",
    specialty: "Luxury Specialist",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Karim Reham",
    specialty: "Commercial Estates",
    image: "/images/agent_professional_2_1771612175462.png",
  },
  {
    name: "Sajid Ibrahim",
    specialty: "Residential Expert",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop",
  },
];

const TopAgents = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Our Agents
          </h2>
          <button className="hidden md:block text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-6 py-2.5 rounded-full uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
            See more
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <AgentCard key={index} {...agent} />
          ))}
        </div>

        <button className="md:hidden w-full mt-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm">
          See more
        </button>
      </div>
    </section>
  );
};

export default TopAgents;
