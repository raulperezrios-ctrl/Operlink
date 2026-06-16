import type { Metadata } from "next";
import "./globals.css";
import LayoutClient from "./layout-client";
import Script from "next/script";

export const metadata: Metadata = {
  title: "OperLink",
  description: "Conectamos talento con oportunidades",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <script src="https://cdn.conekta.io/js/latest/conekta.js" async></script>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-857113085"
          strategy="afterInteractive"
        />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-857113085');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-white">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}