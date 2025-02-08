import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const BasementFoundry = localFont({
  src: "./fonts/BasementGrotesque.woff",
  variable: "--font-basement-grotesque",
});

const inconsolata = localFont({
  src: "./fonts/Inconsolata_Expanded-Regular.ttf",
  variable: "--font-inconsolata",
});

export const metadata: Metadata = {
  title: "Project Ayre",
  description: "Semantic Attentive Visual Question Answering",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${BasementFoundry.variable} ${inconsolata.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
