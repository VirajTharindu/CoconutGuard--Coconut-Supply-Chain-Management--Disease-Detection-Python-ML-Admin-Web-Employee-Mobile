import type { Metadata } from "next";
import "./globals.css";
import NavigationBar from "@/components/NavigationBar";

export const metadata: Metadata = {
  title: "CoconutGuard (Admin)",
  description: "Disease Surveillance & Supply Chain Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        <NavigationBar />
        {children}
      </body>
    </html>
  );
}
