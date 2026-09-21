import React from 'react';

interface BankLogoProps {
  id: string;
  className?: string;
  size?: number;
}

// Map of lenders with local static assets (highest reliability, no CORS/404 risk) and remote fallbacks
const BANK_LOGOS: Record<string, { src: string; fallback: string; name: string }> = {
  // Easycred 13 Multi-Lender Network
  bajaj: {
    src: '/assets/lenders/bajaj.png',
    fallback: 'https://icon.horse/icon/bajajfinserv.in',
    name: 'Bajaj Finserv',
  },
  tata: {
    src: '/assets/lenders/tata.png',
    fallback: 'https://icon.horse/icon/tatacapital.com',
    name: 'Tata Capital',
  },
  poonawalla: {
    src: '/assets/lenders/poonawalla.png',
    fallback: 'https://icon.horse/icon/poonawallafincorp.com',
    name: 'Poonawalla Fincorp',
  },
  godrej: {
    src: '/assets/lenders/godrej.png',
    fallback: 'https://icon.horse/icon/godrejcapital.com',
    name: 'Godrej Capital',
  },
  incred: {
    src: '/assets/lenders/incred.png',
    fallback: 'https://icon.horse/icon/incred.com',
    name: 'InCred Finance',
  },
  chola: {
    src: '/assets/lenders/chola.png',
    fallback: 'https://icon.horse/icon/cholamandalam.com',
    name: 'Cholamandalam',
  },
  chinmay: {
    src: '/assets/lenders/chinmay.png',
    fallback: 'https://icon.horse/icon/chinmayfinlease.com',
    name: 'Chinmay Finlease',
  },
  fibe: {
    src: '/assets/lenders/fibe.png',
    fallback: 'https://icon.horse/icon/fibe.in',
    name: 'FIBE',
  },
  faircent: {
    src: '/assets/lenders/faircent.png',
    fallback: 'https://icon.horse/icon/faircent.in',
    name: 'Faircent',
  },
  zype: {
    src: '/assets/lenders/zype.png',
    fallback: 'https://icon.horse/icon/getzype.com',
    name: 'ZYPE',
  },
  olyv: {
    src: '/assets/lenders/olyv.png',
    fallback: 'https://icon.horse/icon/olyv.in',
    name: 'OLYV',
  },
  truefund: {
    src: '/assets/lenders/truefund.png',
    fallback: 'https://icon.horse/icon/truefund.in',
    name: 'TrueFund',
  },
  mymudra: {
    src: '/assets/lenders/mymudra.png',
    fallback: 'https://icon.horse/icon/mymudra.com',
    name: 'MyMudra',
  },
  // Major Bank Co-Lending Partners
  hdfc: {
    src: '/assets/lenders/hdfc.png',
    fallback: 'https://icon.horse/icon/hdfcbank.com',
    name: 'HDFC Bank',
  },
  icici: {
    src: '/assets/lenders/icici.png',
    fallback: 'https://icon.horse/icon/icicibank.com',
    name: 'ICICI Bank',
  },
  axis: {
    src: '/assets/lenders/axis.png',
    fallback: 'https://icon.horse/icon/axisbank.com',
    name: 'Axis Bank',
  },
  kotak: {
    src: '/assets/lenders/kotak.png',
    fallback: 'https://icon.horse/icon/kotak.com',
    name: 'Kotak Bank',
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
  const logo = BANK_LOGOS[id.toLowerCase()];
  const [imgSrc, setImgSrc] = React.useState<string>(logo?.src || '');
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (logo) {
      setImgSrc(logo.src);
      setFailed(false);
    }
  }, [id]);

  if (!logo || failed) {
    return <InitialsBadge name={logo?.name ?? id} size={size} className={className} />;
  }

  return (
    <img
      src={imgSrc}
      alt={`${logo.name} logo`}
      className={className}
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
        // If local asset fails or hasn't loaded, try remote fallback once before falling back to InitialsBadge
        if (imgSrc === logo.src && logo.fallback && logo.fallback !== logo.src) {
          setImgSrc(logo.fallback);
        } else {
          setFailed(true);
        }
      }}
    />
  );
};

