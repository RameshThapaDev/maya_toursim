import "./globals.css";
import { Playfair_Display, Sora } from "next/font/google";
import Providers from "./providers";
import ChatBotWidget from "./components/ChatBotWidget";
import { ColorModeScript } from "@chakra-ui/react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display"
});

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body"
});

export const metadata = {
  title: "Maya Bliss Tours | Curated Bhutan Journeys",
  description:
    "Discover Bhutan with Maya Bliss Tours. Curated itineraries, mindful travel, and immersive Himalayan experiences."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${sora.variable}`} suppressHydrationWarning>
        <ColorModeScript initialColorMode="light" />
        <Providers>
          {children}
          <ChatBotWidget />
        </Providers>
      </body>
    </html>
  );
}
