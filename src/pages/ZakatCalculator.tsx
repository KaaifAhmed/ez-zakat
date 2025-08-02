import { useState } from "react";
import { Plus, Calculator } from "lucide-react";
import ZakatEntryCard from "@/components/ZakatEntryCard";
import CalculationSummaryPanel from "@/components/CalculationSummaryPanel";
interface ZakatEntry {
  id: number;
  type: 'Asset' | 'Liability';
  category: string;
  amount: number;
  notes: string;
}
const ZakatCalculator = () => {
  const [zakatEntries, setZakatEntries] = useState<ZakatEntry[]>([{
    id: 1,
    type: 'Asset',
    category: 'Cash',
    amount: 0,
    notes: ''
  }]);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const handleAddCard = () => {
    const newEntry: ZakatEntry = {
      id: Date.now(),
      type: 'Asset',
      category: 'Cash',
      amount: 0,
      notes: ''
    };
    setZakatEntries(prev => [...prev, newEntry]);
  };
  const handleDelete = (id: number) => {
    setZakatEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleUpdateEntry = (id: number, field: keyof ZakatEntry, value: any) => {
    setZakatEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };
  return <div className="min-h-screen bg-background font-inter">
      {/* Top Header */}
      <header className="bg-surface-elevated border-b border-border px-6 py-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Zakat Calculator
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track and fulfill your zakat easily
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 pb-36 mb-10 ">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
          {zakatEntries.map(entry => <div key={entry.id} className="animate-fade-in-up">
              <ZakatEntryCard 
                entry={entry}
                onDelete={() => handleDelete(entry.id)} 
                onEdit={() => {/* TODO: Add edit functionality */}}
                onUpdateEntry={handleUpdateEntry}
              />
            </div>)}
        </div>
      </main>

      {/* Calculation Summary Panel with integrated FAB */}
      <CalculationSummaryPanel 
        zakatEntries={zakatEntries} 
        onAddCard={handleAddCard}
        isSummaryExpanded={isSummaryExpanded}
        onToggleSummary={() => setIsSummaryExpanded(!isSummaryExpanded)}
      />
    </div>;
};
export default ZakatCalculator;