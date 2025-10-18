import { Card, CardContent } from '@/components/ui/card';

interface DisbursementCardProps {
  notes: string | null;
  dateOfPayment: string;
  amountPaid: number;
}

export const DisbursementCard = ({ notes, dateOfPayment, amountPaid }: DisbursementCardProps) => {
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

  return (
    <Card className="bg-surface-card border-border shadow-card hover:shadow-md transition-shadow">
      <CardContent className="p-4">
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
          
          {/* Right Column - Amount */}
          <div className="flex-shrink-0">
            <p className="font-bold text-primary text-lg whitespace-nowrap">
              {formatCurrency(amountPaid)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
