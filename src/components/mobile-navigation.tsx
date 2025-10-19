'use client';

import React from 'react';
import { Menu, X, Home, Library, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    label: 'Create',
    href: '/',
    icon: Home,
  },
  {
    label: 'My Resumes',
    href: '/my-resumes',
    icon: Library,
  },
  {
    label: 'Settings',
    href: '/settings/account',
    icon: User,
  },
];

export function MobileNavigation() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname.startsWith('/c/');
    } else if (href === '/settings/account') {
      return pathname.startsWith('/settings');
    }
    return pathname === href;
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Resume Revamp</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.href);
                  
                  return (
                    <Button
                      key={item.label}
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-12",
                        isActive && "bg-gray-100 dark:bg-gray-800"
                      )}
                      onClick={() => handleNavigation(item.href)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}