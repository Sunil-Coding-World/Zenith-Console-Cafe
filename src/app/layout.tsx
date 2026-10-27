import type { Metadata } from "next";
import { Bungee, Chakra_Petch, Press_Start_2P } from "next/font/google";
import "./globals.css";

const display = Bungee({ variable: "--nf-display", subsets: ["latin"], weight: "400" });
const body = Chakra_Petch({ variable: "--nf-body", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const pixel = Press_Start_2P({ variable: "--nf-pixel", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: {
    default: "Zenith Console Cafe | PS5 & PS2 Gaming + Food",
    template: "%s | Zenith Console Cafe",
  },
  description: "PS5 aur PS2 gaming cafe: FC 25, Tekken 8, WWE 2K24. Pizza, Chinese, shakes aur ice cream. Station book karo, tournaments khelo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${pixel.variable}`}>
      <body>{children}</body>
    </html>
  );
}
