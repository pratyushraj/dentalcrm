import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, CheckCircle2, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { CITIES, CityData } from '@/data/cities';

// 3-digit Indian Pincode prefix mapping to city slug
const PINCODE_PREFIX_MAP: Record<string, string> = {
  '110': 'delhi',
  '121': 'faridabad',
  '122': 'gurgaon',
  '141': 'ludhiana',
  '143': 'amritsar',
  '160': 'chandigarh',
  '171': 'shimla',
  '190': 'srinagar',
  '201': 'noida',
  '208': 'kanpur',
  '221': 'varanasi',
  '226': 'lucknow',
  '243': 'bareilly',
  '244': 'moradabad',
  '248': 'dehradun',
  '282': 'agra',
  '302': 'jaipur',
  '324': 'kota',
  '334': 'bikaner',
  '342': 'jodhpur',
  '360': 'rajkot',
  '380': 'ahmedabad',
  '390': 'vadodara',
  '395': 'surat',
  '400': 'mumbai',
  '410': 'navi-mumbai',
  '411': 'pune',
  '413': 'solapur',
  '422': 'nashik',
  '431': 'aurangabad',
  '440': 'nagpur',
  '444': 'amravati',
  '452': 'indore',
  '462': 'bhopal',
  '482': 'jabalpur',
  '492': 'raipur',
  '500': 'hyderabad',
  '506': 'warangal',
  '520': 'vijayawada',
  '522': 'guntur',
  '530': 'visakhapatnam',
  '560': 'bengaluru',
  '570': 'mysore',
  '575': 'mangalore',
  '580': 'hubli-dharwad',
  '600': 'chennai',
  '625': 'madurai',
  '636': 'salem',
  '641': 'coimbatore',
  '673': 'kozhikode',
  '682': 'kochi',
  '695': 'thiruvananthapuram',
  '700': 'kolkata',
  '711': 'haora',
  '781': 'guwahati',
  '800': 'patna',
  '826': 'dhanbad',
  '834': 'ranchi',
};

// 2-digit Indian State postal circle fallbacks
const PINCODE_CIRCLE_MAP: Record<string, string[]> = {
  '11': ['delhi'],
  '12': ['faridabad', 'gurgaon'],
  '13': ['chandigarh'],
  '14': ['ludhiana', 'amritsar'],
  '16': ['chandigarh'],
  '20': ['noida', 'ghaziabad', 'kanpur'],
  '22': ['lucknow', 'varanasi', 'allahabad'],
  '24': ['dehradun', 'bareilly', 'moradabad'],
  '28': ['agra'],
  '30': ['jaipur'],
  '32': ['kota'],
  '34': ['jodhpur'],
  '36': ['rajkot'],
  '38': ['ahmedabad'],
  '39': ['surat', 'vadodara'],
  '40': ['mumbai', 'thane'],
  '41': ['pune', 'navi-mumbai'],
  '44': ['nagpur'],
  '45': ['indore'],
  '46': ['bhopal'],
  '49': ['raipur'],
  '50': ['hyderabad', 'warangal'],
  '52': ['vijayawada', 'guntur'],
  '53': ['visakhapatnam'],
  '56': ['bengaluru'],
  '57': ['mysore', 'mangalore'],
  '60': ['chennai'],
  '62': ['madurai'],
  '64': ['coimbatore', 'tiruppur'],
  '68': ['kochi'],
  '69': ['thiruvananthapuram'],
  '70': ['kolkata'],
  '71': ['haora'],
  '78': ['guwahati'],
  '80': ['patna'],
  '82': ['dhanbad'],
  '83': ['ranchi'],
};

interface ClinicCityFinderProps {
  onCheckEligibility?: (cityName: string) => void;
  currentCitySlug?: string;
  title?: string;
  subtitle?: string;
}

