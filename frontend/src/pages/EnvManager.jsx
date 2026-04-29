import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Lock, Plus, Trash2, Save, 
  Download, Upload, Eye, EyeOff, AlertCircle,
  Settings, Key, ShieldCheck
} from 'lucide-react';
import { useEnv } from '../hooks/useEnv';

const EnvManager = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { fetchEnvVars, saveEnvVars, variables, loading } = useEnv();
  
  const [localVars, setLocalVars] = useState([]);
  const [showValues, setShowValues] = useState({});

  useEffect(() => {
    fetchEnvVars(projectId).then(vars => {
      const formatted = Object.entries(vars).map(([key, value]) => ({ key, value, id: Math.random() }));
      setLocalVars(formatted.length > 0 ? formatted : [{ key: '', value: '', id: Math.random() }]);
    });
  }, [projectId, fetchEnvVars]);

  const handleAdd = () => {
    setLocalVars([...localVars, { key: '', value: '', id: Math.random() }]);
  };

  const handleRemove = (id) => {
    setLocalVars(localVars.filter(v => v.id !== id));
  };

  const handleChange = (id, field, value) => {
    setLocalVars(localVars.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleSave = async () => {
    const finalVars = {};
    localVars.forEach(v => {
      if (v.key.trim()) finalVars[v.key.trim()] = v.value;
    });
    try {
      await saveEnvVars(projectId, finalVars);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleShow = (id) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExport = () => {
    const content = localVars
      .filter(v => v.key.trim())
      .map(v => `${v.key}=${v.value}`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '.env';
    link.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const imported = lines
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .map(line => {
          const [key, ...rest] = line.split('=');
          return { key: key.trim(), value: rest.join('=').trim(), id: Math.random() };
        });
      if (imported.length > 0) {
        setLocalVars(prev => [...prev.filter(v => v.key || v.value), ...imported]);
      }
    };
    reader.readAsText(file);
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
              <Lock size={20} className="text-primary" /> Environment Secrets
            </h1>
          </div>
        </div>
        <div className="editor-header__right">
          <button className="editor-btn editor-btn--ghost" onClick={handleExport}>
            <Download size={16} /> Export .env
          </button>
          <label className="editor-btn editor-btn--ghost" style={{ cursor: 'pointer' }}>
            <Upload size={16} /> Import .env
            <input type="file" hidden onChange={handleImport} accept=".env,text/plain" />
          </label>
          <button 
            className="editor-btn editor-btn--primary" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <span className="editor-loader__spinner" style={{ width: 16, height: 16 }}></span> : <Save size={16} />}
            Save Variables
          </button>
        </div>
      </header>

      <div className="ai-page__content">
        <aside className="ai-form-side">
          <div className="ai-form-side__header">
            <h2>Secrets Management</h2>
            <p>Configure environment variables for your project. Values are encrypted at rest.</p>
          </div>

          <div className="ai-card ai-card--warning" style={{ animation: 'none' }}>
            <div className="ai-card__title"><AlertCircle size={16} /> Security Note</div>
            <p style={{ fontSize: '12px', lineHeight: '1.5', color: 'rgba(255,255,255,0.6)' }}>
              Avoid storing raw passwords. Use managed identity or secret rotation where possible. All values entered here are injected into the build runtime.
            </p>
          </div>

          <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '0', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <ShieldCheck size={20} style={{ color: '#3b82f6' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff', color: '#3b82f6' }}>Vault Protection</span>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
              CogniCode uses AES-256 encryption for all environment secrets.
            </p>
          </div>
        </aside>

        <main className="ai-result-side">
          <div className="ai-card" style={{ padding: '0', animation: 'none', background: 'transparent', border: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '20px', padding: '0 12px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Key</label>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Value</label>
                <span></span>
              </div>

              {localVars.map((v) => (
                <div 
                  key={v.id} 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 100px', 
                    gap: '20px', 
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    padding: '12px',
                    borderRadius: '0',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <input 
                    className="ai-input" 
                    placeholder="VARIABLE_NAME" 
                    value={v.key}
                    onChange={(e) => handleChange(v.id, 'key', e.target.value)}
                    style={{ background: 'transparent', border: 'none', fontSize: '13px', fontWeight: '600', color: '#fff' }}
                  />
                  <div style={{ position: 'relative' }}>
                    <input 
                      className="ai-input" 
                      type={showValues[v.id] ? 'text' : 'password'}
                      placeholder="••••••••••••" 
                      value={v.value}
                      onChange={(e) => handleChange(v.id, 'value', e.target.value)}
                      style={{ background: 'transparent', border: 'none', fontSize: '13px', paddingRight: '40px', color: '#fff' }}
                    />
                    <button 
                      onClick={() => toggleShow(v.id)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                    >
                      {showValues[v.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      className="editor-btn editor-btn--ghost" 
                      onClick={() => handleRemove(v.id)}
                      style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <button 
                className="ai-btn-primary" 
                onClick={handleAdd}
                style={{ width: '100%', marginTop: '12px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
              >
                <Plus size={16} /> Add Environment Variable
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EnvManager;
