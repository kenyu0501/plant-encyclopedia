import fs from "node:fs";

const dbCsvPath = "/private/tmp/mango-data20170214.csv";
const qualityCsvPath = "/private/tmp/mango-quality-characteristic20170522.csv";
const catalogueHtmlPath = "/private/tmp/jircas-catalogue.html";
const outPath = new URL("../supabase/jircas-mango-cultivars.sql", import.meta.url);
const batchBasePath = new URL("../supabase/", import.meta.url);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function stripHtml(value) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sql(value) {
  if (value === null || value === undefined || value === "") return "null";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function slugify(value, id) {
  const normalized = value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/#/g, " ")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || id.toLowerCase();
}

function sizePhrase(weight) {
  const n = Number(weight);
  if (n >= 800) return "かなり大玉の部類";
  if (n >= 550) return "大玉寄り";
  if (n >= 350) return "中玉";
  return "小ぶり";
}

function sweetnessPhrase(brix) {
  const n = Number(brix);
  if (n >= 20) return "糖度は非常に高い";
  if (n >= 18) return "糖度は高め";
  if (n >= 15) return "糖度は中程度";
  return "甘さは控えめ";
}

function sweetnessComment(brix) {
  const n = Number(brix);
  if (n >= 20) return "糖度が非常に高く";
  if (n >= 18) return "糖度が高めで";
  if (n >= 15) return "糖度は中程度で";
  return "甘さは控えめで";
}

function acidityPhrase(acid) {
  const n = Number(acid);
  if (n >= 0.35) return "酸味は強め";
  if (n >= 0.25) return "酸味はやや強め";
  if (n >= 0.15) return "酸味は中程度";
  return "酸味は穏やか";
}

function acidityComment(acid) {
  const n = Number(acid);
  if (n >= 0.35) return "酸味は強め";
  if (n >= 0.25) return "酸味はやや強め";
  if (n >= 0.15) return "酸味は中程度";
  return "酸味は穏やか";
}

function textureFrom(summary) {
  if (/ゼリー|とろけ|なめらか|舌触り/.test(summary)) return "なめらかで口当たりがよいタイプ";
  if (/繊維が多|繊維も多/.test(summary)) return "繊維をはっきり感じやすい";
  if (/繊維は少|繊維が少/.test(summary)) return "繊維は少なめ";
  if (/硬め|しっかり/.test(summary)) return "ややしっかりした肉質";
  if (/ゴム質/.test(summary)) return "弾力のある肉質";
  if (/粉っぽ|ざらつき/.test(summary)) return "ややざらつきを感じる肉質";
  if (/瑞々|みずみず/.test(summary)) return "みずみずしい肉質";
  return null;
}

function aromaFrom(summary) {
  if (/独特の香り|少しクセ|クセがある/.test(summary)) return "個性的な香り";
  if (/華やか/.test(summary)) return "華やかな香り";
  if (/香りが強|香りも強|強い香り/.test(summary)) return "香りは強め";
  if (/マンゴーらしい香り/.test(summary)) return "マンゴーらしい香り";
  if (/香りはほのか|ほのか/.test(summary)) return "香りは穏やか";
  if (/香りも良い|香りがよ|香りが良/.test(summary)) return "香りが良い";
  return null;
}

function beginnerFrom(summary, brix, acid) {
  if (/くせがなく|食べやすい|バランスが良|好評/.test(summary)) return "食味のまとまりがあり試しやすい";
  if (/クセ|独特|繊維が多|粉っぽ|ざらつき|ゴム質/.test(summary)) return "個性が強く好みが分かれやすい";
  if (Number(brix) >= 17 && Number(acid) <= 0.25) return "甘味主体で受け入れられやすい";
  return null;
}

function difficultyFrom(summary) {
  if (/果肉崩壊|タイミングが難しい/.test(summary)) return "収穫タイミングと品質管理に注意";
  if (/ヤニ/.test(summary)) return "果皮表面のヤニに注意";
  if (/良く実がつく|良く実をつく|比較的良く実/.test(summary)) return "JIRCASで着果性の記録があり観察向き";
  return null;
}

function notableFrom(summary) {
  if (/国産マンゴー/.test(summary)) return "国内でよく知られる代表的な赤色系品種として扱いやすい情報です。";
  if (/ペリカンマンゴー/.test(summary)) return "ペリカンマンゴーとして紹介されることがあります。";
  if (/緑果/.test(summary)) return "完熟果だけでなく未熟果利用の文脈でも比較したい品種です。";
  if (/夏小紅/.test(summary)) return "沖縄では夏小紅の名前でも知られます。";
  if (/てぃらら/.test(summary)) return "沖縄ではてぃららの名前でも知られます。";
  if (/試食会では好評/.test(summary)) return "JIRCASの試食会で評価された記録があります。";
  return null;
}

function kenyuComment({ nameJa, origin, weight, brix, acid, peel, texture, aroma, difficulty, beginner, summary }) {
  const points = [
    `${nameJa}は${origin || "由来未詳"}のマンゴーで、${sizePhrase(weight)}の果実です`,
    `${sweetnessComment(brix)}${acidityComment(acid)}`,
    `果皮色は${peel || "未記載"}`,
    texture ? `肉質は${texture}` : null,
    aroma,
    difficulty,
    beginner,
    notableFrom(summary),
  ]
    .filter(Boolean)
    .map((point) => String(point).replace(/。+$/, ""));

  return points.join("。") + "。";
}

const dbRows = parseCsv(fs.readFileSync(dbCsvPath, "utf8").replace(/^\uFEFF/, ""));
const qualityRows = parseCsv(fs.readFileSync(qualityCsvPath, "utf8").replace(/^\uFEFF/, ""));
const catalogueHtml = fs.readFileSync(catalogueHtmlPath, "utf8");

const qualityById = new Map(
  qualityRows.slice(1).map((row) => {
    const id = stripHtml(row[0]).match(/JTMG-\d+/)?.[0];
    return [id, { nameEn: row[1]?.trim(), nameJa: row[2]?.trim(), origin: row[3]?.trim(), colorGroup: stripHtml(row[4] ?? "") }];
  })
);

const catalogueById = new Map();
for (const match of catalogueHtml.matchAll(/JIRCAS-ID:\s*(JTMG-\d+)[\s\S]*?data-title="([^"]+)"/g)) {
  catalogueById.set(match[1], stripHtml(match[2]));
}

