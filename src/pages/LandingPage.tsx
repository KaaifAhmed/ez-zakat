import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Smartphone, Layout, Globe, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground max-w-4xl">
          Manage your Zakat with <span className="text-primary">Clarity</span> and <span className="text-primary">Confidence</span>.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A simple, secure, and modern way to calculate your assets and track your disbursements according to Islamic principles.
        </p>
        <div className="flex gap-4">
          <Button 
            size="lg" 
            onClick={() => navigate("/calculator")}
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Start Calculating <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        {/* Abstract/Modern Visual Decoration could go here */}
      </section>

      {/* Features Section */}
      <section className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EZ Zakat?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Layout className="h-10 w-10 text-primary" />}
              title="Modern Card-Based Design"
              description="Forget complex spreadsheets. Our intuitive card interface makes entering your assets simple and organized."
            />
            <FeatureCard 
              icon={<Smartphone className="h-10 w-10 text-primary" />}
              title="Mobile-Friendly"
              description="Calculate on the go. The entire experience is fully responsive and optimized for your phone or tablet."
            />
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Secure & Private"
              description="Use as a guest with local storage for privacy, or sign up for cloud sync with industry-standard encryption."
            />
            <FeatureCard 
              icon={<Calculator className="h-10 w-10 text-primary" />}
              title="Disbursement Manager"
              description="Track your Zakat payments and see exactly how much of your obligation remains in real-time."
            />
            <FeatureCard 
              icon={<Globe className="h-10 w-10 text-primary" />}
              title="Live Currency Conversion"
              description="Convert assets instantly. Manually input gold/silver rates for precise calculations in your preferred currency."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-8">About the Project</h2>
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="mb-6">
              Hi, I'm <span className="font-semibold text-foreground">Kaaif Ahmed</span>, a Software Engineering student.
            </p>
            <p>
              I built EZ Zakat to help our community fulfill their religious obligations with ease and precision. This project was a journey in exploring modern web development and the power of AI-assisted engineering to build tools that matter.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">EZ Zakat</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Zakat 101</a>
            <a href="#" className="hover:text-primary transition-colors">Help</a>
          </div>
          <p>Built with heart by Kaaif Ahmed.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <div className="mb-4 bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
