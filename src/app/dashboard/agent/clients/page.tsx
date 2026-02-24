"use client";

import { useEffect, useState } from "react";

interface Client {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    bookingCount: number;
    lastBooking: string | null;
}

export default function AgentClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/agent/clients")
            .then((r) => r.json())
            .then((d) => setClients(d.clients ?? []))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-text-main">My Clients</h1>
                <p className="text-sm text-text-muted mt-1">
                    {clients.length > 0 ? `${clients.length} clients from your listings` : "Users who book your listings appear here"}
                </p>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
                </div>
            ) : clients.length === 0 ? (
                <div className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-16 text-center">
                    <span className="material-icons-outlined text-4xl text-emerald-400 mb-3 block">group</span>
                    <h3 className="text-lg font-semibold text-text-main mb-1">No clients yet</h3>
                    <p className="text-sm text-text-muted">Client inquiries on your listings will appear here.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {clients.map((client) => (
                        <div key={client._id}
                            className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-card">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                    <span className="text-white font-bold text-sm">{client.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-text-main">{client.name}</p>
                                    <p className="text-xs text-text-muted">{client.email}</p>
                                    {client.phone && <p className="text-xs text-text-muted">{client.phone}</p>}
                                </div>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-sm font-bold text-text-main">{client.bookingCount}</p>
                                <p className="text-xs text-text-muted">booking{client.bookingCount !== 1 ? "s" : ""}</p>
                                {client.lastBooking && (
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                        Last: {new Date(client.lastBooking).toLocaleDateString("en-US", { dateStyle: "medium" })}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
