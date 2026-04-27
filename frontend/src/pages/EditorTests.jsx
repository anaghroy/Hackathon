import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TestTube, Play, Copy, Check } from 'lucide-react';
import { useAI } from '../hooks/useAI';

const EditorTests = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { generateTests, loading } = useAI();
  const [code, setCode] = useState('');
  const [intent, setIntent] = useState('');
  const [testResult, setTestResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    try {
      const result = await generateTests(projectId, { code, intent });
      setTestResult(result.code || result.tests || result.output || typeof result === 'string' ? result : JSON.stringify(result, null, 2));
      setCopied(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(testResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="editor-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      <header className="editor-header">
        <div className="editor-header__left">
          <button className="editor-btn editor-btn--ghost" onClick={() => navigate(`/editor/${projectId}`)}>
            <ArrowLeft size={16} /> Back to Editor
          </button>
          <div className="editor-header__title" style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TestTube size={18} /> Generate Tests
          </div>
        </div>
      </header>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Side: Input */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', borderRight: '1px solid var(--border-color)', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Source Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste the function or file content here..."
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
          <div style={{ display: 'flex', flexDirection: 'column', height: '100px' }}>
            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Test Requirements (Optional)</label>
            <input
              type="text"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder='e.g., "Use Jest", "Test edge cases for null inputs"'
              style={{
                backgroundColor: 'var(--bg-darker)',
                color: 'var(--text-light)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.75rem',
                fontFamily: 'Inter, sans-serif'
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
            {loading ? 'Generating...' : 'Generate Tests'}
          </button>
        </div>

        {/* Right Side: Output */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)' }}>Generated Tests</label>
            {testResult && (
              <button 
                onClick={handleCopy}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-muted)', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.85rem'
                }}
              >
                {copied ? <Check size={14} color="var(--success-color)" /> : <Copy size={14} />}
                {copied ? <span style={{ color: 'var(--success-color)' }}>Copied!</span> : 'Copy Code'}
              </button>
            )}
          </div>
          <div style={{ flex: 1, backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {testResult ? (
              <pre style={{ margin: 0, padding: '1rem', overflowY: 'auto', color: 'var(--text-light)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', flex: 1 }}>
                {testResult}
              </pre>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Generated tests will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorTests;
