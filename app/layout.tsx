import type { Metadata } from "next";
import { Nunito, Comic_Neue } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const comicNeue = Comic_Neue({
  variable: "--font-comic-neue",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Scribble - Draw. Guess. Win.",
  description: "Play real-time drawing & guessing games with friends or players worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${comicNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-nunito bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
