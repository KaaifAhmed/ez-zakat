import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ZakatEntry } from '@/types/zakat';
import { useZakatData } from '@/hooks/useZakatData';
import { useCurrencyRates } from '@/hooks/useCurrencyData';
import { CATEGORY_SEQUENCE, LIABILITY_CATEGORIES } from '@/constants/zakat';
import { calculateZakatSummary } from '@/utils/calculations';

interface ZakatContextType {
  // State
  zakatEntries: ZakatEntry[];
  editingCardId: number | null;
  isSummaryExpanded: boolean;
  currencyRates: Record<string, number>;
  currencySymbols: Record<string, string>;
  isLoading: boolean;
  currencyLoading: boolean;

  // Actions
  handleAddCard: () => void;
  handleDeleteEntry: (id: number) => void;
  handleUpdateEntry: (id: number, field: keyof ZakatEntry, value: any) => void;
  handleDoneEditing: () => void;
  handleSaveAndProceed: () => Promise<void>;
  setEditingCardId: (id: number | null) => void;
  setIsSummaryExpanded: (expanded: boolean) => void;
}

const ZakatContext = createContext<ZakatContextType | undefined>(undefined);

interface ZakatProviderProps {
  children: ReactNode;
  user: User | null;
  session: Session | null;
}

export const ZakatProvider = ({ children, user, session }: ZakatProviderProps) => {
  const { zakatEntries, setZakatEntries, isLoading } = useZakatData({ user, session });
  const { currencyRates, currencySymbols, loading: currencyLoading } = useCurrencyRates();
  const navigate = useNavigate();
  
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const categorySequence = CATEGORY_SEQUENCE;

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

    const liabilityCategories = LIABILITY_CATEGORIES;
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

  const handleDeleteEntry = (id: number) => {
    setZakatEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleUpdateEntry = (id: number, field: keyof ZakatEntry, value: any) => {
    setZakatEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleDoneEditing = () => {
    setEditingCardId(null);
  };

  const handleSaveAndProceed = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check if user is logged in
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      // Calculate final Zakat due amount
      const { zakatDue } = calculateZakatSummary(zakatEntries, currencyRates);
      
      // Update user's profile with zakat_entries and total_zakat_due
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          zakat_entries: zakatEntries as any,
          total_zakat_due: zakatDue 
        })
        .eq('id', session.user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        return;
      }

      // Check if user has any disbursements, if not add default one
      const { data: existingDisbursements, error: fetchError } = await supabase
        .from('disbursements')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);

      if (fetchError) {
        console.error('Error checking disbursements:', fetchError);
      } else if (!existingDisbursements || existingDisbursements.length === 0) {
        // Add default disbursement
        const { error: disbursementError } = await supabase
          .from('disbursements')
          .insert({
            user_id: session.user.id,
            amount_paid: 10000,
            date_of_payment: new Date().toISOString().split('T')[0],
            notes: 'Edhi Foundation'
          });

        if (disbursementError) {
          console.error('Error creating default disbursement:', disbursementError);
        }
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error in handleSaveAndProceed:', error);
    }
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

  const contextValue: ZakatContextType = {
    // State
    zakatEntries,
    editingCardId,
    isSummaryExpanded,
    currencyRates,
    currencySymbols,
    isLoading,
    currencyLoading,

    // Actions
    handleAddCard,
    handleDeleteEntry,
    handleUpdateEntry,
    handleDoneEditing,
    handleSaveAndProceed,
    setEditingCardId,
    setIsSummaryExpanded,
  };

  return (
    <ZakatContext.Provider value={contextValue}>
      {children}
    </ZakatContext.Provider>
  );
};

export const useZakat = () => {
  const context = useContext(ZakatContext);
  if (context === undefined) {
    throw new Error('useZakat must be used within a ZakatProvider');
  }
  return context;
};