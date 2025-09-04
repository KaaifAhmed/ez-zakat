import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Session } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ZakatEntryCard from "../components/ZakatEntryCard";
import CalculationSummaryPanel from "../components/CalculationSummaryPanel";
import { useCurrencyData } from "../hooks/useCurrencyData";

interface ZakatCalculatorProps {
  user: User | null;
  session: Session | null;
}

interface ZakatEntry {
  id: number;
  type: 'Asset' | 'Liability';
  category: string;
  amount?: number | string; // Only for non-Gold/Silver assets
  notes: string;
  karat?: string;
  weight?: number; // For Gold/Silver
  unit?: 'gram' | 'tola'; // For Gold/Silver
  currency?: string; // For Cash
}

const ZakatCalculator = ({ user, session }: ZakatCalculatorProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currencyRates, currencySymbols, loading: currencyLoading } = useCurrencyData();
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const [zakatEntries, setZakatEntries] = useState<ZakatEntry[]>([
    { id: 1, type: 'Asset', category: 'Cash', amount: '250000', notes: 'Cash in hand', currency: 'PKR' }
  ]);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);

  const categorySequence = ['Cash', 'Gold', 'Silver', 'Business Inventory', 'Receivables', 'Personal Debt', 'Business Loan', 'Other Payables'];

  const handleAddCard = () => {
    if (zakatEntries.length === 0) {
      // Add the detailed example card when starting from empty
      const newEntry: ZakatEntry = {
        id: Date.now(),
        type: 'Asset',
        category: 'Cash',
        amount: '250000',
        notes: 'Cash in hand',
        currency: 'PKR'
      };
      setZakatEntries([newEntry]);
      setEditingCardId(newEntry.id);
      return;
    }

    // Get the last card's category to determine the next one
    const lastEntry = zakatEntries[zakatEntries.length - 1];
    const lastCategoryIndex = categorySequence.indexOf(lastEntry.category);
    const nextCategoryIndex = (lastCategoryIndex + 1) % categorySequence.length;
    const nextCategory = categorySequence[nextCategoryIndex];

    const liabilityCategories = ['Personal Debt', 'Business Loan', 'Other Payables'];
    const isGoldOrSilver = nextCategory === 'Gold' || nextCategory === 'Silver';
    const isLiability = liabilityCategories.includes(nextCategory);

    const newEntry: ZakatEntry = {
      id: Date.now(),
      type: isLiability ? 'Liability' : 'Asset',
      category: nextCategory,
      amount: isGoldOrSilver ? undefined : '',
      notes: '',
      weight: isGoldOrSilver ? 0 : undefined,
      unit: isGoldOrSilver ? 'gram' : undefined,
      karat: isGoldOrSilver ? '' : undefined,
      currency: nextCategory === 'Cash' ? 'PKR' : undefined
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
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Zakat Calculator</h1>
          
          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserIcon size={16} />
                  <span>{user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth")}
              >
                <LogIn size={16} />
                Sign In
              </Button>
            )}
          </div>
        </div>

        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 font-inter relative">
          {/* Main Content Area */}
          <main className="flex-1 p-6 pb-36 mb-10 relative z-10">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
                {zakatEntries.map(entry => <div key={entry.id} className="animate-fade-in-up" data-card-id={entry.id}>
                  <ZakatEntryCard 
                    entry={entry}
                    isEditing={editingCardId === entry.id}
                    editingCardId={editingCardId}
                    onDelete={() => handleDelete(entry.id)} 
                    onEdit={() => setEditingCardId(entry.id)}
                    onUpdateEntry={handleUpdateEntry}
                    onDoneEditing={handleDoneEditing}
                    currencySymbols={currencySymbols}
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
            currencyRates={currencyRates}
            currencySymbols={currencySymbols}
          />
        </div>
      </div>
    </div>
  );
};
export default ZakatCalculator;