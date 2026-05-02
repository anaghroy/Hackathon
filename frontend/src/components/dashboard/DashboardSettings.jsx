import React from 'react';
import { Settings } from 'lucide-react';

const DashboardSettings = () => {
  return (
    <div className="settings-page">
      <header className="dashboard-page__header">
        <div className="dashboard-page__title-group">
          <h1 className="dashboard-page__title">Settings</h1>
          <p className="dashboard-page__subtitle" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
            Manage your personal account preferences.
          </p>
        </div>
      </header>
      <div className="dashboard-page__empty" style={{ background: "rgba(10,10,10,0.4)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "0" }}>
        <div className="dashboard-page__empty-icon" style={{ opacity: 0.5 }}>
          <Settings size={48} strokeWidth={1} />
        </div>
        <p className="dashboard-page__empty-text" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
          Settings panel is currently being updated.
        </p>
      </div>
    </div>
  );
};

export default DashboardSettings;
