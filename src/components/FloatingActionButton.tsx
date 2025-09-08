import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  isEditing: boolean;
  onAddCard: () => void;
  onDoneEditing: () => void;
}

export const FloatingActionButton = ({ isEditing, onAddCard, onDoneEditing }: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={isEditing ? onDoneEditing : onAddCard}
      className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      size="lg"
    >
      {isEditing ? (
        <Check className="w-6 h-6" />
      ) : (
        <Plus className="w-6 h-6" />
      )}
    </Button>
  );
};