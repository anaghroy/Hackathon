import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Cpu } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const EditorExplainAI = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getArchitectureGraph, loading } = useAI();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [globalExplanation, setGlobalExplanation] = useState('');

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const data = await getArchitectureGraph(projectId);
        console.log('Graph Data:', data);
        if (data) {
          const graphData = data.graph || data;
          if (graphData.nodes) setNodes(graphData.nodes);
          if (graphData.edges) setEdges(graphData.edges);
          if (data.explanation) setGlobalExplanation(data.explanation);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchGraph();
  }, [projectId]);

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  return (
    <div className="editor-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      <header className="editor-header">
        <div className="editor-header__left">
          <button className="editor-btn editor-btn--ghost" onClick={() => navigate(`/editor/${projectId}`)}>
            <ArrowLeft size={16} /> Back to Editor
          </button>
          <div className="editor-header__title" style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} /> Architecture Graph
          </div>
        </div>
      </header>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 3, position: 'relative' }}>
          {loading ? (
             <div className="editor-loader" style={{ height: '100%', position: 'absolute', width: '100%', zIndex: 10, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               <div className="editor-loader__spinner"></div>
               <p className="editor-loader__text" style={{ marginTop: '1rem', color: 'var(--primary-color)' }}>Analyzing Architecture...</p>
             </div>
          ) : null}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            proOptions={{ hideAttribution: true }}
            style={{ backgroundColor: '#0b0d11' }}
          >
            <Background color="#333" gap={16} variant="dots" />
            <Controls />
          </ReactFlow>
        </div>

        <div style={{ flex: 1.2, borderLeft: '1px solid var(--border-color)', backgroundColor: 'var(--bg-darker)', padding: '1.5rem', overflowY: 'auto' }}>
          {selectedNode ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }}></div>
                <h3 style={{ color: 'var(--text-light)', margin: 0, fontSize: '1.1rem' }}>
                  {selectedNode.data?.label || selectedNode.id}
                </h3>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <p style={{ fontWeight: '600', color: 'var(--text-light)', marginBottom: '0.5rem' }}>File Details:</p>
                <code style={{ display: 'block', padding: '0.5rem', backgroundColor: 'var(--bg-dark)', borderRadius: '4px', marginBottom: '1rem', wordBreak: 'break-all' }}>
                  {selectedNode.id}
                </code>
                {selectedNode.data?.explanation ? (
                  <p>{selectedNode.data.explanation}</p>
                ) : (
                  <p>Click "Analyze" to generate a detailed explanation of how this file fits into the project architecture.</p>
                )}
              </div>
            </>
          ) : (
            <>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={18} /> System Overview
              </h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {globalExplanation ? (
                  <div className="markdown-content">
                    {globalExplanation}
                  </div>
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                    <p>No architecture overview generated yet.</p>
                    <button className="editor-btn editor-btn--primary" onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>
                      Re-run Analysis
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorExplainAI;
