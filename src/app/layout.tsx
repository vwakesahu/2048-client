import type { Metadata } from "next";
import { VT323, Press_Start_2P, Bungee } from "next/font/google";
import "./globals.css";

// Arcade-style font for main text
const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: ["400"],
});

// Retro pixel font for game elements
const pressStart2P = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: ["400"],
});

// Bold display font for scores and big numbers
const bungee = Bungee({
  variable: "--font-bungee",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "2048 - Neo Brutalism Game",
  description:
    "A brutalist-styled 2048 puzzle game with bold colors and gaming aesthetics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${vt323.variable} ${pressStart2P.variable} ${bungee.variable} antialiased font-vt323`}
      >
        {children}
      </body>
    </html>
  );
}
