import { Cpu, Zap, Bot, Shield, Factory } from 'lucide-react';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { AISheet } from '@/components/ai-sheet';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: { 
      transparentMode: 'top',
      title: (
        <>
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Logo"
          >
            <circle cx={12} cy={12} r={12} fill="currentColor" />
          </svg>
          My App
        </>
      ),
      children: <AISheet />,
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
links: [
      {
        icon: <Cpu />,
        text: 'Basics',
        url: '/docs/basics',
        secondary: false,
      },
      {
        icon: <Zap />,
        text: 'Semi-Autonomous',
        url: '/docs/semi-autonomous',
        secondary: false,
      },
      {
        icon: <Bot />,
        text: 'Autonomous',
        url: '/docs/autonomous',
        secondary: false,
      },
      {
        icon: <Shield />,
        text: 'Combat',
        url: '/docs/combat',
        secondary: false,
      },
      {
        icon: <Factory />,
        text: 'Industrial',
        url: '/docs/industrial',
        secondary: false,
      },
    ],
  };
}
