import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Rocket, History, Terminal, Globe, ExternalLink, 
  RefreshCw, Play, XCircle, CheckCircle2, AlertCircle,
  ArrowLeft, Clock, Server, ShieldCheck
} from 'lucide-react';
import { useDeploy } from '../hooks/useDeploy';
import { useProject } from '../hooks/useProject';

const DeploymentPanel = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { 
    triggerDeployment, fetchDeployStatus, fetchDeployHistory,
    currentDeployment, history, loading 
  } = useDeploy();
  const { projects } = useProject();
  
  const [activeTab, setActiveTab] = useState('current');
  const project = projects.find(p => p._id === projectId);
  
  const pollInterval = useRef(null);

  useEffect(() => {
    fetchDeployStatus(projectId);
    fetchDeployHistory(projectId);

    // Poll every 5 seconds if deployment is active
    pollInterval.current = setInterval(() => {
      if (currentDeployment && ['building', 'deploying', 'queued'].includes(currentDeployment.status)) {
        fetchDeployStatus(projectId);
      }
    }, 5000);

    return () => clearInterval(pollInterval.current);
  }, [projectId, currentDeployment?.status, fetchDeployStatus, fetchDeployHistory]);

  const handleManualDeploy = async () => {
    try {
      await triggerDeployment(projectId);
      fetchDeployHistory(projectId);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'failed': return '#ef4444';
      case 'building':
      case 'deploying': return '#3b82f6';
      default: return 'rgba(255,255,255,0.4)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle2 size={18} />;
      case 'failed': return <AlertCircle size={18} />;
      case 'building':
      case 'deploying': return <RefreshCw size={18} className="animate-spin" />;
      default: return <Clock size={18} />;
    }
  };

  return (
    <div className="ai-page">
      <header className="editor-header">
        <div className="editor-header__left">
          <button className="editor-btn editor-btn--ghost" onClick={() => navigate(`/editor/${projectId}`)}>
            <ArrowLeft size={16} /> Back to Editor
          </button>
          <div className="editor-header__info" style={{ marginLeft: '1.5rem' }}>
            <h1 className="editor-header__title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Rocket size={20} className="text-primary" /> Deployment Console
            </h1>
          </div>
        </div>
        <div className="editor-header__right">
          <button 
            className="editor-btn editor-btn--primary" 
            onClick={handleManualDeploy}
            disabled={loading || (currentDeployment && ['building', 'deploying'].includes(currentDeployment.status))}
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
            Trigger Manual Deploy
          </button>
        </div>
      </header>

      <div className="ai-page__content">
        {/* Sidebar: Navigation & Project Stats */}
        <aside className="ai-form-side">
          <div className="ai-form-side__header">
            <h2>Environment Control</h2>
            <p>Monitor your CI/CD pipeline and deployment lifecycle.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              className={`ai-card ${activeTab === 'current' ? 'active' : ''}`}
              onClick={() => setActiveTab('current')}
              style={{ 
                textAlign: 'left', 
                width: '100%', 
                borderLeft: activeTab === 'current' ? '4px solid #3b82f6' : '1px solid rgba(255,255,255,0.05)',
                background: activeTab === 'current' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255,255,255,0.02)',
                color: '#fff',
                borderRadius: '0',
                padding: '16px'
              }}
            >
              <div className="ai-card__title"><Server size={16} /> Live Deployment</div>
            </button>
            <button 
              className={`ai-card ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
              style={{ 
                textAlign: 'left', 
                width: '100%', 
                borderLeft: activeTab === 'history' ? '4px solid #3b82f6' : '1px solid rgba(255,255,255,0.05)',
                background: activeTab === 'history' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255,255,255,0.02)',
                color: '#fff',
                borderRadius: '0',
                padding: '16px'
              }}
            >
              <div className="ai-card__title"><History size={16} /> Deployment History</div>
            </button>
          </div>

          <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '0', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <ShieldCheck size={20} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#10b981' }}>Security Verified</span>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
              All deployments undergo automated security screening before being exposed to the public URL.
            </p>
          </div>
        </aside>

        {/* Main: Deployment Content */}
        <main className="ai-result-side">
          {activeTab === 'current' ? (
            currentDeployment ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Status Card */}
                <div className="ai-card" style={{ padding: '32px', animation: 'none', borderTop: `4px solid ${getStatusColor(currentDeployment.status)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '24px', fontWeight: '700' }}>
                          Deployment {currentDeployment.status.toUpperCase()}
                        </span>
                        <div style={{ color: getStatusColor(currentDeployment.status) }}>
                          {getStatusIcon(currentDeployment.status)}
                        </div>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                        Production • {currentDeployment.branch || 'main'} • {new Date(currentDeployment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {currentDeployment.status === 'success' && (
                      <a 
                        href={currentDeployment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="editor-btn editor-btn--primary"
                        style={{ background: '#10b981' }}
                      >
                        <Globe size={16} /> Visit Site <ExternalLink size={14} />
                      </a>
                    )}
                  </div>

                  {/* Progress Pipeline */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '32px' }}>
                    {['Queued', 'Building', 'Deploying', 'Live'].map((stage, idx) => {
                      const stages = ['queued', 'building', 'deploying', 'success'];
                      const currentIdx = stages.indexOf(currentDeployment.status);
                      const isComplete = idx < currentIdx || currentDeployment.status === 'success';
                      const isActive = idx === currentIdx;

                      return (
                        <div key={stage} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ 
                            height: '6px', 
                            background: isComplete ? '#10b981' : isActive ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                            borderRadius: '0',
                            transition: 'all 0.4s ease'
                          }} />
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: '700', 
                            textTransform: 'uppercase', 
                            color: isComplete ? '#10b981' : isActive ? '#3b82f6' : 'rgba(255,255,255,0.3)' 
                          }}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Commit Info */}
                  <div style={{ display: 'flex', gap: '32px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '0' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '4px' }}>Commit</label>
                      <span className="mono" style={{ fontSize: '13px' }}>{currentDeployment.commitHash?.substring(0, 7) || 'HEAD'}</span>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '4px' }}>Message</label>
                      <span style={{ fontSize: '13px' }}>{currentDeployment.commitMessage || 'Manual trigger from Dashboard'}</span>
                    </div>
                  </div>
                </div>

                {/* Build Logs */}
                <div className="ai-code-block" style={{ flex: 1, minHeight: '400px' }}>
                  <div className="ai-code-block__header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Terminal size={16} />
                      <span>Build Logs</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Real-time streaming enabled</span>
                  </div>
                  <div style={{ 
                    flex: 1, 
                    padding: '20px', 
                    background: '#000', 
                    color: '#fff', 
                    fontFamily: '"JetBrains Mono", monospace', 
                    fontSize: '13px',
                    lineHeight: '1.6',
                    overflowY: 'auto'
                  }}>
                    {currentDeployment.logs?.length > 0 ? (
                      currentDeployment.logs.map((log, i) => (
                        <div key={i} style={{ marginBottom: '4px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.3)', marginRight: '16px' }}>
                            [{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}]
                          </span>
                          {log.message || log}
                        </div>
                      ))
                    ) : (
                      <div style={{ color: 'rgba(255,255,255,0.3)' }}>Waiting for build logs...</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="ai-empty-state">
                <Rocket size={64} />
                <h3>No Active Deployments</h3>
                <p>Deploy your project to production to see live status and logs.</p>
                <button 
                  className="editor-btn editor-btn--primary" 
                  style={{ marginTop: '24px' }}
                  onClick={handleManualDeploy}
                >
                  Trigger Initial Deploy
                </button>
              </div>
            )
          ) : (
            <div className="ai-card" style={{ padding: '0', animation: 'none', overflow: 'hidden' }}>
              <div className="ai-card__header" style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 className="ai-card__title">Deployment History</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {history.length > 0 ? (
                  history.map((h, i) => (
                    <div 
                      key={h._id} 
                      style={{ 
                        padding: '16px 24px', 
                        borderBottom: i === history.length - 1 ? '' : '1px solid rgba(255,255,255,0.03)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ color: getStatusColor(h.status) }}>{getStatusIcon(h.status)}</div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>{h.commitMessage || 'Manual Deploy'}</div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                            {h.branch} • {new Date(h.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="mono" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                        #{h.commitHash?.substring(0, 7) || 'v1.0.0'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
                    No deployment history found.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DeploymentPanel;
