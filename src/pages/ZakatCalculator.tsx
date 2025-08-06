import { useState, useEffect } from "react";
import { Plus, Calculator } from "lucide-react";
import ZakatEntryCard from "@/components/ZakatEntryCard";
import CalculationSummaryPanel from "@/components/CalculationSummaryPanel";
interface ZakatEntry {
  id: number;
  type: 'Asset' | 'Liability';
  category: string;
  amount: number | string;
  notes: string;
}
const ZakatCalculator = () => {
  const [zakatEntries, setZakatEntries] = useState<ZakatEntry[]>([
    { id: 1, type: 'Asset', category: 'Cash', amount: '250000', notes: 'Cash in hand' }
  ]);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);

  const categorySequence = ['Cash', 'Gold', 'Silver', 'Business Inventory'];

  const handleAddCard = () => {
    // Get the last card's category to determine the next one
    const lastEntry = zakatEntries[zakatEntries.length - 1];
    const lastCategoryIndex = categorySequence.indexOf(lastEntry.category);
    const nextCategoryIndex = (lastCategoryIndex + 1) % categorySequence.length;
    const nextCategory = categorySequence[nextCategoryIndex];

    const newEntry: ZakatEntry = {
      id: Date.now(),
      type: 'Asset',
      category: nextCategory,
      amount: '',
      notes: ''
    };
    setZakatEntries(prev => [...prev, newEntry]);
    setEditingCardId(newEntry.id);
  };

  const handleDoneEditing = () => {
    setEditingCardId(null);
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

  // Auto-focus and scroll to new cards
  useEffect(() => {
    if (zakatEntries.length > 1) {
      const lastEntry = zakatEntries[zakatEntries.length - 1];
      // Scroll to the new card and focus its amount input
      setTimeout(() => {
        const newCardElement = document.querySelector(`[data-card-id="${lastEntry.id}"]`);
        if (newCardElement) {
          newCardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Focus the amount input field
          const amountInput = newCardElement.querySelector('input[type="number"]') as HTMLInputElement;
          if (amountInput) {
            amountInput.focus();
          }
        }
      }, 100);
    }
  }, [zakatEntries.length]);
  return <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 font-inter relative">
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
      <main className="flex-1 p-6 pb-36 mb-10 relative z-10">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
            {zakatEntries.map(entry => <div key={entry.id} className="animate-fade-in-up" data-card-id={entry.id}>
              <ZakatEntryCard 
                entry={entry}
                isEditing={editingCardId === entry.id}
                onDelete={() => handleDelete(entry.id)} 
                onEdit={() => setEditingCardId(entry.id)}
                onUpdateEntry={handleUpdateEntry}
                onDoneEditing={handleDoneEditing}
              />
            </div>)}
        </div>
      </main>

      {/* Calculation Summary Panel with integrated FAB */}
      <CalculationSummaryPanel 
        zakatEntries={zakatEntries} 
        onAddCard={handleAddCard}
        onDoneEditing={handleDoneEditing}
        isEditing={editingCardId !== null}
        isSummaryExpanded={isSummaryExpanded}
        onToggleSummary={() => setIsSummaryExpanded(!isSummaryExpanded)}
      />
    </div>;
};
export default ZakatCalculator;