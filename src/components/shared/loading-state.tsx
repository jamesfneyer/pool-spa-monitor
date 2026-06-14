export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
      {message}
    </div>
  );
}
