import "./globals.css";
import { Playfair_Display, Sora } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata = {
  title: "Himalayan Bliss Tours | Bhutan Travel",
  description: "Modern Bhutan travel experiences with Himalayan Bliss Tours."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${sora.variable}`}>
      <body className="min-h-screen bg-background font-sans">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
