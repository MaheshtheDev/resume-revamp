'use client';

import React from 'react';
import { FilePenLineIcon, Library, User } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const primaryNavItems = [
  {
    label: 'Create',
    href: '/create',
    icon: (isActive: boolean) => (
      <CreateIcon fill={isActive ? '#000000' : '#666666'} />
    ),
  },
  {
    label: 'My Resumes',
    href: '/my-resumes',
    icon: (isActive: boolean) => (
      <Library
        size={18}
        className={cn('text-gray-500', isActive && 'text-gray-900')}
      />
    ),
  },
];

const settingsNavItems = [
  {
    label: 'Settings',
    href: '/settings/account',
    icon: (isActive: boolean) => (
      <User
        size={18}
        className={cn('text-gray-500', isActive && 'text-gray-900')}
      />
    ),
  },
];

function LeftNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { open } = useSidebar();

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/c' || pathname.startsWith('/c/');
    } else if (href === '/settings/account') {
      return pathname.startsWith('/settings');
    }
    return pathname === href;
  };

  return (
    <Sidebar className="bg-[#FAFAFA]" collapsible="icon" variant="inset">
      <SidebarHeader className="flex justify-center flex-row items-center">
        <SidebarMenu>
          <SidebarMenuItem className="hover:bg-transparent">
            <SidebarMenuButton
              tooltip="Resume Revamp"
              onClick={() => router.push('/create')}
            >
              <FilePenLineIcon size={36} />
              <h2 className="text-lg font-semibold text-center animate-in">
                Resume Revamp
              </h2>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className={cn(!open && 'px-2', "hidden")}>
          {primaryNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild tooltip={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    'group',
                    isActiveRoute(item.href) && 'bg-gray-100 rounded-md'
                  )}
                >
                  {item.icon(isActiveRoute(item.href))}
                  <span
                    className={cn(
                      'text-gray-500',
                      isActiveRoute(item.href) && 'text-gray-900 font-medium'
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {/*<Separator className="px-4" />*/}
          {settingsNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild tooltip={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    'group',
                    isActiveRoute(item.href) && 'bg-gray-100 rounded-md'
                  )}
                >
                  {item.icon(isActiveRoute(item.href))}
                  <span
                    className={cn(
                      'text-gray-500',
                      isActiveRoute(item.href) && 'text-gray-900 font-medium'
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}

export default LeftNavBar;

function CreateIcon({ fill }: { fill: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill={fill}
      className="group-hover:fill-black"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_189_28)">
        <path
          d="M0 8.00001C0 7.36349 0.842856 6.75304 2.34314 6.30295C3.84344 5.85286 5.87827 5.60001 8 5.60001C10.1218 5.60001 12.1566 5.85286 13.6569 6.30295C15.1571 6.75304 16 7.36349 16 8.00001C16 8.63649 15.1571 9.24697 13.6569 9.69705C12.1566 10.1471 10.1218 10.4 8 10.4C5.87827 10.4 3.84344 10.1471 2.34314 9.69705C0.842856 9.24697 0 8.63649 0 8.00001Z"
          fill={fill}
        />
        <path
          d="M7.99998 0C8.63646 0 9.24694 0.842856 9.69702 2.34314C10.1471 3.84344 10.4 5.87827 10.4 8C10.4 10.1218 10.1471 12.1566 9.69702 13.6569C9.24694 15.1571 8.63646 16 7.99998 16C7.36346 16 6.75301 15.1571 6.30292 13.6569C5.85283 12.1566 5.59998 10.1218 5.59998 8C5.59998 5.87827 5.85283 3.84344 6.30292 2.34314C6.75301 0.842856 7.36346 0 7.99998 0Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_189_28">
          <rect width="16" height="16" fill={fill} />
        </clipPath>
      </defs>
    </svg>
  );
}
