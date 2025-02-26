import type { Metadata } from 'next';
import './globals.css';
import { GeistSans } from 'geist/font/sans';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
export const metadata: Metadata = {
  title: 'Resume Revamp',
  description: 'Get your Updated Resume in seconds',
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
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
