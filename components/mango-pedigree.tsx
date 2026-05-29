import Link from "next/link";

const pedigreeRows = [
  {
    cultivar: "アーウィン",
    slug: "irwin",
    parentage: "Lippens × Haden",
    note: "日本・沖縄で代表的に扱われる赤色系。SSR解析で両親が確認されています。"
  },
  {
    cultivar: "ドット",
    slug: "dot",
    parentage: "Carrie × Spirit of '76",
    note: "フロリダ系統。JIRCAS登録個体で親子関係が推定されています。"
  },
  {
    cultivar: "ジュビリー",
    slug: "jubilee",
    parentage: "Sensation × Irwin",
    note: "Irwinを片親にもつ赤色系統として見られます。"
  },
  {
    cultivar: "リリー",
    slug: "lily",
    parentage: "Springfels × Sensation",
    note: "フロリダ系品種同士の組み合わせ。"
  },
  {
    cultivar: "マンザニーロ",
    slug: "manzanillo",
    parentage: "Haden × Kent",
    note: "Haden系統の流れを引く大果系。"
  },
  {
    cultivar: "R2E2",
    slug: "r2e2",
    parentage: "Kensington × Kent",
    note: "オーストラリア品種。Kensington系統とKentの組み合わせ。"
  },
  {
    cultivar: "ラポザ",
    slug: "rapoza",
    parentage: "Irwin × Kent、またはHaden系後代",
    note: "ハワイの赤色系。SSR解析では複数の解釈が示されています。"
  }
];

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

      <div className="grid gap-3">
        {pedigreeRows.map((row) => (
          <Link
            key={row.slug}
            href={`/fruits/mango/cultivars/${row.slug}`}
            className="rounded-lg bg-leaf-50 p-3 ring-1 ring-leaf-100"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-bold text-leaf-900">{row.cultivar}</h3>
              <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-leaf-900/70">{row.parentage}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-leaf-900/70">{row.note}</p>
          </Link>
        ))}
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
    <svg viewBox="0 0 940 610" role="img" aria-label="マンゴー品種の親子関係マップ" className="min-w-[860px]">
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

      <PedigreeEdge from={[152, 128]} to={[352, 128]} />
      <PedigreeEdge from={[152, 218]} to={[352, 128]} />

      <PedigreeEdge from={[152, 308]} to={[352, 308]} />
      <PedigreeEdge from={[152, 398]} to={[352, 308]} />

      <PedigreeEdge from={[152, 488]} to={[352, 488]} />
      <PedigreeEdge from={[152, 578]} to={[352, 488]} />

      <PedigreeEdge from={[552, 128]} to={[752, 128]} />
      <PedigreeEdge from={[552, 218]} to={[752, 128]} />

      <PedigreeEdge from={[552, 308]} to={[752, 308]} />
      <PedigreeEdge from={[552, 398]} to={[752, 308]} />

      <PedigreeEdge from={[552, 488]} to={[752, 488]} />
      <PedigreeEdge from={[552, 578]} to={[752, 488]} />

      <PedigreeEdge from={[352, 128]} to={[552, 488]} dashed />
      <PedigreeEdge from={[352, 488]} to={[552, 488]} dashed />

      <PedigreeNode x={24} y={98} label="Lippens" tone="parent" />
      <PedigreeNode x={24} y={188} label="Haden" tone="ancestor" />
      <PedigreeNode x={288} y={98} label="アーウィン" href="/fruits/mango/cultivars/irwin" tone="child" />

      <PedigreeNode x={24} y={278} label="Carrie" tone="parent" />
      <PedigreeNode x={24} y={368} label="Spirit of '76" href="/fruits/mango/cultivars/spirit-of-76" tone="parent" />
      <PedigreeNode x={288} y={278} label="ドット" href="/fruits/mango/cultivars/dot" tone="child" />

      <PedigreeNode x={24} y={458} label="Kensington" href="/fruits/mango/cultivars/kensington" tone="parent" />
      <PedigreeNode x={24} y={548} label="Kent" tone="ancestor" />
      <PedigreeNode x={288} y={458} label="R2E2" href="/fruits/mango/cultivars/r2e2" tone="child" />

      <PedigreeNode x={488} y={98} label="Sensation" href="/fruits/mango/cultivars/sensation" tone="parent" />
      <PedigreeNode x={488} y={188} label="アーウィン" href="/fruits/mango/cultivars/irwin" tone="child" />
      <PedigreeNode x={688} y={98} label="ジュビリー" href="/fruits/mango/cultivars/jubilee" tone="child" />

      <PedigreeNode x={488} y={278} label="Springfels" href="/fruits/mango/cultivars/springfels" tone="parent" />
      <PedigreeNode x={488} y={368} label="Sensation" href="/fruits/mango/cultivars/sensation" tone="parent" />
      <PedigreeNode x={688} y={278} label="リリー" href="/fruits/mango/cultivars/lily" tone="child" />

      <PedigreeNode x={488} y={458} label="アーウィン" href="/fruits/mango/cultivars/irwin" tone="child" />
      <PedigreeNode x={488} y={548} label="Kent" tone="ancestor" />
      <PedigreeNode x={688} y={458} label="ラポザ" href="/fruits/mango/cultivars/rapoza" tone="child" />

      <PedigreeNode x={688} y={548} label="マンザニーロ" href="/fruits/mango/cultivars/manzanillo" tone="child" />
      <PedigreeEdge from={[552, 578]} to={[752, 578]} />
      <PedigreeEdge from={[152, 218]} to={[752, 578]} dashed />

      <g transform="translate(716 34)">
        <LegendChip color="#f9d77e" label="祖先・重要親" />
        <LegendChip color="#d9ead3" label="親" y={24} />
        <LegendChip color="#ffffff" label="子品種" y={48} />
      </g>
    </svg>
  );
}

function PedigreeEdge({ from, to, dashed = false }: { from: [number, number]; to: [number, number]; dashed?: boolean }) {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke="#2f5d3b"
      strokeWidth="2"
      strokeDasharray={dashed ? "6 6" : undefined}
      markerEnd="url(#arrow)"
      opacity={dashed ? "0.58" : "0.82"}
    />
  );
}

function PedigreeNode({
  x,
  y,
  label,
  tone,
  href
}: {
  x: number;
  y: number;
  label: string;
  tone: "ancestor" | "parent" | "child";
  href?: string;
}) {
  const fill = tone === "ancestor" ? "#f9d77e" : tone === "parent" ? "#d9ead3" : "#ffffff";
  const content = (
    <g>
      <rect x={x} y={y - 30} width="128" height="60" rx="8" fill={fill} stroke="#c7dcc8" />
      <text x={x + 64} y={y + 5} textAnchor="middle" className="fill-leaf-900 text-[13px] font-bold">
        {label}
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
