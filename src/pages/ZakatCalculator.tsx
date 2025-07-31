import { useState } from "react";
import { Plus } from "lucide-react";
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
  const [zakatEntries, setZakatEntries] = useState<ZakatEntry[]>([
    { id: 1, type: 'Asset', category: 'Cash', amount: 0, notes: '' }
  ]);

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

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Top Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <h1 className="text-xl font-bold text-foreground">
          Zakat Calculator
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 pb-32">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
          {zakatEntries.map((entry) => (
            <div 
              key={entry.id} 
              className="animate-fade-in animate-scale-in"
            >
              <ZakatEntryCard 
                onDelete={() => handleDelete(entry.id)}
                onEdit={() => {/* TODO: Add edit functionality */}}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Calculation Summary Panel */}
      <CalculationSummaryPanel zakatEntries={zakatEntries} />

      {/* Floating Action Button */}
      <button
        onClick={handleAddCard}
        className="fixed bottom-32 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-md hover:scale-105 hover:brightness-110 transition-all duration-150 ease-in-out flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Add new calculation"
      >
        <Plus size={24} strokeWidth={2} />
      </button>
    </div>
  );
};

export default ZakatCalculator;