const items = dbRows.slice(1).map((row) => {
  const id = stripHtml(row[0]).match(/JTMG-\d+/)?.[0];
  const quality = qualityById.get(id) ?? {};
  const summary = catalogueById.get(id) ?? "";
  const nameJa = (row[1] ?? quality.nameJa ?? "").normalize("NFKC").replace(/\s+/g, " ").trim();
  const nameEn = (row[2] ?? quality.nameEn ?? "").normalize("NFKC").replace(/\s+/g, " ").trim();
  const brix = String(row[3] ?? "").trim();
  const acid = String(row[5] ?? "").trim();
  const weight = String(row[7] ?? "").trim();
  const days = String(row[9] ?? "").trim();
  const peel = String(row[11] ?? "").trim();
  const origin = (quality.origin ?? summary.split("。")[0] ?? "").replace(/の品種$/, "").trim();
  const slug = nameEn === "Irwin" ? "irwin" : slugify(nameEn, id);

  return {
    id,
    nameJa,
    nameEn,
    slug,
    origin,
    description: `${origin || "由来未詳"}に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースでは${id}として整理されています。`,
    fruitSize: `${weight}g（JIRCAS調査平均）。${sizePhrase(weight)}。`,
    taste: `${sweetnessPhrase(brix)}、${acidityPhrase(acid)}。JIRCAS調査値は糖度${brix}度、酸度${acid}%です。`,
    texture: textureFrom(summary),
    aroma: aromaFrom(summary),
    harvestSeason: `成熟日数の中央値は${days}日（JIRCAS石垣調査）。`,
    difficulty: difficultyFrom(summary),
    okinawaSuitability: "JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。",
    containerSuitability: "鉢栽培調査のデータを含むため、鉢管理での比較候補になります。",
    beginnerSuitability: beginnerFrom(summary, brix, acid),
    kenyuComment: kenyuComment({
      nameJa,
      origin,
      weight,
      brix,
      acid,
      peel: peel || quality.colorGroup,
      texture: textureFrom(summary),
      aroma: aromaFrom(summary),
      difficulty: difficultyFrom(summary),
      beginner: beginnerFrom(summary, brix, acid),
      summary,
    }),
    publicNotes: `出典: JIRCASマンゴー遺伝資源サイト（${id}）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/${id}.pdf`,
  };
});

const columns = [
  "name_ja",
  "name_en",
  "slug",
  "origin",
  "description",
  "fruit_size",
  "taste",
  "texture",
  "aroma",
  "harvest_season",
  "difficulty",
  "okinawa_suitability",
  "container_suitability",
  "beginner_suitability",
  "kenyu_comment",
  "public_notes",
  "is_public",
];

function valuesFor(rows) {
  return rows
  .map((item) => {
    const row = [
      item.nameJa,
      item.nameEn,
      item.slug,
      item.origin,
      item.description,
      item.fruitSize,
      item.taste,
      item.texture,
      item.aroma,
      item.harvestSeason,
      item.difficulty,
      item.okinawaSuitability,
      item.containerSuitability,
      item.beginnerSuitability,
      item.kenyuComment,
      item.publicNotes,
      true,
    ];
    return `  (${row.map((value) => (value === true ? "true" : sql(value))).join(", ")})`;
  })
  .join(",\n");
}

const values = valuesFor(items);

