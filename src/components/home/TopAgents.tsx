import AgentCard from "../AgentCard";

const agents = [
  {
    name: "Ahmed Al-Sayed",
    specialty: "Luxury Specialist",
    image: "https://i.pravatar.cc/300?u=ahmed",
    rating: 5,
    reviews: 48,
  },
  {
    name: "Sarah Jenkins",
    specialty: "Commercial Estates",
    image: "https://i.pravatar.cc/300?u=sarah",
    rating: 4.5,
    reviews: 32,
  },
  {
    name: "Omar Khalid",
    specialty: "Residential Expert",
    image: "https://i.pravatar.cc/300?u=omar",
    rating: 5,
    reviews: 120,
  },
  {
    name: "Layla Mahmoud",
    specialty: "Rentals & Leasing",
    image: "https://i.pravatar.cc/300?u=layla",
    rating: 4,
    reviews: 15,
  },
];

const TopAgents = () => {
  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
            Elite <span className="text-gradient">Partnership.</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            Collaborate with the most accomplished real estate professionals in
            the market. Proven expertise and unmatched dedication.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {agents.map((agent, index) => (
            <AgentCard key={index} {...agent} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopAgents;
