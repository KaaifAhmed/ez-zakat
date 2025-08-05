import { useState, useEffect } from "react";
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
  amount: number | string;
  notes: string;
  karat?: string;
  weight?: number;
}

interface ZakatEntryCardProps {
  entry: ZakatEntry;
  onDelete?: () => void;
  onEdit?: () => void;
  onUpdateEntry?: (id: number, field: keyof ZakatEntry, value: any) => void;
}

const ZakatEntryCard = ({ entry, onDelete, onEdit, onUpdateEntry }: ZakatEntryCardProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(entry.amount === '' || entry.amount === 0); // New cards start in edit mode
  const [entryType, setEntryType] = useState<EntryType>(entry.type);
  const [category, setCategory] = useState<string>(entry.category);
  const [amount, setAmount] = useState<string>(entry.amount.toString());
  const [notes, setNotes] = useState<string>(entry.notes);
  const [karat, setKarat] = useState<string>(entry.karat || "");
  const [weight, setWeight] = useState<string>(entry.weight?.toString() || "");

  const assetCategories = [
    "Cash",
    "Gold", 
    "Silver",
    "Business Inventory",
    "Receivables"
  ];

  const liabilityCategories = [
    "Personal Debt",
    "Business Loan", 
    "Other Payables"
  ];

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

  const currentCategories = entryType === "Asset" ? assetCategories : liabilityCategories;
  const isGoldOrSilver = category === "Gold" || category === "Silver";

  // Auto-calculate amount when weight or karat changes for Gold/Silver
  useEffect(() => {
    if (isGoldOrSilver && weight && karat) {
      const rates = category === "Gold" ? goldKaratRates : silverKaratRates;
      const rate = rates[karat as keyof typeof rates];
      if (rate) {
        const calculatedAmount = parseFloat(weight) * rate;
        setAmount(calculatedAmount.toString());
        onUpdateEntry?.(entry.id, 'amount', calculatedAmount);
      }
    }
  }, [weight, karat, category, isGoldOrSilver, entry.id, onUpdateEntry]);

  // Reset category when type changes
  const handleTypeChange = (newType: EntryType) => {
    setEntryType(newType);
    setCategory("");
    setKarat("");
    setWeight("");
    onUpdateEntry?.(entry.id, 'type', newType);
    onUpdateEntry?.(entry.id, 'category', "");
    onUpdateEntry?.(entry.id, 'karat', "");
    onUpdateEntry?.(entry.id, 'weight', 0);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setKarat("");
    setWeight("");
    setAmount("0");
    onUpdateEntry?.(entry.id, 'category', newCategory);
    onUpdateEntry?.(entry.id, 'karat', "");
    onUpdateEntry?.(entry.id, 'weight', 0);
    onUpdateEntry?.(entry.id, 'amount', 0);
  };

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    const numericAmount = parseFloat(newAmount) || 0;
    onUpdateEntry?.(entry.id, 'amount', numericAmount);
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

  const formatAmount = (amount: number) => {
    return `PKR ${amount.toLocaleString('en-US')}`;
  };

  if (!isEditing) {
    // View Mode - Display only
    return (
      <div className="bg-surface-card rounded-xl shadow-card p-6 border border-border/30 hover:shadow-md hover:border-border/60 transition-all duration-300 group scale-95 hover:scale-100">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {entryType}
              </span>
              <h3 className="text-lg font-bold text-foreground mt-1">
                {category || "No category"}
              </h3>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              entryType === "Asset" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
            }`}>
              {entryType}
            </span>
          </div>
          
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Amount:</span>
              <p className="text-xl font-bold text-foreground">
                {formatAmount(parseFloat(amount) || 0)}
              </p>
            </div>
            
            {isGoldOrSilver && karat && (
              <div>
                <span className="text-sm text-muted-foreground">Karat & Weight:</span>
                <p className="text-sm font-medium text-foreground">
                  {karat} • {weight}g
                </p>
              </div>
            )}
            
            {notes && (
              <div>
                <span className="text-sm text-muted-foreground">Notes:</span>
                <p className="text-sm text-foreground">{notes}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Icons */}
        <div className="flex justify-end gap-2 mt-4 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105 transition-all duration-150"
          >
            <Edit3 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:scale-105 transition-all duration-150"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    );
  }

  // Edit Mode - Full form
  return (
    <div className="bg-surface-card rounded-xl shadow-elevated p-6 border border-border/30 hover:shadow-md hover:border-border/60 transition-all duration-300 group">
      {/* Type Selector - Segmented Control */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-foreground mb-3 block">Type</Label>
        <div className="flex bg-muted/50 rounded-lg p-1 border border-border/20">
          <button
            onClick={() => handleTypeChange("Asset")}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all duration-150 ${
              entryType === "Asset"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Asset
          </button>
          <button
            onClick={() => handleTypeChange("Liability")}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all duration-150 ${
              entryType === "Liability"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
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
            {currentCategories.map((cat) => (
              <SelectItem key={cat} value={cat} className="hover:bg-accent hover:text-accent-foreground">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Karat Selection for Gold/Silver */}
      {isGoldOrSilver && (
        <div className="mb-5">
          <Label htmlFor="karat" className="text-sm font-medium text-foreground mb-3 block">
            Karat
          </Label>
          <Select value={karat} onValueChange={handleKaratChange}>
            <SelectTrigger id="karat" className="bg-background">
              <SelectValue placeholder="Select karat" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border shadow-md z-50">
              {Object.entries(category === "Gold" ? goldKaratRates : silverKaratRates).map(([karatValue, rate]) => (
                <SelectItem key={karatValue} value={karatValue} className="hover:bg-accent hover:text-accent-foreground">
                  {karatValue} (PKR {rate.toLocaleString()}/gram)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Weight Input for Gold/Silver or Amount Input for others */}
      <div className="mb-5">
        <Label htmlFor={isGoldOrSilver ? "weight" : "amount"} className="text-sm font-medium text-foreground mb-3 block">
          {isGoldOrSilver ? "Weight (grams)" : "Amount (PKR)"}
        </Label>
        {isGoldOrSilver ? (
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            placeholder="Enter weight in grams"
            className="bg-background"
            disabled={!karat}
          />
        ) : (
          <Input
            id="amount"
            type="number"
            value={amount === '0' ? '' : amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="Enter amount"
            className="bg-background"
          />
        )}
      </div>

      {/* Calculated Amount Display for Gold/Silver */}
      {isGoldOrSilver && karat && weight && (
        <div className="mb-5 p-4 bg-muted/30 rounded-lg border border-border/20">
          <Label className="text-sm font-medium text-foreground mb-2 block">
            Calculated Value
          </Label>
          <div className="text-lg font-bold text-primary">
            {formatAmount(parseFloat(amount) || 0)}
          </div>
          <div className="text-sm text-muted-foreground">
            {weight}g × PKR {(category === "Gold" ? goldKaratRates : silverKaratRates)[karat as keyof typeof goldKaratRates]?.toLocaleString()}/gram
          </div>
        </div>
      )}

      {/* Notes Field */}
      <div className="mb-8">
        <Label htmlFor="notes" className="text-sm font-medium text-foreground mb-3 block">
          Notes (optional)
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Add any additional notes..."
          className="bg-background min-h-[80px] resize-none"
        />
      </div>

      {/* Action Icons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(false)}
          className="text-sm"
        >
          Done Editing
        </Button>
        <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105 transition-all duration-150"
          >
            <Edit3 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:scale-105 transition-all duration-150"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ZakatEntryCard;