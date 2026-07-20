'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', href: '/' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Contact us', href: '/contact' },
  ];

  return (
    <header className="w-full h-20 fixed top-0 left-0 z-50 flex items-center justify-center pointer-events-none">
      <nav className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2 py-2 flex items-center gap-1 mt-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                px-6 py-2 rounded-full text-sm font-body font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
