import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';
import { AnalyticsTracker } from '@/components/analytics-tracker';


const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <AnalyticsTracker />
          <main className="flex-1">{children}</main>
        </RootProvider>
      </body>
    </html>
  );
}
