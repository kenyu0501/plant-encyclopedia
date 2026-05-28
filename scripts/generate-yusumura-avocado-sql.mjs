import fs from "node:fs";

const htmlPath = "/private/tmp/yusumura-avocado-utf8.html";
const outPath = new URL("../supabase/yusumura-avocado-cultivars.sql", import.meta.url);
const batchBasePath = new URL("../supabase/", import.meta.url);

const englishNames = new Map([
  ["メキシコーラ", "Mexicola"],
  ["スチュワート", "Stewart"],
  ["メキシコーラグランデ", "Mexicola Grande"],
  ["ウィンターメキシカン", "Winter Mexican"],
  ["ベーコン", "Bacon"],
  ["フェルテ", "Fuerte"],
  ["エッティンガー", "Ettinger"],
  ["ピンカートン", "Pinkerton"],
  ["ハス", "Hass"],
  ["ジャンボイス", "Jan Boyce"],
  ["ワーツ", "Wurtz"],
  ["エドラノール", "Edranol"],
  ["グリーンゴールド", "Green Gold"],
  ["シャーウィル", "Sharwil"],
  ["リード", "Reed"],
  ["ニムリオ", "Nimlioh"],
  ["サンミゲル", "San Miguel"],
  ["フジカワ", "Fujikawa"],
  ["ムラシゲ", "Murashige"],
  ["カハルー", "Kahaluu"],
  ["マラマ", "Malama"],
  ["ヤマガタ", "Yamagata"],
  ["ホリデイ", "Holiday"],
  ["シャッタウアー", "Schattauer"],
  ["リンダ", "Linda"],
  ["フルマヌ", "Hulumanu"],
  ["ザムナ", "Zamuna"],
  ["MIT13", "MIT13"],
  ["エガミ1号", "Egami 1"],
  ["エガミ2号", "Egami 2"],
  ["モンロー", "Monroe"],
  ["チョケテ", "Choquette"],
  ["ミゲル", "Miguel"],
  ["カビラミドリ", "Kabira Midori"],
  ["カビラキイロ", "Kabira Kiiro"],
  ["カビラムラサキ", "Kabira Murasaki"],
  ["ロレッタ", "Loretta"],
  ["セルパ", "Serpa"],
  ["ホアンホセ", "Juan Jose"],
  ["ラッセル", "Russell"],
  ["ブース８", "Booth 8"],
  ["プーラビーダ", "Pura Vida"],
  ["ポペーノ", "Popenoe"],
  ["シモンズ", "Simmonds"],
  ["デイリー11", "Daily 11"],
  ["ヘレン", "Helen"],
]);

