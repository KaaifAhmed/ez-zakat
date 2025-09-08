import { useNavigate } from "react-router-dom";
import { User } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Calculator, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  user: User | null;
}

export const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="w-full border-b border-border/60 backdrop-blur mb-8 px-4 md:px-6 py-2 bg-white shadow-sm sticky z-50 top-0 left-0">
      <div className="flex items-center justify-between py-3 md:py-4 px-0">
        {/* Left Side - Title and Subtitle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-semibold text-foreground">Zakat Calculator</h1>
            <p className="text-sm text-muted-foreground hidden md:block">Track and fulfill your zakat easily</p>
          </div>
        </div>
        
        {/* Right Side - Auth Status */}
        <div className="flex items-center">
          {user ? (
            <button 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors cursor-pointer"
              onClick={handleSignOut}
              title={`Signed in as ${user.email}`}
            >
              {user.email?.[0]?.toUpperCase() || 'U'}
            </button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/auth")}
              className="gap-2"
            >
              <LogIn size={16} />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};