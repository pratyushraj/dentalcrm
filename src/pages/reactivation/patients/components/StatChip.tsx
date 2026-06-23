import React from 'react';

interface StatChipProps {
  label: string;
  value: number | string;
  dot?: string;
  icon?: React.ReactNode;
}

export const StatChip: React.FC<StatChipProps> = ({ label, value, dot, icon }) => (
  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
    {dot && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />}
    {icon && <span className="flex-shrink-0">{icon}</span>}
    <span className="text-slate-500 text-[12px] font-medium">{label}</span>
    <span className="text-slate-800 text-[13px] font-bold">{value}</span>
  </div>
);
