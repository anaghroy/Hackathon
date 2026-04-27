import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Play, AlertTriangle, Lightbulb, Check } from 'lucide-react';
import { useAI } from '../hooks/useAI';

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

  const renderList = (items, icon) => {
    if (!items || items.length === 0) return <p style={{ color: 'var(--text-muted)' }}>None found.</p>;
    return (
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.95rem' }}>
            <span style={{ marginTop: '0.2rem' }}>{icon}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="editor-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      <header className="editor-header">
        <div className="editor-header__left">
          <button className="editor-btn editor-btn--ghost" onClick={() => navigate(`/editor/${projectId}`)}>
            <ArrowLeft size={16} /> Back to Editor
          </button>
          <div className="editor-header__title" style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} /> AI Code Review
          </div>
        </div>
      </header>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Side: Input */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', borderRight: '1px solid var(--border-color)', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Code Snippet to Review</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              style={{
                flex: 1,
                backgroundColor: 'var(--bg-darker)',
                color: 'var(--text-light)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '1rem',
                fontFamily: 'JetBrains Mono, monospace',
                resize: 'none'
              }}
            />
          </div>
          <button 
            className="editor-btn editor-btn--primary" 
            onClick={handleSubmit}
            disabled={loading || !code.trim()}
            style={{ alignSelf: 'flex-end', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {loading ? <span className="editor-loader__spinner" style={{ width: 16, height: 16, display: 'inline-block' }}></span> : <Play size={16} />}
            {loading ? 'Reviewing...' : 'Review Code'}
          </button>
        </div>

        {/* Right Side: Output */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', backgroundColor: 'var(--bg-dark)' }}>
          {reviewResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Issues Card */}
              <div style={{ backgroundColor: 'var(--bg-darker)', border: '1px solid rgba(248, 81, 73, 0.3)', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ color: 'rgba(248, 81, 73, 1)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} /> Issues & Bugs
                </h3>
                {renderList(reviewResult.issues, <AlertTriangle size={14} color="rgba(248, 81, 73, 0.8)" />)}
              </div>

              {/* Suggestions Card */}
              <div style={{ backgroundColor: 'var(--bg-darker)', border: '1px solid rgba(88, 166, 255, 0.3)', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ color: 'rgba(88, 166, 255, 1)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lightbulb size={18} /> Suggestions & Improvements
                </h3>
                {renderList(reviewResult.suggestions, <Lightbulb size={14} color="rgba(88, 166, 255, 0.8)" />)}
              </div>

              {/* Best Practices Card */}
              <div style={{ backgroundColor: 'var(--bg-darker)', border: '1px solid rgba(46, 160, 67, 0.3)', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ color: 'rgba(46, 160, 67, 1)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={18} /> Best Practices
                </h3>
                {renderList(reviewResult.bestPractices, <Check size={14} color="rgba(46, 160, 67, 0.8)" />)}
              </div>

              {/* Convention Mismatches Card */}
              <div style={{ backgroundColor: 'var(--bg-darker)', border: '1px solid rgba(210, 153, 34, 0.3)', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ color: 'rgba(210, 153, 34, 1)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} /> Convention Mismatches
                </h3>
                {renderList(reviewResult.conventionMismatches, <AlertTriangle size={14} color="rgba(210, 153, 34, 0.8)" />)}
              </div>

            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Submit code to see the review results...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorReview;
