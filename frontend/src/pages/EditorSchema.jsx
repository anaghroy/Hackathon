import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Play, Code, Box, ZoomIn, ZoomOut, Maximize2, X, RotateCcw } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import mermaid from 'mermaid';
import Editor from "@monaco-editor/react";

const EditorSchema = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { generateDbSchema, loading } = useAI();
  const [prompt, setPrompt] = useState('');
  const [schemaCode, setSchemaCode] = useState('');
  const [mermaidGraph, setMermaidGraph] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const mermaidRef = useRef(null);
  const expandedMermaidRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: false, 
      theme: 'dark',
      securityLevel: 'loose',
      themeVariables: {
        fontSize: '16px',
        fontFamily: 'Inter, sans-serif',
        primaryColor: '#3b82f6',
        lineColor: '#4b5563',
        textColor: '#f3f4f6',
        mainBkg: '#1f2937',
        nodeBorder: '#374151'
      }
    });
  }, []);

  const renderMermaid = async (graph, targetRef) => {
    if (graph && targetRef.current) {
      targetRef.current.removeAttribute('data-processed');
      targetRef.current.innerHTML = graph;
      try {
        await mermaid.run({ nodes: [targetRef.current] });
      } catch (err) {
        console.error("Mermaid err", err);
      }
    }
  };

  useEffect(() => {
    renderMermaid(mermaidGraph, mermaidRef);
  }, [mermaidGraph]);

  useEffect(() => {
    if (isExpanded) {
      renderMermaid(mermaidGraph, expandedMermaidRef);
      setPosition({ x: 0, y: 0 });
      setScale(1);
    }
  }, [isExpanded, mermaidGraph]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    try {
      const result = await generateDbSchema(projectId, { prompt });
      setSchemaCode(result.code || result.schema || JSON.stringify(result, null, 2));
      if (result.mermaid) {
        const cleanedMermaid = result.mermaid.replace(/```mermaid/gi, '').replace(/```/g, '').trim();
        setMermaidGraph(cleanedMermaid);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleZoom = (delta) => {
    setScale(prev => Math.min(Math.max(prev + delta, 0.5), 4));
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
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
              <Database size={20} className="text-primary" /> DB Schema Generator
            </h1>
          </div>
        </div>
      </header>
      
      <div className="ai-page__content">
        {/* Left Side: Prompt */}
        <aside className="ai-form-side">
          <div className="ai-form-side__header">
            <h2>Schema Designer</h2>
            <p>Describe your data requirements in plain English, and AI will generate the SQL/Prisma schema and a visual graph.</p>
          </div>

          <div className="ai-group ai-group--flex">
            <label><Database size={12} /> Database Requirements</label>
            <textarea
              className="ai-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g., "An ecommerce system with users, products, categories, and orders. Orders should have multiple items and track status."'
            />
          </div>

          <button 
            className="ai-btn-primary" 
            onClick={handleSubmit}
            disabled={loading || !prompt.trim()}
          >
            {loading ? <span className="editor-loader__spinner" style={{ width: 16, height: 16 }}></span> : <Play size={18} />}
            <span>{loading ? 'Generating...' : 'Generate Schema'}</span>
          </button>
        </aside>

        {/* Right Side: Result */}
        <main className="ai-result-side">
          {schemaCode ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
               
               <div className="ai-code-block" style={{ flex: '0 0 auto', maxHeight: '400px' }}>
                 <div className="ai-code-block__header">
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '0', marginRight: '12px' }}>
                     <Code size={12} />
                     <span>Generated Schema</span>
                   </div>
                 </div>
                 <div style={{ height: '300px' }}>
                    <Editor
                      height="100%"
                      defaultLanguage="sql"
                      value={schemaCode}
                      theme="vs-dark"
                      options={{
                        readOnly: true,
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

               {mermaidGraph && (
                 <div className="ai-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 className="ai-card__title" style={{ margin: 0 }}><Box size={18} /> Visual Relationship Graph</h3>
                      <button 
                        className="editor-btn editor-btn--ghost" 
                        onClick={() => setIsExpanded(true)}
                        style={{ padding: '4px 8px', fontSize: '11px', gap: '4px' }}
                      >
                        <Maximize2 size={12} /> Expand
                      </button>
                    </div>
                    <div 
                      className="mermaid-container" 
                      onClick={() => setIsExpanded(true)}
                      style={{ 
                        flex: 1, 
                        backgroundColor: 'rgba(255,255,255,0.02)', 
                        borderRadius: '0', 
                        padding: '20px', 
                        overflow: 'hidden', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        cursor: 'zoom-in',
                        position: 'relative',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                       <div ref={mermaidRef} className="mermaid" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}></div>
                    </div>
                 </div>
               )}

             </div>
          ) : (
            <div className="ai-empty-state">
              <Database size={64} />
              <h3>DB Architect</h3>
              <p>Provide a description of your data model. The AI will output structured schema code and a visual entity-relationship diagram.</p>
            </div>
          )}
        </main>
      </div>

      {/* Expanded Graph Modal */}
      {isExpanded && (
        <div className="graph-modal-overlay" onClick={() => setIsExpanded(false)}>
          <div className="graph-modal" onClick={e => e.stopPropagation()}>
            <div className="graph-modal__header">
              <h2>Entity Relationship Diagram</h2>
              <button className="editor-btn editor-btn--ghost" onClick={() => setIsExpanded(false)}>
                <X size={20} />
              </button>
            </div>
            <div 
              className="graph-modal__content"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
            >
              <div 
                ref={expandedMermaidRef} 
                className="mermaid" 
                style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  width: 'max-content',
                  height: 'max-content',
                  pointerEvents: 'none'
                }}
              ></div>
            </div>
            <div className="graph-modal__controls">
              <button className="editor-btn editor-btn--ghost" onClick={() => handleZoom(0.2)} title="Zoom In">
                <ZoomIn size={18} />
              </button>
              <button className="editor-btn editor-btn--ghost" onClick={() => handleZoom(-0.2)} title="Zoom Out">
                <ZoomOut size={18} />
              </button>
              <button className="editor-btn editor-btn--ghost" onClick={resetView} title="Reset View">
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorSchema;
