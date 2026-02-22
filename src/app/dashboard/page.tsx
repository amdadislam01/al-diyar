import StatCard from "@/components/dashboard/StatCard";
import MeetingItem from "@/components/dashboard/MeetingItem";
import PropertyCard from "@/components/dashboard/PropertyCard";
import InquiryTable from "@/components/dashboard/InquiryTable";

export default function Dashboard() {
  const inquiries = [
    {
      property: {
        name: "City Center Penthouse",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCGt6X4Ic4nSEv4oJHcs6_BGQxgyvlEgDVYkwzwNKMQSaCJ-kcVJShVOVkEt7sXp-YpXQ-rEiD0SpMkN7LpK5e8_RU2GAa6vWYo1MKSbMXTe9ZbY_llZKgLeZl-ziJ8BHqhssRpn4_-laWTc0OF4dJ97jfl7zxu39bfzaWSdJMj7lNgJbOWGdCRtx1q5hqufAKryO0FNXO3a8oA17kbhvtyOdkV-wnDe_lMdAC__R9hJphA84VZvXhtucQOSxcSLn7T_o0Kh6l_jbNs",
      },
      agent: "Michael Brown",
      date: "Oct 22, 2023",
      status: "Pending Reply",
      statusBg: "bg-yellow-100",
      statusColor: "text-yellow-800",
      statusBorder: "border-yellow-200",
    },
    {
      property: {
        name: "Seaside Villa",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDk7WELHgQVdclvpSheBt6xMxNC8RHw9TYaJd4fex8LdiOV5PFabnBmXl-PQgOltKrpuX2vfqRv8q9EOwulJf-bdS6qe3Wrn0kRTisN_luEJJqvC_wuVkyU9JsbL5sQf0ortQS41ihwx_dBiejoZxR6482XBUAGgV9jiGDDal-2JRQmxeydZWKaUa6TK9ydCOePkwwdX89H8T9V2KdpvZ9DpJtXJ8MvQ5VCygq_yQPcm0DXzihqiD-cLc5R2WdKTbMyCXEw4ubYyrWI",
      },
      agent: "Sarah Jenkins",
      date: "Oct 20, 2023",
      status: "Responded",
      statusBg: "bg-green-100",
      statusColor: "text-green-800",
      statusBorder: "border-green-200",
    },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-full mx-auto space-y-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Welcome back, Ahmed
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Here's what's happening with your property search today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-icons-outlined text-text-muted">
                search
              </span>
            </span>
            <input
              className="w-64 pl-10 pr-4 py-2.5 rounded-lg border-0 bg-white shadow-sm ring-1 ring-inset ring-neutral-subtle placeholder:text-text-muted focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 text-text-main"
              placeholder="Search properties, locations..."
              type="text"
            />
          </div>
          <button className="relative p-2.5 bg-white rounded-lg shadow-sm border border-neutral-subtle text-text-muted hover:text-primary transition-colors">
            <span className="material-icons-outlined">notifications</span>
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="favorite"
          iconBg="bg-primary/5"
          iconColor="text-primary"
          label="Saved Homes"
          trend="+2 this week"
          value="12"
        />
        <StatCard
          icon="calendar_today"
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          label="Scheduled Visits"
          value="3"
        />
        <StatCard
          icon="description"
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          label="Active Offers"
          trend="Pending Approval"
          trendColor="text-orange-600"
          value="1"
        />
        <StatCard
          icon="chat"
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          label="Unread Messages"
          value="5"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Your Schedule */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Your Schedule</h2>
            <a
              className="text-sm font-medium text-primary hover:underline"
              href="#"
            >
              View Calendar
            </a>
          </div>
          <div className="bg-white rounded-xl shadow-soft border border-neutral-subtle overflow-hidden">
            <MeetingItem
              date={{ day: "24", month: "Oct" }}
              status="CONFIRMED"
              statusBg="bg-green-100"
              statusColor="text-green-700"
              time="2:00 PM - 3:00 PM"
              title="Villa Tour with Sarah"
              agent={{
                imageUrl:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAPAuWxopho3HDuePL1Nq-__uaXUOz5hUdmdf653KRpLHCyi6y-otWzTaaLAzl0kgC-05WEp0ljWdT6EdJwJr40gaxRl181AmRG3kMQVV1p5_ugdH-32JI-Vdh51csiToY_mW4hGhfmU0qrUU5h6xXZqL3JV5otnbv1RCpbs0sgGeG3p6P_bKuSFyfJJ6XHUtTrEmCuZ1Aw1xPvu-XXS90-yHKQMe4VJvvIY7RpWatTfFZZAtwxQKzFsDWh5G28_3MN6mMX8-bAQt5X",
                name: "Sarah Jenkins",
                role: "Top Agent",
              }}
            />
            <MeetingItem
              date={{ day: "25", month: "Oct" }}
              status="ONLINE"
              statusBg="bg-blue-100"
              statusColor="text-blue-700"
              time="10:00 AM - 10:45 AM"
              title="Video Walkthrough"
              meetingLink
              property="Downtown Loft #402"
              type="ONLINE"
            />
            <a
              className="block p-4 text-center text-sm font-medium text-primary bg-gray-50 hover:bg-gray-100 transition-colors"
              href="#"
            >
              View Full Calendar
            </a>
          </div>
        </div>

        {/* Recommended Properties */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">
              Recommended for You
            </h2>
            <div className="flex gap-2">
              <button className="p-1 rounded-md hover:bg-neutral-subtle text-text-muted">
                <span className="material-icons-outlined">arrow_back</span>
              </button>
              <button className="p-1 rounded-md hover:bg-neutral-subtle text-text-muted">
                <span className="material-icons-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PropertyCard
              badge="NEW LISTING"
              baths={2}
              beds={2}
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCu8dipnM0OZk3PrgLGwQO9iPVrG9JmShqIZQlS5OKTe97xDXn0jrTqMNXtcBUcw7NTH97HQvW2FjCtE4dS-iVpXFeV1xtnd_NT6gUVOX70WsPb8rJ0EkMcvWAYbxWsZfoaUq-AF6bvE8u4NmSKaqJBMmOjCV03uY-xjUgpXqRAut9BPewZL8EC1xwpT9s8hj707_hvq97C9PwmOPXG9SgJMto_m51EhV66d-JMUSQwhyHTTVqAJFBWJXZurqVA24hIcfwtYmVo-Crm"
              location="Marina District, Dubai"
              price="$450,000"
              sqft="1,200"
              title="Modern Loft in Marina"
              type="Apartment"
            />
            <PropertyCard
              badge="PRICE DROP"
              badgeBg="bg-green-600"
              baths={3}
              beds={4}
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAbGfhaP1FpWjxALmYt5zGrKaJOo5EfStwLM6JOaGmJzIvMpG0uIu91GiCUQ9iEcaKMDZgWoU_mPbBzh6vN__gVw_2XIRVuAqKa8diKEiyo-Jhp8dA79CXjmSfNIHmoLPwOjDM_xXKYoqga-Dh1CdRsj9EAYR4nwa_1-Az3xz-fDmIyMh7Jo1rPpfrEY4X9xim-FLfIdShFpZ4q8GM-jUFKGxVvX1VUH5G6Fm8KX22bD53EjeZrAOqXxKVUl7RsJkMVV1D4oFmCYWDE"
              location="Green Valley, Cairo"
              price="$850,000"
              sqft="2,400"
              title="Family Home in Suburbs"
              type="House"
            />
          </div>
          {/* Promo Banner */}
          <div className="mt-6 bg-primary rounded-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">
                  Get pre-approved for a mortgage
                </h3>
                <p className="text-white/80 text-sm mt-1 max-w-md">
                  Unlock your budget and show sellers you're serious. It only
                  takes 5 minutes to get started.
                </p>
              </div>
              <button className="bg-white text-primary px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors whitespace-nowrap">
                Check Rates
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-primary">Recent Inquiries</h2>
        <InquiryTable inquiries={inquiries} />
      </div>

      <footer className="mt-12 p-6 border-t border-neutral-subtle text-center text-xs text-text-muted">
        <p>© 2023 Al-Diyar Real Estate. All rights reserved.</p>
      </footer>
    </div>
  );
}
