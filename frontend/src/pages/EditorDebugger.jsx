import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bug, Play, Sparkles, AlertTriangle, 
  Terminal, FileCode, History, Search, CheckCircle2 
} from 'lucide-react';
import { useAI } from '../hooks/useAI';
import TypewriterText from '../components/TypewriterText';

const EditorDebugger = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { debugError, debugResult, loading } = useAI();
  const [stackTrace, setStackTrace] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [liveAnalysis, setLiveAnalysis] = useState('');

  // Sync live analysis with streaming result
  React.useEffect(() => {
    if (debugResult?.analysis) {
      setLiveAnalysis(debugResult.analysis);
    }
  }, [debugResult?.analysis]);

  const handleDebug = async () => {
    if (!stackTrace.trim()) return;
    try {
      await debugError(projectId, { stackTrace, errorMessage }, { stream: true });
    } catch (err) {
      console.error(err);
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
              <History size={20} className="text-primary" /> Time-Travel Debugger
            </h1>
          </div>
        </div>
        <div className="editor-header__right">
          <button 
            className="editor-btn editor-btn--primary" 
            onClick={handleDebug}
            disabled={loading || !stackTrace.trim()}
          >
            {loading ? <span className="editor-loader__spinner" style={{ width: 16, height: 16 }}></span> : <Play size={16} />}
            Analyze Root Cause
          </button>
        </div>
      </header>

      <div className="ai-page__content">
        {/* Left Side: Error Input */}
        <aside className="ai-form-side">
          <div className="ai-form-side__header">
            <h2>Error Diagnostics</h2>
            <p>Paste the crash logs or stack trace. Our AI will traverse the dependency graph to find the bug.</p>
          </div>

          <div className="ai-group ai-group--flex" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={14} className="text-warning" /> Error Message (Optional)
            </label>
            <input 
              type="text" 
              className="ai-input" 
              placeholder="e.g. TypeError: Cannot read property 'map' of undefined"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              style={{ padding: '12px' }}
            />
          </div>

          <div className="ai-group ai-group--flex" style={{ flex: 1 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={14} className="text-primary" /> Stack Trace
            </label>
            <textarea 
              className="ai-input ai-input--textarea" 
              placeholder="Paste the full stack trace here..."
              value={stackTrace}
              onChange={(e) => setStackTrace(e.target.value)}
              style={{ flex: 1, resize: 'none', fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', lineHeight: '1.6' }}
            />
          </div>
        </aside>

        {/* Right Side: AI Reasoning */}
        <main className="ai-result-side">
          {debugResult ? (
            <div className="ai-analysis-container">
              <div className="ai-card ai-card--suggestion" style={{ marginBottom: '24px' }}>
                <div className="ai-card__title">
                  <Sparkles size={18} />
                  <span>AI Root Cause Analysis</span>
                </div>
                <div className="ai-analysis-content" style={{ padding: '8px 4px' }}>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                    {liveAnalysis}
                  </div>
                </div>
              </div>

              <div className="ai-card ai-card--info">
                <div className="ai-card__title">
                  <CheckCircle2 size={18} className="text-primary" />
                  <span>Next Steps</span>
                </div>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>
                  Apply the suggested fix in the editor and trigger a new deployment to verify the resolution.
                </p>
              </div>
            </div>
          ) : (
            <div className="ai-empty-state">
              <Search size={64} />
              <h3>Root Cause Analyzer</h3>
              <p>Supply a stack trace to trigger the time-travel debugger. We'll map the error back to its origin in your code.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditorDebugger;
