import "../globals.css";

export const metadata = {
  title: "Login - SowCycle",
  description: "Login to SowCycle",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
