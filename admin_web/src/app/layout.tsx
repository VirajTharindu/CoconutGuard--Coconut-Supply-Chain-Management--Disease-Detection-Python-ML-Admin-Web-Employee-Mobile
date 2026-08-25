import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import ClientLayout from "@/components/ClientLayout";
import Providers from "@/providers/Providers";

export const metadata: Metadata = {
  title: "CoconutGuard (Admin)",
  description: "Disease Surveillance & Supply Chain Management Dashboard",
  icons: {
    icon: '/coconuts-icon.png',
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        <Providers>
          <AuthProvider>
            <AuthGuard>
              <ClientLayout>
                {children}
              </ClientLayout>
            </AuthGuard>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
