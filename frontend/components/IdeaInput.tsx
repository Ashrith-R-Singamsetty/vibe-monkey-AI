import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface IdeaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function IdeaInput({ 
  value, 
  onChange, 
  placeholder = "Describe your startup idea...",
  label = "Your Startup Idea"
}: IdeaInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="idea-input" className="text-sm font-medium">
        {label}
      </Label>
      <Textarea
        id="idea-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] resize-none"
        maxLength={500}
      />
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Be as detailed as possible for better AI analysis</span>
        <span>{value.length}/500</span>
      </div>
    </div>
  );
}
