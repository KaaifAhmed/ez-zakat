import { User } from '@supabase/supabase-js';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DashboardPageProps {
  user: User | null;
}

const DashboardPage = ({ user }: DashboardPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <Header user={user} />
        
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 font-inter">
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-16">
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  Zakat Dashboard
                </h1>
                <p className="text-muted-foreground mb-8">
                  Your Zakat calculations have been saved successfully.
                </p>
                
                <div className="space-y-4">
                  <Button 
                    onClick={() => navigate('/')}
                    className="w-full max-w-sm mx-auto"
                  >
                    Return to Calculator
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;