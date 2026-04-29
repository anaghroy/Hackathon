import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Cpu, Maximize, ZoomIn, ZoomOut, RefreshCw, Layers, Info, Link2, Activity, Folder, File, Code, AlertTriangle, Zap, X, ChevronRight, Settings } from 'lucide-react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  MarkerType,
  Panel,
  ReactFlowProvider
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

import { useAI } from '../hooks/useAI';
import { 
  FolderNode, 
  FileNode, 
  ComponentNode, 
  PageNode,
  HookNode,
  UtilNode,
  ServiceNode, 
  ApiNode, 
  DatabaseNode, 
  MiddlewareNode,
  ControllerNode,
  ConfigNode
} from '../components/GraphNodes';

const nodeTypes = {
  folder: FolderNode,
  file: FileNode,
  component: ComponentNode,
  page: PageNode,
  hook: HookNode,
  util: UtilNode,
  service: ServiceNode,
  api: ApiNode,
  database: DatabaseNode,
  middleware: MiddlewareNode,
  controller: ControllerNode,
  config: ConfigNode,
};

const nodeWidth = 220;
const nodeHeight = 80;

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  try {
    if (!nodes || nodes.length === 0) return { nodes: [], edges: [] };
    
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ 
      rankdir: direction,
      nodesep: 80,
      ranksep: 120
    });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    (edges || []).forEach((edge) => {
      if (edge && edge.source && edge.target) {
        dagreGraph.setEdge(edge.source, edge.target);
      }
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        targetPosition: isHorizontal ? 'left' : 'top',
        sourcePosition: isHorizontal ? 'right' : 'bottom',
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  } catch (err) {
    console.error('Layout Error:', err);
    return { nodes, edges };
  }
};

