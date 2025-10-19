import type { Metadata } from 'next';
import './globals.css';
import { GeistSans } from 'geist/font/sans';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import { MobileNavigation } from '@/components/mobile-navigation';
export const metadata: Metadata = {
  title: 'Resume Revamp',
  description: 'Get your Updated Resume in seconds',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <SidebarProvider defaultOpen={false}>
          <AppSidebar />
          <MobileNavigation />
          {children}
        </SidebarProvider>
        <script
          defer
          src="https://analytics.maheshthedev.me/script.js"
          data-website-id="0d370699-36ab-4ec6-ac02-2eaf37d01d14"
        ></script>
      </body>
    </html>
  );
}
