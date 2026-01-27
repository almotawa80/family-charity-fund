
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  colorClass: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, colorClass, subtitle }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl p-10 border border-gray-50 dark:border-gray-700 flex items-center justify-between hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-2 h-full ${colorClass.split(' ')[0]}`}></div>
      <div className="relative z-10">
        <h3 className="text-gray-400 dark:text-gray-500 font-black text-xs uppercase tracking-[0.2em] mb-3">{title}</h3>
        <div className="text-3xl font-black text-gray-800 dark:text-white mb-1">{value}</div>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 font-bold mt-2">{subtitle}</p>}
      </div>
      <div className={`p-6 rounded-3xl ${colorClass.split(' ')[0]} bg-opacity-10 dark:bg-opacity-20 group-hover:bg-opacity-20 dark:group-hover:bg-opacity-30 transition-all duration-500 transform group-hover:scale-110`}>
        <Icon className={`w-10 h-10 ${colorClass.split(' ')[1]}`} />
      </div>
    </div>
  );
};
