import { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  className?: string;
}

export default function MobileLayout({ 
  children, 
  showNav = true,
  className = ''
}: MobileLayoutProps) {
  return (
    <div className={`mobile-layout ${className}`}>
      {/* Main Content Area */}
      <div 
        className={`
          min-h-screen
          ${showNav ? 'pb-20 md:pb-0' : ''}
        `}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
          paddingBottom: showNav ? 'calc(80px + env(safe-area-inset-bottom))' : 'env(safe-area-inset-bottom)'
        }}
      >
        {children}
      </div>
    </div>
  );
}

