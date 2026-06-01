import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
      <body className="min-h-full flex flex-col bg-white">
        
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <a href="/">
            <img src="/Logo_OperLink.png" alt="OperLink" className="h-8 object-contain" />
          </a>
          <div className="flex gap-2">
            <a href="/" className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-700">Inicio</a>
            <button className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-700">☰</button>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 pb-20">
          {children}
        </main>

        {/* Navegación inferior */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-end z-10">
          <a href="/" className="flex flex-col items-center text-gray-400 text-[10px] gap-0.5">
            <span className="text-xl">🏠</span>
            <span>Inicio</span>
          </a>
          <a href="/operadores" className="flex flex-col items-center text-gray-400 text-[10px] gap-0.5">
            <span className="text-xl">👷</span>
            <span>Operadores</span>
          </a>
          <a href="/empresas" className="flex flex-col items-center text-[10px] gap-0.5">
            <div className="h-12 w-12 rounded-full flex items-center justify-center -mt-5 shadow-lg text-white text-xl" style={{backgroundColor: '#9A2120'}}>🔍</div>
            <span style={{color: '#9A2120'}}>Buscar</span>
          </a>
          <a href="/solicitudes" className="flex flex-col items-center text-gray-400 text-[10px] gap-0.5">
            <span className="text-xl">📋</span>
            <span>Solicitudes</span>
          </a>
          <a href="/login" className="flex flex-col items-center text-gray-400 text-[10px] gap-0.5">
            <span className="text-xl">👤</span>
            <span>Cuenta</span>
          </a>
        </nav>

      </body>
    </html>
  );
}