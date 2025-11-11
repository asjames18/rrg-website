/**
 * Settings Panel Component
 * Displays and manages system settings
 */
import { useState, useEffect } from 'react';

type Category = 'general' | 'email' | 'features' | 'seo' | 'content';

export default function SettingsPanel() {
  const [activeCategory, setActiveCategory] = useState<Category>('general');
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      console.log('[SettingsPanel] Fetching settings from /api/admin/settings');
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      console.log('[SettingsPanel] Response:', response.status, data);

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to fetch settings';
        console.error('[SettingsPanel] Error:', errorMsg);
        throw new Error(errorMsg);
      }

      setSettings(data.settings || {});
      console.log('[SettingsPanel] Settings loaded:', Object.keys(data.settings || {}).length, 'items');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load settings';
      console.error('[SettingsPanel] Exception:', error);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, value: any, category: string) => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('[SettingsPanel] Saving setting:', { key, value, category });
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, category })
      });

      const data = await response.json();
      console.log('[SettingsPanel] Save response:', response.status, data);

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to save setting';
        console.error('[SettingsPanel] Save error:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('[SettingsPanel] Setting saved successfully');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchSettings();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save setting';
      console.error('[SettingsPanel] Save exception:', error);
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const categories = [
    { id: 'general' as Category, name: 'General', icon: '⚙️' },
    { id: 'email' as Category, name: 'Email', icon: '📧' },
    { id: 'features' as Category, name: 'Features', icon: '🔧' },
    { id: 'seo' as Category, name: 'SEO', icon: '🔍' },
    { id: 'content' as Category, name: 'Content', icon: '📝' }
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-neutral-800 rounded"></div>
        <div className="h-96 bg-neutral-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-amber-100">System Settings</h2>
        {success && (
          <div className="text-green-400 font-medium">✓ Settings saved successfully</div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-neutral-800">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              activeCategory === cat.id
                ? 'border-amber-500 text-amber-100'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span className="text-xl">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Settings Form */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        {activeCategory === 'general' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Site Name</label>
              <input
                type="text"
                defaultValue={settings.site_name?.value || 'Real & Raw Gospel'}
                onBlur={(e) => handleSave('site_name', e.target.value, 'general')}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Tagline</label>
              <input
                type="text"
                defaultValue={settings.site_tagline?.value || 'Training the Remnant'}
                onBlur={(e) => handleSave('site_tagline', e.target.value, 'general')}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Contact Email</label>
              <input
                type="email"
                defaultValue={settings.contact_email?.value || ''}
                onBlur={(e) => handleSave('contact_email', e.target.value, 'general')}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200"
              />
            </div>
          </div>
        )}

        {activeCategory === 'email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">SMTP Host</label>
              <input
                type="text"
                defaultValue={settings.smtp_host?.value || ''}
                onBlur={(e) => handleSave('smtp_host', e.target.value, 'email')}
                placeholder="smtp.example.com"
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">SMTP Port</label>
              <input
                type="number"
                defaultValue={settings.smtp_port?.value || 587}
                onBlur={(e) => handleSave('smtp_port', parseInt(e.target.value), 'email')}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">SMTP Username</label>
              <input
                type="text"
                defaultValue={settings.smtp_username?.value || ''}
                onBlur={(e) => handleSave('smtp_username', e.target.value, 'email')}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">SMTP Password</label>
              <input
                type="password"
                defaultValue={settings.smtp_password?.value || ''}
                onBlur={(e) => handleSave('smtp_password', e.target.value, 'email')}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">From Email Address</label>
              <input
                type="email"
                defaultValue={settings.from_email?.value || ''}
                onBlur={(e) => handleSave('from_email', e.target.value, 'email')}
                placeholder="noreply@example.com"
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">From Name</label>
              <input
                type="text"
                defaultValue={settings.from_name?.value || 'Real & Raw Gospel'}
                onBlur={(e) => handleSave('from_name', e.target.value, 'email')}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
              <div>
                <div className="font-medium text-neutral-200">Use TLS/SSL</div>
                <div className="text-sm text-neutral-500">Enable secure connection for SMTP</div>
              </div>
              <button
                onClick={() => handleSave('smtp_use_tls', !settings.smtp_use_tls?.value, 'email')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  settings.smtp_use_tls?.value
                    ? 'bg-green-700 text-green-100'
                    : 'bg-neutral-700 text-neutral-400'
                }`}
                disabled={saving}
              >
                {settings.smtp_use_tls?.value ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <div className="mt-6 p-4 bg-amber-900/20 border border-amber-800/50 rounded-lg">
              <div className="text-sm text-amber-200">
                <strong>Note:</strong> Email configuration requires proper SMTP credentials. Test your settings before enabling email notifications.
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'features' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
              <div>
                <div className="font-medium text-neutral-200">Enable Comments</div>
                <div className="text-sm text-neutral-500">Allow comments on blog posts</div>
              </div>
              <button
                onClick={() => handleSave('enable_comments', !settings.enable_comments?.value, 'features')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  settings.enable_comments?.value
                    ? 'bg-green-700 text-green-100'
                    : 'bg-neutral-700 text-neutral-400'
                }`}
                disabled={saving}
              >
                {settings.enable_comments?.value ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
              <div>
                <div className="font-medium text-neutral-200">User Registration</div>
                <div className="text-sm text-neutral-500">Allow new users to register</div>
              </div>
              <button
                onClick={() => handleSave('enable_registration', !settings.enable_registration?.value, 'features')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  settings.enable_registration?.value
                    ? 'bg-green-700 text-green-100'
                    : 'bg-neutral-700 text-neutral-400'
                }`}
                disabled={saving}
              >
                {settings.enable_registration?.value ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
              <div>
                <div className="font-medium text-neutral-200">Maintenance Mode</div>
                <div className="text-sm text-neutral-500">Show maintenance page to visitors</div>
              </div>
              <button
                onClick={() => handleSave('maintenance_mode', !settings.maintenance_mode?.value, 'features')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  settings.maintenance_mode?.value
                    ? 'bg-red-700 text-red-100'
                    : 'bg-neutral-700 text-neutral-400'
                }`}
                disabled={saving}
              >
                {settings.maintenance_mode?.value ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        )}

        {activeCategory === 'seo' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Default Meta Description</label>
              <textarea
                defaultValue={settings.default_meta_description?.value || ''}
                onBlur={(e) => handleSave('default_meta_description', e.target.value, 'seo')}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200"
                rows={3}
              />
            </div>
          </div>
        )}

        {activeCategory === 'content' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
              <div>
                <div className="font-medium text-neutral-200">Content Approval Required</div>
                <div className="text-sm text-neutral-500">Require admin approval before publishing</div>
              </div>
              <button
                onClick={() => handleSave('content_approval_required', !settings.content_approval_required?.value, 'content')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  settings.content_approval_required?.value
                    ? 'bg-amber-700 text-amber-100'
                    : 'bg-neutral-700 text-neutral-400'
                }`}
                disabled={saving}
              >
                {settings.content_approval_required?.value ? 'Required' : 'Not Required'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Auto-save Interval (seconds)</label>
              <input
                type="number"
                defaultValue={settings.autosave_interval?.value || 30}
                onBlur={(e) => handleSave('autosave_interval', parseInt(e.target.value), 'content')}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {saving && (
          <div className="mt-4 text-center text-amber-400">Saving...</div>
        )}
      </div>
    </div>
  );
}

