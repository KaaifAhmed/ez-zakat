import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Session } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Calculator, LogIn, ArrowRight } from "lucide-react";
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

  const [zakatEntries, setZakatEntries] = useState<ZakatEntry[]>([]);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data from localStorage and database (for logged users)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        if (user) {
          // User is logged in - try to load from database first
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('zakat_entries')
            .eq('id', user.id)
            .maybeSingle();

          if (!error && profile?.zakat_entries) {
            // Data found in database
            const entries = Array.isArray(profile.zakat_entries) ? profile.zakat_entries as unknown as ZakatEntry[] : [];
            if (entries.length > 0) {
              setZakatEntries(entries);
              return;
            }
          }

          // No data in database, check localStorage for migration
          const localData = localStorage.getItem('zakatCalculatorData');
          if (localData) {
            try {
              const parsedData = JSON.parse(localData);
              if (Array.isArray(parsedData) && parsedData.length > 0) {
                setZakatEntries(parsedData);
                // Migrate to database
                await supabase
                  .from('profiles')
                  .update({ zakat_entries: parsedData as any })
                  .eq('id', user.id);
                return;
              }
            } catch (e) {
              console.warn('Failed to parse localStorage data:', e);
            }
          }
        } else {
          // User is not logged in - check localStorage
          const localData = localStorage.getItem('zakatCalculatorData');
          if (localData) {
            try {
              const parsedData = JSON.parse(localData);
              if (Array.isArray(parsedData) && parsedData.length > 0) {
                setZakatEntries(parsedData);
                return;
              }
            } catch (e) {
              console.warn('Failed to parse localStorage data:', e);
            }
          }
        }

        // No data found, set default
        const defaultEntries: ZakatEntry[] = [
          { id: 1, type: 'Asset', category: 'Cash', amount: '250000', notes: 'Cash in hand', currency: 'PKR' }
        ];
        setZakatEntries(defaultEntries);
        localStorage.setItem('zakatCalculatorData', JSON.stringify(defaultEntries));
      } catch (error) {
        console.error('Error loading initial data:', error);
        // Fallback to default
        const defaultEntries: ZakatEntry[] = [
          { id: 1, type: 'Asset', category: 'Cash', amount: '250000', notes: 'Cash in hand', currency: 'PKR' }
        ];
        setZakatEntries(defaultEntries);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [user]);

  // Auto-save to localStorage and database (for logged users)
  useEffect(() => {
    if (!isLoading && zakatEntries.length > 0) {
      const saveData = async () => {
        try {
          if (user) {
            // User is logged in - save to database
            const { error } = await supabase
              .from('profiles')
              .update({ zakat_entries: zakatEntries as any })
              .eq('id', user.id);

            if (!error) {
              // Clear localStorage after successful database save
              localStorage.removeItem('zakatCalculatorData');
            } else {
              console.error('Failed to save to database:', error);
              // Fallback to localStorage
              localStorage.setItem('zakatCalculatorData', JSON.stringify(zakatEntries));
            }
          } else {
            // User is not logged in - save to localStorage
            localStorage.setItem('zakatCalculatorData', JSON.stringify(zakatEntries));
          }
        } catch (error) {
          console.error('Error saving data:', error);
          // Always fallback to localStorage
          localStorage.setItem('zakatCalculatorData', JSON.stringify(zakatEntries));
        }
      };

      const timeoutId = setTimeout(saveData, 500); // Debounce saves
      return () => clearTimeout(timeoutId);
    }
  }, [zakatEntries, user, isLoading]);

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="w-full border-b border-border/60 backdrop-blur mb-8 px-6 py-2 bg-white shadow-sm sticky z-50 top-0 left-0 ">
          <div className="flex items-center justify-between py-4 px-0">
            {/* Left Side - Title and Subtitle */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-foreground">Zakat Calculator</h1>
                <p className="text-sm text-muted-foreground">Track and fulfill your zakat easily</p>
              </div>
            </div>
            
            {/* Right Side - Auth Status */}
            <div className="flex items-center">
              {user ? (
                <button 
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors cursor-pointer"
                  onClick={handleSignOut}
                  title={`Signed in as ${user.email}`}
                >
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="gap-2"
                >
                  <LogIn size={16} />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </header>

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