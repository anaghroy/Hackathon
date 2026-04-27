import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Code } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import ReactDiffViewer from 'react-diff-viewer';

const EditorIntent = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { processIntent, loading } = useAI();
  const [code, setCode] = useState('');
  const [prompt, setPrompt] = useState('');
  const [resultCode, setResultCode] = useState('');

  const handleSubmit = async () => {
    if (!code.trim() || !prompt.trim()) return;
    try {
      const result = await processIntent(projectId, { code, prompt });
      setResultCode(result.code || result.result || result.output || typeof result === 'string' ? result : JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="editor-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      <header className="editor-header">
        <div className="editor-header__left">
          <button className="editor-btn editor-btn--ghost" onClick={() => navigate(`/editor/${projectId}`)}>
            <ArrowLeft size={16} /> Back to Editor
          </button>
          <div className="editor-header__title" style={{ marginLeft: '1rem' }}>Intent Mode</div>
        </div>
      </header>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Side: Input */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', borderRight: '1px solid var(--border-color)', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={16} /> Original Code
            </label>
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
          <div style={{ display: 'flex', flexDirection: 'column', height: '150px' }}>
            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g., "Optimize this function", "Refactor to clean code"'
              style={{
                flex: 1,
                backgroundColor: 'var(--bg-darker)',
                color: 'var(--text-light)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '1rem',
                fontFamily: 'Inter, sans-serif',
                resize: 'none'
              }}
            />
          </div>
          <button 
            className="editor-btn editor-btn--primary" 
            onClick={handleSubmit}
            disabled={loading || !code.trim() || !prompt.trim()}
            style={{ alignSelf: 'flex-end', padding: '0.75rem 1.5rem' }}
          >
            {loading ? <span className="editor-loader__spinner" style={{ width: 16, height: 16, marginRight: 8, display: 'inline-block' }}></span> : <Play size={16} style={{ marginRight: 8 }} />}
            {loading ? 'Processing...' : 'Submit Intent'}
          </button>
        </div>

        {/* Right Side: Output */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', overflowY: 'auto' }}>
          <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Result Diff</label>
          <div style={{ flex: 1, backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
            {resultCode ? (
              <ReactDiffViewer
                oldValue={code}
                newValue={resultCode}
                splitView={true}
                useDarkTheme={true}
                styles={{
                  variables: {
                    dark: {
                      diffViewerBackground: 'var(--bg-darker)',
                      diffViewerColor: 'var(--text-light)',
                      addedBackground: 'rgba(46, 160, 67, 0.15)',
                      addedColor: 'var(--text-light)',
                      removedBackground: 'rgba(248, 81, 73, 0.15)',
                      removedColor: 'var(--text-light)',
                      wordAddedBackground: 'rgba(46, 160, 67, 0.4)',
                      wordRemovedBackground: 'rgba(248, 81, 73, 0.4)',
                    }
                  }
                }}
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Result will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorIntent;
