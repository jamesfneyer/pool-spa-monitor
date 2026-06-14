import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AddAnotherStepProps {
  savedCount: number;
  finishLabel: string;
  onAddAnother: () => void;
  onFinish: () => void;
}

export function AddAnotherStep({
  savedCount,
  finishLabel,
  onAddAnother,
  onFinish,
}: AddAnotherStepProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>
          {savedCount === 1 ? "Profile saved" : `${savedCount} profiles saved`}
        </CardTitle>
        <CardDescription>
          Would you like to register another pool or spa with its equipment?
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button variant="outline" onClick={onAddAnother}>
          <Plus className="size-4" />
          Import new pool/spa
        </Button>
        <Button onClick={onFinish}>{finishLabel}</Button>
      </CardContent>
    </Card>
  );
}
