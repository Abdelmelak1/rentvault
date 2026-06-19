import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RentVault - Rent Anything, Earn Everything",
  description:
    "The all-in-one asset rental platform. Upload vehicles, properties, equipment, and more. Browse, rent, and manage everything in one place.",
  openGraph: {
    images: [{ url: "/og_default.png" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: "/og_default.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <Sidebar />
          <main className="lg:pl-64 min-h-screen bg-slate-50/50">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
