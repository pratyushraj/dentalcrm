import React from 'react';

interface BankLogoProps {
  id: string;
  className?: string;
  size?: number;
}

export const BankSvgLogo: React.FC<BankLogoProps> = ({ id, className = '', size = 32 }) => {
  switch (id.toLowerCase()) {
    case 'hdfc':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#004C8F" />
          <rect x="8" y="8" width="32" height="32" rx="4" fill="#ED232A" />
          <rect x="14" y="14" width="20" height="20" fill="#004C8F" />
          <path d="M20 20H28V28H20V20Z" fill="white" />
          <path d="M22 10H26V38H22V10Z" fill="white" />
          <path d="M10 22H38V26H10V22Z" fill="white" />
        </svg>
      );

    case 'icici':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#B02A30" />
          <circle cx="24" cy="24" r="14" fill="#F37021" />
          <path d="M19 16C23.5 14 31 17 31 23C31 29 25 33 20 31" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="24" cy="24" r="3" fill="white" />
        </svg>
      );

    case 'axis':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#97144D" />
          <path d="M24 10L36 34H28.5L24 24.5L19.5 34H12L24 10Z" fill="white" />
          <path d="M24 16L30.5 30H26L24 25.5L22 30H17.5L24 16Z" fill="#97144D" />
        </svg>
      );

    case 'bajaj':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#0066B2" />
          <path d="M12 28L20 16H24L16 28H12Z" fill="white" />
          <path d="M20 28L28 16H32L24 28H20Z" fill="#00D4B8" />
          <path d="M28 28L36 16H40L32 28H28Z" fill="white" />
          <circle cx="24" cy="33" r="2" fill="white" />
        </svg>
      );

    case 'tata':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#0B3060" />
          <path d="M14 16H34V20H26V34H22V20H14V16Z" fill="#00A3E0" />
          <path d="M16 14H32V16H16V14Z" fill="white" />
          <circle cx="24" cy="24" r="15" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
        </svg>
      );

    case 'kotak':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#ED1C24" />
          <path d="M15 16C19 16 22 20 24 24C26 28 29 32 33 32C37 32 39 29 39 25C39 21 36 18 32 18C28 18 25 22 24 24C22 26 20 30 15 30C11 30 9 27 9 23C9 19 12 16 15 16Z" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'piramal':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#D94B1B" />
          <path d="M15 14H26C30.5 14 34 17.5 34 22C34 26.5 30.5 30 26 30H20V35H15V14Z" fill="white" />
          <circle cx="24" cy="22" r="3.5" fill="#D94B1B" />
          <path d="M30 31L35 36" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'lt':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#003A70" />
          <circle cx="24" cy="24" r="14" stroke="#F6A800" strokeWidth="2.5" />
          <text x="24" y="29" fill="white" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">L&T</text>
        </svg>
      );

    case 'abcl':
    case 'aditya birla':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#8B1D24" />
          <path d="M24 12L35 34H13L24 12Z" fill="#F8A51D" />
          <path d="M24 18L31 32H17L24 18Z" fill="#E21D24" />
          <path d="M24 23L27.5 30H20.5L24 23Z" fill="#FFFFFF" />
        </svg>
      );

    case 'poonawalla':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#4B286D" />
          <circle cx="24" cy="24" r="12" fill="#E31837" />
          <path d="M18 24C18 20.7 20.7 18 24 18C27.3 18 30 20.7 30 24C30 27.3 27.3 30 24 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="24" r="2" fill="white" />
        </svg>
      );

    case 'chola':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#9B1C1C" />
          <path d="M24 14C17 14 14 18 14 24C14 30 17 34 24 34C29 34 33 31 34 27H28C27 28.5 25.5 29.5 24 29.5C20 29.5 19 26.5 19 24C19 21.5 20 18.5 24 18.5C25.5 18.5 27 19.5 28 21H34C33 17 29 14 24 14Z" fill="#FBBF24" />
        </svg>
      );

    case 'smfg':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#005A36" />
          <path d="M16 28C16 28 20 18 26 18C30 18 32 20 32 22C32 26 24 26 20 28C16 30 18 34 22 34C26 34 30 31 30 31" stroke="#84BD00" strokeWidth="3" strokeLinecap="round" />
          <circle cx="20" cy="18" r="2.5" fill="white" />
        </svg>
      );

    case 'muthoot':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#C4161C" />
          <circle cx="24" cy="24" r="13" stroke="white" strokeWidth="2" fill="#E31837" />
          <path d="M18 20C18 20 20 16 24 16C28 16 30 20 30 20C30 20 28 28 24 32C20 28 18 20 18 20Z" fill="white" />
          <circle cx="24" cy="22" r="2" fill="#C4161C" />
        </svg>
      );

    case 'incred':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#004A99" />
          <path d="M14 16H20V32H14V16Z" fill="#F47920" />
          <path d="M22 16H27L34 26V16H39V32H34L27 22V32H22V16Z" fill="white" />
        </svg>
      );

    case 'dmi':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#0B2545" />
          <rect x="14" y="14" width="7" height="20" rx="1" fill="#13997C" />
          <rect x="23" y="14" width="7" height="20" rx="1" fill="#134074" />
          <rect x="32" y="14" width="4" height="20" rx="1" fill="#8DA9C4" />
        </svg>
      );

    case 'liquiloans':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#0F7A75" />
          <path d="M16 32V16H22V27H32V32H16Z" fill="white" />
          <circle cx="28" cy="20" r="3.5" fill="#34D399" />
        </svg>
      );

    case 'dhanlift':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="48" height="48" rx="10" fill="#0867E8" />
          <path d="M16 28L24 16L32 28H16Z" fill="#10B981" />
          <path d="M20 28L24 20L28 28H20Z" fill="white" />
        </svg>
      );
  }
};
