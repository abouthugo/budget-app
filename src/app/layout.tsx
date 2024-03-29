import { cn } from "@/lib/utils";
import MainLayout from "@app/components/ui/main-layout";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import Link from "next/link";
import ContextProvider from "./context-provider";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Spendwise",
  description: "Track your money, be wise",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("bg-background font-sans antialiased", fontSans.variable)}
      >
        <ContextProvider>
          <MainLayout>
            <div className="p-4 w-full row-start-1 row-end-7 overflow-y-scroll overflow-x-hidden">
              {children}
            </div>
            <div className="border-t flex flex-col">
              <div className="p-4 flex justify-center space-x-4">
                <Link href="/" className="text-sm">
                  Home
                </Link>
                <Link href="/budgets" className="text-sm">
                  Budgets
                </Link>
              </div>
            </div>
          </MainLayout>
        </ContextProvider>
      </body>
    </html>
  );
}

function NavBar() {}
