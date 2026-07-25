import Image from "next/image";

const runningFrames = [
  "/mascot/kenchan-mascot-run-1.png",
  "/mascot/kenchan-mascot-run-2.png",
  "/mascot/kenchan-mascot-run-3.png"
];

export function FruitLoading({ label = "読み込み中" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white/86 p-5 text-leaf-900 shadow-soft ring-1 ring-leaf-100">
      <div className="relative h-28 w-32" aria-hidden="true">
        <span className="mascot-loading-shadow absolute bottom-1 left-1/2 h-2.5 w-16 -translate-x-1/2 rounded-full bg-leaf-950/12 blur-[1px]" />
        <span className="mascot-loading-run absolute inset-x-0 top-0 mx-auto block h-28 w-28">
          {runningFrames.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              unoptimized
              priority
              sizes="112px"
              className="mascot-run-frame object-contain"
              style={{
                animationDelay: `${index * 0.18}s`,
                imageRendering: "pixelated"
              }}
            />
          ))}
        </span>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold">{label}</p>
        <div className="mt-2 flex items-center justify-center gap-1.5" aria-hidden="true">
          <span className="loading-fruit-dot bg-[#f5b642]" />
          <span className="loading-fruit-dot bg-[#e8842b] [animation-delay:0.18s]" />
          <span className="loading-fruit-dot bg-leaf-600 [animation-delay:0.36s]" />
        </div>
      </div>
    </div>
  );
}
