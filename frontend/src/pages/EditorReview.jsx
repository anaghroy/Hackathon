import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Play, AlertTriangle, Lightbulb, Check, Code, ShieldCheck, Zap } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import Editor from "@monaco-editor/react";
import TypewriterText from '../components/TypewriterText';

const EditorReview = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { reviewCode, loading } = useAI();
  const [code, setCode] = useState('');
  const [reviewResult, setReviewResult] = useState(null);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    try {
      const result = await reviewCode(projectId, { code });
      setReviewResult(result.review || result);
    } catch (error) {
      console.error(error);
    }
  };

  const renderList = (items, type) => {
    if (!items || items.length === 0) return <p className="text-muted" style={{ fontSize: '13px', margin: '0 0 0 28px' }}>No points detected.</p>;
    
    let Icon = Check;
    if (type === 'issue') Icon = AlertTriangle;
    if (type === 'suggestion') Icon = Lightbulb;
    if (type === 'mismatch') Icon = AlertTriangle;

    return (
      <ul className="ai-list" style={{ marginLeft: '4px' }}>
        {items.map((item, i) => (
          <li key={i} className="ai-list__item">
            <Icon size={14} />
            <TypewriterText text={item} delay={i * 200} speed={10} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="ai-page">
      <header className="editor-header">
        <div className="editor-header__left">
          <button className="editor-btn editor-btn--ghost" onClick={() => navigate(`/editor/${projectId}`)}>
            <ArrowLeft size={16} /> Back to Editor
          </button>
          <div className="editor-header__info" style={{ marginLeft: '1.5rem' }}>
            <h1 className="editor-header__title" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <ShieldCheck size={24} className="text-primary" style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))' }} /> AI Code Review
            </h1>
          </div>
        </div>
      </header>
      
      <div className="ai-page__content">
        {/* Left Side: Input */}
        <aside className="ai-form-side">
          <div className="ai-form-side__header">
            <h2>Code Auditor</h2>
            <p>Paste your snippet below to identify potential bugs, security issues, and style mismatches.</p>
          </div>

          <div className="ai-group ai-group--flex" style={{ minHeight: '300px' }}>
            <label><Code size={12} /> Snippet to Review</label>
            <div className="ai-code-input-container" style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={setCode}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontFamily: 'JetBrains Mono, monospace',
                  padding: { top: 16, bottom: 16 },
                  wordWrap: 'on'
                }}
              />
            </div>
          </div>

          <button 
            className="ai-btn-primary" 
            onClick={handleSubmit}
            disabled={loading || !code.trim()}
          >
            {loading ? <span className="editor-loader__spinner" style={{ width: 16, height: 16 }}></span> : <Zap size={18} />}
            <span>{loading ? 'Analyzing...' : 'Run Analysis'}</span>
          </button>
        </aside>

        {/* Right Side: Output */}
        <main className="ai-result-side">
          {reviewResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div className="ai-card ai-card--issue">
                <h3 className="ai-card__title"><AlertTriangle size={18} /> Critical Issues & Bugs</h3>
                {renderList(reviewResult.issues, 'issue')}
              </div>

              <div className="ai-card ai-card--suggestion">
                <h3 className="ai-card__title"><Lightbulb size={18} /> Suggestions & Improvements</h3>
                {renderList(reviewResult.suggestions, 'suggestion')}
              </div>

              <div className="ai-card ai-card--practice">
                <h3 className="ai-card__title"><Check size={18} /> Best Practices</h3>
                {renderList(reviewResult.bestPractices, 'practice')}
              </div>

              {reviewResult.conventionMismatches?.length > 0 && (
                <div className="ai-card ai-card--warning">
                  <h3 className="ai-card__title"><AlertTriangle size={18} /> Convention Mismatches</h3>
                  {renderList(reviewResult.conventionMismatches, 'mismatch')}
                </div>
              )}

            </div>
          ) : (
            <div className="ai-empty-state">
              <CheckCircle size={64} />
              <h3>Ready for Review</h3>
              <p>Submit your code on the left to start a comprehensive AI analysis of your work.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditorReview;
