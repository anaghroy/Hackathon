import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, Plus, Calendar, FileText, Search } from 'lucide-react';
import { useMemory } from '../hooks/useMemory';

const EditorMemory = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { memories, fetchMemories, createMemory, loading } = useMemory();
  const [title, setTitle] = useState('');
  const [decision, setDecision] = useState('');
  const [filePath, setFilePath] = useState('Global');
  
  const highlightId = location.state?.highlightId;
  const highlightedRef = useRef(null);

  useEffect(() => {
    fetchMemories(projectId);
  }, [projectId]);

  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [memories, highlightId]);

  const handleAddMemory = async () => {
    if (!title.trim() || !decision.trim() || !filePath.trim()) return;
    try {
      await createMemory(projectId, { 
        title, 
        description: decision, 
        filePath: filePath 
      });
      setTitle('');
      setDecision('');
      setFilePath('Global');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="memory-page">
      <header className="editor-header">
        <div className="editor-header__left">
          <button className="editor-btn editor-btn--ghost" onClick={() => navigate(`/editor/${projectId}`)}>
            <ArrowLeft size={16} /> Back to Editor
          </button>
          <div className="editor-header__info" style={{ marginLeft: '1.5rem' }}>
            <h1 className="editor-header__title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BrainCircuit size={20} className="text-primary" /> Project Memory
            </h1>
          </div>
        </div>
      </header>
      
      <div className="memory-page__content">
        {/* Left Side: Add Memory Form */}
        <div className="memory-form-container">
          <div className="memory-form-container__header">
            <h3 className="memory-form-container__title">Record a Decision</h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
              Document architectural choices and project changes.
            </p>
          </div>
          
          <div className="form-group">
            <label>Decision Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g., "Switched to React Flow"'
            />
          </div>

          <div className="form-group">
            <label>Related File Path</label>
            <input
              type="text"
              className="code-input"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder='e.g., "src/components/Graph.jsx" or "Global"'
            />
          </div>

          <div className="form-group">
            <label>Reason / Context</label>
            <textarea
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              placeholder='Explain why this decision was made...'
            />
          </div>

          <button 
            className="editor-btn editor-btn--primary" 
            onClick={handleAddMemory}
            disabled={loading || !title.trim() || !decision.trim() || !filePath.trim()}
            style={{ marginTop: '8px', padding: '12px', justifyContent: 'center' }}
          >
            {loading ? <span className="editor-loader__spinner" style={{ width: 16, height: 16 }}></span> : <Plus size={18} />}
            <span>{loading ? 'Adding...' : 'Save Decision'}</span>
          </button>
        </div>

        {/* Right Side: Timeline */}
        <div className="memory-timeline">
          <div className="memory-timeline__header">
            <h3>Decision Timeline</h3>
            <div className="count">{memories.length} entries</div>
          </div>

          {loading && memories.length === 0 ? (
            <div className="memory-empty-state">
              <span className="editor-loader__spinner"></span>
              <p>Loading project memory...</p>
            </div>
          ) : memories.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {memories.map((mem) => {
                const isHighlighted = mem._id === highlightId;
                return (
                  <div 
                    key={mem._id} 
                    ref={isHighlighted ? highlightedRef : null}
                    className={`memory-card ${isHighlighted ? 'memory-card--active' : ''}`}
                  >
                    <div className="memory-card__header">
                      <div className="memory-card__info">
                        <h4>{mem.title || 'Decision Recorded'}</h4>
                        <div className="file-path">
                          <FileText size={10} style={{ marginRight: '4px' }} />
                          {mem.filePath}
                        </div>
                      </div>
                      <div className="memory-card__date">
                        <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        {mem.createdAt ? new Date(mem.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'}
                      </div>
                    </div>
                    <p className="memory-card__description">
                      {mem.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="memory-empty-state">
              <BrainCircuit size={48} />
              <p>No decisions have been recorded yet. Start building your project memory!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorMemory;
