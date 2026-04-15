'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppShellProps {
  children: ReactNode;
  familyName?: string;
  userName?: string;
  userAvatar?: string;
  onAddNew?: () => void;
}

export function AppShell({
  children,
  familyName,
  userName,
  userAvatar,
  onAddNew,
}: AppShellProps) {
  return (
    <div className="min-h-screen">
      {/* Sidebar - hidden on mobile */}
      <Sidebar />
      
      {/* Header */}
      <Header
        familyName={familyName}
        userName={userName}
        userAvatar={userAvatar}
        onAddNew={onAddNew}
      />
      
      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
