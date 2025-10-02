import type { Metadata } from 'next';
import './globals.css';
import ErrorReporter from '@/components/ErrorReporter';
import Script from 'next/script';
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: "Jonathan's Portfolio",
  description: 'Portfolio website for Jonathan',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>
        {children}
        <Toaster 
          theme="light"
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            },
            className: 'toast',
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