export const ClinicCityFinder: React.FC<ClinicCityFinderProps> = ({
  onCheckEligibility,
  currentCitySlug,
  title = 'Find a Partner Dental Clinic Near You',
  subtitle = 'Search by your 6-digit Pincode or City name to view verified Clinaza financing network clinics.',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Default featured cities
  const featuredSlugs = ['delhi', 'mumbai', 'bengaluru', 'hyderabad', 'pune', 'patna', 'chennai', 'kochi'];

  const filteredCities = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return CITIES.filter((c) => featuredSlugs.includes(c.slug) && c.slug !== currentCitySlug);
    }

    // Check if query is numeric (PIN code search)
    const isNumeric = /^\d+$/.test(query);
    if (isNumeric) {
      // 1. Match 3-digit prefix
      const prefix3 = query.slice(0, 3);
      if (PINCODE_PREFIX_MAP[prefix3]) {
        const primaryMatch = CITIES.find((c) => c.slug === PINCODE_PREFIX_MAP[prefix3]);
        if (primaryMatch) {
          const others = CITIES.filter(
            (c) => c.state === primaryMatch.state && c.slug !== primaryMatch.slug
          ).slice(0, 3);
          return [primaryMatch, ...others];
        }
      }

      // 2. Match 2-digit circle
      const prefix2 = query.slice(0, 2);
      if (PINCODE_CIRCLE_MAP[prefix2]) {
        const circleSlugs = PINCODE_CIRCLE_MAP[prefix2];
        const circleMatches = CITIES.filter((c) => circleSlugs.includes(c.slug));
        if (circleMatches.length > 0) return circleMatches;
      }
    }

    // Text search by city name or state
    return CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.state.toLowerCase().includes(query) ||
        c.slug.includes(query)
    ).slice(0, 6);
  }, [searchTerm, currentCitySlug]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-bold text-[#0867E8]">
          <MapPin size={12} /> CLINAZA VERIFIED CLINIC NETWORK
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-[#0B2450]">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{subtitle}</p>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-xl mx-auto relative">
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter Pincode (e.g. 560034, 110001) or City..."
            className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0867E8] focus:bg-white transition-all shadow-inner"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Quick Filter Metro Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 justify-center text-[11px]">
          <span className="text-slate-400 font-semibold pr-1">Popular:</span>
          {['Delhi', 'Mumbai', 'Bengaluru', 'Patna', 'Hyderabad', 'Pune', 'Kochi'].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setSearchTerm(name)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-[#0867E8] text-slate-600 rounded-lg font-bold transition-all border border-transparent hover:border-blue-200"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* City Results Grid */}
      {filteredCities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredCities.map((city) => (
            <div
              key={city.slug}
              className="bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-blue-300 p-4 rounded-2xl transition-all shadow-xs hover:shadow-md space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black text-[#0B2450] flex items-center gap-1.5">
                      {city.name}
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active Partner Network" />
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{city.state}</p>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                    Verified
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600 pt-1">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <CheckCircle2 size={13} className="text-[#0867E8] shrink-0" />
                    <span>Instant EMI: ₹30,000 to ₹5,00,000</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                    <span>2-Min Soft Approval · ₹0 CIBIL Impact</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                {onCheckEligibility ? (
                  <button
                    type="button"
                    onClick={() => onCheckEligibility(city.name)}
                    className="flex-1 py-2 px-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-[11px] font-bold rounded-xl transition-all text-center shadow-xs cursor-pointer"
                  >
                    Check Eligibility
                  </button>
                ) : (
                  <a
                    href="#check-eligibility"
                    className="flex-1 py-2 px-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-[11px] font-bold rounded-xl transition-all text-center shadow-xs"
                  >
                    Check Eligibility
                  </a>
                )}
                <Link
                  to={`/cities/${city.slug}`}
                  className="py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-[#0B2450] hover:text-[#0867E8] text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1 shrink-0"
                  title={`View ${city.name} Dental EMI Guide`}
                >
                  Guide <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl max-w-md mx-auto space-y-3">
          <MapPin size={28} className="mx-auto text-slate-400" />
          <div>
            <h4 className="text-sm font-black text-[#0B2450]">Expanding to Your Pincode</h4>
            <p className="text-xs text-slate-500 mt-1">
              Clinaza finances dental treatments across 87+ Indian cities. You can still check your pre-approved credit limit online right now!
            </p>
          </div>
          {onCheckEligibility && (
            <button
              type="button"
              onClick={() => onCheckEligibility(searchTerm || 'India')}
              className="px-5 py-2.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-1.5"
            >
              <ShieldCheck size={14} /> Check Online Pre-Approval
            </button>
          )}
        </div>
      )}
    </div>
  );
};
