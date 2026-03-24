import type { Metadata } from "next";
import { Sora } from "next/font/google";

import "@/styles/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  fallback: ["sans-serif"],
});

export const metadata: Metadata = {
  title: "Unified Online University",
  description:
    "Empowering learners worldwide with accessible, high-quality education.",
  icons: {
    icon: "/favicon.svg",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: Readonly<RootLayoutProps>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} antialiased`}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
};

export default RootLayout;
