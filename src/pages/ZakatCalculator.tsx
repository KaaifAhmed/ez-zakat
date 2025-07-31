import { Plus } from "lucide-react";
import ZakatEntryCard from "@/components/ZakatEntryCard";

const ZakatCalculator = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Top Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <h1 className="text-xl font-bold text-foreground">
          Zakat Calculator
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        {/* Demo ZakatEntryCard */}
        <div className="max-w-md">
          <ZakatEntryCard />
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-md hover:scale-105 hover:brightness-110 transition-all duration-150 ease-in-out flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Add new calculation"
      >
        <Plus size={24} strokeWidth={2} />
      </button>
    </div>
  );
};

export default ZakatCalculator;