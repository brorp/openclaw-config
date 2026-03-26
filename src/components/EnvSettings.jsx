const KNOWN_TOGGLES = [
  { key: 'OPENCLAW_EVENT_QUEUE_ENABLED', label: 'Event Queue Enabled', hint: 'Enable settlement event queue for proactive delivery' },
  { key: 'OPENCLAW_AUTO_SEND_PAYMENT_QR', label: 'Auto Send Payment QR', hint: 'Automatically send QR to customer after checkout' },
  { key: 'OPENCLAW_AUTO_SEND_INVOICE', label: 'Auto Send Invoice', hint: 'Automatically send formatted invoice to customer' },
  { key: 'OPENCLAW_PAYMENT_LINK_FALLBACK', label: 'Payment Link Fallback', hint: 'Fall back to payment link if QR delivery fails' },
];

const KNOWN_TEXT_FIELDS = [
  { key: 'API_BASE_URL', label: 'API Base URL', placeholder: 'https://your-api-domain.com' },
  { key: 'OPENCLAW_BIN', label: 'OpenClaw Binary Path', placeholder: '/home/openclaw/.npm-global/bin/openclaw' },
  { key: 'OPENCLAW_CHANNEL', label: 'Channel', placeholder: 'whatsapp' },
  { key: 'OPENCLAW_ACCOUNT', label: 'Account ID', placeholder: '' },
  { key: 'OPENCLAW_EVENT_QUEUE_DIR', label: 'Event Queue Dir', placeholder: '/tmp/worthy-openclaw-events' },
  { key: 'OPENCLAW_MEDIA_DIR', label: 'Media Dir', placeholder: '' },
  { key: 'OPENCLAW_EVENT_POLL_INTERVAL_SECONDS', label: 'Poll Interval (seconds)', placeholder: '5' },
];

function Toggle({ label, hint, checked, onChange }) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 w-10 h-5.5 rounded-full border transition-all duration-200 cursor-pointer flex-shrink-0 ${
          checked
            ? 'bg-accent-400 border-accent-500'
            : 'bg-surface-600 border-surface-500'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
      <div>
        <p className="text-sm font-medium text-text-200">{label}</p>
        {hint && <p className="text-[11px] text-text-400/70 mt-0.5">{hint}</p>}
      </div>
    </div>
  );
}

export default function EnvSettings({ value, onChange }) {
  if (!value || typeof value !== 'object') return null;

  const update = (key, val) => {
    onChange({ ...value, [key]: val });
  };

  const isTrue = (key) => {
    const v = String(value[key] || '').toLowerCase();
    return v === 'true' || v === '1';
  };

  // Compute "other" keys not in KNOWN sets
  const knownKeys = new Set([
    ...KNOWN_TOGGLES.map((t) => t.key),
    ...KNOWN_TEXT_FIELDS.map((t) => t.key),
    'API_TOKEN',
    'DEFAULT_SHOP',
    'STOREFRONT_ACCESS_TOKEN',
    'WORTHY_INTERNAL_TOOLS_DIR',
  ]);
  const otherKeys = Object.keys(value).filter((k) => !knownKeys.has(k));

  return (
    <section id="env-settings" className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-2 h-6 rounded-full bg-success-400" />
        <h2 className="text-lg font-semibold text-text-100">Runtime Settings</h2>
        <span className="text-xs text-text-400 font-mono">.env</span>
      </div>

      <div className="rounded-xl border border-surface-500/40 overflow-hidden">
        {/* Toggles */}
        <div className="px-5 py-4 bg-surface-750/40 space-y-4">
          <p className="text-xs font-semibold text-text-300 uppercase tracking-wider">Feature Flags</p>
          {KNOWN_TOGGLES.map((t) => (
            <Toggle
              key={t.key}
              label={t.label}
              hint={t.hint}
              checked={isTrue(t.key)}
              onChange={(v) => update(t.key, v ? 'true' : 'false')}
            />
          ))}
        </div>

        <div className="border-t border-surface-500/30" />

        {/* Text fields */}
        <div className="px-5 py-4 bg-surface-700/30 space-y-4">
          <p className="text-xs font-semibold text-text-300 uppercase tracking-wider">Configuration</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {KNOWN_TEXT_FIELDS.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <label className="text-xs font-medium text-text-300">{f.label}</label>
                <input
                  type="text"
                  value={value[f.key] || ''}
                  onChange={(e) => update(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-surface-500/50 bg-surface-800 text-text-200 text-sm outline-none transition-all focus:border-accent-400/70 focus:ring-1 focus:ring-accent-400/20 placeholder:text-text-400/40"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Other env vars */}
        {otherKeys.length > 0 && (
          <>
            <div className="border-t border-surface-500/30" />
            <div className="px-5 py-4 bg-surface-750/40 space-y-4">
              <p className="text-xs font-semibold text-text-300 uppercase tracking-wider">Other Variables</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherKeys.map((key) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-xs font-medium text-text-400 font-mono">{key}</label>
                    <input
                      type="text"
                      value={value[key] || ''}
                      onChange={(e) => update(key, e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-surface-500/50 bg-surface-800 text-text-200 text-sm outline-none transition-all focus:border-accent-400/70 focus:ring-1 focus:ring-accent-400/20"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
