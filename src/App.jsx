import { useState, useEffect, useCallback } from 'react';
import { fetchConfig, savePrompt, saveBehavior, saveEnv } from './api';
import PromptEditor from './components/PromptEditor';
import BehaviorEditor from './components/BehaviorEditor';
import EnvSettings from './components/EnvSettings';
import Toast from './components/Toast';

function StatusDot({ status }) {
  const color = {
    idle: 'bg-text-400',
    loading: 'bg-warning-400 animate-pulse',
    connected: 'bg-success-400',
    error: 'bg-danger-400',
  }[status] || 'bg-text-400';

  return <span className={`w-2.5 h-2.5 rounded-full ${color}`} />;
}

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [behavior, setBehavior] = useState(null);
  const [env, setEnv] = useState(null);
  const [status, setStatus] = useState('idle');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('prompt');

  const showToast = (message, type = 'success') => setToast({ message, type, key: Date.now() });

  const loadConfig = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await fetchConfig();
      setPrompt(data.prompt || '');
      setBehavior(data.behavior || {});
      setEnv(data.env || {});
      setStatus('connected');
    } catch (err) {
      console.error(err);
      setStatus('error');
      showToast('Failed to load config: ' + err.message, 'error');
    }
  }, []);

  useEffect(() => { loadConfig(); }, [loadConfig]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const results = await Promise.allSettled([
        savePrompt(prompt),
        saveBehavior(behavior),
        saveEnv(env),
      ]);

      const failed = results.filter((r) => r.status === 'rejected');
      if (failed.length > 0) {
        showToast(`${failed.length} save(s) failed. Check console.`, 'error');
        failed.forEach((r) => console.error(r.reason));
      } else {
        showToast('All changes saved successfully!');
      }
    } catch (err) {
      showToast('Save failed: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'prompt', label: 'System Prompt', icon: '📝' },
    { id: 'behavior', label: 'Behavior', icon: '🤖' },
    { id: 'env', label: 'Runtime', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-surface-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-surface-900/80 border-b border-surface-500/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-accent-500/25">
              OC
            </div>
            <div>
              <h1 className="text-base font-bold text-text-100 tracking-tight">Openclaw Config</h1>
              <p className="text-[11px] text-text-400 font-mono">worthy-api dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-text-400">
              <StatusDot status={status} />
              <span className="hidden sm:inline capitalize">{status}</span>
            </div>

            <button
              id="refresh-btn"
              onClick={loadConfig}
              disabled={status === 'loading'}
              className="px-3 py-2 rounded-lg border border-surface-500/50 bg-surface-700/60 text-text-300 text-xs font-medium hover:bg-surface-600/60 hover:text-text-100 transition-all cursor-pointer disabled:opacity-50"
            >
              ↻ Reload
            </button>

            <button
              id="save-btn"
              onClick={handleSave}
              disabled={saving || status !== 'connected'}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-400 to-accent-600 text-white text-sm font-semibold shadow-lg shadow-accent-500/30 hover:shadow-accent-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex gap-1 p-1 rounded-xl bg-surface-800/60 border border-surface-500/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-surface-700 text-text-100 shadow-md'
                  : 'text-text-400 hover:text-text-200 hover:bg-surface-700/40'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
        {status === 'loading' && !behavior && (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-3 border-accent-400/30 border-t-accent-400 rounded-full animate-spin" />
              <p className="text-sm text-text-400">Loading configuration…</p>
            </div>
          </div>
        )}

        {status === 'error' && !behavior && (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-danger-400/10 flex items-center justify-center text-danger-400 text-2xl">!</div>
              <p className="text-sm text-text-300">Could not connect to the API.</p>
              <p className="text-xs text-text-400">Check that <code className="px-1.5 py-0.5 rounded bg-surface-700 text-text-200 font-mono text-[11px]">VITE_API_URL</code> and <code className="px-1.5 py-0.5 rounded bg-surface-700 text-text-200 font-mono text-[11px]">VITE_API_TOKEN</code> are set correctly.</p>
              <button onClick={loadConfig} className="mt-2 px-4 py-2 rounded-lg bg-accent-400/15 text-accent-400 text-sm font-medium hover:bg-accent-400/25 transition-colors cursor-pointer">
                Retry
              </button>
            </div>
          </div>
        )}

        {behavior && (
          <div className="space-y-8">
            {activeTab === 'prompt' && <PromptEditor value={prompt} onChange={setPrompt} />}
            {activeTab === 'behavior' && <BehaviorEditor value={behavior} onChange={setBehavior} />}
            {activeTab === 'env' && <EnvSettings value={env} onChange={setEnv} />}
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
