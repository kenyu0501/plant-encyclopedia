const fruits = ["🥭", "🥑", "🍌"];

export function FruitLoading({ label = "読み込み中" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white/86 p-5 text-leaf-900 shadow-soft ring-1 ring-leaf-100">
      <div className="flex h-14 items-end justify-center gap-2" aria-hidden="true">
        {fruits.map((fruit, index) => (
          <span key={fruit} className="fruit-bounce grid h-11 w-11 place-items-center rounded-full bg-fruit-100 text-2xl shadow-sm" style={{ animationDelay: `${index * 0.13}s` }}>
            {fruit}
          </span>
        ))}
      </div>
      <div className="text-center">
        <p className="text-sm font-bold">{label}</p>
        <div className="mt-2 flex justify-center gap-1" aria-hidden="true">
          <span className="loading-dot" />
          <span className="loading-dot [animation-delay:0.16s]" />
          <span className="loading-dot [animation-delay:0.32s]" />
        </div>
      </div>
    </div>
  );
}
