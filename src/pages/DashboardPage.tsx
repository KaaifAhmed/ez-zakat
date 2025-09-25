import { User } from '@supabase/supabase-js';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
interface DashboardPageProps {
  user: User | null;
}
const DashboardPage = ({
  user
}: DashboardPageProps) => {
  const navigate = useNavigate();
  const [totalDue, setTotalDue] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const remainingBalance = totalDue - amountPaid;
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
        const { data: disbursements, error: disbursementsError } = await supabase
          .from('disbursements')
          .select('amount_paid')
          .eq('user_id', user.id);

        if (disbursementsError) {
          console.error('Error fetching disbursements:', disbursementsError);
          return;
        }

        // Calculate totals
        const totalZakatDue = profile?.total_zakat_due || 0;
        const totalAmountPaid = disbursements?.reduce((sum, d) => sum + Number(d.amount_paid), 0) || 0;

        setTotalDue(totalZakatDue);
        setAmountPaid(totalAmountPaid);
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
                <Card className="bg-surface-card border-border shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Remaining Balance
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
                <Button size="lg" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 p-2 ">
                  + Add Disbursement
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/')} className="flex-1 border-border text-foreground hover:bg-accent hover:text-accent-foreground p-2 ">
                  Edit Assets & Liabilities
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>;
};
export default DashboardPage;