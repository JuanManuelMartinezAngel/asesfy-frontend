import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StoreProvider } from '@/components/providers/StoreProvider';
import { Toaster } from '@/components/ui/sonner';
import Notifications from '@/components/ui/notifications';
import CookieBanner from '@/components/ui/CookieBanner';
import AuthInitializer from '@/components/providers/AuthInitializer';
import DemoLogin from '@/components/providers/DemoLogin';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Asesfy - Gestión Fiscal Simplificada',
  description: 'Plataforma integral para la gestión fiscal de autónomos y empresas. Servicios profesionales, asesoramiento personalizado y herramientas digitales.',
  keywords: 'gestión fiscal, asesoría fiscal, autónomos, empresas, declaración renta, IVA',
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              'analytics_storage': 'denied'
            });
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <StoreProvider>
          <AuthInitializer />
          <DemoLogin />
          <Notifications />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <CookieBanner />
        </StoreProvider>
      </body>
    </html>
  );
}