import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TestTube, Play, Copy, Check, Code, Zap } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import Editor from "@monaco-editor/react";

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
      setTestResult(result.code || result.tests || result.output || (typeof result === 'string' ? result : JSON.stringify(result, null, 2)));
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
    <div className="ai-page">
      <header className="editor-header">
        <div className="editor-header__left">
          <button className="editor-btn editor-btn--ghost" onClick={() => navigate(`/editor/${projectId}`)}>
            <ArrowLeft size={16} /> Back to Editor
          </button>
          <div className="editor-header__info" style={{ marginLeft: '1.5rem' }}>
            <h1 className="editor-header__title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <TestTube size={20} className="text-primary" /> Generate Tests
            </h1>
          </div>
        </div>
      </header>
      
      <div className="ai-page__content">
        {/* Left Side: Input */}
        <aside className="ai-form-side">
          <div className="ai-form-side__header">
            <h2>Test Generator</h2>
            <p>Paste your function or class and let AI generate comprehensive unit tests.</p>
          </div>

          <div className="ai-group ai-group--flex" style={{ minHeight: '300px' }}>
            <label><Code size={12} /> Source Code</label>
            <div className="ai-code-input-container" style={{ flex: 1, borderRadius: '0', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
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

          <div className="ai-group">
            <label><Zap size={12} /> Requirements (Optional)</label>
            <input
              className="ai-input"
              type="text"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder='e.g., "Use Jest", "Test edge cases for null inputs"'
            />
          </div>

          <button 
            className="ai-btn-primary" 
            onClick={handleSubmit}
            disabled={loading || !code.trim()}
          >
            {loading ? <span className="editor-loader__spinner" style={{ width: 16, height: 16 }}></span> : <Play size={18} />}
            <span>{loading ? 'Generating...' : 'Generate Tests'}</span>
          </button>
        </aside>

        {/* Right Side: Output */}
        <main className="ai-result-side">
          {testResult ? (
            <div className="ai-code-block" style={{ height: '100%' }}>
              <div className="ai-code-block__header">
                <span>Generated Output</span>
                <button 
                  className="editor-btn editor-btn--ghost" 
                  onClick={handleCopy}
                  style={{ height: '28px', padding: '0 12px', fontSize: '11px', gap: '6px' }}
                >
                  {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                  <span className={copied ? 'text-success' : ''}>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <div style={{ flex: 1 }}>
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={testResult}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    fontSize: 13,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    fontFamily: 'JetBrains Mono, monospace',
                    padding: { top: 16, bottom: 16 },
                    wordWrap: 'on'
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="ai-empty-state">
              <TestTube size={64} />
              <h3>No Tests Generated</h3>
              <p>Enter your source code on the left and click generate to see AI-powered unit tests.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditorTests;