function stripHtml(value) {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanName(value) {
  return value.replace(/[★☆]/g, "").replace(/\s+/g, " ").trim();
}

function sql(value) {
  if (value === null || value === undefined || value === "") return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function slugify(value) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/８/g, "8")
    .replace(/号/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function monthText(value) {
  return `${value.replace(/ｰ/g, "-")}（露地栽培の目安。ハウスでは1〜2か月早まることがあります）`;
}

function tasteFrom(feature) {
  const parts = [];
  if (/濃厚|油分が多|油分は高い|食味濃厚/.test(feature)) parts.push("濃厚でコクが出やすい");
  if (/ナッツ/.test(feature)) parts.push("ナッツ風味を感じやすい");
  if (/甘み|甘味/.test(feature)) parts.push("甘みを感じやすい");
  if (/風味|香り/.test(feature)) parts.push("香りや風味が良い");
  if (/食味が良い|味が良い|味よく|優れる|美味しい|品質が良く/.test(feature)) parts.push("食味評価が高い");
  if (parts.length === 0) return feature;
  return [...new Set(parts)].join("。") + "。";
}

function textureFrom(feature) {
  if (/クリーミー/.test(feature)) return "クリーミー";
  if (/なめらか|滑らか/.test(feature)) return "なめらか";
  return null;
}

function aromaFrom(feature) {
  if (/ナッツ/.test(feature)) return "ナッツ香";
  if (/香り|風味/.test(feature)) return "香りが良い";
  return null;
}

function treeVigorFrom(feature) {
  if (/半矮性|大きくなりにくい/.test(feature)) return "半矮性でコンパクトに管理しやすい";
  if (/樹勢が良く/.test(feature)) return "樹勢が強い";
  return null;
}

function beginnerFrom(row) {
  if (["ベーコン", "エッティンガー", "フェルテ", "ピンカートン", "ハス", "メキシコーラ", "メキシコーラグランデ", "スチュワート"].includes(row.nameJa)) {
    return "初心者の組み合わせ候補にしやすい品種。A型とB型を混植すると着果が安定しやすい。";
  }
  if (/着果が良い|豊産性|収量が多い/.test(row.feature)) return "着果性の記述があり、実らせる楽しみを狙いやすい。";
  return null;
}

function okinawaFrom(row) {
  const flowering = row.flowering === "A" || row.flowering === "B" ? `${row.flowering}型` : "開花型未確認";
  const cold = row.cold.replace(/℃/g, "度");
  const notes = [`沖縄では耐寒性よりも排水・台風対策・高温多湿期の管理を重視したい品種です`];
  notes.push(`耐寒目安は${cold}、開花型は${flowering}`);
  if (row.harvest.includes("6-8") || row.harvest.includes("8-9") || row.harvest.includes("9")) {
    notes.push("早い時期の収穫候補として比較しやすい");
  }
  if (row.harvest.includes("4-6") || row.harvest.includes("6-8")) {
    notes.push("沖縄ではハウスや気温条件により収穫が早まる可能性があります");
  }
  return notes.join("。") + "。";
}

function difficultyFrom(row) {
  const flowering = row.flowering === "A" || row.flowering === "B" ? `${row.flowering}型` : row.flowering;
  return `耐寒温度: ${row.cold}。開花型: ${flowering}。A型とB型を組み合わせると結実が安定しやすい。`;
}

function descriptionFrom(row) {
  const flowering = row.flowering === "A" || row.flowering === "B" ? `${row.flowering}型` : row.flowering;
  return `${row.nameJa}はアボカドの品種です。耐寒温度の目安は${row.cold}、開花型は${flowering}、収穫時期は${row.harvest}です。特徴: ${row.feature}`;
}

function commentFrom(row) {
  return `${row.nameJa}は果実重${row.weight}、収穫目安${row.harvest}の品種。${row.feature}。沖縄では排水性の高い場所に植え、A型・B型の組み合わせを意識して着果を安定させたいです。`;
}

const html = fs.readFileSync(htmlPath, "utf8");
const rows = [];
for (const tr of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
  const cells = [...tr[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((match) => stripHtml(match[1]));
  if (cells.length !== 6 || cells[0] === "耐寒温度") continue;
  const [cold, rawName, flowering, harvest, weight, feature] = cells;
  const nameJa = cleanName(rawName);
  rows.push({
    cold,
    nameJa,
    nameEn: englishNames.get(nameJa) ?? null,
    slug: slugify(englishNames.get(nameJa) ?? nameJa),
    flowering: flowering.replace(/\s+/g, ""),
    harvest: harvest.replace(/ｰ/g, "-"),
    weight: weight.replace(/ｇ/g, "g"),
    feature,
  });
}

const values = rows
  .map((row) => {
    const record = [
      row.nameJa,
      row.nameEn,
      row.slug,
      null,
      descriptionFrom(row),
      `${row.weight}。耐寒温度目安: ${row.cold}。`,
      tasteFrom(row.feature),
      textureFrom(row.feature),
      aromaFrom(row.feature),
      monthText(row.harvest),
      treeVigorFrom(row.feature),
      difficultyFrom(row),
      okinawaFrom(row),
      /半矮性|大きくなりにくい/.test(row.feature) ? "鉢や小さめの庭でも検討しやすい。" : "鉢栽培では根域制限と水切れに注意。",
      beginnerFrom(row),
      commentFrom(row),
      null,
      true,
    ];
    return `  (${record.map(sql).join(", ")})`;
  })
  .join(",\n");

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
  "tree_vigor",
  "difficulty",
  "okinawa_suitability",
  "container_suitability",
  "beginner_suitability",
  "kenyu_comment",
  "public_notes",
  "is_public",
];

const output = `-- アボカド品種データ
-- Supabase SQL Editorで実行してください。
-- public_notes には出典を入れていません。

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
  'アボカド',
  'Avocado',
  'avocado',
  'Persea americana',
  'クスノキ科',
  '中南米',
  'クリーミーな果肉を食べる常緑果樹です。',
  'A型・B型の開花型、排水、風対策、収穫時期を見ながら品種を組み合わせます。',
  '沖縄では耐寒性よりも排水性、台風対策、高温多湿期の管理が重要です。',
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

with avocado as (
  select id from public.fruits where slug = 'avocado'
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
  avocado.id,
  source.${columns.join(",\n  source.")}
from source
cross join avocado
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
  tree_vigor = excluded.tree_vigor,
  difficulty = excluded.difficulty,
  okinawa_suitability = excluded.okinawa_suitability,
  container_suitability = excluded.container_suitability,
  beginner_suitability = excluded.beginner_suitability,
  kenyu_comment = excluded.kenyu_comment,
  public_notes = excluded.public_notes,
  is_public = true,
  updated_at = now();

select
  count(*) as avocado_cultivar_count
from public.cultivars
join public.fruits on fruits.id = cultivars.fruit_id
where fruits.slug = 'avocado';
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
  'アボカド',
  'Avocado',
  'avocado',
  'Persea americana',
  'クスノキ科',
  '中南米',
  'クリーミーな果肉を食べる常緑果樹です。',
  'A型・B型の開花型、排水、風対策、収穫時期を見ながら品種を組み合わせます。',
  '沖縄では耐寒性よりも排水性、台風対策、高温多湿期の管理が重要です。',
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

function valuesFor(selectedRows) {
  return selectedRows
    .map((row) => {
      const record = [
        row.nameJa,
        row.nameEn,
        row.slug,
        null,
        descriptionFrom(row),
        `${row.weight}。耐寒温度目安: ${row.cold}。`,
        tasteFrom(row.feature),
        textureFrom(row.feature),
        aromaFrom(row.feature),
        monthText(row.harvest),
        treeVigorFrom(row.feature),
        difficultyFrom(row),
        okinawaFrom(row),
        /半矮性|大きくなりにくい/.test(row.feature) ? "鉢や小さめの庭でも検討しやすい。" : "鉢栽培では根域制限と水切れに注意。",
        beginnerFrom(row),
        commentFrom(row),
        null,
        true,
      ];
      return `  (${record.map(sql).join(", ")})`;
    })
    .join(",\n");
}

function batchSql(selectedRows, index, total) {
  return `-- アボカド品種データ ${index}/${total}
-- Supabase SQL Editorで part1 から順番に実行してください。
-- public_notes には出典を入れていません。

${index === 1 ? `${fruitUpsert}\n` : ""}with avocado as (
  select id from public.fruits where slug = 'avocado'
),
source (${columns.join(", ")}) as (
  values
${valuesFor(selectedRows)}
)
insert into public.cultivars (
  fruit_id,
  ${columns.join(",\n  ")}
)
select
  avocado.id,
  source.${columns.join(",\n  source.")}
from source
cross join avocado
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
  tree_vigor = excluded.tree_vigor,
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

const batchSize = 15;
const batches = [];
for (let start = 0; start < rows.length; start += batchSize) {
  batches.push(rows.slice(start, start + batchSize));
}

batches.forEach((batch, i) => {
  const file = new URL(`yusumura-avocado-cultivars-part${i + 1}.sql`, batchBasePath);
  fs.writeFileSync(file, batchSql(batch, i + 1, batches.length));
});

const checkPath = new URL("yusumura-avocado-cultivars-check.sql", batchBasePath);
fs.writeFileSync(
  checkPath,
  `select
  count(*) as avocado_cultivar_count
from public.cultivars
join public.fruits on fruits.id = cultivars.fruit_id
where fruits.slug = 'avocado';
`
);

console.log(`Wrote ${rows.length} avocado cultivars to ${outPath.pathname}`);
console.log(`Wrote ${batches.length} smaller SQL parts to ${batchBasePath.pathname}`);
