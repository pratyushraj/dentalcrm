import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SortField, SortDir } from '../types';

interface SortIconProps {
  field: SortField;
  active: SortField;
  dir: SortDir;
}

export const SortIcon: React.FC<SortIconProps> = ({
  field,
  active,
  dir,
}) => {
  if (active !== field)
    return (
      <span className="flex flex-col gap-[1px] opacity-25">
        <ChevronUp size={10} />
        <ChevronDown size={10} />
      </span>
    );
  return dir === 'asc' ? (
    <ChevronUp size={12} className="text-indigo-400" />
  ) : (
    <ChevronDown size={12} className="text-indigo-400" />
  );
};
