import { motion } from "framer-motion";
import { Plus } from "lucide-react";
export default function ProductCard({
  product: p,
  index,
  fa,
  money,
  onOpen,
  onQuickAdd,
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, delay: index * 0.025 }}
      className="min-w-0"
    >
      <button
        onClick={onOpen}
        className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[1.35rem] bg-[var(--surface-2)] text-right"
      >
        <img
          src={p.image}
          alt={fa ? p.name : p.en}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        {p.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-[var(--surface)]/90 px-3 py-1.5 text-[10px] font-bold">
            {fa ? p.badge : p.badge === "جدید" ? "NEW" : "BESTSELLER"}
          </span>
        )}
      </button>
      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold">{fa ? p.name : p.en}</h3>
          <p className="mt-1 text-[11px] text-[var(--muted)]">
            {fa ? p.color : p.categoryEn}
          </p>
        </div>
        <button
          onClick={onQuickAdd}
          aria-label="افزودن به سبد"
          className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)]"
        >
          <Plus size={16} />
        </button>
      </div>
      <p className="mt-3 text-sm font-extrabold">{money(p.price)}</p>
    </motion.article>
  );
}
