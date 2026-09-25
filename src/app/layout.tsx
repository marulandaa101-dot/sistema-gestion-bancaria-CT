import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Banco Central Financiero (BCF) - Sistema de Gestión Bancaria',
  description: 'Sistema integral de información para asesoría financiera, catálogo de productos, simulación de créditos, CDT y ahorro con tabla de amortización detallada.',
  keywords: ['banco', 'simulador de credito', 'CDT', 'tabla de amortizacion', 'gestion bancaria', 'SENA'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
