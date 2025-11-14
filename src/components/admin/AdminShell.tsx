import { useState, useEffect } from 'react';
import MediaPicker from './MediaPicker';
import SupabaseContentEditor from '../cms/SupabaseContentEditor';
import Dashboard from './Dashboard';
import ContentAnalytics from './ContentAnalytics';
import SettingsPanel from './SettingsPanel';
import BulkActionsBar from './BulkActionsBar';
import ActivityLog from './ActivityLog';
import PushNotifications from './PushNotifications';

interface AdminShellProps {
  userRole?: string;
  userName?: string;
  userEmail?: string;
}

export default function AdminShell({ userRole, userName, userEmail }: AdminShellProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'analytics' | 'media' | 'users' | 'settings' | 'activity' | 'notifications'>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  // Initialize as hydrated if we're in the browser (component wouldn't render otherwise)
  const [isHydrated, setIsHydrated] = useState(typeof window !== 'undefined');

  // Ensure component is hydrated before rendering
  useEffect(() => {
    // Set hydrated immediately - React is already running if this component rendered
    setIsHydrated(true);
  }, []);

  // Handle hash navigation and URL parameters
  useEffect(() => {
    if (!isHydrated) return;
    
    // Check for hash navigation
    const hash = window.location.hash.replace('#', '');
    if (hash && ['dashboard', 'content', 'analytics', 'media', 'users', 'settings', 'activity', 'notifications'].includes(hash)) {
      setActiveTab(hash as any);
      return;
    }
    
    // Check for edit parameter
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
      setActiveTab('content');
      // Store the edit ID for the content tab to use
      sessionStorage.setItem('editContentId', editId);
      // Clean up the URL
      window.history.replaceState({}, '', '/admin');
    }
  }, [isHydrated]);

  // Handle iframe loading states (only for tabs that use iframes)
  useEffect(() => {
    // Only show loading for tabs that actually use iframes
    const tabsWithIframes: string[] = []; // Add tab IDs here if they use iframes
    
    if (tabsWithIframes.includes(activeTab)) {
      const handleIframeLoad = () => setIsLoading(false);
      const iframes = document.querySelectorAll('iframe');
      
      if (iframes.length > 0) {
        setIsLoading(true);
        iframes.forEach(iframe => {
          iframe.addEventListener('load', handleIframeLoad);
        });
        return () => {
          iframes.forEach(iframe => {
            iframe.removeEventListener('load', handleIframeLoad);
          });
        };
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [activeTab]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', description: 'Overview and analytics' },
    { id: 'content', label: 'Content', icon: '📝', description: 'Create and manage content' },
    { id: 'analytics', label: 'Analytics', icon: '📈', description: 'Performance and insights' },
    { id: 'media', label: 'Media', icon: '📁', description: 'Upload and manage files' },
    { id: 'users', label: 'Users', icon: '👥', description: 'Manage team access' },
    { id: 'notifications', label: 'Push Notifications', icon: '🔔', description: 'Send push notifications' },
    { id: 'settings', label: 'Settings', icon: '⚙️', description: 'System configuration' },
    { id: 'activity', label: 'Activity', icon: '📋', description: 'System activity log' }
  ] as const;

  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-700/30 border-t-amber-500"></div>
          <div className="text-amber-100 font-medium text-lg">Loading Admin Center...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-900" style={{ 
      fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      color: '#ffffff'
    }}>
      {/* Header */}
      <header className="bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-4 sm:space-x-8 flex-1 min-w-0">
              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-700 via-amber-600 to-amber-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-amber-700/30">
                    <span className="text-white font-bold text-lg sm:text-xl tracking-tight" style={{ fontFamily: 'Cinzel, ui-serif, Georgia, serif' }}>RRG</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-neutral-900"></div>
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold text-amber-100 tracking-tight truncate" style={{ fontFamily: 'Cinzel, ui-serif, Georgia, serif' }}>Admin Center</h1>
                  <p className="text-xs sm:text-sm text-neutral-400 font-medium hidden sm:block">Content Management System</p>
                </div>
              </div>
              {/* Mobile: Show user avatar only */}
              <div className="lg:hidden ml-auto">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-full flex items-center justify-center ring-2 ring-neutral-600">
                  <span className="text-amber-100 font-semibold text-xs sm:text-sm">
                    {(userName || userEmail)?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              {/* Desktop: Show full user info */}
              <div className="hidden lg:block">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-full flex items-center justify-center ring-2 ring-neutral-600">
                    <span className="text-amber-100 font-semibold text-sm">
                      {(userName || userEmail)?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-amber-100">
                      {userName || userEmail}
                    </div>
                    {userRole && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-700/20 text-amber-200 ring-1 ring-amber-700/50">
                        {userRole}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Mobile: Icon-only buttons */}
              <a 
                href="/" 
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 text-neutral-400 hover:text-amber-100 hover:bg-neutral-800 rounded-lg transition-all duration-200 group"
                target="_blank"
                rel="noopener noreferrer"
                title="View Site"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
              <a 
                href="/cms" 
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 text-neutral-400 hover:text-amber-100 hover:bg-neutral-800 rounded-lg transition-all duration-200 group"
                title="CMS Dashboard"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </a>
              <a 
                href="/auth" 
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 bg-neutral-800 hover:bg-neutral-700 text-amber-100 rounded-lg transition-all duration-200 group border border-neutral-700 hover:border-amber-700"
                title="Sign Out"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </a>
              
              {/* Desktop: Full buttons with text */}
              <a 
                href="/" 
                className="hidden lg:inline-flex items-center px-4 py-2.5 text-sm font-semibold text-neutral-400 hover:text-amber-100 hover:bg-neutral-800 rounded-xl transition-all duration-200 group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                View Site
              </a>
              <a 
                href="/cms" 
                className="hidden lg:inline-flex items-center px-4 py-2.5 text-sm font-semibold text-neutral-400 hover:text-amber-100 hover:bg-neutral-800 rounded-xl transition-all duration-200 group"
              >
                <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                CMS Dashboard
              </a>
              <a 
                href="/auth" 
                className="hidden lg:inline-flex items-center px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-100 rounded-xl text-sm font-semibold transition-all duration-200 group border border-neutral-700 hover:border-amber-700"
              >
                <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-neutral-900/70 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Mobile: Dropdown selector */}
          <div className="lg:hidden py-4">
            <select
              value={activeTab}
              onChange={(e) => {
                setActiveTab(e.target.value as any);
                setIsLoading(true);
              }}
              className="w-full bg-neutral-800 border border-neutral-700 text-amber-100 rounded-lg px-4 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.icon} {tab.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Desktop: Horizontal tabs */}
          <div className="hidden lg:flex space-x-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsLoading(true);
                }}
                className={`group flex items-center space-x-3 py-5 px-8 rounded-t-2xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-neutral-800 text-amber-200 shadow-lg border-t-4 border-amber-700 transform -translate-y-1'
                    : 'text-neutral-400 hover:text-amber-100 hover:bg-neutral-800/50 hover:shadow-md hover:transform hover:-translate-y-0.5'
                }`}
              >
                <span className={`text-2xl transition-all duration-300 ${
                  activeTab === tab.id ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-105 group-hover:drop-shadow-sm'
                }`}>
                  {tab.icon}
                </span>
                <div className="text-left">
                  <div className="font-bold text-base">{tab.label}</div>
                  <div className="text-xs text-neutral-500 hidden xl:block font-medium">{tab.description}</div>
                </div>
                {activeTab === tab.id && (
                  <div className="w-2 h-2 bg-amber-700 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-neutral-950 relative">
        {/* Loading overlay - only for tabs that use iframes */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-200 border-t-amber-500"></div>
              <div className="text-amber-100 font-medium">Loading...</div>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-12">
            <Dashboard />
          </div>
        )}

        {/* Content Tab - MDX Editor */}
        {activeTab === 'content' && <ContentTab />}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-12">
            <ContentAnalytics />
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && <MediaTab />}

        {/* Users Tab */}
        {activeTab === 'users' && <UsersTab />}

        {/* Push Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-12">
            <PushNotifications />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-12">
            <SettingsPanel />
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-12">
            <ActivityLog />
          </div>
        )}
      </main>
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab() {
  const [stats, setStats] = useState({
    total: { content: 0, published: 0, drafts: 0, featured: 0 },
    byType: { blog: 0, video: 0, book: 0, music: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/cms/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-900">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'Cinzel, ui-serif, Georgia, serif' }}>Welcome Back!</h1>
              <p className="text-xl text-amber-100 font-medium max-w-2xl leading-relaxed">
                Manage your content, track performance, and grow your ministry with our powerful admin tools.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="text-right">
                <div className="text-amber-200 text-sm font-semibold mb-2">Today is</div>
                <div className="text-2xl font-bold text-white">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-amber-200 text-sm mt-1">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="group bg-neutral-900 p-8 rounded-3xl shadow-lg border border-neutral-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden hover:border-blue-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Total Content</div>
                <div className="text-4xl font-bold text-amber-100 mt-1">
                  {loading ? (
                    <div className="animate-pulse bg-neutral-700 h-10 w-16 rounded"></div>
                  ) : (
                    stats.total.content
                  )}
                </div>
                <div className="text-sm text-neutral-400 mt-1">All items</div>
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-neutral-900 p-8 rounded-3xl shadow-lg border border-neutral-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden hover:border-green-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-green-400 uppercase tracking-wider">Published</div>
                <div className="text-4xl font-bold text-amber-100 mt-1">
                  {loading ? (
                    <div className="animate-pulse bg-neutral-700 h-10 w-16 rounded"></div>
                  ) : (
                    stats.total.published
                  )}
                </div>
                <div className="text-sm text-neutral-400 mt-1">Live content</div>
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-neutral-900 p-8 rounded-3xl shadow-lg border border-neutral-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden hover:border-amber-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Drafts</div>
                <div className="text-4xl font-bold text-amber-100 mt-1">
                  {loading ? (
                    <div className="animate-pulse bg-neutral-700 h-10 w-16 rounded"></div>
                  ) : (
                    stats.total.drafts
                  )}
                </div>
                <div className="text-sm text-neutral-400 mt-1">In progress</div>
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-neutral-900 p-8 rounded-3xl shadow-lg border border-neutral-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden hover:border-purple-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Featured</div>
                <div className="text-4xl font-bold text-amber-100 mt-1">
                  {loading ? (
                    <div className="animate-pulse bg-neutral-700 h-10 w-16 rounded"></div>
                  ) : (
                    stats.total.featured
                  )}
                </div>
                <div className="text-sm text-neutral-400 mt-1">Highlighted</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-amber-100 mb-2" style={{ fontFamily: 'Cinzel, ui-serif, Georgia, serif' }}>Quick Actions</h2>
            <p className="text-neutral-400 text-lg">Get started with content creation and management</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 border border-neutral-700 hover:border-amber-700">
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              Filter
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Create New
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <a
            href="/cms"
            className="group bg-neutral-900 p-8 rounded-3xl shadow-lg border border-neutral-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden hover:border-blue-700/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-amber-100 group-hover:text-blue-400 transition-colors mb-2">Content Editor</h3>
              <p className="text-neutral-400 mb-4">Manage posts, videos, books and all your content in one place</p>
              <div className="flex items-center text-blue-400 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-200">
                View All Content
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </a>

          <a
            href="/cms/videos/new"
            className="group bg-neutral-900 p-8 rounded-3xl shadow-lg border border-neutral-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden hover:border-green-700/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/10"></div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-amber-100 group-hover:text-red-400 transition-colors mb-2">New Video</h3>
              <p className="text-neutral-400 mb-4">Upload and publish new video content for your ministry</p>
              <div className="flex items-center text-red-600 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-200">
                Quick Create
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </a>

          <a
            href="/cms/blog/new"
            className="group bg-neutral-900 p-8 rounded-3xl shadow-lg border border-neutral-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden hover:border-green-700/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-amber-100 group-hover:text-green-400 transition-colors mb-2">New Post</h3>
              <p className="text-neutral-400 mb-4">Write and publish new blog posts to share your message</p>
              <div className="flex items-center text-green-600 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-200">
                Quick Create
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </a>

          <button
            onClick={() => {
              setActiveTab('content');
              // Trigger create new content with book type
              setTimeout(() => {
                const event = new CustomEvent('createContent', { detail: { type: 'book' } });
                window.dispatchEvent(event);
              }, 100);
            }}
            className="group bg-neutral-900 p-8 rounded-3xl shadow-lg border border-neutral-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden hover:border-purple-700/50 w-full text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10"></div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-amber-100 group-hover:text-purple-400 transition-colors mb-2">New Book</h3>
              <p className="text-neutral-400 mb-4">Add book recommendations and reviews for your community</p>
              <div className="flex items-center text-purple-600 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-200">
                Quick Create
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Content by Type */}
      <div className="bg-neutral-900 rounded-3xl shadow-lg border border-neutral-800 overflow-hidden">
        <div className="px-10 py-8 border-b border-neutral-800 bg-gradient-to-r from-neutral-800 to-neutral-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-amber-100 mb-2">Content by Type</h2>
              <p className="text-neutral-400 font-medium">Breakdown of your content across different categories</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-neutral-400 font-semibold">Total Distribution</div>
              <div className="text-lg font-bold text-amber-100">
                {loading ? '...' : Object.values(stats.byType).reduce((a, b) => a + b, 0)} items
              </div>
            </div>
          </div>
        </div>
        <div className="p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-3">
                {loading ? (
                  <div className="animate-pulse bg-blue-200 h-10 w-16 rounded mx-auto"></div>
                ) : (
                  stats.byType.blog
                )}
              </div>
              <div className="text-base font-semibold text-amber-100 mb-1">Blog Posts</div>
              <div className="text-sm text-neutral-400">Written content</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
              <div className="text-4xl font-bold text-red-600 mb-3">
                {loading ? (
                  <div className="animate-pulse bg-red-200 h-10 w-16 rounded mx-auto"></div>
                ) : (
                  stats.byType.video
                )}
              </div>
              <div className="text-base font-semibold text-amber-100 mb-1">Videos</div>
              <div className="text-sm text-neutral-400">Video content</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-3">
                {loading ? (
                  <div className="animate-pulse bg-green-200 h-10 w-16 rounded mx-auto"></div>
                ) : (
                  stats.byType.book
                )}
              </div>
              <div className="text-base font-semibold text-amber-100 mb-1">Books</div>
              <div className="text-sm text-neutral-400">Book reviews</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                </svg>
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-3">
                {loading ? (
                  <div className="animate-pulse bg-purple-200 h-10 w-16 rounded mx-auto"></div>
                ) : (
                  stats.byType.music
                )}
              </div>
              <div className="text-base font-semibold text-amber-100 mb-1">Music</div>
              <div className="text-sm text-neutral-400">Audio content</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab() {
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    contentEngagement: 0,
    topContent: [] as Array<{title: string, views: number, type: string}>,
    recentActivity: [] as Array<{action: string, time: string, type: string}>
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalytics({
        pageViews: 1247,
        uniqueVisitors: 892,
        contentEngagement: 78.5,
        topContent: [
          { title: 'Walking in the Spirit', views: 234, type: 'blog' },
          { title: 'End Times Signs', views: 189, type: 'blog' },
          { title: 'Spiritual Warfare 101', views: 156, type: 'video' },
          { title: 'Hebraic Roots Handbook', views: 134, type: 'book' }
        ],
        recentActivity: [
          { action: 'New blog post published', time: '2 hours ago', type: 'success' },
          { action: 'Video uploaded', time: '4 hours ago', type: 'info' },
          { action: 'User signed up', time: '6 hours ago', type: 'success' },
          { action: 'Content updated', time: '1 day ago', type: 'info' }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-amber-100 mb-3">Analytics & Insights</h2>
        <p className="text-neutral-400 text-lg">Track performance, engagement, and content analytics for your ministry.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 p-6 rounded-2xl shadow-sm border border-blue-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-400 uppercase tracking-wide">Page Views</h3>
              <p className="text-3xl font-bold text-amber-100 mt-2">
                {loading ? (
                  <div className="animate-pulse bg-blue-200 h-8 w-20 rounded"></div>
                ) : (
                  analytics.pageViews.toLocaleString()
                )}
              </p>
              <p className="text-sm text-blue-600 mt-1">+12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">👁️</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 p-6 rounded-2xl shadow-sm border border-green-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-400 uppercase tracking-wide">Unique Visitors</h3>
              <p className="text-3xl font-bold text-amber-100 mt-2">
                {loading ? (
                  <div className="animate-pulse bg-green-200 h-8 w-20 rounded"></div>
                ) : (
                  analytics.uniqueVisitors.toLocaleString()
                )}
              </p>
              <p className="text-sm text-green-600 mt-1">+8% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 p-6 rounded-2xl shadow-sm border border-purple-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-purple-400 uppercase tracking-wide">Engagement</h3>
              <p className="text-3xl font-bold text-amber-100 mt-2">
                {loading ? (
                  <div className="animate-pulse bg-purple-200 h-8 w-16 rounded"></div>
                ) : (
                  `${analytics.contentEngagement}%`
                )}
              </p>
              <p className="text-sm text-purple-600 mt-1">+5% from last month</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Content */}
        <div className="bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 overflow-hidden">
          <div className="px-8 py-6 border-b border-neutral-800 bg-neutral-800/50">
            <h3 className="text-lg font-semibold text-amber-100">Top Performing Content</h3>
            <p className="text-neutral-400 text-sm mt-1">Most viewed content this month</p>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.topContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                        <span className="text-slate-600 text-sm">
                          {content.type === 'blog' ? '📄' : content.type === 'video' ? '🎥' : '📚'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{content.title}</div>
                        <div className="text-sm text-slate-500 capitalize">{content.type}</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-600">{content.views} views</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 overflow-hidden">
          <div className="px-8 py-6 border-b border-neutral-800 bg-neutral-800/50">
            <h3 className="text-lg font-semibold text-amber-100">Recent Activity</h3>
            <p className="text-neutral-400 text-sm mt-1">Latest updates and changes</p>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-green-500' : 
                      activity.type === 'info' ? 'bg-blue-500' : 'bg-amber-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">{activity.action}</div>
                      <div className="text-xs text-slate-500">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Content Tab Component
function ContentTab() {
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [contentList, setContentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [defaultContentType, setDefaultContentType] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  useEffect(() => {
    loadContent();
    
    // Check if we should auto-edit a specific content item
    const editId = sessionStorage.getItem('editContentId');
    if (editId) {
      setSelectedContent(editId);
      sessionStorage.removeItem('editContentId'); // Clear it after use
    }

    // Listen for createContent event (from dashboard quick actions)
    const handleCreateContent = (event: CustomEvent) => {
      if (event.detail?.type) {
        setDefaultContentType(event.detail.type);
        setShowCreateForm(true);
        setSelectedContent(null);
      }
    };

    window.addEventListener('createContent', handleCreateContent as EventListener);
    return () => {
      window.removeEventListener('createContent', handleCreateContent as EventListener);
    };
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      console.log('Loading content from /api/cms/content...');
      const response = await fetch('/api/cms/content');
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Content data:', data);
      
      if (response.ok) {
        setContentList(data.content || []);
        console.log('Content loaded successfully:', data.content?.length || 0, 'items');
      } else {
        console.error('API Error:', data);
        setContentList([]);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setContentList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditContent = (contentId: string) => {
    setSelectedContent(contentId);
    setShowCreateForm(false);
  };

  const handleCreateContent = () => {
    setShowCreateForm(true);
    setSelectedContent(null);
  };

  const handleSaveContent = () => {
    setSelectedContent(null);
    setShowCreateForm(false);
    loadContent(); // Reload the content list
  };

  const handleCancelEdit = () => {
    setSelectedContent(null);
    setShowCreateForm(false);
  };

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === contentList.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(contentList.map(item => item.id)));
    }
  };

  const handleBulkAction = async (action: string, value?: string) => {
    if (selectedItems.size === 0) return;
    
    setBulkActionLoading(true);
    try {
      const contentIds = Array.from(selectedItems);
      const response = await fetch('/api/admin/content/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_ids: contentIds,
          action,
          value
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('[ContentTab] Bulk action successful:', data);
        // Reload content list
        await loadContent();
        // Clear selection
        setSelectedItems(new Set());
      } else {
        console.error('[ContentTab] Bulk action failed:', data);
        alert(`Bulk action failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('[ContentTab] Bulk action error:', error);
      alert('An error occurred during bulk action');
    } finally {
      setBulkActionLoading(false);
    }
  };


  if (selectedContent || showCreateForm) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <SupabaseContentEditor
          contentId={selectedContent || undefined}
          onSave={handleSaveContent}
          onCancel={handleCancelEdit}
          defaultContentType={defaultContentType || undefined}
        />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-amber-100 mb-3">Content Management</h2>
          <p className="text-neutral-400 text-lg">Manage your content with the Supabase CMS.</p>
        </div>
        <button
          onClick={handleCreateContent}
          className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium"
        >
          + Create New Content
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-200 border-t-amber-500"></div>
            <div className="text-amber-100 font-medium">Loading content...</div>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 overflow-hidden">
          <div className="px-8 py-6 border-b border-neutral-800 bg-neutral-800/50 flex items-center justify-between">
            <div>
            <h3 className="text-lg font-semibold text-amber-100">Your Content ({contentList.length} items)</h3>
            <p className="text-neutral-400 text-sm mt-1">Click on any content to edit it</p>
            </div>
            {contentList.length > 0 && (
              <button
                onClick={toggleSelectAll}
                className="text-sm text-amber-400 hover:text-amber-300 font-medium"
              >
                {selectedItems.size === contentList.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>
          
          <div className="p-6">
            {contentList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-400 mb-4">No content found</p>
                <p className="text-neutral-500 text-sm">Check the browser console for any API errors</p>
              </div>
            ) : (
              <>
              <div className="grid gap-4">
                {contentList.map((item) => (
                  <div
                    key={item.id}
                      className="p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-amber-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleItemSelection(item.id);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 rounded border-neutral-600 text-amber-600 focus:ring-amber-500 focus:ring-offset-0 bg-neutral-800"
                          />
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => handleEditContent(item.id)}
                          >
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-amber-100 font-medium">{item.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'published' ? 'bg-green-900/30 text-green-300 border border-green-700/50' :
                            item.status === 'draft' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/50' :
                            'bg-gray-900/30 text-gray-300 border border-gray-700/50'
                          }`}>
                            {item.status}
                          </span>
                          {item.featured && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-900/30 text-amber-300 border border-amber-700/50">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-400 text-sm capitalize mb-1">{item.content_type}</p>
                        {item.summary && (
                          <p className="text-neutral-500 text-sm line-clamp-2">{item.summary}</p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.slice(0, 3).map((tag: any) => (
                              <span key={tag.id} className="px-2 py-1 bg-neutral-700 text-neutral-300 text-xs rounded">
                                {tag.name}
                              </span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="px-2 py-1 bg-neutral-700 text-neutral-300 text-xs rounded">
                                +{item.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                          </div>
                      </div>
                      <div className="text-neutral-400 text-sm ml-4">
                        {new Date(item.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                
                {/* Bulk Actions Bar */}
                {selectedItems.size > 0 && (
                  <BulkActionsBar
                    selectedCount={selectedItems.size}
                    contentType="content"
                    onAction={handleBulkAction}
                    onClearSelection={() => setSelectedItems(new Set())}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Media Tab Component
function MediaTab() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-amber-100 mb-3">Media Library</h2>
        <p className="text-neutral-400 text-lg">Upload and manage your media files. Click to copy URLs for use in content.</p>
      </div>

      <div className="bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 overflow-hidden">
        <MediaPicker />
      </div>
    </div>
  );
}

// Users Tab Component
function UsersTab() {
  const [users, setUsers] = useState<Array<{id: string, email: string, displayName?: string, role: string, lastActive: string, createdAt?: string, status?: string}>>([]);
  const [filteredUsers, setFilteredUsers] = useState<typeof users>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [grantEmail, setGrantEmail] = useState('');
  const [grantRole, setGrantRole] = useState('editor');
  const [isGranting, setIsGranting] = useState(false);
  const [grantMessage, setGrantMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Filtering and search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'email' | 'role' | 'lastActive'>('lastActive');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  
  // Bulk actions
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [bulkActionRole, setBulkActionRole] = useState('editor');
  const [isBulkActioning, setIsBulkActioning] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Apply filters, search, and sorting
  useEffect(() => {
    let result = [...users];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.email.toLowerCase().includes(query) ||
        user.displayName?.toLowerCase().includes(query)
      );
    }
    
    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Sorting
    result.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'email':
          aVal = a.email.toLowerCase();
          bVal = b.email.toLowerCase();
          break;
        case 'role':
          aVal = a.role;
          bVal = b.role;
          break;
        case 'lastActive':
          aVal = new Date(a.lastActive).getTime();
          bVal = new Date(b.lastActive).getTime();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchQuery, roleFilter, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      console.log('[UsersTab] Fetching users from /api/cms/users');
      const response = await fetch('/api/cms/users');
      const data = await response.json();
      
      console.log('[UsersTab] Response:', response.status, data);
      
      if (response.ok) {
        const usersList = data.users || [];
        setUsers(usersList);
        console.log('[UsersTab] Users loaded:', usersList.length);
        console.log('[UsersTab] Users data:', usersList);
        console.log('[UsersTab] Users by role:', {
          admin: usersList.filter(u => u.role === 'admin').length,
          editor: usersList.filter(u => u.role === 'editor').length,
          viewer: usersList.filter(u => u.role === 'viewer').length,
          user: usersList.filter(u => u.role === 'user' || !u.role).length,
          total: usersList.length
        });
      } else {
        console.error('[UsersTab] Failed to fetch users:', response.status, response.statusText, data);
        setUsers([]);
      }
    } catch (error) {
      console.error('[UsersTab] Error fetching users:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGranting(true);
    setGrantMessage(null);

    try {
      console.log('[UsersTab] Granting access:', grantEmail, grantRole);
      const response = await fetch('/api/admin/grant-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: grantEmail, role: grantRole })
      });

      const data = await response.json();
      console.log('[UsersTab] Grant response:', response.status, data);

      if (response.ok) {
        setGrantMessage({ type: 'success', text: `Successfully granted ${grantRole} access to ${grantEmail}. They can now sign in with their account.` });
        setGrantEmail('');
        setGrantRole('editor');
        // Refresh users list
        fetchUsers();
      } else {
        setGrantMessage({ type: 'error', text: data.error || 'Failed to grant access. The user may not exist yet.' });
      }
    } catch (error) {
      console.error('[UsersTab] Error granting access:', error);
      setGrantMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsGranting(false);
    }
  };

  const promoteUser = async (userId: string, newRole: string) => {
    try {
      console.log('[UsersTab] Updating user role:', userId, 'to', newRole);
      const response = await fetch('/api/cms/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      });
      
      const data = await response.json();
      console.log('[UsersTab] Update response:', response.status, data);
      
      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        console.log(`[UsersTab] User ${userId} promoted to ${newRole}`);
      } else {
        console.error('[UsersTab] Failed to promote user:', response.statusText, data);
        alert('Failed to update user role. Please try again.');
      }
    } catch (error) {
      console.error('[UsersTab] Error promoting user:', error);
      alert('Error updating user role. Please try again.');
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === paginatedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginatedUsers.map(u => u.id)));
    }
  };

  const handleBulkRoleChange = async () => {
    if (selectedUsers.size === 0) return;
    
    if (!confirm(`Change role to "${bulkActionRole}" for ${selectedUsers.size} selected users?`)) {
      return;
    }

    setIsBulkActioning(true);
    let successCount = 0;
    let failCount = 0;

    for (const userId of Array.from(selectedUsers)) {
      try {
        const response = await fetch('/api/cms/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, role: bulkActionRole })
        });
        
        if (response.ok) {
          successCount++;
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, role: bulkActionRole } : user
          ));
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
      }
    }

    setIsBulkActioning(false);
    setSelectedUsers(new Set());
    alert(`Updated ${successCount} users successfully${failCount > 0 ? `, ${failCount} failed` : ''}.`);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-900/30 text-red-300 border border-red-700/50';
      case 'editor': return 'bg-blue-900/30 text-blue-300 border border-blue-700/50';
      case 'viewer': return 'bg-neutral-800 text-neutral-300 border border-neutral-700';
      case 'user': return 'bg-neutral-800 text-neutral-400 border border-neutral-700';
      default: return 'bg-neutral-800 text-neutral-300 border border-neutral-700';
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // User statistics
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    editors: users.filter(u => u.role === 'editor').length,
    viewers: users.filter(u => u.role === 'viewer').length,
    regularUsers: users.filter(u => u.role === 'user' || !u.role || u.role === '').length,
  };
  
  console.log('[UsersTab] User statistics:', stats);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-100 mb-2 sm:mb-3">User Management</h2>
        <p className="text-neutral-400 text-sm sm:text-lg">Manage team access and permissions for your content management system.</p>
      </div>

      {/* Grant Access Form */}
      <div className="mb-6 sm:mb-8 bg-gradient-to-r from-amber-900/20 to-amber-800/10 border border-amber-700/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-amber-100 mb-2">Grant Admin/Editor Access</h3>
          <p className="text-neutral-300 text-sm">
            Give admin or editor access to an existing user. They must have already created an account via the signup page.
          </p>
        </div>
        
        <form onSubmit={handleGrantAccess} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="grant-email" className="block text-sm font-medium text-amber-200 mb-2">
                User Email Address
              </label>
              <input
                id="grant-email"
                type="email"
                value={grantEmail}
                onChange={(e) => setGrantEmail(e.target.value)}
                placeholder="user@example.com"
                required
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              />
            </div>
            
            <div>
              <label htmlFor="grant-role" className="block text-sm font-medium text-amber-200 mb-2">
                Role
              </label>
              <select
                id="grant-role"
                value={grantRole}
                onChange={(e) => setGrantRole(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGranting || !grantEmail}
            className="w-full md:w-auto px-6 py-3 bg-amber-700 hover:bg-amber-600 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isGranting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Granting Access...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Grant Access
              </>
            )}
          </button>
        </form>

        {grantMessage && (
          <div className={`mt-4 p-4 rounded-lg border ${
            grantMessage.type === 'success' 
              ? 'bg-green-900/20 border-green-700/50 text-green-200' 
              : 'bg-red-900/20 border-red-700/50 text-red-200'
          }`}>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                {grantMessage.type === 'success' ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              <p className="text-sm">{grantMessage.text}</p>
            </div>
          </div>
        )}
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 rounded-xl border border-neutral-700">
          <div className="text-3xl font-bold text-amber-100">{stats.total}</div>
          <div className="text-sm text-neutral-400 mt-1">Total Users</div>
        </div>
        <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 p-6 rounded-xl border border-red-700/30">
          <div className="text-3xl font-bold text-red-300">{stats.admins}</div>
          <div className="text-sm text-neutral-400 mt-1">Admins</div>
        </div>
        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 p-6 rounded-xl border border-blue-700/30">
          <div className="text-3xl font-bold text-blue-300">{stats.editors}</div>
          <div className="text-sm text-neutral-400 mt-1">Editors</div>
        </div>
        <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 p-6 rounded-xl border border-neutral-700">
          <div className="text-3xl font-bold text-neutral-300">{stats.viewers}</div>
          <div className="text-sm text-neutral-400 mt-1">Viewers</div>
        </div>
        <div className="bg-gradient-to-br from-neutral-800/30 to-neutral-900/30 p-6 rounded-xl border border-neutral-700">
          <div className="text-3xl font-bold text-neutral-400">{stats.regularUsers}</div>
          <div className="text-sm text-neutral-400 mt-1">Regular Users</div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-200 border-t-amber-500"></div>
            <div className="text-amber-100 font-medium">Loading users...</div>
          </div>
        </div>
      ) : (
        <>
          {/* Search and Filters */}
          <div className="mb-6 bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-amber-200 mb-2">Search Users</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by email or name..."
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-200 mb-2">Filter by Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                  <option value="user">Regular User</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-200 mb-2">Sort By</label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="lastActive">Last Active</option>
                    <option value="email">Email</option>
                    <option value="role">Role</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 hover:bg-neutral-700 transition-colors"
                    title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  >
                    <svg className={`w-5 h-5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-neutral-400">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedUsers.size > 0 && (
            <div className="mb-4 sm:mb-6 bg-amber-900/20 border border-amber-700/50 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <span className="text-amber-200 font-semibold">{selectedUsers.size} user(s) selected</span>
                <select
                  value={bulkActionRole}
                  onChange={(e) => setBulkActionRole(e.target.value)}
                  className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                  <option value="user">Regular User</option>
                </select>
                <button
                  onClick={handleBulkRoleChange}
                  disabled={isBulkActioning}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-600 disabled:bg-neutral-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  {isBulkActioning ? 'Updating...' : 'Change Role'}
                </button>
              </div>
              <button
                onClick={() => setSelectedUsers(new Set())}
                className="text-neutral-400 hover:text-neutral-200 text-sm"
              >
                Clear Selection
              </button>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-neutral-900 rounded-xl sm:rounded-2xl shadow-sm border border-neutral-800 overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-neutral-800 bg-neutral-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-amber-100">All Users ({filteredUsers.length})</h3>
                <p className="text-neutral-400 text-sm mt-1">Manage roles and permissions for your team</p>
              </div>
              {paginatedUsers.length > 0 && (
                <button
                  onClick={toggleSelectAll}
                  className="text-sm text-amber-400 hover:text-amber-300 font-medium"
                >
                  {selectedUsers.size === paginatedUsers.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>
            
            {filteredUsers.length === 0 ? (
              <div className="px-4 sm:px-8 py-8 sm:py-12 text-center">
                <svg className="w-16 h-16 mx-auto text-neutral-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-neutral-400">No users found matching your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setRoleFilter('all');
                  }}
                  className="mt-4 text-amber-400 hover:text-amber-300 text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <ul className="divide-y divide-neutral-800">
                  {paginatedUsers.map((user) => (
                    <li key={user.id} className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 hover:bg-neutral-800/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                            className="w-5 h-5 rounded border-neutral-600 text-amber-600 focus:ring-amber-500 focus:ring-offset-0 bg-neutral-800 flex-shrink-0"
                        />
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-neutral-600 to-neutral-700 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                            <span className="text-amber-100 font-semibold text-base sm:text-lg">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-base sm:text-lg font-semibold text-amber-100 truncate">{user.displayName || user.email}</div>
                            {user.displayName && <div className="text-xs sm:text-sm text-neutral-500 truncate">{user.email}</div>}
                            <div className="text-xs sm:text-sm text-neutral-400 mt-1">Last active: {user.lastActive}</div>
                        </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 pl-8 sm:pl-0">
                          <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getRoleColor(user.role)}`}>
                            {user.role || 'user'}
                          </span>
                          <select
                            value={user.role}
                            onChange={(e) => promoteUser(user.id, e.target.value)}
                            className="text-xs sm:text-sm border-neutral-700 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-neutral-800 text-amber-100 px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="user">Regular User</option>
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-neutral-800 bg-neutral-800/30">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-sm text-neutral-400">
                        Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 text-neutral-200 rounded-lg text-sm font-medium transition-colors"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 text-neutral-200 rounded-lg text-sm font-medium transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      <div className="mt-8 p-6 bg-blue-900/20 border border-blue-700/30 rounded-2xl">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-100">How User Access Works</h3>
            <div className="mt-2 text-blue-200 text-sm space-y-2">
              <p>• <strong>New Users:</strong> Users must first create an account at <a href="/auth" className="underline hover:text-blue-300">/auth</a> (sign up page)</p>
              <p>• <strong>Grant Access:</strong> Use the form above to promote existing users to Admin or Editor</p>
              <p>• <strong>Roles:</strong> Admin = full access | Editor = content management | Viewer = read only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
