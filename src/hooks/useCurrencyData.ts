import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CurrencyData } from '@/types/zakat';
import { DEFAULT_CURRENCY_RATES, DEFAULT_CURRENCY_SYMBOLS } from '@/constants/zakat';

export const useCurrencyRates = () => {
  const [currencyRates, setCurrencyRates] = useState<Record<string, number>>(DEFAULT_CURRENCY_RATES);
  const [currencySymbols, setCurrencySymbols] = useState<Record<string, string>>(DEFAULT_CURRENCY_SYMBOLS);
  const [loading, setLoading] = useState(false);

  const fetchCurrencyData = async () => {
    try {
      setLoading(true);
      
      // Check localStorage cache first (cache for 1 day)
      const cachedData = localStorage.getItem('exchange-rates-cache');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const isExpired = Date.now() - parsed.timestamp > 86400000; // 1 day
        
        if (!isExpired) {
          setCurrencyRates(parsed.rates);
          if (parsed.symbols) {
            setCurrencySymbols(parsed.symbols);
          }
          setLoading(false);
          return;
        }
      }

      const { data, error } = await supabase.functions.invoke('get-exchange-rates');
      
      if (error) throw error;

      if (data && data.rates) {
        setCurrencyRates(data.rates);
        
        if (data.symbols) {
          setCurrencySymbols(data.symbols);
        }
        
        // Cache both rates and symbols
        localStorage.setItem('exchange-rates-cache', JSON.stringify({
          rates: data.rates,
          symbols: data.symbols || currencySymbols,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.error('Failed to fetch currency data:', error);
      // Keep fallback data already set in state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  return { currencyRates, currencySymbols, loading };
};
