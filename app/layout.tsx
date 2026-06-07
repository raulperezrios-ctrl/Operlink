import type { Metadata } from "next";
import "./globals.css";
import LayoutClient from "./layout-client";

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.png',
  },
}
  title: "OperLink",
  description: "Conectamos talento con oportunidades",
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
      </head>
      <body className="min-h-full flex flex-col bg-white">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}