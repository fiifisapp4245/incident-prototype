import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Providers from "@/components/layout/Providers";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Incident Prototype",
  description: "Network Incident Monitoring Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${ibmPlexSans.variable}`}>
      <body className="min-h-screen">
        <Providers>
          <Header />
          <main className="pt-[72px]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
