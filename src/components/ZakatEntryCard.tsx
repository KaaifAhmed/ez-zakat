import { useState, useEffect, useRef } from "react";
import { Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
type EntryType = "Asset" | "Liability";
interface ZakatEntry {
  id: number;
  type: 'Asset' | 'Liability';
  category: string;
  amount?: number | string; // Only for non-Gold/Silver assets
  notes: string;
  karat?: string;
  weight?: number; // For Gold/Silver
  unit?: 'gram' | 'tola'; // For Gold/Silver
  currency?: 'PKR' | 'USD' | 'EUR' | 'GBP' | 'SAR' | 'AED'; // For Cash
}
interface ZakatEntryCardProps {
  entry: ZakatEntry;
  isEditing?: boolean;
  editingCardId?: number | null;
  onDelete?: () => void;
  onEdit?: () => void;
  onUpdateEntry?: (id: number, field: keyof ZakatEntry, value: any) => void;
  onDoneEditing?: () => void;
}
const ZakatEntryCard = ({
  entry,
  isEditing = false,
  editingCardId = null,
  onDelete,
  onEdit,
  onUpdateEntry,
  onDoneEditing
}: ZakatEntryCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [entryType, setEntryType] = useState<EntryType>(entry.type);
  const [category, setCategory] = useState<string>(entry.category);
  const initialAmountDigits = (entry.amount?.toString().replace(/\D/g, '') || "");
  const [amount, setAmount] = useState<string>(initialAmountDigits);
  const [displayAmount, setDisplayAmount] = useState<string>(initialAmountDigits ? new Intl.NumberFormat().format(parseInt(initialAmountDigits, 10)) : "");
  const [notes, setNotes] = useState<string>(entry.notes);
  const [karat, setKarat] = useState<string>(entry.karat || "");
  const [weight, setWeight] = useState<string>(entry.weight?.toString() || "");
  const [unit, setUnit] = useState<'gram' | 'tola'>(entry.unit || 'gram');
  const [currency, setCurrency] = useState<'PKR' | 'USD' | 'EUR' | 'GBP' | 'SAR' | 'AED'>(entry.currency || 'PKR');
  const amountInputRef = useRef<HTMLInputElement>(null);
  const assetCategories = ["Cash", "Gold", "Silver", "Business Inventory", "Receivables"];
  const liabilityCategories = ["Personal Debt", "Business Loan", "Other Payables"];
  const goldKaratRates = {
    "24K": 30650,
    "22K": 28100,
    "21K": 26800,
    "18K": 23000
  };
  const silverKaratRates = {
    "24K": 340,
    "22K": 310,
    "21K": 290
  };
  
  const TOLA_TO_GRAM = 11.664;
  const currentCategories = entryType === "Asset" ? assetCategories : liabilityCategories;
  const isGoldOrSilver = category === "Gold" || category === "Silver";

  // Update weight and unit for Gold/Silver entries
  useEffect(() => {
    if (isGoldOrSilver) {
      onUpdateEntry?.(entry.id, 'weight', parseFloat(weight) || 0);
      onUpdateEntry?.(entry.id, 'unit', unit);
      onUpdateEntry?.(entry.id, 'karat', karat);
    }
  }, [weight, unit, karat, isGoldOrSilver, entry.id, onUpdateEntry]);

  // Reset category when type changes
  const handleTypeChange = (newType: EntryType) => {
    setEntryType(newType);
    setCategory("");
    setKarat("");
    setWeight("");
    setAmount("0");
    setUnit('gram');
    onUpdateEntry?.(entry.id, 'type', newType);
    onUpdateEntry?.(entry.id, 'category', "");
    onUpdateEntry?.(entry.id, 'karat', "");
    onUpdateEntry?.(entry.id, 'weight', 0);
    onUpdateEntry?.(entry.id, 'amount', 0);
    onUpdateEntry?.(entry.id, 'unit', 'gram');
    onUpdateEntry?.(entry.id, 'currency', undefined);
  };
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setKarat("");
    setWeight("");
    setAmount("0");
    setUnit('gram');
    if (newCategory === 'Cash') {
      setCurrency('PKR');
      onUpdateEntry?.(entry.id, 'currency', 'PKR');
    } else {
      onUpdateEntry?.(entry.id, 'currency', undefined);
    }
    onUpdateEntry?.(entry.id, 'category', newCategory);
    onUpdateEntry?.(entry.id, 'karat', "");
    onUpdateEntry?.(entry.id, 'weight', 0);
    onUpdateEntry?.(entry.id, 'amount', 0);
    onUpdateEntry?.(entry.id, 'unit', 'gram');
  };
  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = amountInputRef.current;
    const rawValue = e.target.value;
    const caretPos = inputEl?.selectionStart ?? rawValue.length;

    // Count digits before caret in current input
    const digitsBeforeCaret = rawValue.slice(0, caretPos).replace(/\D/g, '').length;

    // Clean to digits-only source of truth
    const digits = rawValue.replace(/\D/g, '');
    setAmount(digits);

    // Format for display
    const formatted = digits ? new Intl.NumberFormat().format(parseInt(digits, 10)) : "";
    setDisplayAmount(formatted);

    // Update parent with numeric value
    const numericAmount = digits ? parseInt(digits, 10) : 0;
    onUpdateEntry?.(entry.id, 'amount', numericAmount);

    // Restore caret to appropriate position
    requestAnimationFrame(() => {
      if (!inputEl) return;
      let digitCount = 0;
      let newCaret = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) {
          digitCount++;
        }
        if (digitCount === digitsBeforeCaret) {
          newCaret = i + 1;
          break;
        }
      }
      if (digitsBeforeCaret === 0) newCaret = 0;
      if (digitsBeforeCaret >= (digits.length)) newCaret = formatted.length;
      inputEl.setSelectionRange(newCaret, newCaret);
    });
  };
  const handleWeightChange = (newWeight: string) => {
    setWeight(newWeight);
    const numericWeight = parseFloat(newWeight) || 0;
    onUpdateEntry?.(entry.id, 'weight', numericWeight);
  };
  const handleKaratChange = (newKarat: string) => {
    setKarat(newKarat);
    onUpdateEntry?.(entry.id, 'karat', newKarat);
  };
  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    onUpdateEntry?.(entry.id, 'notes', newNotes);
  };

  const handleUnitChange = (newUnit: 'gram' | 'tola') => {
    setUnit(newUnit);
    onUpdateEntry?.(entry.id, 'unit', newUnit);
  };

  const handleCurrencyChange = (newCurrency: 'PKR' | 'USD' | 'EUR' | 'GBP' | 'SAR' | 'AED') => {
    setCurrency(newCurrency);
    onUpdateEntry?.(entry.id, 'currency', newCurrency);
  };
  // Calculate display value for Gold/Silver
  const getGoldSilverDisplayValue = () => {
    if (!isGoldOrSilver || !weight || !karat) return 0;
    
    const rates = category === "Gold" ? goldKaratRates : silverKaratRates;
    const rate = rates[karat as keyof typeof rates];
    if (!rate) return 0;
    
    const weightInGrams = unit === 'tola' ? parseFloat(weight) * TOLA_TO_GRAM : parseFloat(weight);
    return weightInGrams * rate;
  };

  const handleNotesKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onDoneEditing?.();
    }
  };

  const handleDeleteClick = () => {
    if (showDeleteConfirm) {
      onDelete?.();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  const formatAmountPKR = (amount: number) => {
    return `PKR ${amount.toLocaleString('en-US')}`;
  };
  const formatAmountWithCurrency = (code: string, amount: number) => {
    return `${code} ${amount.toLocaleString('en-US')}`;
  };
  if (!isEditing) {
    // View Mode - Display only
    return <div className="bg-surface-card rounded-xl shadow-card p-6 border border-border/30 hover:shadow-md hover:border-border/60 transition-all duration-300 group scale-95 hover:scale-100">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              
              <h3 className="text-lg font-bold text-foreground mt-1">
                {category || "No category"}
              </h3>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${entryType === "Asset" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
              {entryType}
            </span>
          </div>
          
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">
                {isGoldOrSilver ? "Calculated Value:" : "Amount:"}
              </span>
              <p className="text-xl font-bold text-foreground">
                {isGoldOrSilver
                  ? formatAmountPKR(getGoldSilverDisplayValue())
                  : (category === 'Cash'
                      ? formatAmountWithCurrency(currency, parseFloat(amount) || 0)
                      : formatAmountPKR(parseFloat(amount) || 0)
                    )}
              </p>
            </div>
            
            {isGoldOrSilver && <div>
                <span className="text-sm text-muted-foreground">Details:</span>
                <p className="text-sm font-medium text-foreground">
                  {karat && `${karat} • `}{weight}{unit === 'tola' ? ' tola' : 'g'}
                </p>
              </div>}
            
            {notes && <div>
                <span className="text-sm text-muted-foreground">Notes:</span>
                <p className="text-sm text-foreground">{notes}</p>
              </div>}
          </div>
        </div>
        
        {/* Action Icons */}
        {entry.id !== editingCardId && (!showDeleteConfirm ? (
          <div className="flex justify-end gap-2 mt-4 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
            <Button variant="ghost" size="icon" onClick={onEdit} className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105 transition-all duration-150">
              <Edit3 size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDeleteClick} className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:scale-105 transition-all duration-150">
              <Trash2 size={16} />
            </Button>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
            <p className="text-sm text-foreground mb-3">Are you sure you want to delete?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={handleCancelDelete} className="text-sm">
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteClick} className="text-sm">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>;
  }

  // Edit Mode - Full form
  return <div className="bg-surface-card rounded-xl shadow-elevated p-6 border border-border/30 hover:shadow-md hover:border-border/60 transition-all duration-300 group">
      {/* Type Selector - Segmented Control */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-foreground mb-3 block">Type</Label>
        <div className="flex bg-muted/50 rounded-lg p-1 border border-border/20">
          <button onClick={() => handleTypeChange("Asset")} className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all duration-150 ${entryType === "Asset" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            Asset
          </button>
          <button onClick={() => handleTypeChange("Liability")} className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all duration-150 ${entryType === "Liability" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            Liability
          </button>
        </div>
      </div>

      {/* Category Selector */}
      <div className="mb-5">
        <Label htmlFor="category" className="text-sm font-medium text-foreground mb-3 block">
          Category
        </Label>
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category" className="bg-background">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border shadow-md z-50">
            {currentCategories.map(cat => <SelectItem key={cat} value={cat} className="hover:bg-accent hover:text-accent-foreground">
                {cat}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Currency for Cash */}
      {category === 'Cash' && (
        <div className="mb-5">
          <Label htmlFor="currency" className="text-sm font-medium text-foreground mb-3 block">
            Currency
          </Label>
          <Select value={currency} onValueChange={(v) => handleCurrencyChange(v as any)}>
            <SelectTrigger id="currency" className="bg-background">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border shadow-md z-50">
              <SelectItem value="PKR" className="hover:bg-accent hover:text-accent-foreground">PKR (Pakistani Rupee)</SelectItem>
              <SelectItem value="USD" className="hover:bg-accent hover:text-accent-foreground">USD (US Dollar)</SelectItem>
              <SelectItem value="EUR" className="hover:bg-accent hover:text-accent-foreground">EUR (Euro)</SelectItem>
              <SelectItem value="GBP" className="hover:bg-accent hover:text-accent-foreground">GBP (British Pound)</SelectItem>
              <SelectItem value="SAR" className="hover:bg-accent hover:text-accent-foreground">SAR (Saudi Riyal)</SelectItem>
              <SelectItem value="AED" className="hover:bg-accent hover:text-accent-foreground">AED (UAE Dirham)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Karat Selection for Gold/Silver */}
      {isGoldOrSilver && <div className="mb-5">
          <Label htmlFor="karat" className="text-sm font-medium text-foreground mb-3 block">
            Karat
          </Label>
          <Select value={karat} onValueChange={handleKaratChange}>
            <SelectTrigger id="karat" className="bg-background">
              <SelectValue placeholder="Select karat" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border shadow-md z-50">
              {Object.keys(category === "Gold" ? goldKaratRates : silverKaratRates).map((karatValue) => <SelectItem key={karatValue} value={karatValue} className="hover:bg-accent hover:text-accent-foreground">
                  {karatValue}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>}

      {/* Unit Toggle for Gold/Silver */}
      {isGoldOrSilver && <div className="mb-5">
          <Label className="text-sm font-medium text-foreground mb-3 block">Unit</Label>
          <div className="flex bg-muted/50 rounded-lg p-1 border border-border/20">
            <button onClick={() => handleUnitChange('gram')} className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all duration-150 ${unit === 'gram' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              Gram
            </button>
            <button onClick={() => handleUnitChange('tola')} className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all duration-150 ${unit === 'tola' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              Tola
            </button>
          </div>
        </div>}

      {/* Weight Input for Gold/Silver or Amount Input for others */}
      <div className="mb-5">
        <Label htmlFor={isGoldOrSilver ? "weight" : "amount"} className="text-sm font-medium text-foreground mb-3 block">
          {isGoldOrSilver ? `Weight (${unit === 'tola' ? 'tola' : 'grams'})` : `Amount (${category === 'Cash' ? currency : 'PKR'})`}
        </Label>
        {isGoldOrSilver ? <Input id="weight" type="number" value={weight} onChange={e => handleWeightChange(e.target.value)} placeholder={`Enter weight in ${unit === 'tola' ? 'tola' : 'grams'}`} className="bg-background" disabled={!karat} /> : <Input id="amount" type="text" ref={amountInputRef} value={displayAmount} onChange={handleAmountInputChange} placeholder="Enter amount" className="bg-background" />}
      </div>

      {/* Calculated Amount Display for Gold/Silver */}
      {isGoldOrSilver && karat && weight && <div className="mb-5 p-4 bg-muted/30 rounded-lg border border-border/20">
          <Label className="text-sm font-medium text-foreground mb-2 block">
            Calculated Value
          </Label>
          <div className="text-lg font-bold text-primary">
            {formatAmountPKR(getGoldSilverDisplayValue())}
          </div>
          <div className="text-sm text-muted-foreground">
            {weight} {unit === 'tola' ? 'tola' : 'g'} × PKR {(category === "Gold" ? goldKaratRates : silverKaratRates)[karat as keyof typeof goldKaratRates]?.toLocaleString()}/gram
            {unit === 'tola' && ` (${(parseFloat(weight) * TOLA_TO_GRAM).toFixed(2)}g)`}
          </div>
        </div>}

      {/* Notes Field */}
      <div className="mb-8">
        <Label htmlFor="notes" className="text-sm font-medium text-foreground mb-3 block">
          Notes (optional)
        </Label>
        <Textarea id="notes" value={notes} onChange={e => handleNotesChange(e.target.value)} onKeyDown={handleNotesKeyDown} placeholder="Add any additional notes..." className="bg-background min-h-[80px] resize-none" />
      </div>

      {/* Action Icons */}
      {entry.id !== editingCardId && (!showDeleteConfirm ? (
        <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
          <Button variant="ghost" size="icon" onClick={onEdit} className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105 transition-all duration-150">
            <Edit3 size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDeleteClick} className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:scale-105 transition-all duration-150">
            <Trash2 size={16} />
          </Button>
        </div>
      ) : (
        <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/20">
          <p className="text-sm text-foreground mb-3">Are you sure you want to delete?</p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleCancelDelete} className="text-sm">
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteClick} className="text-sm">
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>;
};
export default ZakatEntryCard;