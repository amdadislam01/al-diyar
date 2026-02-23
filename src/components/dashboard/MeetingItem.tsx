import Image from "next/image";
import React from "react";

interface MeetingItemProps {
  date: {
    month: string;
    day: string;
  };
  title: string;
  status: string;
  statusBg: string;
  statusColor: string;
  time: string;
  agent?: {
    name: string;
    role: string;
    imageUrl: string;
  };
  type?: "ONLINE" | "IN_PERSON";
  property?: string;
  meetingLink?: boolean;
}

const MeetingItem: React.FC<MeetingItemProps> = ({
  date,
  title,
  status,
  statusBg,
  statusColor,
  time,
  agent,
  type,
  property,
  meetingLink,
}) => {
  return (
    <div className="p-5 border-b border-neutral-subtle dark:border-slate-800 hover:bg-primary/5 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group">
      <div className="flex items-start gap-4">
        <div
          className={`flex flex-col items-center justify-center ${type === "ONLINE" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "bg-primary/10 dark:bg-blue-900/30 text-primary dark:text-blue-400"} rounded-lg w-14 h-14 shrink-0 transition-colors`}
        >
          <span className="text-xs font-bold uppercase">{date.month}</span>
          <span className="text-xl font-bold">{date.day}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-primary dark:text-blue-400">{title}</h4>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusBg} ${statusColor} dark:opacity-90`}
            >
              {status}
            </span>
          </div>
          <div className="flex items-center text-sm text-text-muted dark:text-slate-400 mt-1 mb-2">
            <span className="material-icons-outlined text-sm mr-1">
              {type === "ONLINE" ? "videocam" : "schedule"}
            </span>
            {time}
          </div>
          {agent && (
            <div className="flex items-center gap-2">
              <Image
                alt={agent.name}
                width={500}
                height={500}
                className="w-6 h-6 rounded-full"
                src={agent.imageUrl}
              />
              <span className="text-xs text-text-muted dark:text-slate-400">
                {agent.name} • {agent.role}
              </span>
            </div>
          )}
          {property && (
            <p className="text-xs text-text-muted dark:text-slate-400">Property: {property}</p>
          )}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {type !== "ONLINE" ? (
          <>
            <button className="flex-1 text-xs font-medium py-2 rounded-lg bg-primary dark:bg-blue-600 text-white hover:bg-primary/90 dark:hover:bg-blue-500 transition-colors">
              Get Directions
            </button>
            <button className="flex-1 text-xs font-medium py-2 rounded-lg border border-neutral-subtle dark:border-slate-700 text-text-muted dark:text-slate-400 hover:bg-neutral-subtle dark:hover:bg-slate-800 transition-colors">
              Reschedule
            </button>
          </>
        ) : (
          meetingLink && (
            <button className="w-full text-xs font-medium py-2 rounded-lg border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-1">
              <span className="material-icons-outlined text-sm">link</span>
              Copy Meeting Link
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default MeetingItem;
