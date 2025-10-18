import { User } from '@supabase/supabase-js';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';
import { DisbursementCard } from '@/components/DisbursementCard';
interface DashboardPageProps {
  user: User | null;
}
const DashboardPage = ({
  user
}: DashboardPageProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [totalDue, setTotalDue] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [disbursements, setDisbursements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [amountError, setAmountError] = useState('');

  const remainingBalance = parseFloat((totalDue - amountPaid).toFixed(2));
  const progressPercentage = totalDue > 0 ? (amountPaid / totalDue) * 100 : 0;
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        setIsLoading(true);

        // Fetch user's profile data for total_zakat_due
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('total_zakat_due')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }

        // Fetch all user's disbursements
        const { data: disbursementsData, error: disbursementsError } = await supabase
          .from('disbursements')
          .select('*')
          .eq('user_id', user.id);

        if (disbursementsError) {
          console.error('Error fetching disbursements:', disbursementsError);
          return;
        }

        // Calculate totals
        const totalZakatDue = profile?.total_zakat_due || 0;
        const totalAmountPaid = disbursementsData?.reduce((sum, d) => sum + Number(d.amount_paid), 0) || 0;

        setTotalDue(totalZakatDue);
        setAmountPaid(totalAmountPaid);
        setDisbursements(disbursementsData || []);
      } catch (error) {
        console.error('Error in fetchDashboardData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSavePayment = async () => {
    if (!user || !formData.amount) {
      toast({
        title: "Error",
        description: "Please enter an amount.",
        variant: "destructive",
      });
      return;
    }

    const enteredAmount = parseFloat(parseFloat(formData.amount).toFixed(2));
    
    // Validate minimum amount
    if (enteredAmount <= 0) {
      setAmountError('Amount must be greater than zero');
      return;
    }
    
    // Validate maximum amount
    if (enteredAmount > remainingBalance) {
      setAmountError(`Amount cannot exceed remaining balance of ${formatCurrency(remainingBalance)}`);
      return;
    }
    
    setAmountError('');

    try {
      const { data: newDisbursement, error } = await supabase
        .from('disbursements')
        .insert({
          user_id: user.id,
          amount_paid: parseFloat(formData.amount),
          date_of_payment: formData.date,
          notes: formData.notes || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving disbursement:', error);
        toast({
          title: "Error",
          description: "Failed to save payment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Update local state for real-time UI update
      setDisbursements(prev => [...prev, newDisbursement]);
      setAmountPaid(prev => prev + parseFloat(formData.amount));

      // Reset form and close modal
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setAmountError('');
      setIsModalOpen(false);

      toast({
        title: "Success",
        description: "Payment recorded successfully!",
      });
    } catch (error) {
      console.error('Error in handleSavePayment:', error);
      toast({
        title: "Error",
        description: "Failed to save payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }
  return <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <Header user={user} />
        
        <div className="bg-background font-inter">
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Page Title */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Zakat Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Track your Zakat obligations and payments
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Due Card */}
                <Card className="bg-surface-card border-border shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Zakat Due
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(totalDue)}
                    </div>
                  </CardContent>
                </Card>

                {/* Amount Paid Card */}
                <Card className="bg-surface-card border-border shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Amount Paid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(amountPaid)}
                    </div>
                  </CardContent>
                </Card>

                {/* Remaining Balance Card */}
                <Card className={`border-border shadow-card ${remainingBalance <= 0 ? 'bg-[#E8F5E9]' : 'bg-surface-card'}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      {remainingBalance <= 0 ? (
                        <>
                          <Check className="w-4 h-4" />
                          Zakat Paid in Full
                        </>
                      ) : (
                        'Remaining Balance'
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(remainingBalance)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Bar */}
              <Card className="bg-surface-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Payment Progress
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {progressPercentage.toFixed(1)}% of Zakat obligation completed
                  </p>
                </CardHeader>
                <CardContent>
                  <Progress value={progressPercentage} className="w-full h-3" />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 p-2"
                  onClick={() => setIsModalOpen(true)}
                  disabled={remainingBalance <= 0}
                >
                  + Add Disbursement
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/')} className="flex-1 border-border text-foreground hover:bg-accent hover:text-accent-foreground p-2 ">
                  Edit Assets & Liabilities
                </Button>
              </div>

              {/* Disbursement History Section */}
              <div className="space-y-4 mt-8">
                <h2 className="text-2xl font-semibold text-foreground">
                  Disbursement History
                </h2>
                
                {disbursements.length === 0 ? (
                  /* Empty State */
                  <Card className="bg-surface-card border-border shadow-card">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground text-base">
                        You haven't logged any payments yet. Click the '+ Add Disbursement' button to get started!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  /* Disbursement List */
                  <div className="space-y-3">
                    {[...disbursements]
                      .sort((a, b) => new Date(b.date_of_payment).getTime() - new Date(a.date_of_payment).getTime())
                      .map((disbursement) => (
                        <DisbursementCard
                          key={disbursement.id}
                          notes={disbursement.notes}
                          dateOfPayment={disbursement.date_of_payment}
                          amountPaid={Number(disbursement.amount_paid)}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* Add Disbursement Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Payment Record</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount Paid *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, amount: e.target.value }));
                    setAmountError('');
                  }}
                  min="0"
                  max={remainingBalance}
                  step="0.01"
                  className="w-full"
                />
                {amountError && (
                  <p className="text-sm text-destructive">{amountError}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date of Payment</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes / Recipient (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="e.g., Edhi Foundation, Local Mosque"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full min-h-[80px]"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePayment}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save Payment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>;
};
export default DashboardPage;