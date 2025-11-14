import { useState } from 'react';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  onBack?: () => void;
  onSearch?: () => void;
  children?: React.ReactNode;
}

export default function MobileHeader({
  title = 'Real & Raw Gospel',
  showBack = false,
  showSearch = false,
  onBack,
  onSearch,
  children
}: MobileHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (onSearch && !isSearchOpen) {
      onSearch();
    }
  };

  return (
    <header 
      className="md:hidden sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-lg border-b border-neutral-800"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 text-neutral-300 hover:text-amber-400 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Logo/Title */}
          <div className="flex items-center gap-2">
            <img 
              src="/rrg-logo.jpg" 
              alt="RRG" 
              className="w-8 h-8 rounded-lg object-cover"
            />
            <h1 className="text-lg font-bold text-amber-100 truncate max-w-[180px]">
              {title}
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <button
              onClick={handleSearch}
              className="p-2 text-neutral-300 hover:text-amber-400 transition-colors"
              aria-label="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}

          {children}

          {/* User Menu Button (if signed in) */}
          <button
            id="mobile-user-menu-btn"
            className="p-2 text-neutral-300 hover:text-amber-400 transition-colors"
            aria-label="User menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar (when open) */}
      {isSearchOpen && (
        <div className="px-4 pb-3 animate-slideDown">
          <input
            type="search"
            placeholder="Search..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            autoFocus
          />
        </div>
      )}
    </header>
  );
}

