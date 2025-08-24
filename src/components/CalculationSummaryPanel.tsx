import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, Plus, X, Info, Check } from "lucide-react";

interface ZakatEntry {
  id: number;
  type: 'Asset' | 'Liability';
  category: string;
  amount?: number | string; // Only for non-Gold/Silver assets
  notes: string;
  karat?: string;
  weight?: number; // For Gold/Silver
  price?: number // For Gold/Silver
  unit?: 'gram' | 'tola'; // For Gold/Silver
  currency?: string; // For Cash
}

interface CalculationSummaryPanelProps {
  zakatEntries: ZakatEntry[];
  onAddCard?: () => void;
  onDoneEditing?: () => void;
  isEditing?: boolean;
  isSummaryExpanded?: boolean;
  onToggleSummary?: () => void;
  currencyRates?: Record<string, number>;
  currencySymbols?: Record<string, string>;
}

const CalculationSummaryPanel = ({ 
  zakatEntries, 
  onAddCard, 
  onDoneEditing, 
  isEditing = false, 
  isSummaryExpanded = false, 
  onToggleSummary, 
  currencyRates: externalCurrencyRates,
  currencySymbols: externalCurrencySymbols 
}: CalculationSummaryPanelProps) => {
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [netZakatableAssets, setNetZakatableAssets] = useState(0);
  const [zakatDue, setZakatDue] = useState(0);
  const [animatedZakatDue, setAnimatedZakatDue] = useState(0);
  
  // Use external rates if provided, otherwise use fallback
  const finalCurrencyRates = externalCurrencyRates || {
    PKR: 1,
    USD: 285,
    EUR: 310,
    GBP: 360,
    SAR: 75,
    AED: 78,
  };

  const TOLA_TO_GRAM = 11.664;
  const nisabThreshold = 179689;

  // Helper function to calculate asset value
  const calculateAssetValue = (entry: ZakatEntry): number => {
    if (entry.category === 'Gold' || entry.category === 'Silver') {
      if (!entry.weight || !entry.karat || !entry.price) return 0;
      
      const rates = entry.category === 'Gold' ? 
        { "24K": entry.price, "22K": entry.price * 0.916, "21K": entry.price * 0.875, "18K": entry.price * 0.75 } :
        { "24K": entry.price, "22K": entry.price * 0.916, "21K": entry.price * 0.875 };
        
      const rate = rates[entry.karat as keyof typeof rates];
      if (!rate) return 0;
      
      const weightInGrams = entry.unit === 'tola' ? entry.weight * TOLA_TO_GRAM : entry.weight;
      return weightInGrams * rate;
    }
    if (entry.category === 'Cash') {
      const baseAmount = typeof entry.amount === 'string' ? parseFloat(entry.amount) || 0 : entry.amount || 0;
      const rate = finalCurrencyRates[(entry.currency || 'PKR') as keyof typeof finalCurrencyRates] || 1;
      return baseAmount * rate;
    }
    return typeof entry.amount === 'string' ? parseFloat(entry.amount) || 0 : entry.amount || 0;
  };

  useEffect(() => {
    // Calculate total assets
    const assets = zakatEntries
      .filter(entry => entry.type === 'Asset')
      .reduce((sum, entry) => sum + calculateAssetValue(entry), 0);
    
    // Calculate total liabilities
    const liabilities = zakatEntries
      .filter(entry => entry.type === 'Liability')
      .reduce((sum, entry) => sum + calculateAssetValue(entry), 0);
    
    // Calculate net zakatable assets
    const netAssets = assets - liabilities;
    
    // Calculate zakat due
    const zakat = netAssets > nisabThreshold ? netAssets * 0.025 : 0;
    
    setTotalAssets(assets);
    setTotalLiabilities(liabilities);
    setNetZakatableAssets(netAssets);
    setZakatDue(zakat);
  }, [zakatEntries, finalCurrencyRates]);

  // Count-up animation for Zakat Due
  useEffect(() => {
    if (isSummaryExpanded && zakatDue > 0) {
      setAnimatedZakatDue(0);
      const duration = 800; // 800ms animation
      const steps = 30;
      const increment = zakatDue / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setAnimatedZakatDue(zakatDue);
          clearInterval(timer);
        } else {
          setAnimatedZakatDue(Math.floor(increment * currentStep));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    } else {
      setAnimatedZakatDue(zakatDue);
    }
  }, [zakatDue, isSummaryExpanded]);

  const formatCurrency = (amount: number) => {
    return `PKR ${new Intl.NumberFormat('en-US').format(amount)}`;
  };

  return (
    <>
      {/* Modal Bottom Sheet */}
      {isSummaryExpanded && (
        <div 
          className="fixed top-0 left-0 w-screen h-screen z-50 bg-black/50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={onToggleSummary}
        >
          {/* Bottom Sheet Panel */}
          <div 
            className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto"
            className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out"
            style={{ 
              borderTopLeftRadius: '16px', 
              borderTopRightRadius: '16px',
              maxHeight: '85vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Zakat Calculation Summary</h2>
              <button 
                onClick={onToggleSummary}
                className="p-2 hover:bg-accent rounded-lg group"
                aria-label="Close panel"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-4 overflow-y-auto max-h-96">
              {/* Total Assets */}
              <div 
                className="flex justify-between items-center opacity-0 translate-y-4 animate-fade-in"
                style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
              >
                <span className="text-muted-foreground">Total Assets</span>
                <span className="font-semibold text-foreground">{formatCurrency(totalAssets)}</span>
              </div>
              
              {/* Total Liabilities */}
              <div 
                className="flex justify-between items-center opacity-0 translate-y-4 animate-fade-in"
                style={{ animationDelay: '75ms', animationFillMode: 'forwards' }}
              >
                <span className="text-muted-foreground">Total Liabilities</span>
                <span className="font-semibold text-destructive">- {formatCurrency(totalLiabilities)}</span>
              </div>
              
              {/* Divider */}
              <div 
                className="border-t border-border my-4 opacity-0 animate-fade-in"
                style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}
              ></div>
              
              {/* Net Zakatable Assets */}
              <div 
                className="flex justify-between items-center opacity-0 translate-y-4 animate-fade-in"
                style={{ animationDelay: '225ms', animationFillMode: 'forwards' }}
              >
                <span className="text-muted-foreground">Net Zakatable Assets</span>
                <span className="font-semibold text-foreground">{formatCurrency(netZakatableAssets)}</span>
              </div>
              
              {/* Nisab Threshold */}
              <div 
                className="flex justify-between items-center opacity-0 translate-y-4 animate-fade-in"
                style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
              >
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Nisab Threshold Est.</span>
                  <span className="text-xs text-muted-foreground">For 1446-47 AH</span>
                </div>
                <span className="font-semibold text-foreground">{formatCurrency(nisabThreshold)}</span>
              </div>
              
              {/* Final Zakat Due - Most Prominent */}
              <div 
                className="bg-primary/5 rounded-lg p-4 mt-6 border border-primary/20 opacity-0 translate-y-4 animate-fade-in"
                style={{ animationDelay: '375ms', animationFillMode: 'forwards', marginBottom: '16px' }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-foreground">Zakat Due</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(animatedZakatDue)}</span>
                </div>
                {zakatDue === 0 && (
                  <div className="text-xs text-muted-foreground mt-2">
                    {netZakatableAssets < nisabThreshold ? 'Below Nisab threshold' : 'No zakat due'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-elevated/95 backdrop-blur-sm border-t border-border/50 shadow-lg z-30">
        <div className="relative">
          {/* Subtle gradient border top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          
          <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
            {/* Compact Summary - Left Side */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <span className="text-primary font-semibold text-sm">₨</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block">Zakat Due</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(zakatDue)}
                  </span>
                </div>
              </div>
              <button 
                onClick={onToggleSummary}
                className="p-2 hover:bg-accent rounded-lg transition-all duration-200 hover:scale-105 group"
                aria-label="Show detailed breakdown"
              >
                {isSummaryExpanded ? (
                  <ChevronDown size={18} className="text-muted-foreground group-hover:text-foreground transition-all duration-200" />
                ) : (
                  <ChevronUp size={18} className="text-muted-foreground group-hover:text-foreground transition-all duration-200" />
                )}
              </button>
            </div>
            
            {/* Smart FAB - Right Side */}
            <button 
              onClick={isEditing ? onDoneEditing : onAddCard} 
              aria-label={isEditing ? "Done editing" : "Add new calculation"} 
              className="h-12 w-12 bg-primary text-primary-foreground rounded-xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 ease-out flex items-center justify-center group"
            >
              {isEditing ? (
                <Check size={20} strokeWidth={2.5} className="transition-transform duration-200" />
              ) : (
                <Plus size={20} strokeWidth={2.5} className="group-active:rotate-90 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalculationSummaryPanel;