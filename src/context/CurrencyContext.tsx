import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CurrencyCode = 'ETB' | 'USD';

export interface CountryInfo {
  code: string;
  name: string;
  currency: CurrencyCode;
  currencySymbol: string;
  flag: string;
  region: string;
}

export const POPULAR_COUNTRIES: CountryInfo[] = [
  { code: 'ET', name: 'Ethiopia', currency: 'ETB', currencySymbol: 'ETB', flag: '🇪🇹', region: 'Africa' },
  { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', flag: '🇺🇸', region: 'Americas' },
  { code: 'GB', name: 'United Kingdom', currency: 'USD', currencySymbol: '$', flag: '🇬🇧', region: 'Europe' },
  { code: 'CA', name: 'Canada', currency: 'USD', currencySymbol: '$', flag: '🇨🇦', region: 'Americas' },
  { code: 'KE', name: 'Kenya', currency: 'USD', currencySymbol: '$', flag: '🇰🇪', region: 'Africa' },
  { code: 'DE', name: 'Germany', currency: 'USD', currencySymbol: '$', flag: '🇩🇪', region: 'Europe' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'USD', currencySymbol: '$', flag: '🇦🇪', region: 'Middle East' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'USD', currencySymbol: '$', flag: '🇸🇦', region: 'Middle East' },
  { code: 'IN', name: 'India', currency: 'USD', currencySymbol: '$', flag: '🇮🇳', region: 'Asia' },
  { code: 'AU', name: 'Australia', currency: 'USD', currencySymbol: '$', flag: '🇦🇺', region: 'Oceania' },
  { code: 'ZA', name: 'South Africa', currency: 'USD', currencySymbol: '$', flag: '🇿🇦', region: 'Africa' },
  { code: 'NG', name: 'Nigeria', currency: 'USD', currencySymbol: '$', flag: '🇳🇬', region: 'Africa' },
  { code: 'SD', name: 'Sudan', currency: 'USD', currencySymbol: '$', flag: '🇸🇩', region: 'Africa' },
  { code: 'DJ', name: 'Djibouti', currency: 'USD', currencySymbol: '$', flag: '🇩🇯', region: 'Africa' },
  { code: 'SO', name: 'Somalia', currency: 'USD', currencySymbol: '$', flag: '🇸🇴', region: 'Africa' },
  { code: 'GLOBAL', name: 'International / Other Countries', currency: 'USD', currencySymbol: '$', flag: '🌐', region: 'Global' },
];

interface CurrencyContextType {
  countryCode: string;
  country: CountryInfo;
  currency: CurrencyCode;
  currencySymbol: string;
  isEthiopia: boolean;
  setCountryCode: (code: string) => void;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (etb: number, usd?: number) => string;
  getPrimaryAmount: (etb: number, usd?: number) => { amount: number; currency: CurrencyCode; label: string };
  formatDualPrice: (etb: number, usd?: number) => { primary: string; secondary: string };
  detectedVia: 'stored' | 'timezone' | 'locale' | 'network' | 'default';
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_COUNTRY = 'pharmastar_user_country_code';
const LOCAL_STORAGE_KEY_CURRENCY = 'pharmastar_user_currency';

// Intelligent location detector using browser hints (Timezone, Language, Locale)
export const detectUserCountry = (): { code: string; detectedVia: 'timezone' | 'locale' | 'default' } => {
  try {
    // 1. Check browser timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (timezone.toLowerCase().includes('addis_ababa') || timezone.toLowerCase().includes('ethiopia')) {
      return { code: 'ET', detectedVia: 'timezone' };
    }

    // 2. Check browser languages (Amharic, Oromo, Tigrinya, or ET locale)
    const languages = navigator.languages || [navigator.language || ''];
    for (const lang of languages) {
      const lower = lang.toLowerCase();
      if (lower.startsWith('am') || lower.startsWith('om') || lower.startsWith('ti') || lower.includes('-et')) {
        return { code: 'ET', detectedVia: 'locale' };
      }
    }

    // 3. If timezone is in US/Canada/UK/etc.
    if (timezone.startsWith('America/')) {
      return { code: 'US', detectedVia: 'timezone' };
    }
    if (timezone.startsWith('Europe/London')) {
      return { code: 'GB', detectedVia: 'timezone' };
    }
    if (timezone.startsWith('Africa/Nairobi')) {
      return { code: 'KE', detectedVia: 'timezone' };
    }
  } catch (e) {
    // ignore
  }

  // Default international / global
  return { code: 'GLOBAL', detectedVia: 'default' };
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [countryCode, setCountryCodeState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_COUNTRY);
      if (stored) return stored;
    } catch (e) {}
    return detectUserCountry().code;
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const storedCurr = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENCY);
      if (storedCurr === 'ETB' || storedCurr === 'USD') return storedCurr;
      const storedCountry = localStorage.getItem(LOCAL_STORAGE_KEY_COUNTRY);
      if (storedCountry) return storedCountry === 'ET' ? 'ETB' : 'USD';
    } catch (e) {}
    return countryCode === 'ET' ? 'ETB' : 'USD';
  });

  const [detectedVia, setDetectedVia] = useState<'stored' | 'timezone' | 'locale' | 'network' | 'default'>('default');

  // Background non-blocking network verification for client IP
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_COUNTRY);
    if (stored) {
      setDetectedVia('stored');
      return;
    }

    const { code, detectedVia: via } = detectUserCountry();
    setDetectedVia(via);

    // Try server geo detector
    fetch('/api/geo/detect')
      .then(r => r.json())
      .then(data => {
        if (data && data.countryCode) {
          if (!localStorage.getItem(LOCAL_STORAGE_KEY_COUNTRY)) {
            setCountryCodeState(data.countryCode);
            setCurrencyState(data.currency || (data.countryCode === 'ET' ? 'ETB' : 'USD'));
            setDetectedVia('network');
          }
        }
      })
      .catch(() => {
        // Fallback to timezone/locale detection already set
      });
  }, []);

  const setCountryCode = (code: string) => {
    setCountryCodeState(code);
    const newCurr: CurrencyCode = code === 'ET' ? 'ETB' : 'USD';
    setCurrencyState(newCurr);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_COUNTRY, code);
      localStorage.setItem(LOCAL_STORAGE_KEY_CURRENCY, newCurr);
    } catch (e) {}
  };

  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CURRENCY, curr);
    } catch (e) {}
  };

  const isEthiopia = countryCode === 'ET' || currency === 'ETB';

  const country = POPULAR_COUNTRIES.find(c => c.code === countryCode) || {
    code: countryCode,
    name: countryCode === 'ET' ? 'Ethiopia' : 'International / Other',
    currency: isEthiopia ? 'ETB' : 'USD',
    currencySymbol: isEthiopia ? 'ETB' : '$',
    flag: countryCode === 'ET' ? '🇪🇹' : '🌐',
    region: isEthiopia ? 'Africa' : 'Global'
  };

  const currencySymbol = currency === 'ETB' ? 'ETB' : '$';

  // Standardized price formatter: ETB for Ethiopia, USD for all other countries
  const formatPrice = (etb: number, usd?: number): string => {
    if (currency === 'ETB') {
      return `${etb.toLocaleString()} ETB`;
    }
    const computedUsd = usd !== undefined ? usd : Number((etb / 125).toFixed(2));
    return `$${computedUsd.toFixed(2)} USD`;
  };

  const getPrimaryAmount = (etb: number, usd?: number) => {
    if (currency === 'ETB') {
      return { amount: etb, currency: 'ETB' as CurrencyCode, label: `${etb.toLocaleString()} ETB` };
    }
    const computedUsd = usd !== undefined ? usd : Number((etb / 125).toFixed(2));
    return { amount: computedUsd, currency: 'USD' as CurrencyCode, label: `$${computedUsd.toFixed(2)} USD` };
  };

  const formatDualPrice = (etb: number, usd?: number) => {
    const computedUsd = usd !== undefined ? usd : Number((etb / 125).toFixed(2));
    if (currency === 'ETB') {
      return {
        primary: `${etb.toLocaleString()} ETB`,
        secondary: `$${computedUsd.toFixed(2)} USD`
      };
    }
    return {
      primary: `$${computedUsd.toFixed(2)} USD`,
      secondary: `${etb.toLocaleString()} ETB`
    };
  };

  return (
    <CurrencyContext.Provider
      value={{
        countryCode,
        country,
        currency,
        currencySymbol,
        isEthiopia,
        setCountryCode,
        setCurrency,
        formatPrice,
        getPrimaryAmount,
        formatDualPrice,
        detectedVia
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Provide safe fallback if accessed outside Provider
    return {
      countryCode: 'ET',
      country: POPULAR_COUNTRIES[0],
      currency: 'ETB',
      currencySymbol: 'ETB',
      isEthiopia: true,
      setCountryCode: () => {},
      setCurrency: () => {},
      formatPrice: (etb: number, usd?: number) => `${etb} ETB`,
      getPrimaryAmount: (etb: number) => ({ amount: etb, currency: 'ETB', label: `${etb} ETB` }),
      formatDualPrice: (etb: number, usd?: number) => ({ primary: `${etb} ETB`, secondary: `$${usd || 1} USD` }),
      detectedVia: 'default'
    };
  }
  return context;
};
