import Image from "next/image";
import React from "react";

interface Inquiry {
  property: {
    name: string;
    imageUrl: string;
  };
  agent: string;
  date: string;
  status: string;
  statusBg: string;
  statusColor: string;
  statusBorder: string;
}

const InquiryTable: React.FC<{ inquiries: Inquiry[] }> = ({ inquiries }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-soft dark:shadow-premium border border-neutral-subtle dark:border-slate-800 overflow-x-auto transition-colors">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-text-muted dark:text-slate-400 uppercase bg-gray-50 dark:bg-slate-800/50 border-b border-neutral-subtle dark:border-slate-800 transition-colors">
          <tr>
            <th className="px-6 py-4 font-medium" scope="col">
              Property
            </th>
            <th className="px-6 py-4 font-medium" scope="col">
              Agent
            </th>
            <th className="px-6 py-4 font-medium" scope="col">
              Date
            </th>
            <th className="px-6 py-4 font-medium" scope="col">
              Status
            </th>
            <th className="px-6 py-4 font-medium text-right" scope="col">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry, index) => (
            <tr
              key={index}
              className={`bg-white dark:bg-slate-900 ${index !== inquiries.length - 1
                  ? "border-b border-neutral-subtle dark:border-slate-800"
                  : ""
                } hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors`}
            >
              <td className="px-6 py-4 font-medium text-primary dark:text-blue-400">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-slate-700 overflow-hidden shrink-0 transition-colors">
                    <Image
                      alt={inquiry.property.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover"
                      src={inquiry.property.imageUrl}
                    />
                  </div>
                  <span className="text-text-main dark:text-white transition-colors">{inquiry.property.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-text-muted dark:text-slate-400">{inquiry.agent}</td>
              <td className="px-6 py-4 text-text-muted dark:text-slate-400">{inquiry.date}</td>
              <td className="px-6 py-4">
                <span
                  className={`${inquiry.statusBg} ${inquiry.statusColor} dark:opacity-90 dark:bg-opacity-20 text-xs font-medium px-2.5 py-0.5 rounded border ${inquiry.statusBorder} dark:border-opacity-30 transition-all`}
                >
                  {inquiry.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-primary dark:text-blue-400 hover:text-primary/70 dark:hover:text-blue-300 font-medium transition-colors">
                  {inquiry.status === "Responded" ? "Reply" : "View"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InquiryTable;
