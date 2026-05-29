import Link from "next/link";

const hiddenRows = [
  "Barl: Keitt × Tommy Atkins",
  "Jinhuang: White × Kent",
  "Keitt Red: Irwin × Keitt",
  "Yu-Win #6: Jinhuang × Irwin"
];

export function MangoPedigree() {
  return (
    <section className="space-y-4 rounded-lg bg-white/84 p-5 ring-1 ring-leaf-100">
      <div>
        <h2 className="text-lg font-bold text-leaf-900">品種の系譜</h2>
        <p className="mt-2 text-sm leading-6 text-leaf-900/70">
          SSRマーカー解析では、JIRCASで保存されているマンゴー遺伝資源の親子関係が推定され、Hadenを祖先にもつフロリダ系品種が多いことが示されています。
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg bg-leaf-50 p-3 ring-1 ring-leaf-100">
        <MangoPedigreeMap />
      </div>

      <div className="rounded-md bg-fruit-100 p-3 text-sm leading-6 text-leaf-900/74">
        <p className="font-bold text-leaf-900">JIRCAS登録外・未公開ページの関係</p>
        <p className="mt-1">{hiddenRows.join(" / ")}</p>
      </div>

      <p className="text-xs leading-5 text-leaf-900/54">
        出典: Yamamoto et al. Genetic diversity and relatedness of mango cultivars assessed by SSR markers, Breeding Science, 2019.
      </p>
    </section>
  );
}

function MangoPedigreeMap() {
  return (
    <svg viewBox="0 0 1280 720" role="img" aria-label="マンゴー品種の親子関係マップ" className="min-w-[1180px]">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#2f5d3b" />
        </marker>
      </defs>

      <text x="24" y="34" className="fill-leaf-900 text-[18px] font-bold">
        SSR解析で示された主な親子関係
      </text>
      <text x="24" y="58" className="fill-leaf-900/60 text-[12px]">
        親品種から子品種へ矢印で表示しています
      </text>

      <PedigreeEdge from={[160, 150]} to={[320, 150]} />
      <PedigreeEdge from={[160, 230]} to={[320, 150]} />

      <PedigreeEdge from={[160, 330]} to={[320, 330]} />
      <PedigreeEdge from={[160, 410]} to={[320, 330]} />

      <PedigreeEdge from={[160, 520]} to={[320, 520]} />
      <PedigreeEdge from={[160, 600]} to={[320, 520]} />

      <PedigreeEdge from={[620, 150]} to={[800, 150]} />
      <PedigreeEdge from={[620, 230]} to={[800, 150]} />

      <PedigreeEdge from={[620, 330]} to={[800, 330]} />
      <PedigreeEdge from={[620, 410]} to={[800, 330]} />

      <PedigreeEdge from={[620, 520]} to={[800, 520]} />
      <PedigreeEdge from={[620, 600]} to={[800, 520]} />

      <PedigreeEdge from={[620, 600]} to={[800, 635]} />
      <PedigreeEdge from={[160, 230]} to={[800, 635]} />

      <PedigreeNode x={24} y={150} label="Lippens" year="1940年代" tone="parent" />
      <PedigreeNode x={24} y={230} label="Haden" year="1910年頃" tone="ancestor" />
      <PedigreeNode x={320} y={150} label="アーウィン" year="1949年選抜" href="/fruits/mango/cultivars/irwin" tone="child" />

      <PedigreeNode x={24} y={330} label="Carrie" year="1940年代" tone="parent" />
      <PedigreeNode x={24} y={410} label="Spirit of '76" year="1970年代" href="/fruits/mango/cultivars/spirit-of-76" tone="parent" />
      <PedigreeNode x={320} y={330} label="ドット" year="1980年代" href="/fruits/mango/cultivars/dot" tone="child" />

      <PedigreeNode x={24} y={520} label="Kensington" year="豪州系" href="/fruits/mango/cultivars/kensington" tone="parent" />
      <PedigreeNode x={24} y={600} label="Kent" year="1930年代" tone="ancestor" />
      <PedigreeNode x={320} y={520} label="R2E2" year="1982年頃" href="/fruits/mango/cultivars/r2e2" tone="child" />

      <PedigreeNode x={484} y={150} label="Sensation" year="1940年代" href="/fruits/mango/cultivars/sensation" tone="parent" />
      <PedigreeNode x={484} y={230} label="アーウィン" year="1949年選抜" href="/fruits/mango/cultivars/irwin" tone="child" />
      <PedigreeNode x={800} y={150} label="ジュビリー" year="年代未確認" href="/fruits/mango/cultivars/jubilee" tone="child" />

      <PedigreeNode x={484} y={330} label="Springfels" year="1920年代" href="/fruits/mango/cultivars/springfels" tone="parent" />
      <PedigreeNode x={484} y={410} label="Sensation" year="1940年代" href="/fruits/mango/cultivars/sensation" tone="parent" />
      <PedigreeNode x={800} y={330} label="リリー" year="年代未確認" href="/fruits/mango/cultivars/lily" tone="child" />

      <PedigreeNode x={484} y={520} label="アーウィン" year="1949年選抜" href="/fruits/mango/cultivars/irwin" tone="child" />
      <PedigreeNode x={484} y={600} label="Kent" year="1930年代" tone="ancestor" />
      <PedigreeNode x={800} y={520} label="ラポザ" year="1990年代" href="/fruits/mango/cultivars/rapoza" tone="child" />
      <PedigreeNode x={800} y={635} label="マンザニーロ" year="年代未確認" href="/fruits/mango/cultivars/manzanillo" tone="child" />

      <g transform="translate(1040 96)">
        <LegendChip color="#f9d77e" label="祖先・重要親" />
        <LegendChip color="#d9ead3" label="親" y={24} />
        <LegendChip color="#ffffff" label="子品種" y={48} />
      </g>
    </svg>
  );
}

function PedigreeEdge({ from, to }: { from: [number, number]; to: [number, number] }) {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke="#2f5d3b"
      strokeWidth="2"
      markerEnd="url(#arrow)"
      opacity="0.76"
    />
  );
}

function PedigreeNode({
  x,
  y,
  label,
  year,
  tone,
  href
}: {
  x: number;
  y: number;
  label: string;
  year: string;
  tone: "ancestor" | "parent" | "child";
  href?: string;
}) {
  const fill = tone === "ancestor" ? "#f9d77e" : tone === "parent" ? "#d9ead3" : "#ffffff";
  const content = (
    <g>
      <rect x={x - 136} y={y - 34} width="136" height="68" rx="8" fill={fill} stroke="#c7dcc8" />
      <text x={x - 68} y={y - 2} textAnchor="middle" className="fill-leaf-900 text-[13px] font-bold">
        {label}
      </text>
      <text x={x - 68} y={y + 17} textAnchor="middle" className="fill-leaf-900/60 text-[11px] font-semibold">
        {year}
      </text>
    </g>
  );

  if (!href) return content;
  return <Link href={href}>{content}</Link>;
}

function LegendChip({ color, label, y = 0 }: { color: string; label: string; y?: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <rect x="0" y="-12" width="18" height="18" rx="4" fill={color} stroke="#c7dcc8" />
      <text x="26" y="2" className="fill-leaf-900/70 text-[12px] font-semibold">
        {label}
      </text>
    </g>
  );
}
