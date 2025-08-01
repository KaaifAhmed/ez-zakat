import { useState } from "react";
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
  amount: number;
  notes: string;
}

interface ZakatEntryCardProps {
  entry: ZakatEntry;
  onDelete?: () => void;
  onEdit?: () => void;
  onUpdateEntry?: (id: number, field: keyof ZakatEntry, value: any) => void;
}

const ZakatEntryCard = ({ entry, onDelete, onEdit, onUpdateEntry }: ZakatEntryCardProps) => {
  const [entryType, setEntryType] = useState<EntryType>(entry.type);
  const [category, setCategory] = useState<string>(entry.category);
  const [amount, setAmount] = useState<string>(entry.amount.toString());
  const [notes, setNotes] = useState<string>(entry.notes);

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

  const currentCategories = entryType === "Asset" ? assetCategories : liabilityCategories;

  // Reset category when type changes
  const handleTypeChange = (newType: EntryType) => {
    setEntryType(newType);
    setCategory("");
    onUpdateEntry?.(entry.id, 'type', newType);
    onUpdateEntry?.(entry.id, 'category', "");
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    onUpdateEntry?.(entry.id, 'category', newCategory);
  };

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    const numericAmount = parseFloat(newAmount) || 0;
    onUpdateEntry?.(entry.id, 'amount', numericAmount);
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    onUpdateEntry?.(entry.id, 'notes', newNotes);
  };

  // Dynamic label for amount/weight input
  const getAmountLabel = () => {
    if (category === "Gold" || category === "Silver") {
      return "Weight (grams)";
    }
    return "Amount (PKR)";
  };

  return (
    <div className="bg-surface-card rounded-xl shadow-card p-6 border border-border/30 hover:shadow-md hover:border-border/60 transition-all duration-200 group">
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

      {/* Amount/Weight Input */}
      <div className="mb-5">
        <Label htmlFor="amount" className="text-sm font-medium text-foreground mb-3 block">
          {getAmountLabel()}
        </Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          placeholder={category === "Gold" || category === "Silver" ? "Enter weight" : "Enter amount"}
          className="bg-background"
        />
      </div>

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
      <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
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
  );
};

export default ZakatEntryCard;