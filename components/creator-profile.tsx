import {
  BookOpenText,
  Building2,
  Coffee,
  ExternalLink,
  Instagram,
  PenLine,
  Sprout,
  Users,
  Youtube
} from "lucide-react";
import Image from "next/image";

const socialLinks = [
  {
    href: "https://www.youtube.com/@avocado_japan",
    label: "YouTube",
    account: "@avocado_japan",
    icon: Youtube,
    mark: null,
    className: "bg-red-600 text-white hover:bg-red-700"
  },
  {
    href: "https://x.com/kenyu0501_",
    label: "X",
    account: "@kenyu0501_",
    icon: null,
    mark: "X",
    className: "bg-neutral-950 text-white hover:bg-neutral-800"
  },
  {
    href: "https://www.instagram.com/kenyu.uehara/",
    label: "Instagram",
    account: "@kenyu.uehara",
    icon: Instagram,
    mark: null,
    className:
      "bg-gradient-to-r from-fuchsia-600 via-rose-500 to-orange-500 text-white hover:opacity-90"
  },
  {
    href: "https://www.facebook.com/people/けんゆー/100064303141109/",
    label: "Facebook",
    account: "けんゆー",
    icon: null,
    mark: "f",
    className: "bg-blue-600 text-white hover:bg-blue-700"
  },
  {
    href: "https://okinawan-avocado.com",
    label: "糸満フルーツ園けんちゃん",
    account: "公式Webサイト",
    icon: Sprout,
    mark: null,
    className: "bg-leaf-700 text-white hover:bg-leaf-900"
  },
  {
    href: "https://community.camp-fire.jp/projects/view/241505",
    label: "オンラインサロン",
    account: "CAMPFIRE Community",
    icon: Users,
    mark: null,
    className: "bg-orange-600 text-white hover:bg-orange-700"
  }
];

const activityLinks = [
  {
    href: "https://www.jtfa.info",
    label: "日本熱帯果樹協会",
    role: "理事",
    icon: Building2
  },
  {
    href: "https://sites.google.com/view/okinawacoffeeschool/",
    label: "国産コーヒー栽培実践塾",
    role: "スタッフ",
    icon: Coffee
  },
  {
    href: "https://agri.mynavi.jp/author/ken-yu/",
    label: "マイナビ農業",
    role: "ライター",
    icon: PenLine
  },
  {
    href: null,
    label: "現代農業 過去連載",
    role: "「熱帯果樹のおもしろ生態大百科」",
    icon: BookOpenText
  }
];

export function CreatorProfile() {
  return (
    <section
      aria-labelledby="creator-profile-title"
      className="relative overflow-hidden rounded-xl bg-white/88 p-5 shadow-soft ring-1 ring-leaf-100 sm:p-6"
    >
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-fruit-100/65 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-14 h-44 w-44 rounded-full bg-leaf-100/70 blur-2xl"
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="mx-auto flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-leaf-50 ring-1 ring-leaf-100 sm:mx-0">
          <Image
            src="/mascot/kenchan-mascot-wave.png"
            alt=""
            width={120}
            height={120}
            unoptimized
            className="h-28 w-28 object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-leaf-700">図鑑製作者の自己紹介</p>
          <h2 id="creator-profile-title" className="mt-1 text-2xl font-bold text-leaf-900">
            はじめまして！けんゆーと申します．
          </h2>
          <div className="mt-3 space-y-3 leading-7 text-leaf-900/72">
            <p>
              2児の父です．お酒はやめました．果物を食べて，コーヒーを飲みながら植物を育てたりしています．
              小説を読んだり，お笑いを見るのが好きです．
            </p>
            <p>
              さて，この図鑑は熱帯果樹の品種に特化した図鑑です．果樹には魅力的な品種が数えきれないほど多く，
              色々食べたり育てたりしているので，作りました．
            </p>
            <p>
              現状一人で作っていますが，もちろん限界があるので，皆さんのお力をお貸しください．
              閲覧者の方でも画像を投稿できるようになっています．皆さんの情報が集まれば，
              もっと熱帯果樹分野は楽しくなると信じてます．よろしくね！
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-6 border-t border-leaf-100 pt-6">
        <h3 className="text-xl font-bold text-leaf-900">けんゆーのSNSについて</h3>
        <p className="mt-1 text-sm leading-6 text-leaf-900/60">
          動画や日々の栽培，活動のお知らせはこちらからご覧いただけます．
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2" aria-label="けんゆーのSNSと関連サイト">
          {socialLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex min-h-16 items-center gap-3 rounded-xl px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${item.className}`}
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-xl font-black"
                >
                  {Icon ? <Icon size={21} /> : item.mark}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold leading-5">{item.label}</span>
                  <span className="mt-0.5 block truncate text-xs font-semibold opacity-75">
                    {item.account}
                  </span>
                </span>
                <ExternalLink size={15} aria-hidden="true" className="shrink-0 opacity-60" />
              </a>
            );
          })}
        </div>
      </div>

      <div className="relative mt-6 border-t border-leaf-100 pt-6">
        <h3 className="text-xl font-bold text-leaf-900">苗木屋ねったい</h3>
        <p className="mt-2 leading-7 text-leaf-900/72">果樹・観葉植物の苗木生産してます．</p>
        <a
          href="https://www.youtube.com/@nettai_plants"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-12 items-center gap-3 rounded-xl bg-red-600 px-4 py-3 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md"
        >
          <Youtube size={21} aria-hidden="true" />
          <span>
            <span className="block leading-5">苗木屋ねったい YouTube</span>
            <span className="mt-0.5 block text-xs font-semibold opacity-75">@nettai_plants</span>
          </span>
          <ExternalLink size={15} aria-hidden="true" className="ml-1 opacity-60" />
        </a>
      </div>

      <div className="relative mt-6 border-t border-leaf-100 pt-6">
        <h3 className="text-xl font-bold text-leaf-900">活動・執筆</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {activityLinks.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold leading-5 text-leaf-900">{item.label}</span>
                  <span className="mt-1 block text-sm font-semibold leading-5 text-leaf-900/60">
                    {item.role}
                  </span>
                </span>
                {item.href ? (
                  <ExternalLink
                    size={15}
                    aria-hidden="true"
                    className="shrink-0 text-leaf-900/35"
                  />
                ) : null}
              </>
            );

            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-20 items-center gap-3 rounded-xl bg-white/90 px-4 py-3 ring-1 ring-leaf-100 transition hover:-translate-y-0.5 hover:bg-leaf-50 hover:shadow-sm"
              >
                {content}
              </a>
            ) : (
              <div
                key={item.label}
                className="flex min-h-20 items-center gap-3 rounded-xl bg-white/65 px-4 py-3 ring-1 ring-leaf-100"
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
