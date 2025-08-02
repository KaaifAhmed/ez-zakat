import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, Plus, X, Info } from "lucide-react";

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
  isSummaryExpanded?: boolean;
  onToggleSummary?: () => void;
}

const CalculationSummaryPanel = ({ zakatEntries, onAddCard, isSummaryExpanded = false, onToggleSummary }: CalculationSummaryPanelProps) => {
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [netZakatableAssets, setNetZakatableAssets] = useState(0);
  const [zakatDue, setZakatDue] = useState(0);
  
  const nisabThreshold = 275000; // PKR
  const GOLD_RATE_PER_GRAM = 28200;
  const SILVER_RATE_PER_GRAM = 350;

  useEffect(() => {
    // Calculate total assets - for gold/silver, use entered amount directly (already calculated with karat rates)
    const assets = zakatEntries
      .filter(entry => entry.type === 'Asset')
      .reduce((sum, entry) => sum + entry.amount, 0);
    
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
    <>
      {/* Overlay */}
      {isSummaryExpanded && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
          onClick={onToggleSummary}
        />
      )}

      {/* Bottom Sheet Panel */}
      {isSummaryExpanded && (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-surface rounded-t-xl shadow-2xl transform transition-transform duration-300 ease-out animate-slide-in-bottom">
          <div className="h-[60vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Zakat Calculation Details</h2>
              <button 
                onClick={onToggleSummary}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                aria-label="Close panel"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Assets and Liabilities */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Assets</span>
                  <span className="font-semibold text-foreground">{formatCurrency(totalAssets)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Liabilities</span>
                  <span className="font-semibold text-destructive">- {formatCurrency(totalLiabilities)}</span>
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Net Zakatable Assets</span>
                    <span className="font-semibold text-foreground">{formatCurrency(netZakatableAssets)}</span>
                  </div>
                </div>
              </div>

              {/* Nisab Information */}
              <div className="bg-accent/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Nisab Threshold</span>
                  <span className="font-semibold text-foreground">{formatCurrency(nisabThreshold)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Info size={14} />
                  <span>Based on 87.48g of silver (612.36 × PKR {SILVER_RATE_PER_GRAM})</span>
                </div>
              </div>

              {/* Final Zakat Due */}
              <div className="bg-primary/5 rounded-lg p-6 text-center border border-primary/20">
                <div className="text-sm text-muted-foreground mb-2">Final Zakat Due</div>
                <div className="text-3xl font-bold text-primary">{formatCurrency(zakatDue)}</div>
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
    </>
  );
};

export default CalculationSummaryPanel;