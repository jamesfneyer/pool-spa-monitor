import { Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WelcomeStepProps {
  onContinue: () => void;
}

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-accent">
          <Waves className="size-6 text-accent-foreground" />
        </div>
        <CardTitle>Welcome to Pool &amp; Spa Command Center</CardTitle>
        <CardDescription>
          Let&apos;s register your pool or spa and the equipment you use so you can track
          chemistry, maintenance, and warranties in one place.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button size="lg" onClick={onContinue}>
          Get started
        </Button>
      </CardContent>
    </Card>
  );
}
