import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendColor?: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendColor = "text-green-600",
  icon,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-soft border border-neutral-subtle flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-text-muted">{label}</p>
        <h3 className="text-3xl font-bold text-primary mt-2">{value}</h3>
        {trend && (
          <p
            className={`text-xs font-medium mt-1 flex items-center ${trendColor}`}
          >
            <span className="material-icons-round text-sm mr-1">
              trending_up
            </span>
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 ${iconBg} rounded-lg ${iconColor}`}>
        <span className="material-icons-outlined">{icon}</span>
      </div>
    </div>
  );
};

export default StatCard;
