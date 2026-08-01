import './globals.css';

export const metadata = {
  title: 'Tanda Moto - Dashboard Administrativo',
  description: 'Sistema de control y seguimiento en tiempo real para tandas de motocicletas.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#0b0e14] text-gray-100 selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
