export interface ZakatEntry {
  id: number;
  type: 'Asset' | 'Liability';
  category: string;
  amount?: number | string;
  notes: string;
  karat?: string;
  weight?: number;
  unit?: 'gram' | 'tola';
  price?: number;
  currency?: string;
}

export type EntryType = "Asset" | "Liability";

export interface CurrencyData {
  rates: Record<string, number>;
  symbols: Record<string, string>;
}