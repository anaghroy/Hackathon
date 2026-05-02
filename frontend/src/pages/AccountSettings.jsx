import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Shield, Bell, Globe, 
  ArrowLeft, Save, Loader2, Lock,
  Settings
} from 'lucide-react';
import { getSettings, updateSettings } from '../services/settings.service';
import { toast } from 'react-hot-toast';

const AccountSettings = ({ onBack }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (field) => {
    try {
      const updatedValue = !settings[field];
      setSettings(prev => ({ ...prev, [field]: updatedValue }));
      
      const res = await updateSettings({ [field]: updatedValue });
      if (res.success) {
        toast.success("Preference updated");
      }
    } catch (error) {
      toast.error("Failed to update preference");
      fetchSettings(); // Revert on failure
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Loader2 className="loader-icon" />
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-page__container">
        {/* Header */}
        <div className="settings-page__header">
          <div className="settings-page__title-group">
            <button 
              onClick={onBack || (() => navigate('/dashboard'))}
              className="settings-page__back-btn"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="settings-page__title">Account Settings</h1>
          </div>
        </div>

        <div className="settings-page__content">
          {/* Sidebar Nav */}
          <div className="settings-page__sidebar">
            <div className="settings-page__nav-item settings-page__nav-item--active">
              <User size={18} />
              <span>Profile & Security</span>
            </div>
            <div className="settings-page__nav-item">
              <Bell size={18} />
              <span>Notifications</span>
            </div>
            <div className="settings-page__nav-item">
              <Globe size={18} />
              <span>Preferences</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="settings-page__main">
            {/* Linked Accounts */}
            <section className="settings-page__section">
              <h2 className="settings-page__section-title">
                <Shield size={18} />
                Linked Accounts
              </h2>
              <div className="settings-page__list">
                <div className="settings-page__item">
                  <div className="settings-page__item-info">
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                    <div className="settings-page__item-text">
                      <p>GitHub</p>
                      <p>Fast one-click login</p>
                    </div>
                  </div>
                  {settings?.loginMethods?.includes('github') ? (
                    <span className="settings-page__item-badge settings-page__item-badge--connected">Connected</span>
                  ) : (
                    <button className="settings-page__item-btn">Connect</button>
                  )}
                </div>
                <div className="settings-page__item">
                  <div className="settings-page__item-info">
                    <svg width="20" height="20" viewBox="0 0 18 18">
                      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                      <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.172.282-1.712V4.956H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.044l3.007-2.332z" fill="#FBBC05"/>
                      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.443 2.048.957 4.956l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    <div className="settings-page__item-text">
                      <p>Google</p>
                      <p>Connected via workspace</p>
                    </div>
                  </div>
                  {settings?.loginMethods?.includes('google') ? (
                    <span className="settings-page__item-badge settings-page__item-badge--connected">Connected</span>
                  ) : (
                    <button className="settings-page__item-btn">Connect</button>
                  )}
                </div>
              </div>
            </section>

            {/* General Preferences */}
            <section className="settings-page__section">
              <h2 className="settings-page__section-title">
                <Settings size={18} />
                General Preferences
              </h2>
              <div className="settings-page__list">
                <div className="settings-page__toggle-group">
                  <div className="settings-page__toggle-info">
                    <p>Two-Factor Authentication</p>
                    <p>Enhance your account security</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('twoFactorEnabled')}
                    className={`settings-page__toggle-switch ${settings?.twoFactorEnabled ? 'settings-page__toggle-switch--on' : 'settings-page__toggle-switch--off'}`}
                  >
                    <div className={`settings-page__toggle-switch-dot ${settings?.twoFactorEnabled ? 'settings-page__toggle-switch-dot--on' : 'settings-page__toggle-switch-dot--off'}`} />
                  </button>
                </div>

                <div className="settings-page__toggle-group">
                  <div className="settings-page__toggle-info">
                    <p>Email Notifications</p>
                    <p>Receive deployment & security alerts</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('emailNotifications')}
                    className={`settings-page__toggle-switch ${settings?.emailNotifications ? 'settings-page__toggle-switch--on' : 'settings-page__toggle-switch--off'}`}
                  >
                    <div className={`settings-page__toggle-switch-dot ${settings?.emailNotifications ? 'settings-page__toggle-switch-dot--on' : 'settings-page__toggle-switch-dot--off'}`} />
                  </button>
                </div>
              </div>
            </section>

            {/* Danger Zone */}
            <section className="settings-page__danger">
              <h2 className="settings-page__danger-title">Danger Zone</h2>
              <p className="settings-page__danger-text">Once you delete your account, there is no going back. Please be certain.</p>
              <button className="settings-page__danger-btn">
                Delete Account
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
