import React from 'react';

const DashboardOverview = () => {
  return (
    <div className="overview-docs">
      <header className="docs-header">
        <h1 className="docs-title">Platform Documentation</h1>
        <p className="docs-lead">
          Welcome to CogniCode, the premium AI-powered development environment. 
          Our platform provides institutional-grade tools to build, manage, and scale your mission-critical applications.
        </p>
      </header>

      <div className="docs-content">
        <section className="docs-section">
          <h2 className="docs-subtitle">Core Capabilities</h2>
          <div className="docs-grid">
            <div className="docs-item">
              <h3>Smart Dashboard</h3>
              <p>Centralized control center for all your projects and active deployments.</p>
            </div>
            <div className="docs-item">
              <h3>Project Management</h3>
              <p>Create, organize, and manage your repositories with a streamlined interface.</p>
            </div>
            <div className="docs-item">
              <h3>Code Review</h3>
              <p>Automated AI-driven code analysis for bugs, performance, and best practices.</p>
            </div>
            <div className="docs-item">
              <h3>Graph & Analytics</h3>
              <p>Interactive visual representations of your system architecture and schemas.</p>
            </div>
            <div className="docs-item">
              <h3>Deployment System</h3>
              <p>Connect GitHub repositories and push to production with zero friction.</p>
            </div>
            <div className="docs-item">
              <h3>Shared Workspace</h3>
              <p>Collaborate with your team securely on projects and live codebases.</p>
            </div>
            <div className="docs-item">
              <h3>DevOps Integration</h3>
              <p>Built-in CI/CD, environment variables, and scalable infrastructure tools.</p>
            </div>
            <div className="docs-item">
              <h3>AI Productivity Tools</h3>
              <p>Context-aware editor, intent-based modifications, and memory timeline.</p>
            </div>
            <div className="docs-item">
              <h3>Security & Reliability</h3>
              <p>Vulnerability scanning and robust error handling across all features.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardOverview;
