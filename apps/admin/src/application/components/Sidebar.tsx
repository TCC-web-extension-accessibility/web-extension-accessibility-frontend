'use client';

import {
  BookOpenIcon,
  ChartLineIcon,
  ChatIcon,
  GearIcon,
  HouseIcon,
  ListIcon,
  SignOutIcon,
  XIcon,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { authService } from '~/src/lib/auth';

interface MenuItem {
  name: string;
  icon: React.ElementType;
  href: string;
  onClick?: () => void;
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { name: 'Home', icon: HouseIcon, href: '/home' },
    { name: 'Relatórios', icon: ChartLineIcon, href: '/relatorios' },
    { name: 'Feedbacks', icon: ChatIcon, href: '/feedbacks' },
    { name: 'Boas Práticas', icon: BookOpenIcon, href: '/boas-praticas' },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      authService.removeToken();
    }
  };

  const bottomMenuItems: MenuItem[] = [
    { name: 'Configurações', icon: GearIcon, href: '/configuracoes' },
    {
      name: 'Sair',
      icon: SignOutIcon,
      href: '/login',
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white  shadow-lg border border-gray-200 "
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <XIcon size={24} /> : <ListIcon size={24} />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={clsx(
          'hidden lg:flex flex-col h-screen bg-white  border-r border-gray-200 ',
          'fixed top-0 left-0 z-40 shadow-lg',
          'transition-all duration-300 ease-in-out',
          isOpen ? 'w-64' : 'w-20'
        )}
      >
        <div className="flex-1 flex flex-col p-4">
          <nav className="mt-11 space-y-2 flex-1">
            {menuItems.map((item) => (
              <MenuItem key={item.href} item={item} isExpanded={isOpen} />
            ))}
          </nav>

          <nav className="space-y-2 mt-auto">
            {bottomMenuItems.map((item) => (
              <MenuItem key={item.href} item={item} isExpanded={isOpen} />
            ))}
          </nav>
        </div>
      </aside>

      <aside
        className={clsx(
          'lg:hidden fixed top-0 left-0 z-40 h-screen bg-white  border-r border-gray-200 ',
          'transition-transform duration-300 ease-in-out w-64',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="mb-8 flex items-center justify-center h-12 mt-12">
            <div className="font-bold text-xl text-blue-600 dark:text-blue-400">
              Admin Panel
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <div key={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                <MenuItem item={item} isExpanded={true} />
              </div>
            ))}
          </nav>
          <nav className="space-y-2 mt-auto">
            {bottomMenuItems.map((item) => (
              <div key={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                <MenuItem item={item} isExpanded={true} />
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

const MenuItem = ({
  item,
  isExpanded,
}: {
  item: MenuItem;
  isExpanded: boolean;
}) => {
  const Icon = item.icon;
  const pathname = usePathname();
  const active = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={item.onClick}
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
        'hover:bg-gray-100 ',
        active && 'bg-primary-50  text-primary',
        !active && 'text-gray-700 ',
        'relative overflow-hidden'
      )}
    >
      <div className="flex items-center gap-3 w-full">
        <Icon
          size={24}
          weight={active ? 'fill' : 'regular'}
          className="flex-shrink-0"
        />
        <span
          className={clsx(
            'font-medium whitespace-nowrap transition-opacity duration-300',
            isExpanded ? 'opacity-100' : 'opacity-0'
          )}
        >
          {item.name}
        </span>
      </div>
    </Link>
  );
};
