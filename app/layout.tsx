import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

const previewImage = '/preview.png';
const siteUrl = 'https://fast-qrcode.vercel.app';

export const metadata: Metadata = {
  title: 'Gerador de QR Code — Download em SVG ou PNG',
  description: 'Gere códigos QR personalizados a partir de qualquer link. Baixe em SVG ou PNG com alta qualidade.',
  metadataBase: new URL(siteUrl),
  keywords: ['qr code', 'gerador de qr code', 'download qr', 'qrcode png', 'qrcode svg', 'link para qrcode', 'grátis', 'gratuito'],
  authors: [{ name: 'LuizObara', url: 'https://github.com/luizobara' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    title: 'Gerador de QR Code — Download em SVG ou PNG',
    description: 'Gere códigos QR personalizados e baixe em PNG ou SVG. Simples, rápido e gratuito.',
    siteName: 'Gerador de QR Code',
    images: [
      {
        url: previewImage,
        width: 1200,
        height: 630,
        alt: 'Preview do QR Code Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gerador de QR Code — Download em SVG ou PNG',
    description: 'Transforme qualquer link em QR Code e baixe rapidamente em SVG ou PNG.',
    images: [previewImage],
    creator: '@luizobara',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}