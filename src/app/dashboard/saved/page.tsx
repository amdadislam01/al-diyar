"use client";

export default function SavedListingsPage() {
    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Saved Listings</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Properties you've saved for later
                </p>
            </div>

            <div className="flex flex-col items-center gap-5 py-24 text-center">
                <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <span className="material-icons-outlined text-4xl text-red-400">favorite_border</span>
                </div>
                <div>
                    <p className="text-slate-700 dark:text-slate-200 font-semibold">No Saved Listings Yet</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
                        Browse properties and click the heart icon to save listings for quick access later.
                    </p>
                </div>
                <a
                    href="/properties"
                    className="text-sm bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                >
                    Browse Properties
                </a>
            </div>
        </div>
    );
}
