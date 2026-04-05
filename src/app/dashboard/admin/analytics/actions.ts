"use server";

import dbConnect from "@/lib/mongodb";
import Listing from "@/models/Listing";
import User from "@/models/User";
import Booking from "@/models/Booking";

export async function getAdminAnalytics() {
    try {
        await dbConnect();

        // 1. KPI Data
        const totalUsers = await User.countDocuments();
        const totalListings = await Listing.countDocuments();
        
        // Revenue: Sum of listing prices that have been "Paid"
        const paidBookings = await Booking.find({ paymentStatus: "Paid" }).populate("listing");
        const totalRevenue = paidBookings.reduce((acc, booking: any) => {
            return acc + (booking.listing?.price || 0);
        }, 0);

        const totalBookings = await Booking.countDocuments();
        const conversionRate = totalBookings > 0 ? ((paidBookings.length / totalBookings) * 100).toFixed(1) : "0";

        // 2. User Engagement (Last 7 Days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            d.setHours(0, 0, 0, 0);
            return d;
        });

        const userEngagementRaw = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: last7Days[0] }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            }
        ]);

        const userEngagementMap = new Map(userEngagementRaw.map(item => [item._id, item.count]));
        const userEngagement = last7Days.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            return userEngagementMap.get(dateStr) || 0;
        });

        // 3. Listing Distribution by Category
        const distributionRaw = await Listing.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const totalDistributionCount = distributionRaw.reduce((acc, item) => acc + item.count, 0);
        const listingDistribution = distributionRaw.map(item => ({
            label: item._id,
            value: totalDistributionCount > 0 ? Math.round((item.count / totalDistributionCount) * 100) : 0,
            color: getColorForCategory(item._id)
        })).slice(0, 3); // Top 3 categories

        // 4. Top Performing Listings (by Views)
        const topListings = await Listing.find({})
            .sort({ views: -1 })
            .limit(5)
            .select("title views images createdAt price");

        return {
            kpis: [
                { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+14.5%", icon: "payments", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
                { label: "Conversion Rate", value: `${conversionRate}%`, change: "+0.8%", icon: "trending_up", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                { label: "Total Listings", value: totalListings.toString(), change: "+5", icon: "home", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
                { label: "Active Users", value: totalUsers.toString(), change: "+12", icon: "people", color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" }
            ],
            userEngagement: userEngagement || [],
            listingDistribution: listingDistribution || [],
            topListings: (topListings || []).map(l => ({
                id: l._id?.toString() || Math.random().toString(),
                title: l.title || "Untitled Property",
                views: l.views || 0,
                change: "+12%", 
                image: (l.images && l.images.length > 0) ? l.images[0] : "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop"
            }))
        };

    } catch (error) {
        console.error("Error fetching analytics:", error);
        throw new Error("Failed to fetch analytics data");
    }
}

function getColorForCategory(category: string) {
    const colors: Record<string, string> = {
        "Residential": "bg-primary",
        "Commercial": "bg-emerald-500",
        "Land/Plots": "bg-amber-500",
        "Apartment": "bg-blue-500",
        "Villa": "bg-purple-500",
    };
    return colors[category] || "bg-slate-400";
}
