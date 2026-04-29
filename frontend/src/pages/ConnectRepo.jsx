import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GitCompare, GitGraph, Globe, Search, ArrowRight, 
  Settings, ChevronRight, ChevronLeft, Check, AlertCircle, RefreshCcw,
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
    fetchRepos(provider);
  }, [provider, fetchRepos]);

  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="dashboard" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header className="navbar" style={{ padding: '0 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', height: '72px' }}>
        <button 
          className="btn btn-ghost" 
          onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', color: 'rgba(255,255,255,0.7)', border: 'none', background: 'transparent' }}
        >
          <ChevronLeft size={18} /> <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Back to Dashboard</span>
        </button>
      </header>

      <main className="dashboard-page" style={{ flex: 1, padding: '3rem 2rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <header className="dashboard-page__header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div className="dashboard-page__title-group">
              <h1 className="dashboard-page__title">Connect Repository</h1>
              <p className="dashboard-page__subtitle">Integrate your version control system to enable automated workflows and live deployments.</p>
            </div>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            
            {/* Left Side: Setup Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '2px', background: provider ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.05)', color: provider ? '#3b82f6' : 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600', border: provider ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent', flexShrink: 0 }}>1</div>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#fff', marginBottom: '0.25rem' }}>Choose Provider</h3>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: '1.5' }}>Select GitHub, GitLab, or Bitbucket.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '2px', background: selectedRepo ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.05)', color: selectedRepo ? '#3b82f6' : 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600', border: selectedRepo ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent', flexShrink: 0 }}>2</div>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#fff', marginBottom: '0.25rem' }}>Select Repository</h3>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: '1.5' }}>Choose the project you want to connect.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '2px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600', flexShrink: 0 }}>3</div>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#fff', marginBottom: '0.25rem' }}>Configure Build</h3>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: '1.5' }}>Define build and installation commands.</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.03)', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={16} style={{ color: '#3b82f6' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#3b82f6' }}>AI-Security Ready</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', margin: 0 }}>
                  Once connected, our DevSecOps agent automatically scans every push for vulnerabilities.
                </p>
              </div>
            </div>

            {/* Right Side: Main Interface */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Step 1: Provider Selection */}
              <section>
                <label className="input-label" style={{ marginBottom: '0.75rem', display: 'block' }}>VCS Provider</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  <button 
                    className={`btn ${provider === 'github' ? 'btn-primary' : 'btn-ghost'}`} 
                    onClick={() => setProvider('github')}
                    style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: provider !== 'github' ? '1px solid rgba(255,255,255,0.1)' : 'none', height: 'auto' }}
                  >
                    <GitCompare size={20} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: '500' }}>GitHub</span>
                  </button>
                  <button 
                    className={`btn ${provider === 'gitlab' ? 'btn-primary' : 'btn-ghost'}`} 
                    onClick={() => setProvider('gitlab')}
                    style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: provider !== 'gitlab' ? '1px solid rgba(255,255,255,0.1)' : 'none', height: 'auto' }}
                  >
                    <GitGraph size={20} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: '500' }}>GitLab</span>
                  </button>
                  <button 
                    className={`btn ${provider === 'bitbucket' ? 'btn-primary' : 'btn-ghost'}`} 
                    onClick={() => setProvider('bitbucket')}
                    style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: provider !== 'bitbucket' ? '1px solid rgba(255,255,255,0.1)' : 'none', height: 'auto' }}
                  >
                    <Globe size={20} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: '500' }}>Bitbucket</span>
                  </button>
                </div>
              </section>

              {/* Step 2: Repository List */}
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="input-label" style={{ margin: 0 }}>Repository</label>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                    <input 
                      className="input-field" 
                      placeholder="Search repos..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: '2.25rem', height: '34px', fontSize: '0.8125rem', width: '180px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '240px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                      <RefreshCcw size={20} className="animate-spin" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    </div>
                  ) : filteredRepos.length > 0 ? (
                    filteredRepos.map(repo => (
                      <button 
                        key={repo.id}
                        onClick={() => setSelectedRepo(repo)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem', 
                          background: selectedRepo?.id === repo.id ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)', 
                          border: `1px solid ${selectedRepo?.id === repo.id ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
                          borderRadius: '2px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          color: selectedRepo?.id === repo.id ? '#fff' : 'rgba(255,255,255,0.7)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Terminal size={14} style={{ color: selectedRepo?.id === repo.id ? '#3b82f6' : 'rgba(255,255,255,0.3)' }} />
                          <span style={{ fontSize: '0.8125rem', fontWeight: '500' }}>
                            {repo.full_name || repo.name}
                          </span>
                        </div>
                        {selectedRepo?.id === repo.id && <Check size={16} style={{ color: '#3b82f6' }} />}
                      </button>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 0', color: 'rgba(255,255,255,0.4)' }}>
                      <AlertCircle size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                      <p style={{ fontSize: '0.8125rem', margin: 0 }}>No repositories found.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Step 3: Build Configuration */}
              {selectedRepo && (
                <section style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <label className="input-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Build Configuration</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.75rem', opacity: 0.8 }}>Branch</label>
                      <input 
                        className="input-field" 
                        value={config.branch} 
                        onChange={(e) => setConfig({...config, branch: e.target.value})}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.75rem', opacity: 0.8 }}>Root Directory</label>
                      <input 
                        className="input-field" 
                        value={config.rootDir} 
                        onChange={(e) => setConfig({...config, rootDir: e.target.value})}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.75rem', opacity: 0.8 }}>Install Command</label>
                      <input 
                        className="input-field" 
                        value={config.installCommand} 
                        onChange={(e) => setConfig({...config, installCommand: e.target.value})}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.75rem', opacity: 0.8 }}>Build Command</label>
                      <input 
                        className="input-field" 
                        value={config.buildCommand} 
                        onChange={(e) => setConfig({...config, buildCommand: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary" 
                    onClick={handleConnect}
                    disabled={loading}
                    style={{ width: '100%', marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}
                  >
                    {loading ? 'Initializing...' : 'Connect & Initialize'}
                    {!loading && <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />}
                  </button>
                </section>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConnectRepo;
