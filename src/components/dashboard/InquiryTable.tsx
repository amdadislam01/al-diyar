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
    <div className="bg-white rounded-xl shadow-soft border border-neutral-subtle overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-text-muted uppercase bg-gray-50 border-b border-neutral-subtle">
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
              className={`bg-white ${
                index !== inquiries.length - 1
                  ? "border-b border-neutral-subtle"
                  : ""
              } hover:bg-gray-50 transition-colors`}
            >
              <td className="px-6 py-4 font-medium text-primary">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                    <Image
                      alt={inquiry.property.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover"
                      src={inquiry.property.imageUrl}
                    />
                  </div>
                  <span>{inquiry.property.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-text-muted">{inquiry.agent}</td>
              <td className="px-6 py-4 text-text-muted">{inquiry.date}</td>
              <td className="px-6 py-4">
                <span
                  className={`${inquiry.statusBg} ${inquiry.statusColor} text-xs font-medium px-2.5 py-0.5 rounded border ${inquiry.statusBorder}`}
                >
                  {inquiry.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-primary hover:text-primary/70 font-medium">
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
