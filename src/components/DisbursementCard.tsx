import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DisbursementCardProps {
  id: string;
  notes: string | null;
  dateOfPayment: string;
  amountPaid: number;
  onDelete: (id: string) => Promise<void>;
}

export const DisbursementCard = ({ id, notes, dateOfPayment, amountPaid, onDelete }: DisbursementCardProps) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(id);
    } finally {
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  };

  return (
    <Card className="bg-surface-card border-border shadow-card hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {!isConfirmingDelete ? (
          <div className="flex justify-between items-center gap-4">
            {/* Left Column - Details */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-base truncate">
                {notes || 'Payment'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDate(dateOfPayment)}
              </p>
            </div>
            
            {/* Right Column - Amount & Delete Button */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <p className="font-bold text-primary text-lg whitespace-nowrap">
                {formatCurrency(amountPaid)}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsConfirmingDelete(true)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-foreground font-medium">Are you sure you want to delete this payment?</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsConfirmingDelete(false)}
                disabled={isDeleting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
