"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface BookingFormProps {
  listingId: string;
  listingTitle: string;
}

export default function BookingForm({ listingId, listingTitle }: BookingFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please login to schedule a visit");
      router.push("/auth/signin");
      return;
    }

    if (!visitDate) {
      toast.error("Please select a visit date");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          visitDate,
          message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Visit requested successfully!");
        setVisitDate("");
        setMessage("");
        // Optionally redirect to dashboard
        router.push("/dashboard/user/bookings");
      } else {
        toast.error(data.message || "Failed to schedule visit");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-6 flex items-center gap-2">
        <span className="material-icons-round text-sky-500">event</span>
        Schedule a Visit
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="visitDate" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
            Preferred Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="visitDate"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-sky-500 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all text-sm font-semibold text-slate-900 dark:text-white appearance-none"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 pointer-events-none">
              calendar_today
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
            Custom Message (Optional)
          </label>
          <textarea
            id="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell the seller about your interest..."
            className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-sky-500 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all text-sm font-semibold text-slate-900 dark:text-white resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 sm:py-5 rounded-2xl bg-sky-500 text-white font-black uppercase tracking-widest text-xs sm:text-sm hover:bg-sky-600 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none disabled:translate-y-0"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span className="material-icons-round text-base">book_online</span>
              Request Visit
            </>
          )}
        </button>
      </form>
      
      <p className="mt-4 text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-[0.1em] text-center px-4">
        You will be notified once the seller confirms your request
      </p>
    </div>
  );
}
