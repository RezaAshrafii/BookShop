import localFont from "next/font/local";
import "./globals.css";
import ClientProvider from "./ClientProvider";
import { JSX, ReactNode } from "react";

const IRANSans = localFont({
  src: "/fonts/IRANSansWeb.woff",
  variable: "--font-iran-sans",
  weight: "100 900",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html dir="rtl" lang="fa">
      <body className={`${IRANSans.variable} antialiased bg-gray-50`}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
