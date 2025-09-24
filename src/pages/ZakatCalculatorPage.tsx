import { User, Session } from '@supabase/supabase-js';
import { ZakatProvider, useZakat } from '@/context/ZakatContext';
import { Header } from '@/components/Header';
import ZakatEntryCard from '@/components/ZakatEntryCard';
import CalculationSummaryPanel from '@/components/CalculationSummaryPanel';
import { Button } from '@/components/ui/button';

interface ZakatCalculatorProps {
  user: User | null;
  session: Session | null;
}

const ZakatCalculatorContent = ({ user }: { user: User | null }) => {
  const {
    zakatEntries,
    editingCardId,
    isSummaryExpanded,
    currencyRates,
    currencySymbols,
    handleAddCard,
    handleDeleteEntry,
    handleUpdateEntry,
    handleDoneEditing,
    handleSaveAndProceed,
    setEditingCardId,
    setIsSummaryExpanded,
  } = useZakat();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <Header user={user} />

        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 font-inter relative">
          {/* Main Content Area */}
          <main className="flex-1 p-6 pb-36 mb-10 relative z-10">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
              {zakatEntries.map(entry => (
                <div key={entry.id} className="animate-fade-in-up" data-card-id={entry.id}>
                  <ZakatEntryCard 
                    entry={entry}
                    isEditing={editingCardId === entry.id}
                    editingCardId={editingCardId}
                    onDelete={() => handleDeleteEntry(entry.id)} 
                    onEdit={() => setEditingCardId(entry.id)}
                    onUpdateEntry={handleUpdateEntry}
                    onDoneEditing={handleDoneEditing}
                    currencySymbols={currencySymbols}
                  />
                </div>
              ))}
            </div>

            {/* Save & Proceed Button */}
            {zakatEntries.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={handleSaveAndProceed}
                  className="w-full max-w-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg py-3 px-6 font-medium transition-colors"
                >
                  Save & Proceed to Dashboard
                </Button>
              </div>
            )}
          </main>

          {/* Calculation Summary Panel with integrated FAB */}
          <CalculationSummaryPanel 
            zakatEntries={zakatEntries} 
            onAddCard={handleAddCard}
            onDoneEditing={handleDoneEditing}
            isEditing={editingCardId !== null}
            isSummaryExpanded={isSummaryExpanded}
            onToggleSummary={() => setIsSummaryExpanded(!isSummaryExpanded)}
            currencyRates={currencyRates}
            currencySymbols={currencySymbols}
          />
        </div>
      </div>
    </div>
  );
};

const ZakatCalculatorPage = ({ user, session }: ZakatCalculatorProps) => {
  return (
    <ZakatProvider user={user} session={session}>
      <ZakatCalculatorContent user={user} />
    </ZakatProvider>
  );
};

export default ZakatCalculatorPage;