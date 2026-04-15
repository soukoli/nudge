'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Home,
  Heart,
  Settings,
} from 'lucide-react';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/dashboard', icon: <LayoutDashboard size={22} />, label: 'Dashboard' },
  { href: '/members', icon: <Users size={22} />, label: 'Members' },
  { href: '/assets', icon: <Home size={22} />, label: 'Assets' },
  { href: '/nudges', icon: <Heart size={22} />, label: 'Nudges' },
];

const bottomNavItems: NavItem[] = [
  { href: '/settings', icon: <Settings size={22} />, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  
  // Extract locale-independent path
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?:\/|$)/, '/');

  const isActive = (href: string) => {
    return pathWithoutLocale === href || pathWithoutLocale.startsWith(href + '/');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link href="/dashboard" className="sidebar-logo">
        <Image
          src="/logo.png"
          alt="Keep Close"
          width={40}
          height={40}
          className="w-10 h-10"
        />
      </Link>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <motion.div
              className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={item.label}
            >
              {item.icon}
            </motion.div>
          </Link>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="flex flex-col gap-2">
        {bottomNavItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <motion.div
              className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={item.label}
            >
              {item.icon}
            </motion.div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
