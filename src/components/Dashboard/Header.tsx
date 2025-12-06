interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export function DashboardHeader({
  title = new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  subtitle,
}: DashboardHeaderProps) {
  const date = new Date();

  return (
    <div className="space-y-2">
      <div className="inline-flex gap-2 items-end">
        <p className="text-4xl font-bold">{date.getDate()}</p>
        <p className="text-2xl font-bold text-muted-foreground">
          {date.toLocaleDateString("th-TH", {
            month: "long",
          })}
        </p>
      </div>
      <p className="text-muted-foreground">{}</p>
    </div>
  );
}
