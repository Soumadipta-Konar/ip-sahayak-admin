import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { CitationDrawer } from "@/components/chat/CitationDrawer";
import { FacilitatorBridge } from "@/components/chat/FacilitatorBridge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IP-SAKTI Sahayak | AI Assistant for Ayurvedic IP & Regulations (SIH 045)",
  description: "Multilingual, source-grounded legal copilot for patents, CSIR-TKDL, BDA 2023 ABS compliance, and regulatory classification in Ayurveda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-200`}>
        <DisclaimerBanner />
        <Header />
        
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col">
          {children}
        </main>

        <CitationDrawer />
        <FacilitatorBridge />

        <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 bg-slate-950/60">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>IP-SAKTI Sahayak (SIH 045) &bull; Ministry of AYUSH & Smart India Hackathon</span>
            <span className="text-slate-600">GIGW Compliant &bull; Patents Act 1970 &bull; BDA 2023 &bull; CSIR-TKDL</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
