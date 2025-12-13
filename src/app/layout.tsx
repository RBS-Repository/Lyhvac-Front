import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "../components/CategorySidebar";
import { AuthProvider } from "../components/AuthContext";
import { CMSProvider } from "../components/CMSContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LY HVAC | Professional Heating & Cooling Systems & Parts",
  description: "Quality HVAC systems and parts for residential and commercial properties. Discover our wide range of heating, ventilation, and air conditioning solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <CMSProvider>
          <SidebarProvider>
              {children}
            </SidebarProvider>
          </CMSProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
