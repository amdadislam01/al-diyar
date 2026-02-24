"use client";

export default function MessagesPage() {
    const conversations = [
        {
            id: 1,
            name: "Al-Diyar Support",
            avatar: "support_agent",
            lastMessage: "Welcome to Al-Diyar! How can we help you today?",
            time: "Just now",
            unread: 1,
            isSupport: true,
        },
    ];

    return (
        <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Messages</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Your conversations with agents and support
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Conversation list */}
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {conversations.map((c) => (
                        <div
                            key={c.id}
                            className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                        >
                            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="material-icons-outlined text-primary">{c.avatar}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{c.name}</p>
                                    <p className="text-[11px] text-slate-400 shrink-0">{c.time}</p>
                                </div>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">{c.lastMessage}</p>
                            </div>
                            {c.unread > 0 && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-bold text-white">{c.unread}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Empty state after the placeholder */}
                <div className="flex flex-col items-center gap-4 py-12 text-center px-4 border-t border-slate-50 dark:border-slate-800">
                    <span className="material-icons-outlined text-4xl text-slate-300 dark:text-slate-600">chat_bubble_outline</span>
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                        Start a conversation by booking a property visit — your agent will be able to reach out here.
                    </p>
                </div>
            </div>
        </div>
    );
}
