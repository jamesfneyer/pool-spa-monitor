import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: ReactNode;
  description?: string;
  footer?: ReactNode;
}

export function MetricCard({ title, value, description, footer }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-semibold">{value}</div>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
        {footer}
      </CardContent>
    </Card>
  );
}
