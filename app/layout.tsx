import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mialeticia.com'),
  title: 'Mia Leticia — Tu puerta de entrada a Ecuador',
  description: 'Una casa colonial en el Centro Histórico de Quito. Hospédate en Mia Leticia y descubre Ecuador desde su corazón.',
  openGraph: {
    title: 'Mia Leticia — Tu puerta de entrada a Ecuador',
    description: 'Una casa colonial en el Centro Histórico de Quito. Tu viaje comienza aquí.',
    images: ['/images/hero-patio.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
