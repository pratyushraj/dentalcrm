import React from 'react';

interface BankLogoProps {
  id: string;
  className?: string;
  size?: number;
}

// Official brand logos — Wikipedia/Wikimedia Commons (freely licensed) & brand press kits
const BANK_LOGOS: Record<string, { src: string; name: string }> = {
  hdfc: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/320px-HDFC_Bank_Logo.svg.png',
    name: 'HDFC Bank',
  },
  icici: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/ICICI_Bank_Logo.svg/320px-ICICI_Bank_Logo.svg.png',
    name: 'ICICI Bank',
  },
  axis: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Axis_Bank_logo.svg/320px-Axis_Bank_logo.svg.png',
    name: 'Axis Bank',
  },
  bajaj: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Bajaj_Finance_logo.svg/320px-Bajaj_Finance_logo.svg.png',
    name: 'Bajaj Finserv',
  },
  tata: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_Capital_Logo.png/320px-Tata_Capital_Logo.png',
    name: 'Tata Capital',
  },
  kotak: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Kotak_Mahindra_Bank_logo.svg/320px-Kotak_Mahindra_Bank_logo.svg.png',
    name: 'Kotak Bank',
  },
  piramal: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Piramal_Finance_Logo.png/320px-Piramal_Finance_Logo.png',
    name: 'Piramal Finance',
  },
  lt: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/L%26T_Finance_Logo.svg/320px-L%26T_Finance_Logo.svg.png',
    name: 'L&T Finance',
  },
  abcl: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Aditya_Birla_Capital_Logo.svg/320px-Aditya_Birla_Capital_Logo.svg.png',
    name: 'Aditya Birla',
  },
  poonawalla: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Poonawalla_Fincorp_Logo.png/320px-Poonawalla_Fincorp_Logo.png',
    name: 'Poonawalla',
  },
  chola: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Cholamandalam_Investment_and_Finance_Company_logo.png/320px-Cholamandalam_Investment_and_Finance_Company_logo.png',
    name: 'Cholamandalam',
  },
  smfg: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/SMFG_India_Credit_logo.png/320px-SMFG_India_Credit_logo.png',
    name: 'SMFG Credit',
  },
  muthoot: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Muthoot_Finance_Logo.svg/320px-Muthoot_Finance_Logo.svg.png',
    name: 'Muthoot Finance',
  },
  incred: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/InCred_logo.svg/320px-InCred_logo.svg.png',
    name: 'InCred',
  },
  dmi: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/DMI_Finance_logo.png/320px-DMI_Finance_logo.png',
    name: 'DMI Finance',
  },
  liquiloans: {
    src: 'https://liquiloans.io/images/logo.png',
    name: 'LiquiLoans',
  },
  dhanlift: {
    src: 'https://dhanlift.com/static/media/logo.png',
    name: 'Dhanlift',
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
        width: size, height: size,
        objectFit: 'contain',
        borderRadius: 6,
        background: '#ffffff',
        flexShrink: 0,
        display: 'block',
        padding: 2,
      }}
      onError={() => setFailed(true)}
    />
  );
};

