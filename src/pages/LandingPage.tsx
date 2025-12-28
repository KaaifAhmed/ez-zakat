import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Smartphone, Layout, Globe, Calculator, ArrowDown, ChevronRight, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,transparent,var(--background))]"></div>

        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 text-sm font-medium rounded-full bg-secondary/50 text-secondary-foreground border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            New: Live Currency Conversion
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground max-w-5xl mx-auto mb-6 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Fulfill your Zakat with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Clarity & Confidence</span>.
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            The modern, secure, and privacy-focused way to calculate your assets and track disbursements. compliant with Islamic principles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Button
              size="lg"
              onClick={() => navigate("/calculator")}
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
            >
              Start Calculating <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 rounded-full w-full sm:w-auto hover:bg-secondary/50"
            >
              Sign In to Save
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section (Bento Grid Style) */}
      <section id="features" className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Everything you need to calculate with peace of mind.</h2>
            <p className="text-lg text-muted-foreground">We've reimagined the Zakat experience to be simple, private, and powerful.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Item */}
            <div className="md:col-span-2 row-span-2">
              <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-background to-primary/5">
                <CardContent className="p-8 flex flex-col items-start justify-between h-full">
                  <div className="mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                      <Layout className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Modern Card-Based Interface</h3>
                    <p className="text-muted-foreground text-lg">
                      Gone are the complex spreadsheets. Our intuitive card design breaks down every asset category into simple, manageable steps.
                    </p>
                  </div>
                  <div className="w-full bg-background rounded-xl h-48 border border-border/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                      <span className="text-sm font-medium text-primary/70">Interactive Preview</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Item 1 */}
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                  <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Mobile First</h3>
                <p className="text-muted-foreground">
                  Calculate on the go. Fully optimized for every device you own.
                </p>
              </CardContent>
            </Card>

            {/* Side Item 2 */}
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Private & Secure</h3>
                <p className="text-muted-foreground">
                  Guest mode stores data locally. Signed-in data is encrypted in the cloud.
                </p>
              </CardContent>
            </Card>

            {/* Bottom Trio Items */}
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
                  <Calculator className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Disbursement Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Log your payments and see your remaining obligations in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 md:col-span-2">
              <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Live Currency Conversion</h3>
                  <p className="text-muted-foreground">
                    Instantly convert assets to your preferred currency. Manual rates for Gold & Silver ensure precision.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Three simple steps to fulfill your obligation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-[-1]"></div>

            <div className="bg-background border border-border rounded-2xl p-8 text-center relative hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-primary/20">1</div>
              <h3 className="text-xl font-bold mb-3">Input Assets</h3>
              <p className="text-muted-foreground text-sm">
                Enter your cash, gold, silver, investments, and other zakatable assets securely.
              </p>
            </div>

            <div className="bg-background border border-border rounded-2xl p-8 text-center relative hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-primary/20">2</div>
              <h3 className="text-xl font-bold mb-3">Instant Calculation</h3>
              <p className="text-muted-foreground text-sm">
                We automatically calculate the Nisab threshold and your total Zakat obligation.
              </p>
            </div>

            <div className="bg-background border border-border rounded-2xl p-8 text-center relative hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-primary/20">3</div>
              <h3 className="text-xl font-bold mb-3">Track & Distribute</h3>
              <p className="text-muted-foreground text-sm">
                Log your payments as you make them. Keep track until your obligation is fulfilled.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Heart className="h-12 w-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-6">Built with Principle & Precision</h2>
          <div className="prose prose-lg prose-invert mx-auto opacity-90">
            <p className="leading-relaxed mb-6">
              "Hi, I'm <span className="font-bold">Kaaif Ahmed</span>. I built EZ Zakat to solve a problem I saw in our community: the complexity and uncertainty of manually calculating Zakat."
            </p>
            <p className="text-base font-light">
              This project combines modern engineering with religious obligation, offering a tool that is as precise as it is easy to use. Open source and privacy-focused, because your worship belongs to you.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-background border-t py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Calculator className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xl font-bold">EZ Zakat</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empowering the Ummah with modern tools for spiritual obligations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-6">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Calculator</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Currency Converter</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6">Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Zakat Guide (101)</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Gold Rates</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EZ Zakat. All rights reserved.</p>
            <p>Designed and Developed by Kaaif Ahmed.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
