export default function PromptChips({ prompts, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onSelect(p)}
          className="focus-ring glass rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-slate-100 cursor-pointer"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
