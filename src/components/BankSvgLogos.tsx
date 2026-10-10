import React from 'react';
import { LENDER_BASE64_LOGOS } from './lenderLogosData';

interface BankLogoProps {
  id: string;
  className?: string;
  size?: number;
}

// Map of PayU & Flexmoney Cardless EMI and Bank Affordability Partners
const BANK_LOGOS: Record<string, { src: string; fallback: string; name: string }> = {
  // Infrastructure Gateways
  payu: {
    src: '/assets/payu_logo.svg',
    fallback: '/assets/payu_logo.png',
    name: 'PayU Affordability',
  },
  flexmoney: {
    src: '/assets/flexmoney_logo.png',
    fallback: 'https://flexmoney.in/logo.png',
    name: 'Flexmoney InstaCred',
  },
  // PayU & Flexmoney Cardless EMI Lenders
  fibe: {
    src: '/assets/lenders/fibe.png',
    fallback: 'https://icon.horse/icon/fibe.in',
    name: 'FIBE',
  },
  axio: {
    src: '/assets/lenders/axio.png',
    fallback: 'https://icon.horse/icon/axio.co.in',
    name: 'Axio (ZestMoney)',
  },
  cashe: {
    src: '/assets/lenders/cashe.png',
    fallback: 'https://icon.horse/icon/cashe.co.in',
    name: 'CASHe',
  },
  kreditbee: {
    src: '/assets/lenders/kreditbee.png',
    fallback: 'https://icon.horse/icon/kreditbee.in',
    name: 'KreditBee',
  },
  tvs: {
    src: '/assets/lenders/tvs.png',
    fallback: 'https://icon.horse/icon/tvscredit.com',
    name: 'TVS Credit',
  },
  homecredit: {
    src: '/assets/lenders/homecredit.png',
    fallback: 'https://icon.horse/icon/homecredit.co.in',
    name: 'Home Credit',
  },
  lazypay: {
    src: '/assets/lenders/lazypay.png',
    fallback: 'https://icon.horse/icon/lazypay.in',
    name: 'LazyPay',
  },
  idfc: {
    src: '/assets/lenders/idfc.png',
    fallback: 'https://icon.horse/icon/idfcfirstbank.com',
    name: 'IDFC FIRST Bank',
  },
  icici: {
    src: '/assets/lenders/icici.png',
    fallback: 'https://icon.horse/icon/icicibank.com',
    name: 'ICICI Bank',
  },
  hdfc: {
    src: '/assets/lenders/hdfc.png',
    fallback: 'https://icon.horse/icon/hdfcbank.com',
    name: 'HDFC Bank',
  },
  kotak: {
    src: '/assets/lenders/kotak.png',
    fallback: 'https://icon.horse/icon/kotak.com',
    name: 'Kotak Bank',
  },
  axis: {
    src: '/assets/lenders/axis.png',
    fallback: 'https://icon.horse/icon/axisbank.com',
    name: 'Axis Bank',
  },
  federal: {
    src: '/assets/lenders/federal.png',
    fallback: 'https://icon.horse/icon/federalbank.co.in',
    name: 'Federal Bank',
  },
};

// Fallback: colored initials badge when image fails to load
const BG_COLORS = [
  '#004C8F','#B02A30','#97144D','#0066B2','#0B3060',
  '#ED1C24','#D94B1B','#003A70','#8B1D24','#4B286D','#1e40af',
];

const InitialsBadge: React.FC<{ name: string; size: number; className?: string }> = ({ name, size, className }) => {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const bg = BG_COLORS[name.charCodeAt(0) % BG_COLORS.length];
  return (
    <div
      className={className}
      style={{
        width: size, height: size,
        backgroundColor: bg,
        borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: Math.round(size * 0.35),
        fontWeight: 900,
        color: '#fff',
        fontFamily: 'sans-serif',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

export const BankSvgLogo: React.FC<BankLogoProps> = ({ id, className = '', size = 32 }) => {
  const normalizedId = id.toLowerCase();
  const logo = BANK_LOGOS[normalizedId];
  const base64Src = LENDER_BASE64_LOGOS[normalizedId];
  const [imgSrc, setImgSrc] = React.useState<string>(base64Src || logo?.src || '');
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const currentBase64 = LENDER_BASE64_LOGOS[normalizedId];
    if (currentBase64) {
      setImgSrc(currentBase64);
      setFailed(false);
    } else if (logo) {
      setImgSrc(logo.src);
      setFailed(false);
    }
  }, [normalizedId]);

  if (!logo || failed) {
    return <InitialsBadge name={logo?.name ?? id} size={size} className={className} />;
  }

  return (
    <img
      src={imgSrc}
      alt={`${logo.name} logo`}
      className={className}
      loading="eager"
      decoding="async"
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        borderRadius: 4,
        background: '#ffffff',
        flexShrink: 0,
        display: 'block',
      }}
      onError={() => {
        // Fall back to local file or remote fallback before initials badge
        if (imgSrc.startsWith('data:') && logo.src) {
          setImgSrc(logo.src);
        } else if (logo.fallback && imgSrc !== logo.fallback) {
          setImgSrc(logo.fallback);
        } else {
          setFailed(true);
        }
      }}
    />
  );
};

