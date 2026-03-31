"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/hooks/useSocket";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { 
    Search, 
    Send, 
    MoreVertical, 
    ArrowLeft, 
    Loader2, 
    MessageSquare,
    Circle,
    CheckCheck,
    Sidebar as SidebarIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function MessagesPage() {
    const { data: session } = useSession();
    const { connected, joinRoom, sendMessage, onMessage } = useSocket();
    const searchParams = useSearchParams();
    const initialChatId = searchParams.get("chat");

    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch("/api/messages/conversations");
                const data = await res.json();
                if (data.conversations) {
                    setConversations(data.conversations);
                    
                    if (initialChatId) {
                        const chat = data.conversations.find((c: any) => c._id === initialChatId);
                        if (chat) setSelectedChat(chat);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch conversations", error);
            } finally {
                setLoadingConversations(false);
            }
        };

        if (session) fetchConversations();
    }, [session, initialChatId]);

    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChat) return;
            setLoadingMessages(true);
            try {
                const res = await fetch(`/api/messages/${selectedChat._id}`);
                const data = await res.json();
                if (data.messages) {
                    setMessages(data.messages);
                }
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setLoadingMessages(false);
            }
        };

        if (selectedChat) {
            fetchMessages();
            joinRoom(selectedChat._id);
        }
    }, [selectedChat, joinRoom]);

    // Socket listener
    useEffect(() => {
        if (!onMessage) return;
        
        const cleanup = onMessage((data: any) => {
            if (selectedChat && data.conversationId === selectedChat._id) {
                setMessages((prev) => {
                    const exists = prev.some(m => m._id === data._id);
                    if (exists) return prev;
                    return [...prev, data];
                });
            }
            
            setConversations((prev) => 
                prev.map((c) => 
                    c._id === data.conversationId 
                        ? { ...c, lastMessage: data, updatedAt: new Date() } 
                        : c
                ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            );
        });

        return cleanup;
    }, [onMessage, selectedChat, session?.user?.id]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = newMessage.trim();
        if (!text || !selectedChat || !session) return;

        setNewMessage("");

        try {
            const res = await fetch(`/api/messages/${selectedChat._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            const data = await res.json();
            
            if (res.ok && data.message) {
                setMessages((prev) => [...prev, data.message]);
                if (connected) {
                    sendMessage({
                        ...data.message,
                        conversationId: selectedChat._id,
                    });
                }
            } else {
                toast.error(data.error || "Failed to send message");
                setNewMessage(text);
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
            setNewMessage(text);
        }
    };

    const getOtherParticipant = (participants: any[]) => {
        return participants.find((p: any) => p._id !== session?.user?.id);
    };

    const filteredConversations = useMemo(() => {
        return conversations.filter(c => {
            const other = getOtherParticipant(c.participants);
            return other?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [conversations, searchTerm, session]);

    return (
        <div className="flex min-h-screen mx-auto overflow-hidden bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50">
            {/* Conversations Sidebar */}
            <aside className={`w-full md:w-96 flex-shrink-0 border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">Messages</h1>
                        <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
                            <motion.div 
                                animate={{ scale: connected ? [1, 1.2, 1] : 1 }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-slate-400'}`} 
                            />
                            <span className={`text-[10px] font-bold ${connected ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {connected ? 'LIVE' : 'OFFLINE'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100/50 dark:bg-slate-900/50 border-none rounded-2xl pl-10 pr-4 py-2.5 text-sm ring-1 ring-slate-200/50 dark:ring-slate-800/50 focus:ring-2 focus:ring-sky-500 transition-all outline-hidden dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4">
                    {loadingConversations ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-3">
                            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                            <p className="text-xs text-slate-400">Loading inbox...</p>
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2 opacity-60">
                            <MessageSquare className="w-10 h-10 text-slate-300" />
                            <p className="text-sm text-slate-500">No chats found</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredConversations.map((c) => {
                                const other = getOtherParticipant(c.participants);
                                const isActive = selectedChat?._id === c._id;
                                return (
                                    <motion.div
                                        key={c._id}
                                        layoutId={c._id}
                                        onClick={() => setSelectedChat(c)}
                                        className={`group relative flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                                            isActive 
                                                ? 'bg-sky-500 shadow-xl shadow-sky-500/25 -translate-y-[2px]' 
                                                : 'hover:bg-slate-100 dark:hover:bg-slate-900'
                                        }`}
                                    >
                                        <div className="relative shrink-0">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/20 shadow-sm">
                                                {other?.image ? (
                                                    <Image src={other.image} alt={other.name || "User"} fill className="object-cover" />
                                                ) : (
                                                    <div className={`w-full h-full flex items-center justify-center font-bold text-base ${isActive ? 'bg-sky-400 text-white' : 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'}`}>
                                                        {other?.name?.charAt(0) || "?"}
                                                    </div>
                                                )}
                                            </div>
                                            {connected && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-md" />}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-0.5">
                                                <p className={`text-[13px] font-bold truncate ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                                    {other?.name || "Unknown User"}
                                                </p>
                                                <p className={`text-[9px] font-medium shrink-0 ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                                                    {c.lastMessage ? format(new Date(c.lastMessage.createdAt), "HH:mm") : ""}
                                                </p>
                                            </div>
                                            <p className={`text-[12px] truncate leading-tight ${isActive ? 'text-sky-50/80' : 'text-slate-500 dark:text-slate-400'}`}>
                                                {c.lastMessage?.text || "Started a conversation"}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </aside>

            {/* Chat Area */}
            <main className={`flex-1 flex flex-col relative ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                {selectedChat ? (
                    <>
                        {/* Header */}
                        <header className="px-6 py-4 flex items-center justify-between bg-white/50 dark:bg-slate-950/50 border-b border-slate-200/50 dark:border-slate-800/50">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setSelectedChat(null)}
                                    className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                                </button>
                                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm relative">
                                    {getOtherParticipant(selectedChat.participants)?.image ? (
                                        <Image src={getOtherParticipant(selectedChat.participants).image} alt="Avatar" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-sky-100 text-sky-600 font-bold text-sm">
                                            {getOtherParticipant(selectedChat.participants)?.name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="leading-tight">
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        {getOtherParticipant(selectedChat.participants)?.name}
                                    </h2>
                                    <div className="flex items-center gap-1.5">
                                        <Circle className={`w-1.5 h-1.5 fill-current ${connected ? 'text-emerald-500' : 'text-slate-400'}`} />
                                        <span className="text-[10px] text-slate-500 font-medium">{connected ? 'Active now' : 'Connecting...'}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-slate-400">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </header>

                        {/* Message Feed */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 dark:bg-slate-900/10">
                            <AnimatePresence mode="popLayout">
                                {messages.map((m, i) => {
                                    const senderId = typeof m.sender === 'object' ? m.sender._id : m.sender;
                                    const isMe = senderId === session?.user?.id;
                                    return (
                                        <motion.div 
                                            key={m._id || i}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`group relative max-w-[80%] md:max-w-[65%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
                                                <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                                    isMe 
                                                        ? 'bg-sky-500 text-white rounded-br-none font-medium' 
                                                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/50 dark:border-slate-700/50'
                                                }`}>
                                                    <p className="leading-relaxed">{m.text}</p>
                                                </div>
                                                <div className={`flex items-center gap-1.5 text-[10px] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    <span className="text-slate-400 font-medium">
                                                        {format(new Date(m.createdAt), "HH:mm")}
                                                    </span>
                                                    {isMe && <CheckCheck className="w-3 h-3 text-sky-500" />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50">
                            <form 
                                onSubmit={handleSendMessage} 
                                className="relative flex items-center gap-3 bg-slate-100/50 dark:bg-slate-900/50 p-2 rounded-2xl ring-1 ring-slate-200/50 dark:ring-slate-800/50 focus-within:ring-2 focus-within:ring-sky-500 transition-all"
                            >
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Write your message..."
                                    className="flex-1 bg-transparent border-none px-4 py-2 text-sm outline-hidden dark:text-white placeholder:text-slate-400"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="shrink-0 w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:shadow-none transition-all"
                                >
                                    <Send className="w-5 h-5" />
                                </motion.button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                        >
                            <div className="w-32 h-32 rounded-3xl bg-linear-to-tr from-sky-500/20 to-emerald-500/20 flex items-center justify-center shadow-inner">
                                <MessageSquare className="w-12 h-12 text-sky-500" />
                            </div>
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center"
                            >
                                <CheckCheck className="text-emerald-500" />
                            </motion.div>
                        </motion.div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Seamless Messaging</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                                Connect with agents and property managers instantly. Select a chat from the inbox to start your conversation.
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
