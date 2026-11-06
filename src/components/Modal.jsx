import { motion } from "framer-motion";
import { X } from "lucide-react";
export function Overlay({ onClose }) {
  return (
    <motion.button
      aria-label="بستن پنجره"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
    />
  );
}
export function Modal({ children, onClose, maxWidth = "max-w-2xl" }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto p-3 sm:p-6">
      <motion.section
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.985 }}
        transition={{ duration: 0.2 }}
        className={`relative my-auto max-h-[calc(100dvh-1.5rem)] w-full ${maxWidth} overflow-y-auto rounded-[1.75rem] bg-[var(--surface)] text-[var(--text)] shadow-2xl`}
      >
        <button
          onClick={onClose}
          aria-label="بستن"
          className="absolute left-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-[var(--surface)] shadow"
        >
          <X size={18} />
        </button>
        {children}
      </motion.section>
    </div>
  );
}
export function Field({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-rose-400"
      />
    </div>
  );
}
export function TrackStep({ active, title, desc }) {
  return (
    <div className="flex gap-3">
      <span
        className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full ${active ? "bg-rose-500 text-white" : "border border-[var(--line)] text-[var(--muted)]"}`}
      >
        {active ? "✓" : "·"}
      </span>
      <div>
        <p className="text-xs font-bold">{title}</p>
        <p className="mt-1 text-[11px] text-[var(--muted)]">{desc}</p>
      </div>
    </div>
  );
}
