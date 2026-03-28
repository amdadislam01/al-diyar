import Image from "next/image";

interface AgentProps {
  name: string;
  specialty: string;
  image: string;
}

const AgentCard = ({ name, image }: AgentProps) => {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-4xl overflow-hidden shadow-card dark:shadow-premium hover:shadow-xl transition-all duration-500 border border-slate-100 h-full dark:border-slate-800">
      <div className="aspect-4/5 overflow-hidden">
        <Image
          src={image}
          alt={name}
          width={1000}
          height={1000}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl line-clamp-1 font-bold text-slate-900 dark:text-white mb-1">
              {name}
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
              Real estate agent
            </p>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">
              <span className="material-icons-round text-lg">public</span>
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-lg">
              <span className="material-icons-round text-lg">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
