import { ZakatEntry } from '@/types/zakat';
import { GOLD_KARAT_RATES, SILVER_KARAT_RATES, TOLA_TO_GRAM } from '@/constants/zakat';

/**
 * Calculate the PKR value of a Zakat entry based on its category
 */
export const calculateAssetValue = (
  entry: ZakatEntry, 
  currencyRates: Record<string, number>
): number => {
  if (entry.category === 'Gold' || entry.category === 'Silver') {
    if (!entry.weight || !entry.karat || !entry.price) return 0;
    
    const karatRates = entry.category === 'Gold' ? GOLD_KARAT_RATES : SILVER_KARAT_RATES;
    const karatMultiplier = karatRates[entry.karat as keyof typeof karatRates] || 1;
    const weightInGrams = entry.unit === 'tola' ? entry.weight * TOLA_TO_GRAM : entry.weight;
    const pricePerGram = entry.price * karatMultiplier;
    
    return weightInGrams * pricePerGram;
  }
  
  if (entry.category === 'Cash' && entry.currency && entry.currency !== 'PKR') {
    const amount = typeof entry.amount === 'string' ? parseFloat(entry.amount) : (entry.amount || 0);
    const rate = currencyRates[entry.currency] || 1;
    return amount * rate;
  }
  
  // For PKR cash and all other categories
  return typeof entry.amount === 'string' ? parseFloat(entry.amount) : (entry.amount || 0);
};

/**
 * Format currency amount with proper locale formatting
 */
export const formatCurrency = (amount: number, currency: string = 'PKR'): string => {
  return `${currency} ${amount.toLocaleString('en-US')}`;
};

import { NISAB_THRESHOLD_PKR, ZAKAT_RATE } from '@/constants/zakat';

/**
 * Calculate total assets, liabilities, and zakat due
 */
export const calculateZakatSummary = (
  entries: ZakatEntry[],
  currencyRates: Record<string, number>
) => {
  let totalAssets = 0;
  let totalLiabilities = 0;
  
  entries.forEach(entry => {
    const value = calculateAssetValue(entry, currencyRates);
    if (entry.type === 'Asset') {
      totalAssets += value;
    } else {
      totalLiabilities += value;
    }
  });
  
  const netZakatableAssets = Math.max(0, totalAssets - totalLiabilities);
  const zakatDue = netZakatableAssets >= NISAB_THRESHOLD_PKR ? netZakatableAssets * ZAKAT_RATE : 0;
  
  return {
    totalAssets,
    totalLiabilities,
    netZakatableAssets,
    zakatDue,
    isAboveNisab: netZakatableAssets >= NISAB_THRESHOLD_PKR
  };
};