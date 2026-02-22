import Image from "next/image";
import React from "react";

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-primary text-white shrink-0 h-full">
      {/* Logo */}
      <div className="flex items-center justify-start h-20 px-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="material-icons-round text-white text-xl">
              apartment
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight">Al-Diyar</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <a
          className="flex items-center px-4 py-3 text-sm font-medium bg-white/10 rounded-xl text-white group transition-colors"
          href="#"
        >
          <span className="material-icons-outlined mr-3 text-white">
            dashboard
          </span>
          Dashboard
        </a>
        <a
          className="flex items-center px-4 py-3 text-sm font-medium text-white/70 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
          href="#"
        >
          <span className="material-icons-outlined mr-3 text-white/70 group-hover:text-white">
            favorite_border
          </span>
          Saved Listings
        </a>
        <a
          className="flex items-center px-4 py-3 text-sm font-medium text-white/70 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
          href="#"
        >
          <span className="material-icons-outlined mr-3 text-white/70 group-hover:text-white">
            calendar_month
          </span>
          Scheduled Visits
        </a>
        <a
          className="flex items-center px-4 py-3 text-sm font-medium text-white/70 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
          href="#"
        >
          <span className="material-icons-outlined mr-3 text-white/70 group-hover:text-white">
            confirmation_number
          </span>
          Bookings
        </a>
        <a
          className="flex items-center justify-between px-4 py-3 text-sm font-medium text-white/70 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
          href="#"
        >
          <div className="flex items-center">
            <span className="material-icons-outlined mr-3 text-white/70 group-hover:text-white">
              chat_bubble_outline
            </span>
            Messages
          </div>
          <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            2
          </span>
        </a>
        <a
          className="flex items-center px-4 py-3 text-sm font-medium text-white/70 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
          href="#"
        >
          <span className="material-icons-outlined mr-3 text-white/70 group-hover:text-white">
            receipt_long
          </span>
          Billing
        </a>
        <a
          className="flex items-center px-4 py-3 text-sm font-medium text-white/70 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
          href="#"
        >
          <span className="material-icons-outlined mr-3 text-white/70 group-hover:text-white">
            analytics
          </span>
          Reports
        </a>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10">
        <a
          className="flex items-center px-4 py-3 text-sm font-medium text-white/70 rounded-xl hover:bg-white/5 hover:text-white transition-colors mb-2"
          href="#"
        >
          <span className="material-icons-outlined mr-3">settings</span>
          Settings
        </a>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mt-2">
          <Image
            alt="Profile"
            width={500}
            height={500}
            className="h-8 w-8 rounded-full border border-white/20"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWNQ9IPZf0tDdkFJCbncWwUFXDyC772DckSbmr38QralEuFI2mafhzQWFNwND8eXDpUyTrCnpniuXxgRlX96bPhEKq4DGNvm_dCRrIU3Kbiqu7_PUHNebuvOJyVINHBrQvxIbl-y_8-wWa-0iw55wAy2vt2HS4Esw5UPe1OkZFbm4YW-ulXL9zKEU45J4jWQ0I4sO_o_pLR4VvuDaF5XPFzoeIjsFoWaSScBwIQHCc5DzVjJAsctHzydpwXb22izqYQKoThnp3OiZU"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Ahmed Al-Sayed
            </p>
            <p className="text-xs text-white/50 truncate">Premium Buyer</p>
          </div>
          <button className="text-white/50 hover:text-white">
            <span className="material-icons-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
