import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown, Sparkles, MapPin, Search } from 'lucide-react';
import { useCurrency, POPULAR_COUNTRIES, CountryInfo } from '../context/CurrencyContext';

interface CountryCurrencySelectorProps {
  compact?: boolean;
  className?: string;
}

export const CountryCurrencySelector: React.FC<CountryCurrencySelectorProps> = ({
  compact = false,
  className = ''
}) => {
  const { country, currency, isEthiopia, setCountryCode, detectedVia } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredCountries = POPULAR_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-xl border transition cursor-pointer select-none ${
          compact
            ? 'px-2.5 py-1 text-xs bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-200'
            : 'px-3 py-1.5 text-xs font-semibold bg-slate-900/95 hover:bg-slate-800/90 border-slate-700 text-white shadow-sm'
        } ${isEthiopia ? 'border-amber-500/40' : 'border-cyan-500/40'}`}
        title={`Current Region: ${country.name} (${currency}) - Click to switch`}
      >
        <span className="text-sm leading-none">{country.flag}</span>
        <span className="font-bold font-mono tracking-tight text-white">
          {currency}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-400' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50 overflow-hidden animate-fade-in text-slate-100">
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Region &amp; Currency</span>
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full font-mono">
                {isEthiopia ? '🇪🇹 Local ETB' : '🌐 Global USD'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Select your location. Ethiopian users pay in <strong>ETB (Birr)</strong> via Telebirr/CBE; all other countries pay in <strong>US$ (USD)</strong> via Card/PayPal.
            </p>
          </div>

          {/* Quick Toggles: Ethiopia vs Worldwide */}
          <div className="p-2 space-y-1.5 bg-slate-950/60 border-b border-slate-800">
            {/* Ethiopia Option */}
            <button
              onClick={() => {
                setCountryCode('ET');
                setIsOpen(false);
              }}
              className={`w-full p-2 rounded-xl text-left transition flex items-center justify-between cursor-pointer ${
                isEthiopia
                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200'
                  : 'bg-slate-900/60 hover:bg-slate-800/70 border border-transparent text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🇪🇹</span>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Ethiopia</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                      ETB (Birr)
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Telebirr, CBE (*847#), Awash, Dashen, Chapa
                  </div>
                </div>
              </div>
              {isEthiopia && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
            </button>

            {/* International Option */}
            <button
              onClick={() => {
                setCountryCode('GLOBAL');
                setIsOpen(false);
              }}
              className={`w-full p-2 rounded-xl text-left transition flex items-center justify-between cursor-pointer ${
                !isEthiopia
                  ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-200'
                  : 'bg-slate-900/60 hover:bg-slate-800/70 border border-transparent text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🌐</span>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>All Other Countries / Global</span>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                      US$ (USD)
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    USA, Europe, UK, Canada, Kenya, UAE • Card / PayPal
                  </div>
                </div>
              </div>
              {!isEthiopia && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
            </button>
          </div>

          {/* Search Specific Country */}
          <div className="p-2 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search country (USA, UK, Kenya...)"
                className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* List of Countries */}
          <div className="max-h-44 overflow-y-auto p-1.5 space-y-1">
            {filteredCountries.map(c => {
              const isSelected = country.code === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    setCountryCode(c.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600/20 text-teal-300 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{c.flag}</span>
                    <span>{c.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                    <span className={c.currency === 'ETB' ? 'text-amber-400' : 'text-cyan-400'}>
                      {c.currency}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="p-2 bg-slate-950 text-center text-[10px] text-slate-500 border-t border-slate-800 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3 text-teal-400" />
            <span>Auto-detects location • Runs in every country</span>
          </div>
        </div>
      )}
    </div>
  );
};
