import { useEffect, useState } from "react";

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

  useEffect(() => {
    // Calculate total assets
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
  }, [zakatEntries, nisabThreshold]);

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString('en-US')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-md p-4 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {/* Total Assets */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Total Assets</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(totalAssets)}
            </p>
          </div>

          {/* Total Liabilities */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Total Liabilities</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(totalLiabilities)}
            </p>
          </div>

          {/* Nisab Threshold */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Nisab Threshold</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(nisabThreshold)}
            </p>
          </div>

          {/* Zakat Due - Most Prominent */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Zakat Due</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(zakatDue)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationSummaryPanel;