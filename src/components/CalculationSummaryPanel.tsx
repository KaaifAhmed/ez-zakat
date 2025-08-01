import { useEffect, useState } from "react";
import { ChevronUp, Plus } from "lucide-react";

interface ZakatEntry {
  id: number;
  type: 'Asset' | 'Liability';
  category: string;
  amount: number;
  notes: string;
}

interface CalculationSummaryPanelProps {
  zakatEntries: ZakatEntry[];
  onAddCard?: () => void;
}

const CalculationSummaryPanel = ({ zakatEntries, onAddCard }: CalculationSummaryPanelProps) => {
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [netZakatableAssets, setNetZakatableAssets] = useState(0);
  const [zakatDue, setZakatDue] = useState(0);
  
  const nisabThreshold = 275000; // PKR
  const GOLD_RATE_PER_GRAM = 28200;
  const SILVER_RATE_PER_GRAM = 350;

  useEffect(() => {
    // Calculate total assets with gold/silver conversion
    const assets = zakatEntries
      .filter(entry => entry.type === 'Asset')
      .reduce((sum, entry) => {
        if (entry.category === 'Gold') {
          return sum + (entry.amount * GOLD_RATE_PER_GRAM);
        } else if (entry.category === 'Silver') {
          return sum + (entry.amount * SILVER_RATE_PER_GRAM);
        } else {
          return sum + entry.amount;
        }
      }, 0);
    
    // Calculate total liabilities
    const liabilities = zakatEntries
      .filter(entry => entry.type === 'Liability')
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    // Calculate net zakatable assets
    const netAssets = assets - liabilities;
    
    // Calculate zakat due
    const zakat = netAssets > nisabThreshold ? netAssets * 0.025 : 0;
    
    setTotalAssets(assets);
    setTotalLiabilities(liabilities);
    setNetZakatableAssets(netAssets);
    setZakatDue(zakat);
  }, [zakatEntries, nisabThreshold, GOLD_RATE_PER_GRAM, SILVER_RATE_PER_GRAM]);

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString('en-US')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface-elevated/95 backdrop-blur-sm border-t border-border/50 shadow-lg z-10">
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
              className="p-2 hover:bg-accent rounded-lg transition-all duration-200 hover:scale-105 group"
              aria-label="Show detailed breakdown"
            >
              <ChevronUp size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </div>
          
          {/* Integrated FAB - Right Side */}
          <button 
            onClick={onAddCard} 
            aria-label="Add new calculation" 
            className="h-12 w-12 bg-primary text-primary-foreground rounded-xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 ease-out flex items-center justify-center group"
          >
            <Plus size={20} strokeWidth={2.5} className="group-active:rotate-90 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculationSummaryPanel;