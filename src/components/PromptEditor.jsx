export default function PromptEditor({ value, onChange }) {
  return (
    <section id="prompt-editor" className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-2 h-6 rounded-full bg-accent-400" />
        <h2 className="text-lg font-semibold text-text-100">System Prompt</h2>
        <span className="text-xs text-text-400 font-mono">AGENTS.sales.md</span>
      </div>

      <div className="relative group">
        <textarea
          id="system-prompt-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-full min-h-[420px] p-5 rounded-xl border border-surface-500/60 bg-surface-750 text-text-200 font-mono text-[13px] leading-relaxed resize-y outline-none transition-all duration-200 focus:border-accent-400/80 focus:ring-2 focus:ring-accent-400/20 placeholder:text-text-400/50"
          placeholder="# Masukkan system prompt di sini..."
        />
        <div className="absolute bottom-3 right-3 text-xs text-text-400/60 font-mono select-none">
          {value.length.toLocaleString()} chars
        </div>
      </div>
    </section>
  );
}
