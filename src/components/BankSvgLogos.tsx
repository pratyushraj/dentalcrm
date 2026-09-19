import React from 'react';

interface BankLogoProps {
  id: string;
  className?: string;
  size?: number;
}

// Official brand logos via Google's S2 favicon service — no hotlink restrictions
const BANK_LOGOS: Record<string, { src: string; name: string }> = {
  // Easycred 13 Multi-Lender Network
  bajaj: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=bajajfinserv.in',
    name: 'Bajaj Finserv',
  },
  tata: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=tatacapital.com',
    name: 'Tata Capital',
  },
  poonawalla: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=poonawallafincorp.com',
    name: 'Poonawalla Fincorp',
  },
  godrej: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=godrejcapital.com',
    name: 'Godrej Capital',
  },
  incred: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=incred.com',
    name: 'InCred Finance',
  },
  chola: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=cholamandalam.com',
    name: 'Cholamandalam',
  },
  chinmay: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=chinmayfinlease.com',
    name: 'Chinmay Finlease',
  },
  fibe: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=fibe.in',
    name: 'FIBE',
  },
  faircent: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=faircent.in',
    name: 'Faircent',
  },
  zype: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=getzype.com',
    name: 'ZYPE',
  },
  olyv: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=olyv.in',
    name: 'OLYV',
  },
  truefund: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=truefund.in',
    name: 'TrueFund',
  },
  mymudra: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=mymudra.com',
    name: 'MyMudra',
  },
  // Major Bank Co-Lending Partners
  hdfc: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=hdfcbank.com',
    name: 'HDFC Bank',
  },
  icici: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=icicibank.com',
    name: 'ICICI Bank',
  },
  axis: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=axisbank.com',
    name: 'Axis Bank',
  },
  kotak: {
    src: 'https://www.google.com/s2/favicons?sz=128&domain=kotak.com',
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
  const [failed, setFailed] = React.useState(false);

  if (!logo || failed) {
    return <InitialsBadge name={logo?.name ?? id} size={size} className={className} />;
  }

  return (
    <img
      src={logo.src}
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
      onError={() => setFailed(true)}
    />
  );
};

