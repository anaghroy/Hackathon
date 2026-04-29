import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Activity, Zap, Clock, Database, 
  AlertCircle, Sparkles, Play, Code, CheckCircle2 
} from 'lucide-react';
import { useAI } from '../hooks/useAI';
import Editor from "@monaco-editor/react";
import ReactDiffViewer from 'react-diff-viewer-continued';
import TypewriterText from '../components/TypewriterText';

const EditorPerformance = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { analyzePerformance, performanceResult, loading } = useAI();
  const [code, setCode] = useState('');
  const [showOptimized, setShowOptimized] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    try {
      await analyzePerformance(projectId, { code });
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
              <Activity size={20} className="text-primary" /> Performance Profiler
            </h1>
          </div>
        </div>
        <div className="editor-header__right">
          <button 
            className="editor-btn editor-btn--primary" 
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
          >
            {loading ? <span className="editor-loader__spinner" style={{ width: 16, height: 16 }}></span> : <Play size={16} />}
            Analyze Complexity
          </button>
        </div>
      </header>

      <div className="ai-page__content">
        {/* Left Side: Code Input & Metrics */}
        <aside className="ai-form-side">
          <div className="ai-form-side__header">
            <h2>Big-O Analysis</h2>
            <p>Paste your function to analyze time/space complexity and find bottlenecks.</p>
          </div>

          <div className="ai-group ai-group--flex" style={{ minHeight: '300px' }}>
            <label><Code size={12} /> Source Code</label>
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
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>
          </div>

          {performanceResult && (
            <div className="performance-metrics" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="ai-card" style={{ padding: '16px', animation: 'none' }}>
                <div className="ai-card__title" style={{ marginBottom: '8px', fontSize: '13px' }}>
                  <Clock size={14} /> Time Complexity
                </div>
                <div className="ai-badge ai-badge--high" style={{ fontSize: '16px', padding: '8px 12px' }}>
                  {performanceResult.timeComplexity || 'O(N)'}
                </div>
              </div>
              <div className="ai-card" style={{ padding: '16px', animation: 'none' }}>
                <div className="ai-card__title" style={{ marginBottom: '8px', fontSize: '13px' }}>
                  <Database size={14} /> Space Complexity
                </div>
                <div className="ai-badge ai-badge--low" style={{ fontSize: '16px', padding: '8px 12px' }}>
                  {performanceResult.spaceComplexity || 'O(1)'}
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Right Side: Insights & Optimizations */}
        <main className="ai-result-side">
          {performanceResult ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="ai-card ai-card--warning">
                  <div className="ai-card__title">
                    <AlertCircle size={18} />
                    <span>Bottlenecks</span>
                  </div>
                  <ul className="ai-list">
                    {performanceResult.bottlenecks?.map((b, i) => (
                      <li key={i} className="ai-list__item">
                        <Zap size={14} className="text-warning" /> 
                        <TypewriterText text={b} delay={i * 200} speed={10} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="ai-card ai-card--suggestion">
                  <div className="ai-card__title">
                    <Sparkles size={18} />
                    <span>AI Suggestions</span>
                  </div>
                  <ul className="ai-list">
                    {performanceResult.suggestions?.map((s, i) => (
                      <li key={i} className="ai-list__item">
                        <CheckCircle2 size={14} className="text-primary" />
                        <TypewriterText text={s} delay={(performanceResult.bottlenecks?.length || 0) * 200 + i * 200} speed={10} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {performanceResult.optimizedCode && (
                <div className="ai-code-block">
                  <div className="ai-code-block__header">
                    <span>Performance Optimization Diff</span>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        className={`editor-btn ${!showOptimized ? 'editor-btn--primary' : 'editor-btn--ghost'}`}
                        style={{ padding: '4px 12px', fontSize: '11px' }}
                        onClick={() => setShowOptimized(false)}
                      >
                        Split View
                      </button>
                      <button 
                        className={`editor-btn ${showOptimized ? 'editor-btn--primary' : 'editor-btn--ghost'}`}
                        style={{ padding: '4px 12px', fontSize: '11px' }}
                        onClick={() => setShowOptimized(true)}
                      >
                        Unified View
                      </button>
                    </div>
                  </div>
                  <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#0f0f10' }}>
                    <ReactDiffViewer
                      oldValue={code}
                      newValue={performanceResult.optimizedCode}
                      splitView={!showOptimized}
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
              )}
            </>
          ) : (
            <div className="ai-empty-state">
              <Zap size={64} />
              <h3>Intelligence Engine</h3>
              <p>Analyze your algorithms to get detailed complexity reports and optimized alternatives.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditorPerformance;
