import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CurrencyData {
  rates: Record<string, number>;
  symbols: Record<string, string>;
}

export const useCurrencyData = () => {
  const [currencyRates, setCurrencyRates] = useState<Record<string, number>>({
    PKR: 1,
    USD: 285,
    EUR: 310,
    GBP: 360,
    SAR: 75,
    AED: 78,
  });
  
  const [currencySymbols, setCurrencySymbols] = useState<Record<string, string>>({
    'PKR': 'Pakistani Rupee',
    'USD': 'United States Dollar',
    'EUR': 'Euro',
    'GBP': 'British Pound Sterling',
    'SAR': 'Saudi Riyal',
    'AED': 'United Arab Emirates Dirham',
  });
  
  const [loading, setLoading] = useState(false);

  const fetchCurrencyData = async () => {
    try {
      setLoading(true);
      
      // Check localStorage cache first (cache for 1 hour)
      const cachedData = localStorage.getItem('exchange-rates-cache');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const isExpired = Date.now() - parsed.timestamp > 3600000; // 1 hour
        
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
