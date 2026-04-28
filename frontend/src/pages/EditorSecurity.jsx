import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShieldAlert, ShieldCheck, AlertTriangle, 
  ChevronRight, Play, RefreshCw, CheckCircle2, Lock
} from 'lucide-react';
import { useAI } from '../hooks/useAI';
import ReactDiffViewer from 'react-diff-viewer-continued';

const EditorSecurity = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { scanSecurity, applyFix, securityResult, loading } = useAI();
  const [selectedIssue, setSelectedIssue] = useState(null);

  const handleScan = async () => {
    try {
      await scanSecurity(projectId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyFix = async () => {
    if (!selectedIssue || !selectedIssue.suggestedFix) return;
    try {
      await applyFix({
        projectId,
        fileModifications: [
          {
            filePath: selectedIssue.filePath || selectedIssue.file || "unknown",
            newContent: selectedIssue.suggestedFix
          }
        ]
      });
      // Optionally re-scan or update UI
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (securityResult && securityResult.issues && securityResult.issues.length > 0) {
      setSelectedIssue(securityResult.issues[0]);
    }
  }, [securityResult]);

  return (
    <div className="ai-page">
      <header className="editor-header">
        <div className="editor-header__left">
          <button className="editor-btn editor-btn--ghost" onClick={() => navigate(`/editor/${projectId}`)}>
            <ArrowLeft size={16} /> Back to Editor
          </button>
          <div className="editor-header__info" style={{ marginLeft: '1.5rem' }}>
            <h1 className="editor-header__title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldAlert size={20} className="text-error" /> Security Fixer (DevSecOps)
            </h1>
          </div>
        </div>
        <div className="editor-header__right">
          <button 
            className="editor-btn editor-btn--primary" 
            onClick={handleScan}
            disabled={loading}
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
            Scan Project Security
          </button>
        </div>
      </header>

      <div className="ai-page__content">
        {/* Sidebar: Issues List */}
        <aside className="ai-form-side">
          <div className="ai-form-side__header">
            <h2>Vulnerabilities</h2>
            <p>AI-detected security flaws and suggested patches.</p>
          </div>

          <div className="ai-list">
            {!securityResult ? (
              <div className="ai-empty-state" style={{ padding: '20px' }}>
                <Lock size={40} />
                <p>Run a scan to detect security vulnerabilities in your codebase.</p>
              </div>
            ) : securityResult.issues && securityResult.issues.length > 0 ? (
              securityResult.issues.map((issue, idx) => (
                <button 
                  key={idx}
                  className={`ai-card ai-card--issue ${selectedIssue === issue ? 'active' : ''}`}
                  onClick={() => setSelectedIssue(issue)}
                  style={{ 
                    textAlign: 'left', 
                    width: '100%', 
                    marginBottom: '12px',
                    backgroundColor: selectedIssue === issue ? 'rgba(239, 68, 68, 0.1)' : '',
                    borderColor: selectedIssue === issue ? '#ef4444' : ''
                  }}
                >
                  <div className="ai-card__title">
                    <AlertTriangle size={16} />
                    <span>{issue.issue}</span>
                  </div>
                  <div className="ai-badge ai-badge--high" style={{ marginBottom: '8px' }}>Critical</div>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {issue.explanation}
                  </p>
                </button>
              ))
            ) : (
              <div className="ai-empty-state" style={{ padding: '20px' }}>
                <ShieldCheck size={48} className="text-success" style={{ color: '#10b981' }} />
                <h3 style={{ color: '#10b981' }}>Secure Codebase</h3>
                <p>No critical vulnerabilities detected by the DevSecOps agent.</p>
              </div>
            )}
          </div>
        </aside>

        {/* Main: Diff Viewer */}
        <main className="ai-result-side">
          {selectedIssue ? (
            <>
              <div className="ai-card ai-card--warning" style={{ animation: 'none', marginBottom: '0' }}>
                <div className="ai-card__title">
                  <ShieldAlert size={18} />
                  <span>{selectedIssue.issue} Analysis</span>
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>
                  {selectedIssue.explanation}
                </p>
                <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                  <div className="ai-badge ai-badge--low">Line: {selectedIssue.line}</div>
                  <div className="ai-badge ai-badge--high">Severity: HIGH</div>
                </div>
              </div>

              <div className="ai-code-block">
                <div className="ai-code-block__header">
                  <span>Suggested Auto-Fix Patch</span>
                  <button 
                    className="ai-btn-primary" 
                    style={{ padding: '6px 16px', fontSize: '12px', height: '32px' }}
                    onClick={handleApplyFix}
                    disabled={loading || !selectedIssue.suggestedFix}
                  >
                    <CheckCircle2 size={14} /> Apply Auto-Fix
                  </button>
                </div>
                <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#0f0f10' }}>
                  <ReactDiffViewer
                    oldValue={"// Vulnerable code at line " + selectedIssue.line}
                    newValue={selectedIssue.suggestedFix}
                    splitView={true}
                    useDarkTheme={true}
                    styles={{
                      variables: {
                        dark: {
                          diffViewerBackground: '#0f0f10',
                          addedBackground: 'rgba(46, 160, 67, 0.12)',
                          removedBackground: 'rgba(248, 81, 73, 0.12)',
                        }
                      },
                      contentText: {
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '13px'
                      }
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="ai-empty-state">
              <ShieldAlert size={64} />
              <h3>Security Intelligence</h3>
              <p>Select a vulnerability from the list to view the AI analysis and suggested security patch.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditorSecurity;
