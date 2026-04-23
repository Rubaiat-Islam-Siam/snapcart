import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "../Provider";
import StoreProvider from "../redux/StoreProvider";
import InitUser from "../InitUser";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Snapcart",
  description: "Your one-stop destination for all your grocery needs.",
  openGraph: {
    title: "Snapcart",
    description: "Your one-stop destination for all your grocery needs.",
    images: [
      {
        url: "/download.png",
        width: 1200,
        height: 630,
        alt: "Snapcart Preview",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-green-50 to-white"
      >
        <Provider>
          <StoreProvider>
            <InitUser/>
            {children}
          </StoreProvider>
        </Provider>
        
      </body>
    </html>
  );
}
