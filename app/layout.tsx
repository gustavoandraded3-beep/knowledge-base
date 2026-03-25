import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "InternalKB", template: "%s | InternalKB" },
  description: "Internal Knowledge Base — company documentation portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
