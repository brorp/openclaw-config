import { useEffect, useRef } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(onClose, 4000);
    return () => clearTimeout(timerRef.current);
  }, [onClose]);

  const bgClass =
    type === 'error'
      ? 'bg-danger-500/90 border-danger-400/40'
      : 'bg-success-500/90 border-success-400/40';

  const icon = type === 'error' ? '✕' : '✓';

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-md shadow-2xl text-sm font-medium text-white animate-[slideIn_0.35s_ease] ${bgClass}`}
    >
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-xs font-bold">
        {icon}
      </span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
      >
        ✕
      </button>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
