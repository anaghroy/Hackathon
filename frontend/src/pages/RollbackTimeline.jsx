import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, History, RotateCcw, Clock, 
  CheckCircle2, XCircle, AlertCircle, 
  User, GitCommit, ChevronRight, RefreshCw, 
  ShieldCheck, ArrowRight
} from 'lucide-react';
import { useDeploy } from '../hooks/useDeploy';

const RollbackTimeline = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { fetchDeployHistory, rollbackDeployment, history, loading } = useDeploy();
  
  const [selectedDeploy, setSelectedDeploy] = useState(null);

  useEffect(() => {
    fetchDeployHistory(projectId);
  }, [projectId, fetchDeployHistory]);

  const handleRollback = async (deployId) => {
    if (window.confirm("Are you sure you want to rollback to this version? This will restart the application using the image from this deployment.")) {
      try {
        await rollbackDeployment(projectId, deployId);
        navigate(`/editor/${projectId}/deploy`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'failed': return '#ef4444';
      default: return 'rgba(255,255,255,0.4)';
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
              <History size={20} className="text-primary" /> Version Control Timeline
            </h1>
          </div>
        </div>
        <div className="editor-header__right">
          <button className="editor-btn editor-btn--ghost" onClick={() => fetchDeployHistory(projectId)}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh History
          </button>
        </div>
      </header>

      <div className="ai-page__content">
        <aside className="ai-form-side">
          <div className="ai-form-side__header">
            <h2>Deployment History</h2>
            <p>Trace every deployment back to its source. Rollback to any stable version with one click.</p>
          </div>

          {selectedDeploy ? (
            <div className="ai-card" style={{ animation: 'none', border: `1px solid ${getStatusColor(selectedDeploy.status)}` }}>
              <div className="ai-card__title" style={{ color: getStatusColor(selectedDeploy.status) }}>
                {selectedDeploy.status.toUpperCase()} DEPLOYMENT
              </div>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                  <GitCommit size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  <span className="mono">{selectedDeploy.commitHash || 'latest'}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                  <User size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  <span>Manual Trigger</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                  <Clock size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  <span>{new Date(selectedDeploy.createdAt).toLocaleString()}</span>
                </div>
                
                {selectedDeploy.status === 'success' && (
                  <button 
                    className="ai-btn-primary" 
                    onClick={() => handleRollback(selectedDeploy._id)}
                    style={{ marginTop: '12px', width: '100%', background: '#3b82f6' }}
                  >
                    <RotateCcw size={16} /> Rollback to this version
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="ai-card ai-card--info" style={{ animation: 'none' }}>
              <div className="ai-card__title">Select a Deployment</div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Click on any event in the timeline to view detailed information and rollback options.
              </p>
            </div>
          )}

          <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <ShieldCheck size={20} style={{ color: '#3b82f6' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6' }}>Snapshot Protection</span>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
              We store immutable snapshots of your application images, ensuring rollbacks are instantaneous and safe.
            </p>
          </div>
        </aside>

        <main className="ai-result-side">
          <div style={{ padding: '0 40px' }}>
            {history.length > 0 ? (
              <div style={{ position: 'relative' }}>
                {/* Vertical Line */}
                <div style={{ 
                  position: 'absolute', 
                  left: '20px', 
                  top: '0', 
                  bottom: '0', 
                  width: '2px', 
                  background: 'rgba(255,255,255,0.05)' 
                }} />

                {history.map((deploy, index) => (
                  <div 
                    key={deploy._id} 
                    onClick={() => setSelectedDeploy(deploy)}
                    style={{ 
                      position: 'relative', 
                      paddingLeft: '60px', 
                      paddingBottom: '40px', 
                      cursor: 'pointer',
                      opacity: selectedDeploy?._id === deploy._id ? 1 : 0.6,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Timeline Node */}
                    <div style={{ 
                      position: 'absolute', 
                      left: '11px', 
                      top: '0', 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      background: getStatusColor(deploy.status),
                      boxShadow: `0 0 15px ${getStatusColor(deploy.status)}44`,
                      border: '4px solid #0D0D0D',
                      zIndex: 2
                    }} />

                    <div className="ai-card" style={{ 
                      margin: '0', 
                      animation: 'none', 
                      background: selectedDeploy?._id === deploy._id ? 'rgba(255,255,255,0.03)' : 'transparent',
                      border: selectedDeploy?._id === deploy._id ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '16px', fontWeight: '700' }}>{deploy.commitMessage || 'Manual Deployment'}</span>
                            <span style={{ 
                              fontSize: '10px', 
                              fontWeight: '800', 
                              padding: '2px 8px', 
                              borderRadius: '4px', 
                              background: `${getStatusColor(deploy.status)}22`, 
                              color: getStatusColor(deploy.status),
                              textTransform: 'uppercase'
                            }}>
                              {deploy.status}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                            <span className="mono">{deploy.commitHash?.substring(0, 7) || 'v1.0.0'}</span>
                            <span>{new Date(deploy.createdAt).toLocaleString()}</span>
                            <span>{deploy.branch || 'main'}</span>
                          </div>
                        </div>
                        <ArrowRight size={18} style={{ color: 'rgba(255,255,255,0.1)' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ai-empty-state">
                <History size={64} />
                <h3>No History Available</h3>
                <p>Your deployment history will appear here once you start deploying projects.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RollbackTimeline;
