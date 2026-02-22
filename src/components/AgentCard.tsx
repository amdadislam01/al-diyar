interface AgentProps {
  name: string;
  specialty: string;
  image: string;
  reviews: number;
  rating: number;
}

const AgentCard = ({ name, specialty, image, reviews, rating }: AgentProps) => {
  return (
    <div className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-premium hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800/50 hover:-translate-y-2">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
        <img
          src={image}
          alt={name}
          className="relative w-28 h-28 rounded-full mx-auto object-cover ring-4 ring-white dark:ring-slate-800 shadow-xl"
        />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
          Top Producer
        </div>
      </div>

      <div className="text-center space-y-1 mb-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-accent transition-colors">
          {name}
        </h3>
        <p className="text-accent text-[10px] font-bold uppercase tracking-widest">
          {specialty}
        </p>
      </div>

      <div className="flex items-center justify-center gap-1.5 mb-8">
        <div className="flex items-center gap-0.5 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="material-icons-round text-sm">
              {i < Math.floor(rating)
                ? "star"
                : i < rating
                  ? "star_half"
                  : "star_border"}
            </span>
          ))}
        </div>
        <span className="text-slate-400 dark:text-slate-600 text-[10px] font-bold">
          ({reviews})
        </span>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-accent hover:text-white text-slate-900 dark:text-white rounded-xl text-xs font-bold transition-all">
          Profile
        </button>
        <button className="w-12 h-11 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-xl flex items-center justify-center transition-all">
          <span className="material-icons-round text-lg">chat_bubble</span>
        </button>
      </div>
    </div>
  );
};

export default AgentCard;
