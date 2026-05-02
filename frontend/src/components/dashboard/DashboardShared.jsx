import React from 'react';
import { Users } from 'lucide-react';

const DashboardShared = () => {
  return (
    <div className="shared-page">
      <header className="dashboard-page__header">
        <div className="dashboard-page__title-group">
          <h1 className="dashboard-page__title">Shared With Me</h1>
          <p className="dashboard-page__subtitle" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
            Projects and workspaces shared by your team.
          </p>
        </div>
      </header>
      <div className="dashboard-page__empty" style={{ background: "rgba(10,10,10,0.4)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "0" }}>
        <div className="dashboard-page__empty-icon" style={{ opacity: 0.5 }}>
          <Users size={48} strokeWidth={1} />
        </div>
        <p className="dashboard-page__empty-text" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
          No projects have been shared with you yet.
        </p>
      </div>
    </div>
  );
};

export default DashboardShared;
