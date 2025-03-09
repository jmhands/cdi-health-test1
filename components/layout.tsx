'use client';

import { Navbar, Sidebar } from 'flowbite-react';
import { HiChartPie, HiDatabase, HiHome } from 'react-icons/hi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <Navbar fluid className="border-b border-gray-200 dark:border-gray-700">
        <Navbar.Brand href="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            CDI Health Dashboard
          </span>
        </Navbar.Brand>
      </Navbar>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar aria-label="Dashboard sidebar" className="h-[calc(100vh-64px)]">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                as={Link}
                href="/"
                icon={HiHome}
                active={pathname === '/'}
              >
                Overview
              </Sidebar.Item>
              <Sidebar.Item
                as={Link}
                href="/analytics"
                icon={HiChartPie}
                active={pathname === '/analytics'}
              >
                Analytics
              </Sidebar.Item>
              <Sidebar.Item
                as={Link}
                href="/drives"
                icon={HiDatabase}
                active={pathname === '/drives'}
              >
                Drives
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 