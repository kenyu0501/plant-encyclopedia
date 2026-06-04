import Link from "next/link";

const families: PedigreeFamilyData[] = [
  {
    theme: "florida",
    group: "フロリダ系",
    parentA: { label: "Lippens", year: "1940年代", tone: "parent" },
    parentB: { label: "Haden", year: "1910年頃", tone: "ancestor" },
    child: { label: "アーウィン", year: "1949年選抜", href: "/fruits/mango/cultivars/irwin" }
  },
  {
    theme: "florida",
    group: "フロリダ系",
    parentA: { label: "Carrie", year: "1940年代", tone: "parent" },
    parentB: { label: "Spirit of '76", year: "1970年代", href: "/fruits/mango/cultivars/spirit-of-76", tone: "parent" },
    child: { label: "ドット", year: "1980年代", href: "/fruits/mango/cultivars/dot" }
  },
  {
    theme: "australia",
    group: "豪州系",
    parentA: { label: "Kensington", year: "豪州系", href: "/fruits/mango/cultivars/kensington", tone: "parent" },
    parentB: { label: "Kent", year: "1930年代", tone: "ancestor" },
    child: { label: "R2E2", year: "1982年頃", href: "/fruits/mango/cultivars/r2e2" }
  },
  {
    theme: "florida",
    group: "フロリダ系",
    parentA: { label: "Sensation", year: "1940年代", href: "/fruits/mango/cultivars/sensation", tone: "parent" },
    parentB: { label: "アーウィン", year: "1949年選抜", href: "/fruits/mango/cultivars/irwin", tone: "child" },
    child: { label: "ジュビリー", year: "年代未確認", href: "/fruits/mango/cultivars/jubilee" }
  },
  {
    theme: "israel",
    group: "イスラエル系",
    parentA: { label: "Springfels", year: "1920年代", href: "/fruits/mango/cultivars/springfels", tone: "parent" },
    parentB: { label: "Sensation", year: "1940年代", href: "/fruits/mango/cultivars/sensation", tone: "parent" },
    child: { label: "リリー", year: "年代未確認", href: "/fruits/mango/cultivars/lily" }
  },
  {
    theme: "hawaii",
    group: "ハワイ系",
    parentA: { label: "アーウィン", year: "1949年選抜", href: "/fruits/mango/cultivars/irwin", tone: "child" },
    parentB: { label: "Kent", year: "1930年代", tone: "ancestor" },
    child: { label: "ラポザ", year: "1990年代", href: "/fruits/mango/cultivars/rapoza" }
  },
  {
    theme: "latin",
    group: "中南米系",
    parentA: { label: "Haden", year: "1910年頃", tone: "ancestor" },
    parentB: { label: "Kent", year: "1930年代", tone: "ancestor" },
    child: { label: "マンザニーロ", year: "年代未確認", href: "/fruits/mango/cultivars/manzanillo" }
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
          SSRマーカー解析では，JIRCASで保存されているマンゴー遺伝資源の親子関係が推定され，Hadenを祖先にもつフロリダ系品種が多いことが示されています．
        </p>
      </div>

      <div className="rounded-lg bg-gradient-to-br from-leaf-50 via-white to-fruit-50 p-3 ring-1 ring-leaf-100">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-leaf-900 px-3 py-1 text-xs font-bold text-white">親子関係マップ</span>
          <LegendChip tone="ancestor" label="祖先・重要親" />
          <LegendChip tone="parent" label="親" />
          <LegendChip tone="child" label="子品種" />
        </div>

        <div className="grid gap-3">
          {families.map((family) => (
            <PedigreeFamily key={`${family.child.label}-${family.parentA.label}-${family.parentB.label}`} family={family} />
          ))}
        </div>
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

type PedigreeFamilyData = {
  theme: "florida" | "australia" | "israel" | "hawaii" | "latin";
  group: string;
  parentA: PedigreeNodeData;
  parentB: PedigreeNodeData;
  child: PedigreeNodeData;
};

type PedigreeNodeData = {
  label: string;
  year: string;
  href?: string;
  tone?: "ancestor" | "parent" | "child";
};

function PedigreeFamily({ family }: { family: PedigreeFamilyData }) {
  const theme = themeStyles(family.theme);

  return (
    <article className="relative overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-leaf-100">
      <div className={`absolute inset-y-0 left-0 w-1.5 ${theme.rail}`} />
      <div className="grid gap-3 p-3 sm:grid-cols-[1fr_auto_1.1fr] sm:items-center sm:p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${theme.badge}`}>{family.group}</span>
            <span className="text-xs font-semibold text-leaf-900/54">親品種</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <PedigreeNode node={family.parentA} fallbackTone="parent" />
            <PedigreeNode node={family.parentB} fallbackTone="parent" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 sm:block">
          <div className={`grid h-11 w-11 place-items-center rounded-full text-lg font-black text-white shadow-sm ${theme.circle}`}>
            ×
          </div>
          <div className="h-px flex-1 bg-leaf-200 sm:mt-2 sm:h-10 sm:w-px sm:flex-none sm:bg-leaf-200" />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-leaf-900/54">子品種</span>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${theme.badge}`}>推定親子</span>
          </div>
          <PedigreeNode node={family.child} fallbackTone="child" featured />
        </div>
      </div>
    </article>
  );
}

function PedigreeNode({
  node,
  fallbackTone,
  featured = false
}: {
  node: PedigreeNodeData;
  fallbackTone: "ancestor" | "parent" | "child";
  featured?: boolean;
}) {
  const tone = node.tone ?? fallbackTone;
  const content = (
    <div
      className={[
        "min-h-[68px] rounded-md border p-3 transition",
        featured ? "border-leaf-200 bg-white shadow-[0_8px_20px_rgba(23,65,42,0.08)]" : toneClass(tone),
        node.href ? "hover:-translate-y-0.5 hover:border-leaf-300 hover:shadow-md" : ""
      ].join(" ")}
    >
      <div className="text-base font-bold leading-tight text-leaf-900">{node.label}</div>
      <div className="mt-1 text-xs font-semibold text-leaf-900/60">{node.year}</div>
    </div>
  );

  if (!node.href) return content;
  return (
    <Link href={node.href} className="block">
      {content}
    </Link>
  );
}

function LegendChip({ tone, label }: { tone: "ancestor" | "parent" | "child"; label: string }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold text-leaf-900/70 ${toneClass(tone)}`}>{label}</span>
  );
}

function toneClass(tone: "ancestor" | "parent" | "child") {
  if (tone === "ancestor") return "border-amber-200 bg-amber-100/80";
  if (tone === "parent") return "border-leaf-200 bg-leaf-100/80";
  return "border-leaf-200 bg-white";
}

function themeStyles(theme: PedigreeFamilyData["theme"]) {
  const styles = {
    florida: {
      rail: "bg-rose-400",
      badge: "bg-rose-100 text-rose-900",
      circle: "bg-rose-500"
    },
    australia: {
      rail: "bg-amber-400",
      badge: "bg-amber-100 text-amber-900",
      circle: "bg-amber-500"
    },
    israel: {
      rail: "bg-violet-400",
      badge: "bg-violet-100 text-violet-900",
      circle: "bg-violet-500"
    },
    hawaii: {
      rail: "bg-sky-400",
      badge: "bg-sky-100 text-sky-900",
      circle: "bg-sky-500"
    },
    latin: {
      rail: "bg-emerald-400",
      badge: "bg-emerald-100 text-emerald-900",
      circle: "bg-emerald-500"
    }
  };

  return styles[theme];
}
