import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Code, Sparkles, Wand2 } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import ReactDiffViewer from 'react-diff-viewer';
import Editor from "@monaco-editor/react";

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
      setResultCode(result.code || result.result || result.output || (typeof result === 'string' ? result : JSON.stringify(result, null, 2)));
    } catch (error) {
      console.error(error);
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
              <Sparkles size={20} className="text-primary" /> Intent Mode
            </h1>
          </div>
        </div>
      </header>
      
      <div className="ai-page__content">
        {/* Left Side: Input */}
        <aside className="ai-form-side">
          <div className="ai-form-side__header">
            <h2>AI Assistant</h2>
            <p>Describe what you want to achieve, and the AI will refactor your code accordingly.</p>
          </div>

          <div className="ai-group ai-group--flex" style={{ minHeight: '300px' }}>
            <label><Code size={12} /> Original Code</label>
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

          <div className="ai-group" style={{ height: '140px' }}>
            <label><Wand2 size={12} /> Your Intent</label>
            <textarea
              className="ai-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g., "Optimize this function", "Convert to TypeScript"'
              style={{ height: '100%' }}
            />
          </div>

          <button 
            className="ai-btn-primary" 
            onClick={handleSubmit}
            disabled={loading || !code.trim() || !prompt.trim()}
          >
            {loading ? <span className="editor-loader__spinner" style={{ width: 16, height: 16 }}></span> : <Play size={18} />}
            <span>{loading ? 'Refactoring...' : 'Apply Intent'}</span>
          </button>
        </aside>

        {/* Right Side: Output */}
        <main className="ai-result-side">
          {resultCode ? (
            <div className="ai-code-block" style={{ border: 'none' }}>
              <div className="ai-code-block__header">
                <span>Refactor Comparison</span>
              </div>
              <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#0f0f10' }}>
                <ReactDiffViewer
                  oldValue={code}
                  newValue={resultCode}
                  splitView={true}
                  useDarkTheme={true}
                  styles={{
                    variables: {
                      dark: {
                        diffViewerBackground: '#0f0f10',
                        diffViewerColor: 'rgba(255,255,255,0.7)',
                        addedBackground: 'rgba(46, 160, 67, 0.12)',
                        addedColor: 'rgba(255,255,255,0.8)',
                        removedBackground: 'rgba(248, 81, 73, 0.12)',
                        removedColor: 'rgba(255,255,255,0.8)',
                        wordAddedBackground: 'rgba(46, 160, 67, 0.3)',
                        wordRemovedBackground: 'rgba(248, 81, 73, 0.3)',
                        lineNumberColor: 'rgba(255,255,255,0.2)',
                      }
                    },
                    contentText: {
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '13px',
                      lineHeight: '1.6'
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="ai-empty-state">
              <Sparkles size={64} />
              <h3>Intent Engine</h3>
              <p>Provide your code and instructions. The AI will analyze your intent and show a side-by-side comparison of the changes.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditorIntent;
