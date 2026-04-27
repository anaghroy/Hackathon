import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Play } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import mermaid from 'mermaid';

const EditorSchema = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { generateDbSchema, loading } = useAI();
  const [prompt, setPrompt] = useState('');
  const [schemaCode, setSchemaCode] = useState('');
  const [mermaidGraph, setMermaidGraph] = useState('');
  const mermaidRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'dark' });
  }, []);

  useEffect(() => {
    if (mermaidGraph && mermaidRef.current) {
      mermaidRef.current.removeAttribute('data-processed');
      mermaidRef.current.innerHTML = mermaidGraph;
      mermaid.run({ nodes: [mermaidRef.current] }).catch(err => console.error("Mermaid err", err));
    }
  }, [mermaidGraph]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    try {
      const result = await generateDbSchema(projectId, { prompt });
      setSchemaCode(result.code || result.schema || JSON.stringify(result, null, 2));
      if (result.mermaid) {
        setMermaidGraph(result.mermaid);
      }
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
          <div className="editor-header__title" style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} /> DB Schema Generator
          </div>
        </div>
      </header>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Side: Prompt */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', borderRight: '1px solid var(--border-color)', gap: '1rem' }}>
          <label style={{ color: 'var(--text-muted)' }}>Describe your Database</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='e.g., "Ecommerce app with users, products, orders"'
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
          <button 
            className="editor-btn editor-btn--primary" 
            onClick={handleSubmit}
            disabled={loading || !prompt.trim()}
            style={{ alignSelf: 'flex-end', padding: '0.75rem 1.5rem' }}
          >
            {loading ? <span className="editor-loader__spinner" style={{ width: 16, height: 16, marginRight: 8, display: 'inline-block' }}></span> : <Play size={16} style={{ marginRight: 8 }} />}
            {loading ? 'Generating...' : 'Generate Schema'}
          </button>
        </div>

        {/* Right Side: Result */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', overflowY: 'auto', gap: '1rem' }}>
          {schemaCode ? (
             <>
               <div style={{ flex: 1, backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', overflowY: 'auto' }}>
                 <h4 style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>Generated Code</h4>
                 <pre style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'JetBrains Mono, monospace' }}>
                   {schemaCode}
                 </pre>
               </div>
               {mermaidGraph && (
                 <div style={{ flex: 1, backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div ref={mermaidRef} className="mermaid" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}></div>
                 </div>
               )}
             </>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Schema will appear here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorSchema;
