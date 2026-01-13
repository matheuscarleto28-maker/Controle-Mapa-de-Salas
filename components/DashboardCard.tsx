
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
  subtitle?: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  colorClass, 
  subtitle,
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''}`}
    >
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-2 font-medium">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
  );
};

export default DashboardCard;
