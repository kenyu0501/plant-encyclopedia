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
