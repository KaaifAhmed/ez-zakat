import { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ZakatEntry } from '@/types/zakat';

interface UseZakatDataProps {
  user: User | null;
  session: Session | null;
}

export const useZakatData = ({ user, session }: UseZakatDataProps) => {
  const [zakatEntries, setZakatEntries] = useState<ZakatEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialRender = useRef(true);

  // Load initial data with robust logic
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user;

        // LOGGED-IN USER LOGIC
        if (currentUser) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('zakat_entries')
            .eq('id', currentUser.id)
            .maybeSingle();

          if (error) console.error("Database fetch error:", error);

          // If database has entries, use them
          if (profile && profile.zakat_entries && Array.isArray(profile.zakat_entries) && profile.zakat_entries.length > 0) {
            setZakatEntries(profile.zakat_entries as unknown as ZakatEntry[]);
            setIsLoading(false);
            return;
          }

          // If DB is empty, check localStorage (for guest-to-login transition)
          const localData = localStorage.getItem('zakatCalculatorData');
          if (localData) {
            try {
              const parsedData = JSON.parse(localData);
              if (Array.isArray(parsedData) && parsedData.length > 0) {
                setZakatEntries(parsedData);
                setIsLoading(false);
                return;
              }
            } catch (e) {
              console.warn('Failed to parse localStorage data:', e);
            }
          }
        }

        // GUEST USER LOGIC (or logged-in user with no data anywhere)
        const localData = localStorage.getItem('zakatCalculatorData');
        if (localData) {
          try {
            const parsedData = JSON.parse(localData);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              setZakatEntries(parsedData);
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.warn('Failed to parse localStorage data:', e);
          }
        }

        // No data found anywhere. Setting default card.
        const defaultEntries: ZakatEntry[] = [
          { id: 1, type: 'Asset', category: 'Cash', amount: '250000', notes: 'Cash in hand', currency: 'PKR' }
        ];
        setZakatEntries(defaultEntries);
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
  }, []);

  // Save data with robust logic whenever entries change
  useEffect(() => {
    const saveData = async () => {
      // Prevent saving the initial default card on the very first render
      if (isInitialRender.current) {
        isInitialRender.current = false;
        return;
      }

      if (isLoading || zakatEntries.length === 0) {
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user;

        // LOGGED-IN USER LOGIC
        if (currentUser) {
          const { error } = await supabase
            .from('profiles')
            .update({ zakat_entries: zakatEntries as any })
            .eq('id', currentUser.id);

          if (error) {
            console.error("Error saving to database:", error);
            // Fallback to localStorage
            localStorage.setItem('zakatCalculatorData', JSON.stringify(zakatEntries));
          } else {
            // Clean up local storage after successful DB save
            localStorage.removeItem('zakatCalculatorData');
          }
        }
        // GUEST USER LOGIC
        else {
          localStorage.setItem('zakatCalculatorData', JSON.stringify(zakatEntries));
        }
      } catch (error) {
        console.error('Error saving data:', error);
        // Always fallback to localStorage on error
        localStorage.setItem('zakatCalculatorData', JSON.stringify(zakatEntries));
      }
    };

    // Debounce saves
    const timeoutId = setTimeout(saveData, 500);
    return () => clearTimeout(timeoutId);
  }, [zakatEntries, isLoading]);

  return {
    zakatEntries,
    setZakatEntries,
    isLoading
  };
};