const output = `-- JIRCASマンゴー遺伝資源サイトの公開情報をもとに、図鑑向けに要約したマンゴー62品種データです。
-- 参照日: 2026-05-28
-- 出典:
--   https://www.jircas.go.jp/ja/database/mango/mango-database
--   https://www.jircas.go.jp/ja/database/mango/catalogue
--   https://www.jircas.go.jp/ja/database/mango/quality-characteristic

insert into public.fruits (
  name_ja,
  name_en,
  slug,
  scientific_name,
  family_name,
  origin,
  description,
  cultivation_summary,
  okinawa_suitability,
  is_public
) values (
  'マンゴー',
  'Mango',
  'mango',
  'Mangifera indica',
  'ウルシ科',
  'インド周辺',
  '濃厚な甘みと香りが魅力の代表的な熱帯果樹です。',
  '日当たりと排水を好み、開花期の湿度管理が重要です。',
  '沖縄では品種ごとの開花・着果・病害管理を見ながら導入を検討します。',
  true
) on conflict (slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  scientific_name = excluded.scientific_name,
  family_name = excluded.family_name,
  origin = excluded.origin,
  description = excluded.description,
  cultivation_summary = excluded.cultivation_summary,
  okinawa_suitability = excluded.okinawa_suitability,
  is_public = true,
  updated_at = now();

with mango as (
  select id from public.fruits where slug = 'mango'
),
source (${columns.join(", ")}) as (
  values
${values}
)
insert into public.cultivars (
  fruit_id,
  ${columns.join(",\n  ")}
)
select
  mango.id,
  source.${columns.join(",\n  source.")}
from source
cross join mango
on conflict (fruit_id, slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  origin = excluded.origin,
  description = excluded.description,
  fruit_size = excluded.fruit_size,
  taste = excluded.taste,
  texture = excluded.texture,
  aroma = excluded.aroma,
  harvest_season = excluded.harvest_season,
  difficulty = excluded.difficulty,
  okinawa_suitability = excluded.okinawa_suitability,
  container_suitability = excluded.container_suitability,
  beginner_suitability = excluded.beginner_suitability,
  kenyu_comment = excluded.kenyu_comment,
  public_notes = excluded.public_notes,
  is_public = true,
  updated_at = now();

select
  count(*) as imported_jircas_mango_cultivars
from public.cultivars
join public.fruits on fruits.id = cultivars.fruit_id
where fruits.slug = 'mango'
  and cultivars.public_notes like '%JIRCASマンゴー遺伝資源サイト%';
`;

fs.writeFileSync(outPath, output);

const fruitUpsert = `insert into public.fruits (
  name_ja,
  name_en,
  slug,
  scientific_name,
  family_name,
  origin,
  description,
  cultivation_summary,
  okinawa_suitability,
  is_public
) values (
  'マンゴー',
  'Mango',
  'mango',
  'Mangifera indica',
  'ウルシ科',
  'インド周辺',
  '濃厚な甘みと香りが魅力の代表的な熱帯果樹です。',
  '日当たりと排水を好み、開花期の湿度管理が重要です。',
  '沖縄では品種ごとの開花・着果・病害管理を見ながら導入を検討します。',
  true
) on conflict (slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  scientific_name = excluded.scientific_name,
  family_name = excluded.family_name,
  origin = excluded.origin,
  description = excluded.description,
  cultivation_summary = excluded.cultivation_summary,
  okinawa_suitability = excluded.okinawa_suitability,
  is_public = true,
  updated_at = now();
`;

function insertSql(rows, index, total) {
  return `-- JIRCASマンゴー品種データ ${index}/${total}
-- Supabase SQL Editorで part1 から順番に実行してください。

${index === 1 ? `${fruitUpsert}\n` : ""}with mango as (
  select id from public.fruits where slug = 'mango'
),
source (${columns.join(", ")}) as (
  values
${valuesFor(rows)}
)
insert into public.cultivars (
  fruit_id,
  ${columns.join(",\n  ")}
)
select
  mango.id,
  source.${columns.join(",\n  source.")}
from source
cross join mango
on conflict (fruit_id, slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  origin = excluded.origin,
  description = excluded.description,
  fruit_size = excluded.fruit_size,
  taste = excluded.taste,
  texture = excluded.texture,
  aroma = excluded.aroma,
  harvest_season = excluded.harvest_season,
  difficulty = excluded.difficulty,
  okinawa_suitability = excluded.okinawa_suitability,
  container_suitability = excluded.container_suitability,
  beginner_suitability = excluded.beginner_suitability,
  kenyu_comment = excluded.kenyu_comment,
  public_notes = excluded.public_notes,
  is_public = true,
  updated_at = now();
`;
}

const batchSize = 16;
const batches = [];
for (let start = 0; start < items.length; start += batchSize) {
  batches.push(items.slice(start, start + batchSize));
}

batches.forEach((rows, i) => {
  const file = new URL(`jircas-mango-cultivars-part${i + 1}.sql`, batchBasePath);
  fs.writeFileSync(file, insertSql(rows, i + 1, batches.length));
});

const checkPath = new URL("jircas-mango-cultivars-check.sql", batchBasePath);
fs.writeFileSync(
  checkPath,
  `select
  count(*) as imported_jircas_mango_cultivars
from public.cultivars
join public.fruits on fruits.id = cultivars.fruit_id
where fruits.slug = 'mango'
  and cultivars.public_notes like '%JIRCASマンゴー遺伝資源サイト%';
`
);

console.log(`Wrote ${items.length} cultivars to ${outPath.pathname}`);
console.log(`Wrote ${batches.length} smaller SQL parts to ${batchBasePath.pathname}`);
