interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export function DashboardHeader({
  title = "ยินดีต้อนรับ",
  subtitle,
}: DashboardHeaderProps) {
  const defaultSubtitle = `ภาพรวมฟาร์มสุกรของคุณ - ${new Date().toLocaleDateString(
    "th-TH",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  )}`;

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{subtitle || defaultSubtitle}</p>
    </div>
  );
}
