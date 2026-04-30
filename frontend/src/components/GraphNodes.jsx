import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { Folder, File, Cpu, Layers, Globe, Database, Shield, Zap, Layout, Anchor, Settings, Wrench } from 'lucide-react';

const NodeWrapper = ({ children, selected, type, label, icon: Icon, color }) => {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`custom-node custom-node--${type} ${selected ? 'custom-node--selected' : ''}`}
      style={{
        padding: '14px 24px',
        borderRadius: '2rem',
        background: selected ? 'rgba(255, 255, 255, 0.04)' : '#050505',
        border: `1.5px solid ${selected ? color : 'rgba(255, 255, 255, 0.1)'}`,
        boxShadow: selected 
          ? `0 0 30px ${color}22, 0 12px 40px rgba(0,0,0,0.5)` 
          : '0 8px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        minWidth: '220px',
        backdropFilter: 'blur(12px)',
        transition: 'border 0.3s ease, box-shadow 0.3s ease',
        cursor: 'default',
        fontFamily: "'Inter', sans-serif"
      }}>
      
      <Handle 
        type="target" 
        position={Position.Left} // Default to left/right for flowchart feel
        style={{ 
          background: '#fff', 
          border: `2px solid ${color}`, 
          width: '10px', 
          height: '10px',
          left: '-6px'
        }} 
      />
      
      <div style={{
        width: '38px',
        height: '38px',
        borderRadius: '2rem',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        boxShadow: `inset 0 0 10px ${color}10`
      }}>
        <Icon size={20} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ 
          color: '#ffffff', 
          fontSize: '14px', 
          fontWeight: '600', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          letterSpacing: '-0.02em'
        }}>
          {label}
        </div>
        <div style={{ 
          color: '#555', 
          fontSize: '10px', 
          textTransform: 'uppercase', 
          letterSpacing: '0.12em',
          fontWeight: '800',
          marginTop: '2px'
        }}>
          {type}
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ 
          background: '#fff', 
          border: `2px solid ${color}`, 
          width: '10px', 
          height: '10px',
          right: '-6px'
        }} 
      />
    </motion.div>
  );
};

export const FolderNode = memo(({ data, selected }) => (
  <NodeWrapper type="folder" label={data.label} icon={Folder} color="#3b82f6" selected={selected} />
));

export const FileNode = memo(({ data, selected }) => (
  <NodeWrapper type="file" label={data.label} icon={File} color="#94a3b8" selected={selected} />
));

export const ComponentNode = memo(({ data, selected }) => (
  <NodeWrapper type="component" label={data.label} icon={Cpu} color="#22d3ee" selected={selected} />
));

export const PageNode = memo(({ data, selected }) => (
  <NodeWrapper type="page" label={data.label} icon={Layout} color="#3676de" selected={selected} />
));

export const HookNode = memo(({ data, selected }) => (
  <NodeWrapper type="hook" label={data.label} icon={Anchor} color="#f59e0b" selected={selected} />
));

export const UtilNode = memo(({ data, selected }) => (
  <NodeWrapper type="util" label={data.label} icon={Wrench} color="#10b981" selected={selected} />
));

export const ServiceNode = memo(({ data, selected }) => (
  <NodeWrapper type="service" label={data.label} icon={Layers} color="#3676de" selected={selected} />
));

export const ApiNode = memo(({ data, selected }) => (
  <NodeWrapper type="api" label={data.label} icon={Globe} color="#ec4899" selected={selected} />
));

export const DatabaseNode = memo(({ data, selected }) => (
  <NodeWrapper type="database" label={data.label} icon={Database} color="#10b981" selected={selected} />
));

export const MiddlewareNode = memo(({ data, selected }) => (
  <NodeWrapper type="middleware" label={data.label} icon={Shield} color="#f43f5e" selected={selected} />
));

export const ControllerNode = memo(({ data, selected }) => (
  <NodeWrapper type="controller" label={data.label} icon={Zap} color="#06b6d4" selected={selected} />
));

export const ConfigNode = memo(({ data, selected }) => (
  <NodeWrapper type="config" label={data.label} icon={Settings} color="#64748b" selected={selected} />
));
