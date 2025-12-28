import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Smartphone, Layout, Globe, Calculator, Heart, Check, Trash2, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden z-10">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,transparent,var(--background))] -z-10"></div>

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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Ease & Confidence</span>.
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            The modern, secure, and privacy-focused way to calculate your Zakat and track disbursements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 relative z-20">
            <Button
              size="lg"
              onClick={() => navigate("/calculator")}
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all w-full sm:w-auto cursor-pointer"
            >
              Start Calculating <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 rounded-full w-full sm:w-auto hover:bg-secondary/50 cursor-pointer"
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
            {/* Large Item with Interactive Preview */}
            <div className="md:col-span-2 row-span-2">
              <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-background to-primary/5">
                <CardContent className="p-8 flex flex-col items-start justify-between h-full">
                  <div className="mb-8 w-full">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                      <Layout className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Modern Card-Based Interface</h3>
                    <p className="text-muted-foreground text-lg mb-8">
                      Gone are the complex spreadsheets. Our intuitive card design breaks down every asset category into simple, manageable steps.
                    </p>

                    {/* Interactive Preview Mockup - Mimicking ZakatEntryCard */}
                    <div className="w-full max-w-md mx-auto relative group">
                      <div className="bg-background rounded-xl shadow-lg border border-border/40 p-6 relative overflow-visible transform transition-transform duration-500 hover:scale-[1.02]">
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-foreground mt-1">Cash</h3>
                          </div>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                            Asset
                          </span>
                        </div>

                        {/* Card Content */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm text-muted-foreground">Amount:</span>
                              <p className="text-xl font-bold text-foreground">PKR 100,000</p>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Notes:</span>
                              <p className="text-sm text-foreground">Emergency savings account</p>
                            </div>
                          </div>
                        </div>

                        {/* Action Icons (Visual only) */}
                        <div className="flex justify-end gap-2 mt-4 opacity-60">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Edit3 size={14} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Trash2 size={14} />
                          </Button>
                        </div>

                        {/* Zakat Highlight */}
                        <div className="absolute -right-4 -top-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce">
                          Zakat: PKR 2,500
                        </div>
                      </div>

                      {/* Floating Cursor/Hand Element for visual effect */}
                      <div className="absolute -bottom-6 -right-6 bg-background p-2 rounded-lg shadow-lg border animate-pulse hidden group-hover:flex items-center gap-2 z-10">
                        <Check className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-foreground">Auto-calculated</span>
                      </div>
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
              "Assalamu'alaikum, I'm <span className="font-bold">Kaaif Ahmed</span>. I built EZ Zakat to solve the problem of the complexity of manually calculating Zakat."
            </p>
            <p className="text-base font-light">
              This project combines modern engineering with religious obligation, offering a tool that is as precise as it is easy to use. This was a project that I built for the community, and to explore this new world of AI-assisted coding.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Common questions about Zakat calculation and our platform.</p>
          </div>

          <div className="grid gap-4">
            {[
              {
                question: "How is Zakat calculated?",
                answer: "Zakat is calculated at 2.5% of your total zakatable assets (Cash, Gold, Silver, Investments, etc.) once they exceed the Nisab threshold. The Nisab is the minimum amount of wealth a Muslim must possess for a full lunar year before they are liable to pay Zakat. Our calculator automatically fetches current gold/silver rates to help determine this threshold."
              },
              {
                question: "Is my financial data secure?",
                answer: "Absolutely. We take privacy seriously. You can use EZ Zakat in \"Guest Mode\" where all data is stored exclusively on your device's local storage, nothing is sent to our servers. If you choose to create an account to sync across devices, your data is stored securely in the cloud using industry-standard encryption. We do not collect any personally identifiable financial information."
              },
              {
                question: "Can I calculate Zakat in different currencies?",
                answer: "Yes! Our calculator supports live currency conversion. You can enter your assets in your local currency, and we'll handle the conversions. For precious metals like Gold and Silver, you can manually input the rates relevant to your region for maximum accuracy."
              },
              {
                question: "Is this calculator verified?",
                answer: "This tool is built to strictly follow standard Islamic rulings regarding Zakat calculation on wealth. However, as with all matters of fiqh, if you have complex financial situations or specific questions about unique assets, we always recommend consulting with a qualified scholar or local Imam."
              }
            ].map((faq, index) => (
              <Accordion key={index} type="single" collapsible className="w-full bg-background rounded-xl border border-border/50 shadow-sm px-6">
                <AccordionItem value={`item-${index}`} className="border-none">
                  <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
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
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6">Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="https://gold.pk/gold-rates-pakistan.php" target="_blank" className="hover:text-primary transition-colors">Gold Rates</a></li>
                <li><a href="https://gold.pk/pakistan-silver-rates-xagp.php" target="_blank" className="hover:text-primary transition-colors">Silver Rates</a></li>
                <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6">More information about Zakat</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="https://www.banuri.edu.pk/readquestion/%D8%B2%DA%A9%D9%88%DB%83-%DA%A9%D8%A7-%D8%AD%D8%B3%D8%A7%D8%A8-144102200197/23-10-2019" target="_blank" className="hover:text-primary transition-colors">Jamiat Ul Uloom Banuri Town</a></li>
                <li><a href="https://islamqa.info/en/answers/93414" target="_blank" className="hover:text-primary transition-colors">IslamQA</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EZ Zakat. All rights reserved.</p>
            <p>Designed and Developed by <a href="https://linkedin.com/in/kaaifahmedkhan" target="_blank" className="hover:text-primary transition-colors">Kaaif Ahmed</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