const ArchitectureGraphInner = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getArchitectureGraph, loading: aiLoading, architectureGraph, explanation: aiExplanation } = useAI();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [globalExplanation, setGlobalExplanation] = useState('');
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const processGraphData = useCallback((data) => {
    if (!data || !data.graph) return;
    
    const { nodes: rawNodes, edges: rawEdges } = data.graph;
    
    const nodeIds = new Set();
    const validNodes = (rawNodes || []).filter(n => {
      if (!n || !n.id || !n.data || nodeIds.has(n.id)) return false;
      nodeIds.add(n.id);
      return true;
    });

    const validEdges = (rawEdges || []).filter(e => 
      e && e.source && e.target && nodeIds.has(e.source) && nodeIds.has(e.target)
    );

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      validNodes,
      validEdges
    );

    const enhancedEdges = layoutedEdges.map(edge => ({
      ...edge,
      type: 'default', // Bezier for smooth curves like reference
      style: { stroke: 'rgba(54, 118, 222, 0.4)', strokeWidth: 2 },
      animated: true,
      className: 'flowing-edge',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgba(54, 118, 222, 0.6)',
      },
    }));

    setNodes(layoutedNodes);
    setEdges(enhancedEdges);
    if (data.explanation) setGlobalExplanation(data.explanation);
  }, [setNodes, setEdges]);

  const performFetch = useCallback(async (force = false) => {
    if (!projectId) return;
    try {
      setIsInitializing(true);
      setError(null);
      const data = await getArchitectureGraph(projectId);
      if (data && data.graph && data.graph.nodes && data.graph.nodes.length > 0) {
        processGraphData(data);
      } else {
        // Handle empty but not error state if needed
        setNodes([]);
        setEdges([]);
      }
    } catch (err) {
      setError(err.message || "Unable to load architecture graph.");
    } finally {
      setIsInitializing(false);
    }
  }, [projectId, getArchitectureGraph, processGraphData, setNodes, setEdges]);

  useEffect(() => {
    performFetch();
  }, [projectId]);

  const onNodeClick = useCallback((event, node) => {
    event.stopPropagation();
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onLayout = useCallback(
    (direction) => {
      if (nodes.length === 0) return;
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, setNodes, setEdges]
  );

  const isLoading = aiLoading || isInitializing;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw',
      backgroundColor: '#000000',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Premium Header */}
      <header style={{
        height: '64px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: '#050505',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate(`/editor/${projectId}`)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: '0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px'
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={20} style={{ color: '#3676de' }} />
            <span style={{ fontWeight: '600', fontSize: '15px' }}>Architecture Graph</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => performFetch(true)}
            style={{
              background: '#3676de',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
            Scan Project
          </button>
        </div>
      </header>

      <main style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div style={{ flex: 1, position: 'relative', background: '#000000', height: '100%' }}>
          
          {/* Direct Loading Overlay */}
          {isLoading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 100,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px'
            }}>
              <div className="loader-ring"></div>
              <p style={{ color: '#888', fontSize: '12px', letterSpacing: '0.15em', fontWeight: '700' }}>INITIALIZING SCAN...</p>
            </div>
          )}

          {error && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0d11' }}>
              <div style={{ textAlign: 'center', maxWidth: '400px', padding: '40px', borderRadius: '0', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '20px', margin: '0 auto' }} />
                <h3 style={{ color: '#fff', marginBottom: '12px' }}>Analysis Failed</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>{error}</p>
                <button onClick={() => performFetch(true)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '0', cursor: 'pointer', fontWeight: '700' }}>
                  Retry Scan
                </button>
              </div>
            </div>
          )}

          {/* Final Graph UI - Always rendered, opacity controlled if needed but here we show it directly */}
          <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#111" gap={20} variant="dots" />
              <Controls style={{ background: '#050505', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0' }} />
              <MiniMap 
                style={{ background: '#050505', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0' }}
                nodeColor={(n) => {
                  if (n.type === 'folder') return '#3b82f6';
                  if (n.type === 'page') return '#3676de';
                  if (n.type === 'component') return '#22d3ee';
                  if (n.type === 'api') return '#ec4899';
                  if (n.type === 'database') return '#10b981';
                  return '#64748b';
                }}
                maskColor="rgba(0, 0, 0, 0.7)"
              />
              
              <Panel position="top-left">
                <div style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  background: 'rgba(17, 19, 24, 0.85)', 
                  backdropFilter: 'blur(12px)',
                  padding: '12px 20px', 
                  borderRadius: '0', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                  color: '#fff'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px', fontWeight: '700' }}>Nodes</div>
                    <div style={{ fontSize: '16px', fontWeight: '800' }}>{nodes.length}</div>
                  </div>
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px', fontWeight: '700' }}>Links</div>
                    <div style={{ fontSize: '16px', fontWeight: '800' }}>{edges.length}</div>
                  </div>
                </div>
              </Panel>

              <Panel position="top-right">
                <div style={{ display: 'flex', gap: '8px', background: 'rgba(17, 19, 24, 0.85)', backdropFilter: 'blur(12px)', padding: '6px', borderRadius: '0', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <button onClick={() => onLayout('TB')} title="Vertical Flow" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', borderRadius: '0' }}><Layers size={18} /></button>
                  <button onClick={() => onLayout('LR')} title="Horizontal Flow" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', borderRadius: '0', transform: 'rotate(-90deg)' }}><Layers size={18} /></button>
                </div>
              </Panel>
            </ReactFlow>
          </div>
        </div>

        {/* Right Detail Panel */}
        <div 
          style={{ 
            width: selectedNode ? '420px' : '0px', 
            background: '#050505', 
            borderLeft: selectedNode ? '1px solid rgba(255,255,255,0.06)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 100
          }}
        >
          {selectedNode && (
            <div style={{ padding: '32px', width: '400px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '0', 
                    background: 'rgba(54, 118, 222, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#3676de',
                    border: '1px solid rgba(54, 118, 222, 0.2)'
                  }}>
                    {selectedNode.type === 'folder' ? <Folder size={22} /> : <File size={22} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: '#fff' }}>{selectedNode.data?.label || 'Unknown'}</h3>
                    <span style={{ fontSize: '10px', color: '#3676de', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '800' }}>{selectedNode.type}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedNode(null)}
                  style={{ background: 'rgba(255,255,255,0.03)', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '8px', borderRadius: '0' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scroll">
                <section style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
                    <Info size={14} /> Information
                  </h4>
                  <div style={{ background: 'rgba(255,255,255,0.015)', borderRadius: '0', padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '10px', color: '#555', display: 'block', marginBottom: '4px', fontWeight: '700' }}>PATH</label>
                      <code style={{ fontSize: '12px', color: '#888', wordBreak: 'break-all', fontFamily: "'JetBrains Mono', monospace" }}>{selectedNode.data?.path || 'N/A'}</code>
                    </div>
                    {selectedNode.data?.size > 0 && (
                      <div>
                        <label style={{ fontSize: '10px', color: '#555', display: 'block', marginBottom: '4px', fontWeight: '700' }}>SIZE</label>
                        <span style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>{(selectedNode.data.size / 1024).toFixed(2)} KB</span>
                      </div>
                    )}
                  </div>
                </section>

                <section style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
                    <Link2 size={14} /> Topological Links
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.015)', borderRadius: '0', padding: '16px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>Inbound</div>
                      <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff' }}>{edges.filter(e => e.target === selectedNode.id).length}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.015)', borderRadius: '0', padding: '16px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>Outbound</div>
                      <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff' }}>{edges.filter(e => e.source === selectedNode.id).length}</div>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
                    <Activity size={14} /> AI Analysis
                  </h4>
                  <div style={{ background: 'rgba(54, 118, 222, 0.05)', borderRadius: '0', padding: '20px', border: '1px solid rgba(54, 118, 222, 0.15)', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.7' }}>
                    {selectedNode.type === 'folder' 
                      ? `This structural node consolidates children modules. It defines a functional namespace and boundary within the system.`
                      : `This module is part of the system's logic flow. Its connectivity indicates it plays a ${edges.filter(e => e.target === selectedNode.id).length > 2 ? 'core' : 'supporting'} role in the architecture.`}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Persistent Bottom Summary (Optional, but user said directly final graph page) */}
      {!selectedNode && globalExplanation && (
        <div style={{
          position: 'absolute',
          display: 'none',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          background: 'rgba(5, 5, 5, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '0',
          padding: '16px 20px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
          zIndex: 5
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Activity size={15} color="#3676de" />
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Architecture Summary HIDDEN</span>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>{globalExplanation.substring(0, 200)}...</p>
        </div>
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .loader-ring { width: 40px; height: 40px; border: 3px solid rgba(54, 118, 222, 0.1); border-top: 3px solid #3676de; border-radius: 0; animation: spin 1s linear infinite; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 0; }
        
        /* Modern Data Flow Animation */
        .flowing-edge path {
          stroke-dasharray: 10;
          animation: dashdraw 0.5s linear infinite;
        }
        @keyframes dashdraw {
          from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
        }

        .react-flow__handle {
          transition: all 0.2s ease;
        }
        .react-flow__handle:hover {
          transform: scale(1.5);
        }
      `}</style>
    </div>
  );
};

const EditorExplainAI = () => (
  <ReactFlowProvider>
    <ArchitectureGraphInner />
  </ReactFlowProvider>
);

export default EditorExplainAI;
