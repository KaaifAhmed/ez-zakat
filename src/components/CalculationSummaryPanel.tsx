import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

interface ZakatEntry {
  id: number;
  type: 'Asset' | 'Liability';
  category: string;
  amount: number;
  notes: string;
}

interface CalculationSummaryPanelProps {
  zakatEntries: ZakatEntry[];
}

const CalculationSummaryPanel = ({ zakatEntries }: CalculationSummaryPanelProps) => {
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
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg p-4 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Compact Summary - Left Side */}
        <div className="flex items-center gap-3">
          <div>
            <span className="text-sm text-muted-foreground">Zakat Due: </span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(zakatDue)}
            </span>
          </div>
          <button 
            className="p-1 hover:bg-accent rounded-md transition-colors"
            aria-label="Show detailed breakdown"
          >
            <ChevronUp size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculationSummaryPanel;