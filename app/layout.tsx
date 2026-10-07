import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import "./theme.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/components/cart-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { CookieBanner } from "@/components/cookie-banner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Good Cell - Tecnología Premium",
  description:
    "Tecnología premium en Armenia, Quindío: Apple, Bose, JBL, DJI, Shokz y más. Productos originales, sellados de fábrica y con garantía.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <Navbar />
            <main className="w-full flex-1">{children}</main>
            <WhatsAppButton />
            <ScrollToTopButton />
            <Footer />
            <CookieBanner />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}