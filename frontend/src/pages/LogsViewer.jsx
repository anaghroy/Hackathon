import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Terminal, Filter, Download, 
  Trash2, Play, RefreshCw, ChevronDown, 
  Search, ShieldAlert, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useDeploy } from '../hooks/useDeploy';

const LogsViewer = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { fetchLogs, triggerDeployment, loading } = useDeploy();
  
  const [logs, setLogs] = useState([]);
  const [logType, setLogType] = useState('build');
  const [isFollowing, setIsFollowing] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const logEndRef = useRef(null);
  const pollInterval = useRef(null);

  const fetchCurrentLogs = async () => {
    const newLogs = await fetchLogs(projectId, { type: logType, lines: 200 });
    setLogs(newLogs);
  };

  useEffect(() => {
    fetchCurrentLogs();
    pollInterval.current = setInterval(fetchCurrentLogs, 3000);
    return () => clearInterval(pollInterval.current);
  }, [projectId, logType]);

  useEffect(() => {
    if (isFollowing && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isFollowing]);

  const handleDownload = () => {
    const content = logs.map(l => `[${new Date(l.timestamp).toISOString()}] ${l.message}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectId}-${logType}-logs.txt`;
    a.click();
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const filteredLogs = logs.filter(l => 
    l.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ai-page">
      <header className="editor-header">
        <div className="editor-header__left">
          <button className="editor-btn editor-btn--ghost" onClick={() => navigate(`/editor/${projectId}`)}>
            <ArrowLeft size={16} /> Back to Editor
          </button>
          <div className="editor-header__info" style={{ marginLeft: '1.5rem' }}>
            <h1 className="editor-header__title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Terminal size={20} className="text-primary" /> Log Intelligence
            </h1>
          </div>
        </div>
        <div className="editor-header__right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '0', marginRight: '12px' }}>
            <button 
              className={`editor-btn ${logType === 'build' ? 'editor-btn--primary' : 'editor-btn--ghost'}`}
              onClick={() => setLogType('build')}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Build Logs
            </button>
            <button 
              className={`editor-btn ${logType === 'runtime' ? 'editor-btn--primary' : 'editor-btn--ghost'}`}
              onClick={() => setLogType('runtime')}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Runtime Logs
            </button>
          </div>
          <button className="editor-btn editor-btn--ghost" onClick={handleDownload}>
            <Download size={16} /> Download
          </button>
          <button className="editor-btn editor-btn--ghost" onClick={clearLogs}>
            <Trash2 size={16} /> Clear
          </button>
        </div>
      </header>

      <div className="ai-page__content">
        <aside className="ai-form-side">
          <div className="ai-form-side__header">
            <h2>Log Filters</h2>
            <p>Analyze telemetry and runtime execution data.</p>
          </div>

          <div className="ai-card" style={{ animation: 'none' }}>
            <div className="ai-card__title"><Search size={16} /> Search Logs</div>
            <input 
              className="ai-input" 
              placeholder="Filter by keyword..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginTop: '12px' }}
            />
          </div>

          <div style={{ marginTop: '12px' }}>
            <label className="sidebar-check" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
              <input 
                type="checkbox" 
                checked={isFollowing} 
                onChange={(e) => setIsFollowing(e.target.checked)}
              />
              Follow tail (Scroll to bottom)
            </label>
          </div>

          <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '0', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <CheckCircle2 size={20} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#10b981' }}>Health OK</span>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
              Node status is healthy. No anomalies detected in the last 60 minutes.
            </p>
          </div>
        </aside>

        <main className="ai-result-side" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="ai-code-block" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="ai-code-block__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Terminal size={16} />
                <span>stdout / stderr</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '11px', color: '#10b981' }}>● Live</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{filteredLogs.length} lines matched</span>
              </div>
            </div>
            <div style={{ 
              flex: 1, 
              padding: '20px', 
              background: '#000', 
              color: '#fff', 
              fontFamily: '"JetBrains Mono", monospace', 
              fontSize: '13px',
              lineHeight: '1.6',
              overflowY: 'auto',
              borderBottomLeftRadius: '0',
              borderBottomRightRadius: '0'
            }}>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, i) => (
                  <div key={log._id || i} style={{ marginBottom: '4px', display: 'flex' }}>
                    <span style={{ color: 'rgba(255,255,255,0.2)', minWidth: '100px', flexShrink: 0 }}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span style={{ 
                      color: log.type === 'stderr' ? '#ef4444' : log.type === 'system' ? '#3b82f6' : 'rgba(255,255,255,0.8)'
                    }}>
                      {log.message}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '100px' }}>
                  No logs found matching your criteria.
                </div>
              )}
              <div ref={logEndRef} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LogsViewer;
