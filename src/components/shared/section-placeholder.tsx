import type { LucideIcon } from "lucide-react";
import { EmptyState } from "./empty-state";
import { PageHeader } from "./page-header";

interface SectionPlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function SectionPlaceholder({
  title,
  description,
  icon,
}: SectionPlaceholderProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={icon}
        title={`${title} coming soon`}
        description="This section will be built in an upcoming milestone. Navigation and layout are ready."
      />
    </div>
  );
}
