import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GitCompare, GitGraph, Globe, Search, ArrowRight, 
  Settings, ChevronRight, Check, AlertCircle, RefreshCcw,
  Terminal, ShieldCheck
} from 'lucide-react';
import { useRepo } from '../hooks/useRepo';

const ConnectRepo = () => {
  const navigate = useNavigate();
  const { fetchRepos, connectRepo, repos, loading } = useRepo();
  const [provider, setProvider] = useState('github');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [config, setConfig] = useState({
    branch: 'main',
    buildCommand: 'npm run build',
    installCommand: 'npm install',
    rootDir: './'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRepos(provider, searchQuery);
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [provider, searchQuery, fetchRepos]);

  const displayRepos = repos;

  const handleConnect = async () => {
    if (!selectedRepo) return;
    try {
      await connectRepo({
        provider,
        repoName: selectedRepo.full_name || selectedRepo.name,
        branch: config.branch,
        buildCommand: config.buildCommand,
        installCommand: config.installCommand,
        rootDir: config.rootDir
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-container" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="auth-card" style={{ maxWidth: '1000px', width: '100%', padding: '0', display: 'grid', gridTemplateColumns: '400px 1fr' }}>
        
        {/* Left Side: Steps & Info */}
        <aside style={{ background: '#0a0a0b', padding: '40px', borderRight: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Connect Repository</h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
              Integrate your version control system to enable automated AI security scans and seamless deployments.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: provider ? '#3b82f6' : '#1a1a1b', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '12px', fontWeight: '700' }}>1</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>Choose Provider</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>GitHub, GitLab, or Bitbucket</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: selectedRepo ? '#3b82f6' : '#1a1a1b', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '12px', fontWeight: '700' }}>2</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>Select Repository</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Choose from your projects</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1a1a1b', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '12px', fontWeight: '700' }}>3</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>Configure Build</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Define build and install commands</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <ShieldCheck size={20} style={{ color: '#3b82f6' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6' }}>AI-Security Ready</span>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
              Once connected, our DevSecOps agent will automatically scan every push for OWASP vulnerabilities.
            </p>
          </div>
        </aside>

        {/* Right Side: Main Interface */}
        <main style={{ padding: '40px', overflowY: 'auto', maxHeight: '85vh' }}>
          
          {/* Step 1: Provider Selection */}
          <section style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Select VCS Provider
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <button 
                className={`auth-btn ${provider === 'github' ? '' : 'auth-btn--ghost'}`} 
                onClick={() => setProvider('github')}
                style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', background: provider === 'github' ? '#3b82f6' : '' }}
              >
                <GitCompare size={20} />
                <span style={{ fontSize: '13px' }}>GitHub</span>
              </button>
              <button 
                className={`auth-btn ${provider === 'gitlab' ? '' : 'auth-btn--ghost'}`} 
                onClick={() => setProvider('gitlab')}
                style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', background: provider === 'gitlab' ? '#3b82f6' : '' }}
              >
                <GitGraph size={20} />
                <span style={{ fontSize: '13px' }}>GitLab</span>
              </button>
              <button 
                className={`auth-btn ${provider === 'bitbucket' ? '' : 'auth-btn--ghost'}`} 
                onClick={() => setProvider('bitbucket')}
                style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', background: provider === 'bitbucket' ? '#3b82f6' : '' }}
              >
                <Globe size={20} />
                <span style={{ fontSize: '13px' }}>Bitbucket</span>
              </button>
            </div>
          </section>

          {/* Step 2: Repository List */}
          <section style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select Repository
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input 
                  className="auth-input" 
                  placeholder="Search repos..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: '8px 12px 8px 36px', width: '200px', fontSize: '13px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <RefreshCcw size={24} className="animate-spin" style={{ color: 'rgba(255,255,255,0.2)' }} />
                </div>
              ) : displayRepos.length > 0 ? (
                displayRepos.map(repo => (
                  <button 
                    key={repo.id}
                    onClick={() => setSelectedRepo(repo)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '12px 16px', 
                      background: selectedRepo?.id === repo.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.02)', 
                      border: `1px solid ${selectedRepo?.id === repo.id ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Terminal size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
                      <span style={{ fontSize: '14px', color: selectedRepo?.id === repo.id ? '#fff' : 'rgba(255,255,255,0.8)' }}>
                        {repo.full_name || repo.name}
                      </span>
                    </div>
                    {selectedRepo?.id === repo.id && <Check size={16} style={{ color: '#3b82f6' }} />}
                  </button>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.2)' }}>
                  <AlertCircle size={32} style={{ marginBottom: '12px' }} />
                  <p>No repositories found</p>
                </div>
              )}
            </div>
          </section>

          {/* Step 3: Build Configuration */}
          {selectedRepo && (
            <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Build Configuration
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="auth-group">
                  <label>Branch</label>
                  <input 
                    className="auth-input" 
                    value={config.branch} 
                    onChange={(e) => setConfig({...config, branch: e.target.value})}
                  />
                </div>
                <div className="auth-group">
                  <label>Root Directory</label>
                  <input 
                    className="auth-input" 
                    value={config.rootDir} 
                    onChange={(e) => setConfig({...config, rootDir: e.target.value})}
                  />
                </div>
                <div className="auth-group">
                  <label>Install Command</label>
                  <input 
                    className="auth-input" 
                    value={config.installCommand} 
                    onChange={(e) => setConfig({...config, installCommand: e.target.value})}
                  />
                </div>
                <div className="auth-group">
                  <label>Build Command</label>
                  <input 
                    className="auth-input" 
                    value={config.buildCommand} 
                    onChange={(e) => setConfig({...config, buildCommand: e.target.value})}
                  />
                </div>
              </div>

              <button 
                className="auth-btn" 
                onClick={handleConnect}
                disabled={loading}
                style={{ width: '100%', marginTop: '32px', height: '52px' }}
              >
                {loading ? 'Initializing...' : 'Connect & Initialize'}
                {!loading && <ArrowRight size={18} style={{ marginLeft: '10px' }} />}
              </button>
            </section>
          )}

        </main>
      </div>
    </div>
  );
};

export default ConnectRepo;
