import { Instagram, Youtube } from "lucide-react";
import Image from "next/image";

const socialLinks = [
  {
    href: "https://www.youtube.com/@avocado_japan",
    label: "YouTube",
    account: "@avocado_japan",
    icon: Youtube,
    className: "bg-red-600 text-white hover:bg-red-700"
  },
  {
    href: "https://x.com/kenyu0501_",
    label: "X",
    account: "@kenyu0501_",
    icon: null,
    className: "bg-neutral-950 text-white hover:bg-neutral-800"
  },
  {
    href: "https://www.instagram.com/kenyu.uehara/",
    label: "Instagram",
    account: "@kenyu.uehara",
    icon: Instagram,
    className:
      "bg-gradient-to-r from-fuchsia-600 via-rose-500 to-orange-500 text-white hover:opacity-90"
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
            こんにちは，けんゆーです！
          </h2>
          <p className="mt-3 leading-7 text-leaf-900/72">
            沖縄県糸満市で，アボカド，マンゴー，バナナなどの熱帯果樹を育てています．
            実際の栽培経験と文献を行き来しながら，品種選びや栽培の現場で役立つ情報を，
            少しずつこの図鑑にまとめています．
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5" aria-label="図鑑製作者のSNS">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-bold shadow-sm transition ${item.className}`}
                >
                  {Icon ? (
                    <Icon size={18} aria-hidden="true" />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-[18px] w-[18px] items-center justify-center text-base font-black"
                    >
                      X
                    </span>
                  )}
                  <span>{item.label}</span>
                  <span className="text-xs font-semibold opacity-75">{item.account}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
