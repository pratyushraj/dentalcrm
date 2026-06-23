import React from 'react';
import { getInitials } from '../helpers';

interface AvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md';
  profilePhoto?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  color,
  size = 'md',
  profilePhoto,
}) => {
  const dim = size === 'sm' ? 'w-10 h-10 text-[12px]' : 'w-12 h-12 text-[14px]';
  if (profilePhoto) {
    return (
      <div className={`${dim} rounded-full overflow-hidden flex-shrink-0 border border-slate-200 bg-neutral-900`}>
        <img src={profilePhoto} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
      style={{ background: `${color}22`, border: `1px solid ${color}44`, color }}
    >
      {getInitials(name)}
    </div>
  );
};
