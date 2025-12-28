import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
    const navigate = useNavigate();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Calculator className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">EZ Zakat</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <button onClick={() => scrollToSection("features")} className="hover:text-primary transition-colors">Features</button>
                    <button onClick={() => scrollToSection("how-it-works")} className="hover:text-primary transition-colors">How it Works</button>
                    <button onClick={() => scrollToSection("about")} className="hover:text-primary transition-colors">About</button>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-primary">
                        Sign In
                    </Button>
                    <Button size="sm" onClick={() => navigate("/calculator")} className="rounded-full shadow-sm hover:shadow-md transition-all">
                        Get Started
                    </Button>
                </div>
            </div>
        </nav>
    );
}
