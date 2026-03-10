'use client';

import { Home, MessageCircle, Users, Trophy, BarChart3, Zap } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const [chatHistory] = useState<Array<{ id: string; title: string; date: string }>>([
    { id: '1', title: 'Lewis Hamilton Records', date: 'Today' },
    { id: '2', title: 'DRS Explained', date: 'Yesterday' },
    { id: '3', title: 'Monaco GP Strategy', date: '3 days ago' },
  ]);

  return (
    <div className="flex flex-col h-full w-64 bg-card border-r border-border">
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-sm text-foreground">F1 Intelligence</h1>
          <p className="text-xs text-muted-foreground">AI Assistant</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <NavItem icon={Home} label="Home" href="/" active={pathname === '/'} />
        <NavItem icon={MessageCircle} label="Ask F1 AI" href="/chat" active={pathname === '/chat'} />
        <NavItem icon={Users} label="Drivers" href="/drivers" active={pathname === '/drivers'} />
        <NavItem icon={Trophy} label="Teams" href="/teams" active={pathname === '/teams'} />
        <NavItem icon={BarChart3} label="Race History" href="/races" active={pathname === '/races'} />
        <NavItem icon={Zap} label="Technical Analysis" href="/technical" active={pathname === '/technical'} />
      </nav>

      {/* Chat History */}
      <div className="border-t border-border p-3">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3 px-2">Chat History</h3>
        <div className="space-y-2">
          {chatHistory.map((chat) => (
            <div key={chat.id} className="p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
              <p className="text-sm text-foreground truncate">{chat.title}</p>
              <p className="text-xs text-muted-foreground">{chat.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active?: boolean;
}

function NavItem({ icon: Icon, label, href, active = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-foreground hover:bg-muted'
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
