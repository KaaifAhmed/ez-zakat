/**
 * Zakat calculation constants and configuration
 */

export const NISAB_THRESHOLD_PKR = 179689; // PKR amount for nisab threshold
export const ZAKAT_RATE = 0.025; // 2.5% zakat rate
export const TOLA_TO_GRAM = 11.664; // Conversion factor from tola to grams

export const CATEGORY_SEQUENCE = [
  'Cash', 
  'Gold', 
  'Silver', 
  'Business Inventory', 
  'Receivables', 
  'Personal Debt', 
  'Business Loan', 
  'Other Payables'
];

export const ASSET_CATEGORIES = [
  'Cash', 
  'Gold', 
  'Silver', 
  'Business Inventory', 
  'Receivables'
];

export const LIABILITY_CATEGORIES = [
  'Personal Debt', 
  'Business Loan', 
  'Other Payables'
];

export const GOLD_KARAT_RATES = {
  "24K": 1.0,
  "22K": 0.916,
  "21K": 0.875,
  "18K": 0.75,
};

export const SILVER_KARAT_RATES = {
  "24K": 1.0,
  "22K": 0.916,
  "21K": 0.875,
};

export const DEFAULT_CURRENCY_RATES = {
  PKR: 1,
  USD: 285,
  EUR: 310,
  GBP: 360,
  SAR: 75,
  AED: 78,
};

export const DEFAULT_CURRENCY_SYMBOLS = {
  'PKR': 'Pakistani Rupee',
  'USD': 'United States Dollar',
  'EUR': 'Euro',
  'GBP': 'British Pound Sterling',
  'SAR': 'Saudi Riyal',
  'AED': 'United Arab Emirates Dirham',
};