import './globals.css';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { SessionProvider } from '@/components/session-provider';
import { WarningScreen } from '@/components/WarningScreen';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#14b8a6',
};

export const metadata: Metadata = {
  title: {
    default: 'VastSea - Coding Problems & Solutions',
    template: '%s | VastSea',
  },
  description: 'A modern platform for sharing and learning programming problems and solutions',
  manifest: '/manifest.json',
  authors: [{ name: 'VastSea Team' }],
  keywords: ['programming', 'coding', 'problems', 'solutions', 'algorithms', 'Java', 'JavaScript', 'C++', 'C'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon', type: 'image/png' }
    ]
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <WarningScreen />
            <div id="main-app" className="flex min-h-screen flex-col bg-background" style={{ display: 'none' }}>
              <Navbar />
              <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}