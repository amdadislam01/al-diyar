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
    <div className="p-5 border-b border-neutral-subtle hover:bg-primary/5 transition-colors cursor-pointer group">
      <div className="flex items-start gap-4">
        <div
          className={`flex flex-col items-center justify-center ${type === "ONLINE" ? "bg-blue-50 text-blue-600" : "bg-primary/10 text-primary"} rounded-lg w-14 h-14 shrink-0`}
        >
          <span className="text-xs font-bold uppercase">{date.month}</span>
          <span className="text-xl font-bold">{date.day}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-primary">{title}</h4>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusBg} ${statusColor}`}
            >
              {status}
            </span>
          </div>
          <div className="flex items-center text-sm text-text-muted mt-1 mb-2">
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
              <span className="text-xs text-text-muted">
                {agent.name} • {agent.role}
              </span>
            </div>
          )}
          {property && (
            <p className="text-xs text-text-muted">Property: {property}</p>
          )}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {type !== "ONLINE" ? (
          <>
            <button className="flex-1 text-xs font-medium py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
              Get Directions
            </button>
            <button className="flex-1 text-xs font-medium py-2 rounded-lg border border-neutral-subtle text-text-muted hover:bg-neutral-subtle transition-colors">
              Reschedule
            </button>
          </>
        ) : (
          meetingLink && (
            <button className="w-full text-xs font-medium py-2 rounded-lg border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
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
