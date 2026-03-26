import { useState } from 'react';

function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-surface-500/40 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-surface-700/60 hover:bg-surface-600/60 transition-colors cursor-pointer"
      >
        <span className="text-sm font-semibold text-text-200">{title}</span>
        <span className={`text-text-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && <div className="px-5 py-4 space-y-4 bg-surface-750/40">{children}</div>}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-text-300">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-lg border border-surface-500/50 bg-surface-800 text-text-200 text-sm outline-none transition-all focus:border-accent-400/70 focus:ring-1 focus:ring-accent-400/20 placeholder:text-text-400/40"
      />
      {hint && <p className="text-[11px] text-text-400/70">{hint}</p>}
    </div>
  );
}

function ListEditor({ label, items = [], onChange }) {
  const [newItem, setNewItem] = useState('');
  const add = () => {
    if (!newItem.trim()) return;
    onChange([...items, newItem.trim()]);
    setNewItem('');
  };
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-text-300">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-400/15 text-accent-400 text-xs font-medium border border-accent-400/20"
          >
            {item}
            <button onClick={() => remove(idx)} className="opacity-60 hover:opacity-100 cursor-pointer">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Add item…"
          className="flex-1 px-3 py-2 rounded-lg border border-surface-500/50 bg-surface-800 text-text-200 text-xs outline-none transition-all focus:border-accent-400/70 placeholder:text-text-400/40"
        />
        <button
          onClick={add}
          className="px-3 py-2 rounded-lg bg-accent-400/15 text-accent-400 text-xs font-medium border border-accent-400/20 hover:bg-accent-400/25 transition-colors cursor-pointer"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function BehaviorEditor({ value, onChange }) {
  if (!value || typeof value !== 'object') return null;

  const update = (path, val) => {
    const copy = JSON.parse(JSON.stringify(value));
    const keys = path.split('.');
    let obj = copy;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = val;
    onChange(copy);
  };

  const style = value.style || {};
  const contacts = value.contacts || {};
  const messages = value.messages || {};

  return (
    <section id="behavior-editor" className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-2 h-6 rounded-full bg-warning-400" />
        <h2 className="text-lg font-semibold text-text-100">Behavior Config</h2>
        <span className="text-xs text-text-400 font-mono">BEHAVIOR.sales.json</span>
      </div>

      <div className="space-y-3">
        {/* Style */}
        <CollapsibleSection title="🎨  Style & Language" defaultOpen>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Language" value={style.language || ''} onChange={(v) => update('style.language', v)} placeholder="id" />
            <InputField label="Customer Title (mid)" value={style.customer_title_mid || ''} onChange={(v) => update('style.customer_title_mid', v)} placeholder="kk" />
            <InputField label="Customer Title (end)" value={style.customer_title_end || ''} onChange={(v) => update('style.customer_title_end', v)} placeholder="kak" />
            <InputField label="Max Sentences" value={String(style.max_sentences || '')} onChange={(v) => update('style.max_sentences', parseInt(v) || 0)} placeholder="4" />
          </div>
          <ListEditor
            label="Forbidden Titles"
            items={style.forbidden_titles || []}
            onChange={(v) => update('style.forbidden_titles', v)}
          />
        </CollapsibleSection>

        {/* Contacts */}
        <CollapsibleSection title="📞  Contacts">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Human Agent URL" value={contacts.human_agent_url || ''} onChange={(v) => update('contacts.human_agent_url', v)} />
            <InputField label="Human Agent Phone" value={contacts.human_agent_phone || ''} onChange={(v) => update('contacts.human_agent_phone', v)} />
            <InputField label="Ops Forward Phone" value={contacts.ops_forward_phone || ''} onChange={(v) => update('contacts.ops_forward_phone', v)} />
          </div>
        </CollapsibleSection>

        {/* Messages */}
        <CollapsibleSection title="💬  Bot Messages">
          <div className="space-y-4">
            {Object.entries(messages).map(([key, msg]) => (
              <div key={key} className="space-y-1.5">
                <label className="text-xs font-medium text-text-300 font-mono">{key}</label>
                <textarea
                  value={msg}
                  onChange={(e) => update(`messages.${key}`, e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-surface-500/50 bg-surface-800 text-text-200 text-sm outline-none resize-y transition-all focus:border-accent-400/70 focus:ring-1 focus:ring-accent-400/20 placeholder:text-text-400/40"
                />
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Raw JSON Fallback */}
        <CollapsibleSection title="🔧  Raw JSON Editor">
          <textarea
            id="behavior-raw-json"
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try { onChange(JSON.parse(e.target.value)); } catch {}
            }}
            spellCheck={false}
            rows={16}
            className="w-full p-4 rounded-lg border border-surface-500/50 bg-surface-800 text-text-200 font-mono text-[12px] leading-relaxed resize-y outline-none transition-all focus:border-accent-400/70 focus:ring-1 focus:ring-accent-400/20"
          />
        </CollapsibleSection>
      </div>
    </section>
  );
}
