import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GovtBanner } from "@/components/layout/GovtBanner";
import { Header } from "@/components/layout/Header";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { CitationDrawer } from "@/components/chat/CitationDrawer";
import { FacilitatorBridge } from "@/components/chat/FacilitatorBridge";
import { QueryProvider } from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IP-SAKTI Sahayak | Ministry of AYUSH (SIH 045)",
  description: "Official National AI Statutory Copilot for Ayurvedic Intellectual Property, CSIR-TKDL Defense, and BDA 2023 ABS Compliance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900`}>
        <QueryProvider>
          <div className="print:hidden">
            <GovtBanner />
            <Header />
            <DisclaimerBanner />
          </div>
          
          <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col">
            {children}
          </main>

          <CitationDrawer />
          <FacilitatorBridge />

          <footer className="border-t border-slate-200 py-6 text-xs text-slate-600 bg-white shadow-xs print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#002147]">IP-SAKTI Sahayak</span>
                <span className="text-slate-300">|</span>
                <span>Ministry of AYUSH, Government of India &bull; SIH 045</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                <span>GIGW 3.0 Compliant</span>
                <span>&bull;</span>
                <span>The Patents Act, 1970</span>
                <span>&bull;</span>
                <span>Biological Diversity Act, 2023</span>
                <span>&bull;</span>
                <span>CSIR-TKDL</span>
              </div>
            </div>
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}
