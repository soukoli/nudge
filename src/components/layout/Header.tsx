'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  Bell,
  Moon,
  Sun,
  Globe,
  Plus,
  Monitor,
} from 'lucide-react';
import { Button, Avatar } from '@/components/ui';
import { useTheme } from '@/components/ThemeProvider';

interface HeaderProps {
  familyName?: string;
  userAvatar?: string;
  userName?: string;
  onAddNew?: () => void;
}

export function Header({
  familyName = 'My Family',
  userAvatar,
  userName = 'User',
  onAddNew,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, resolvedTheme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleTheme = () => {
    // Cycle through: light -> dark -> system -> light
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const toggleLocale = () => {
    const newLocale = locale === 'cs' ? 'en' : 'cs';
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  // Get icon and title based on current theme
  const getThemeIcon = () => {
    if (theme === 'system') {
      return <Monitor size={20} />;
    }
    return resolvedTheme === 'dark' ? <Moon size={20} /> : <Sun size={20} />;
  };

  const getThemeTitle = () => {
    if (theme === 'system') {
      return `System (${resolvedTheme})`;
    }
    return theme === 'dark' ? 'Dark mode' : 'Light mode';
  };

  return (
    <header className="header">
      {/* Left: Family Avatars & Add Friend */}
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {/* Placeholder for family member avatars */}
          <Avatar size="sm" fallback="JD" className="border-2 border-[var(--color-background)]" />
          <Avatar size="sm" fallback="AM" className="border-2 border-[var(--color-background)]" />
          <Avatar size="sm" fallback="KD" className="border-2 border-[var(--color-background)]" />
          <div className="avatar avatar-sm border-2 border-[var(--color-background)] bg-[var(--color-primary)] text-white text-xs font-medium">
            +2
          </div>
        </div>
        
        {onAddNew && (
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={onAddNew}
          >
            Add
          </Button>
        )}
      </div>

      {/* Center: Family Name / Status */}
      <div className="flex items-center gap-3">
        <motion.h1 
          className="text-lg font-semibold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {familyName}
        </motion.h1>
      </div>

      {/* Right: Search, Notifications, Settings */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" title="Notifications">
          <Bell size={20} />
        </Button>

        {/* Language Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLocale}
          title={locale === 'cs' ? 'Switch to English' : 'Přepnout na češtinu'}
        >
          <Globe size={20} />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={getThemeTitle()}
        >
          {getThemeIcon()}
        </Button>

        {/* User Avatar */}
        <Avatar
          src={userAvatar}
          fallback={userName}
          size="md"
          className="cursor-pointer"
        />
      </div>
    </header>
  );
}
