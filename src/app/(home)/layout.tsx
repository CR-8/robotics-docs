import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: React.ReactNode }) {
  const base = baseOptions();
  return (
    <DocsLayout 
      tree={source.pageTree} 
      {...base} 
      sidebar={{ enabled: true }}
      nav={{ ...base.nav, title: 'Robotics Docs' }}
      containerProps={{
        className: 'max-w-[1900px]',
      }}
    >
      {children}
    </DocsLayout>
  );
}
