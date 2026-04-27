import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProject from '../hooks/useProject';
import { 
  ArrowLeft, FileCode2, TestTube, CheckCircle, Folder, 
  FileJson, Cpu, Database, BrainCircuit, Activity
} from 'lucide-react';

const EditorPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { selectedProject, getProject, loading, error } = useProject();

  useEffect(() => {
    if (projectId) {
      getProject(projectId);
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="editor-loader">
        <div className="editor-loader__spinner"></div>
        <p className="editor-loader__text">Loading Project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="editor-error">
        <p>Error loading project: {error}</p>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const projectTitle = selectedProject?.title || 'Untitled Project';
  const shortId = projectId.substring(0, 8);

  return (
    <div className="editor-layout">
      {/* 1. TOP HEADER BAR */}
      <header className="editor-header">
        <div className="editor-header__left">
          <div className="editor-header__info">
            <h1 className="editor-header__title">{projectTitle}</h1>
            <span className="editor-header__subtitle">ID: {shortId}</span>
          </div>
        </div>
        
        <div className="editor-header__right">
          <button 
            className="editor-btn editor-btn--ghost" 
            onClick={() => navigate(`/editor/${projectId}/tests`)}
          >
            <TestTube size={16} /> Generate Tests
          </button>
          <button 
            className="editor-btn editor-btn--ghost" 
            onClick={() => navigate(`/editor/${projectId}/review`)}
          >
            <CheckCircle size={16} /> Review Code
          </button>
          <button 
            className="editor-btn editor-btn--primary" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </header>

      <div className="editor-workspace">
        {/* 2. LEFT SIDEBAR */}
        <aside className="editor-sidebar editor-sidebar--left">
          <div className="editor-sidebar__section">
            <h3 className="editor-sidebar__title">EXPLORER</h3>
            <ul className="editor-file-tree">
              <li className="editor-file-tree__item"><Folder size={14} className="icon-folder" /> src/</li>
              <li className="editor-file-tree__item"><Folder size={14} className="icon-folder" /> components/</li>
              <li className="editor-file-tree__item"><Folder size={14} className="icon-folder" /> pages/</li>
              <li className="editor-file-tree__item"><Folder size={14} className="icon-folder" /> styles/</li>
              <li className="editor-file-tree__item"><FileJson size={14} className="icon-file" /> package.json</li>
            </ul>
          </div>

          <div className="editor-sidebar__section">
            <h3 className="editor-sidebar__title">DECISION MEMORY</h3>
            <ul className="editor-memory-list">
              <li className="editor-memory-list__item">
                <span className="bullet"></span> API architecture selected
              </li>
              <li className="editor-memory-list__item">
                <span className="bullet"></span> MongoDB chosen
              </li>
              <li className="editor-memory-list__item">
                <span className="bullet"></span> React frontend selected
              </li>
            </ul>
          </div>
        </aside>

        {/* 3. CENTER MAIN AREA */}
        <main className="editor-main">
          <div className="editor-main__header">
            <div className="editor-tab active">
              <FileCode2 size={14} />
              <span>Dashboard.jsx</span>
            </div>
          </div>
          <div className="editor-code-panel">
            <div className="editor-code-lines">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="line-number">{i + 1}</div>
              ))}
            </div>
            <pre className="editor-code-content">
              <code>{`import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h1>Welcome to Dashboard</h1>
      <p>This is your main control panel.</p>
    </div>
  );
};

export default Dashboard;
`}</code>
            </pre>
          </div>
        </main>

        {/* 4. RIGHT SIDEBAR (AI TOOLS PANEL) */}
        <aside className="editor-sidebar editor-sidebar--right">
          <div className="editor-sidebar__section">
            <h3 className="editor-sidebar__title">AI TOOLS</h3>
            <div className="editor-tools-grid">
              <button 
                className="editor-tool-card" 
                onClick={() => navigate(`/editor/${projectId}/intent`)}
              >
                <Activity size={20} />
                <span>Intent Mode</span>
              </button>
              
              <button 
                className="editor-tool-card" 
                onClick={() => navigate(`/editor/${projectId}/explain-ai`)}
              >
                <Cpu size={20} />
                <span>Architecture Graph</span>
              </button>
              
              <button 
                className="editor-tool-card" 
                onClick={() => navigate(`/editor/${projectId}/schema`)}
              >
                <Database size={20} />
                <span>DB Schema</span>
              </button>
              
              <button 
                className="editor-tool-card" 
                onClick={() => navigate(`/editor/${projectId}/memory`)}
              >
                <BrainCircuit size={20} />
                <span>Memory</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EditorPage;
