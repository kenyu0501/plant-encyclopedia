"use client";

import type { User } from "@supabase/supabase-js";
import {
  Bug,
  CalendarDays,
  Camera,
  CheckCircle2,
  Droplets,
  Flower2,
  Leaf,
  Mail,
  PencilLine,
  Plus,
  Scissors,
  Sprout,
  Trash2,
  Upload,
  Wheat
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { compressImageForUpload, formatBytes } from "@/lib/image-compress";
import type { PublicFruitOption } from "@/lib/queries";
import { createClient } from "@/lib/supabase-browser";
import type {
  CultivationEventType,
  CultivationLog,
  CultivationMethod,
  UserPlant
} from "@/types/database";

type Message = {
  tone: "success" | "error" | "info";
  text: string;
};

const eventOptions: {
  value: CultivationEventType;
  label: string;
}[] = [
  { value: "observation", label: "観察" },
  { value: "planting", label: "植付け" },
  { value: "repotting", label: "植替え" },
  { value: "flowering", label: "開花" },
  { value: "fruiting", label: "結実" },
  { value: "fertilizing", label: "施肥" },
  { value: "pruning", label: "剪定" },
  { value: "watering", label: "水やり" },
  { value: "pest", label: "病害虫" },
  { value: "harvest", label: "収穫" },
  { value: "other", label: "その他" }
];

const methodLabels: Record<CultivationMethod, string> = {
  pot: "鉢植え",
  ground: "地植え",
  other: "その他"
};

export function CultivationJournal({
  fruits,
  initialUser
}: {
  fruits: PublicFruitOption[];
  initialUser: User | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCultivarId = searchParams.get("cultivar_id");
  const requestedFruit = fruits.find((fruit) =>
    fruit.cultivars.some((cultivar) => cultivar.id === requestedCultivarId)
  );
  const [user, setUser] = useState<User | null>(initialUser);
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [logs, setLogs] = useState<CultivationLog[]>([]);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [selectedPlantId, setSelectedPlantId] = useState("");
  const [loading, setLoading] = useState(Boolean(initialUser));
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [email, setEmail] = useState("");

  const [fruitId, setFruitId] = useState(requestedFruit?.id ?? fruits[0]?.id ?? "");
  const selectedFruit = fruits.find((fruit) => fruit.id === fruitId);
  const availableCultivars = useMemo(() => selectedFruit?.cultivars ?? [], [selectedFruit]);
  const [cultivarId, setCultivarId] = useState(
    requestedCultivarId && availableCultivars.some((cultivar) => cultivar.id === requestedCultivarId)
      ? requestedCultivarId
      : availableCultivars[0]?.id ?? ""
  );
  const [nickname, setNickname] = useState("");
  const [plantedAt, setPlantedAt] = useState("");
  const [method, setMethod] = useState<CultivationMethod>("pot");
  const [potSize, setPotSize] = useState("");
  const [region, setRegion] = useState("");
  const [plantNotes, setPlantNotes] = useState("");

  const [eventType, setEventType] = useState<CultivationEventType>("observation");
  const [occurredAt, setOccurredAt] = useState(todayDateInput());
  const [logTitle, setLogTitle] = useState("");
  const [logNotes, setLogNotes] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoInputKey, setPhotoInputKey] = useState(0);

  const loadJournal = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setLoadError(null);
    const supabase = createClient();
    const [plantsResult, logsResult] = await Promise.all([
      supabase.from("user_plants").select("*").order("updated_at", { ascending: false }),
      supabase
        .from("cultivation_logs")
        .select("*")
        .order("occurred_at", { ascending: false })
        .order("created_at", { ascending: false })
    ]);

    if (plantsResult.error || logsResult.error) {
      setLoadError(
        plantsResult.error?.message ??
          logsResult.error?.message ??
          "栽培記録を読み込めませんでした。"
      );
      setLoading(false);
      return;
    }

    const nextPlants = plantsResult.data ?? [];
    const nextLogs = logsResult.data ?? [];
    setPlants(nextPlants);
    setLogs(nextLogs);
    setSelectedPlantId((current) =>
      nextPlants.some((plant) => plant.id === current) ? current : nextPlants[0]?.id ?? ""
    );

    const paths = nextLogs
      .map((log) => log.photo_path)
      .filter((path): path is string => Boolean(path));
    if (paths.length > 0) {
      const signedEntries = await Promise.all(
        paths.map(async (path) => {
          const { data } = await supabase.storage
            .from("cultivation-records")
            .createSignedUrl(path, 60 * 60);
          return [path, data?.signedUrl ?? ""] as const;
        })
      );
      setPhotoUrls(Object.fromEntries(signedEntries.filter(([, url]) => Boolean(url))));
    } else {
      setPhotoUrls({});
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void loadJournal();
  }, [loadJournal]);

  useEffect(() => {
    const nextCultivars = fruits.find((fruit) => fruit.id === fruitId)?.cultivars ?? [];
    if (!nextCultivars.some((cultivar) => cultivar.id === cultivarId)) {
      setCultivarId(nextCultivars[0]?.id ?? "");
    }
  }, [cultivarId, fruitId, fruits]);

  const selectedPlant = plants.find((plant) => plant.id === selectedPlantId) ?? null;
  const selectedLogs = logs.filter((log) => log.plant_id === selectedPlantId);

  async function sendMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setSaving(true);
    setMessage({ tone: "info", text: "確認メールを送信しています。" });
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/garden`
      }
    });
    setSaving(false);
    if (error) {
      setMessage({ tone: "error", text: `メール送信に失敗しました: ${error.message}` });
      return;
    }
    setMessage({
      tone: "success",
      text: "確認メールを送信しました。メール内のリンクから栽培記録へ戻れます。"
    });
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setPlants([]);
    setLogs([]);
    router.refresh();
  }

  async function addPlant(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !cultivarId || !nickname.trim()) return;
    setSaving(true);
    setMessage({ tone: "info", text: "所有株を登録しています。" });
    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_plants")
      .insert({
        user_id: user.id,
        cultivar_id: cultivarId,
        nickname: nickname.trim(),
        planted_at: plantedAt || null,
        cultivation_method: method,
        pot_size: method === "pot" ? potSize.trim() || null : null,
        region: region.trim() || null,
        notes: plantNotes.trim() || null
      })
      .select()
      .single();
    setSaving(false);
    if (error) {
      setMessage({ tone: "error", text: databaseErrorMessage(error.message) });
      return;
    }

    setNickname("");
    setPlantedAt("");
    setPotSize("");
    setPlantNotes("");
    setMessage({ tone: "success", text: "所有株を登録しました。" });
    await loadJournal();
    if (data) setSelectedPlantId(data.id);
  }

  async function addLog(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !selectedPlant) return;
    setSaving(true);
    setMessage({ tone: "info", text: photo ? "写真を準備しています。" : "記録を保存しています。" });
    const supabase = createClient();
    let photoPath: string | null = null;

    if (photo) {
      try {
        const compressed = await compressImageForUpload(photo);
        photoPath = `${user.id}/${selectedPlant.id}/${crypto.randomUUID()}.jpg`;
        setMessage({
          tone: "info",
          text: `写真を圧縮して保存しています（${formatBytes(photo.size)} → ${formatBytes(compressed.compressedBytes)}）。`
        });
        const { error } = await supabase.storage
          .from("cultivation-records")
          .upload(photoPath, compressed.file, { cacheControl: "3600", upsert: false });
        if (error) throw error;
      } catch (error) {
        setSaving(false);
        setMessage({
          tone: "error",
          text: error instanceof Error ? error.message : "写真の保存に失敗しました。"
        });
        return;
      }
    }

    const { error } = await supabase.from("cultivation_logs").insert({
      user_id: user.id,
      plant_id: selectedPlant.id,
      event_type: eventType,
      occurred_at: occurredAt,
      title: logTitle.trim() || null,
      notes: logNotes.trim() || null,
      photo_path: photoPath
    });

    if (error) {
      if (photoPath) {
        await supabase.storage.from("cultivation-records").remove([photoPath]);
      }
      setSaving(false);
      setMessage({ tone: "error", text: databaseErrorMessage(error.message) });
      return;
    }

    setLogTitle("");
    setLogNotes("");
    setPhoto(null);
    setPhotoInputKey((current) => current + 1);
    setSaving(false);
    setMessage({ tone: "success", text: "栽培記録を追加しました。" });
    await loadJournal();
  }

  async function deleteLog(log: CultivationLog) {
    if (!window.confirm("この栽培記録を削除しますか？")) return;
    const supabase = createClient();
    const { error } = await supabase.from("cultivation_logs").delete().eq("id", log.id);
    if (error) {
      setMessage({ tone: "error", text: `記録を削除できませんでした: ${error.message}` });
      return;
    }
    if (log.photo_path) {
      await supabase.storage.from("cultivation-records").remove([log.photo_path]);
    }
    setMessage({ tone: "success", text: "栽培記録を削除しました。" });
    await loadJournal();
  }

  async function deletePlant(plant: UserPlant) {
    if (!window.confirm(`「${plant.nickname}」と、すべての栽培記録を削除しますか？`)) return;
    const supabase = createClient();
    const plantLogs = logs.filter((log) => log.plant_id === plant.id);
    const photoPaths = plantLogs
      .map((log) => log.photo_path)
      .filter((path): path is string => Boolean(path));
    const { error } = await supabase.from("user_plants").delete().eq("id", plant.id);
    if (error) {
      setMessage({ tone: "error", text: `所有株を削除できませんでした: ${error.message}` });
      return;
    }
    if (photoPaths.length > 0) {
      await supabase.storage.from("cultivation-records").remove(photoPaths);
    }
    setMessage({ tone: "success", text: "所有株と栽培記録を削除しました。" });
    await loadJournal();
  }

  if (!user) {
    return (
      <section className="space-y-4 rounded-lg bg-white/86 p-5 ring-1 ring-leaf-100">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-leaf-100 p-3 text-leaf-800">
            <Sprout size={23} />
          </div>
          <div>
            <h2 className="font-bold text-leaf-900">栽培記録にはログインが必要です</h2>
            <p className="mt-1 text-sm leading-6 text-leaf-900/68">
              記録は非公開で保存され、ご本人だけが閲覧・編集できます。
            </p>
          </div>
        </div>
        <form onSubmit={sendMagicLink} className="space-y-3 rounded-md bg-leaf-50 p-4">
          <label className="block">
            <span className="text-sm font-semibold text-leaf-900">メールアドレス</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClassName}
            />
          </label>
          <button type="submit" disabled={saving} className={secondaryButtonClassName}>
            <Mail size={17} />
            確認メールを送る
          </button>
        </form>
        {message ? <MessageBox message={message} /> : null}
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="flex items-center justify-between gap-3 rounded-lg bg-white/84 p-4 ring-1 ring-leaf-100">
        <div className="min-w-0 text-sm">
          <span className="block font-bold text-leaf-900">ログイン中</span>
          <span className="block truncate text-leaf-900/58">{user.email ?? user.id}</span>
        </div>
        <button type="button" onClick={signOut} className="shrink-0 text-sm font-semibold text-leaf-700">
          ログアウト
        </button>
      </section>

      {message ? <MessageBox message={message} /> : null}

      {loadError ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <p className="font-bold">栽培記録の準備が必要です</p>
          <p className="mt-1">
            Supabaseで栽培記録用SQLを実行した後、ページを再読み込みしてください。
          </p>
          <p className="mt-2 break-all text-xs text-amber-900/64">{loadError}</p>
        </section>
      ) : null}

      <details className="rounded-lg bg-white/84 ring-1 ring-leaf-100" open={plants.length === 0}>
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-4 py-3 font-bold text-leaf-900 [&::-webkit-details-marker]:hidden">
          <Plus size={18} />
          所有株を登録
        </summary>
        <form onSubmit={addPlant} className="space-y-4 border-t border-leaf-100 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="果樹">
              <select
                required
                value={fruitId}
                onChange={(event) => setFruitId(event.target.value)}
                className={inputClassName}
              >
                {fruits.map((fruit) => (
                  <option key={fruit.id} value={fruit.id}>
                    {fruit.name_ja}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="品種">
              <select
                required
                value={cultivarId}
                onChange={(event) => setCultivarId(event.target.value)}
                className={inputClassName}
              >
                {availableCultivars.map((cultivar) => (
                  <option key={cultivar.id} value={cultivar.id}>
                    {cultivar.name_ja}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="株の名前" hint="例：庭のアーウィン1号">
            <input
              required
              maxLength={80}
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              className={inputClassName}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="植付日・購入日">
              <input
                type="date"
                value={plantedAt}
                onChange={(event) => setPlantedAt(event.target.value)}
                className={inputClassName}
              />
            </Field>
            <Field label="栽培方法">
              <select
                value={method}
                onChange={(event) => setMethod(event.target.value as CultivationMethod)}
                className={inputClassName}
              >
                <option value="pot">鉢植え</option>
                <option value="ground">地植え</option>
                <option value="other">その他</option>
              </select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {method === "pot" ? (
              <Field label="鉢サイズ" hint="例：10号鉢">
                <input
                  maxLength={40}
                  value={potSize}
                  onChange={(event) => setPotSize(event.target.value)}
                  className={inputClassName}
                />
              </Field>
            ) : null}
            <Field label="大まかな栽培地域" hint="例：沖縄本島南部">
              <input
                maxLength={80}
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className={inputClassName}
              />
            </Field>
          </div>
          <Field label="株についてのメモ">
            <textarea
              maxLength={1000}
              rows={3}
              value={plantNotes}
              onChange={(event) => setPlantNotes(event.target.value)}
              className={inputClassName}
            />
          </Field>
          <button type="submit" disabled={saving || !cultivarId} className={primaryButtonClassName}>
            <Sprout size={17} />
            所有株を登録
          </button>
        </form>
      </details>

      {loading ? (
        <div className="rounded-lg bg-white/84 p-5 text-sm text-leaf-900/56 ring-1 ring-leaf-100">
          栽培記録を読み込んでいます。
        </div>
      ) : plants.length > 0 ? (
        <>
          <section className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-leaf-900">育てている株</h2>
                <p className="mt-1 text-xs text-leaf-900/52">{plants.length}株を登録中</p>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {plants.map((plant) => {
                const cultivar = findCultivar(fruits, plant.cultivar_id);
                return (
                  <button
                    key={plant.id}
                    type="button"
                    onClick={() => setSelectedPlantId(plant.id)}
                    className={[
                      "w-48 shrink-0 rounded-lg p-4 text-left transition",
                      selectedPlantId === plant.id
                        ? "bg-leaf-700 text-white shadow-sm"
                        : "bg-white/84 text-leaf-900 ring-1 ring-leaf-100"
                    ].join(" ")}
                  >
                    <span className="block truncate font-bold">{plant.nickname}</span>
                    <span
                      className={[
                        "mt-1 block truncate text-xs font-semibold",
                        selectedPlantId === plant.id ? "text-white/72" : "text-leaf-900/52"
                      ].join(" ")}
                    >
                      {cultivar?.fruitName ?? "果樹"} / {cultivar?.cultivarName ?? "品種"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {selectedPlant ? (
            <>
              <PlantSummary
                plant={selectedPlant}
                cultivar={findCultivar(fruits, selectedPlant.cultivar_id)}
                onDelete={() => void deletePlant(selectedPlant)}
              />

              <section className="rounded-lg bg-white/84 p-5 ring-1 ring-leaf-100">
                <h2 className="flex items-center gap-2 font-bold text-leaf-900">
                  <PencilLine size={18} />
                  記録を追加
                </h2>
                <form onSubmit={addLog} className="mt-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="記録の種類">
                      <select
                        value={eventType}
                        onChange={(event) => setEventType(event.target.value as CultivationEventType)}
                        className={inputClassName}
                      >
                        {eventOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="日付">
                      <input
                        type="date"
                        required
                        value={occurredAt}
                        onChange={(event) => setOccurredAt(event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                  </div>
                  <Field label="見出し" hint="例：今年最初の開花">
                    <input
                      maxLength={100}
                      value={logTitle}
                      onChange={(event) => setLogTitle(event.target.value)}
                      className={inputClassName}
                    />
                  </Field>
                  <Field label="記録・メモ">
                    <textarea
                      maxLength={2000}
                      rows={4}
                      value={logNotes}
                      onChange={(event) => setLogNotes(event.target.value)}
                      className={inputClassName}
                    />
                  </Field>
                  <Field label="写真（任意）">
                    <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-leaf-300 bg-leaf-50 px-4 text-center">
                      <Camera size={21} className="text-leaf-700" />
                      <span className="mt-2 text-sm font-semibold text-leaf-900">
                        {photo ? photo.name : "写真を選択"}
                      </span>
                      <input
                        key={photoInputKey}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
                        className="sr-only"
                      />
                    </label>
                  </Field>
                  <button type="submit" disabled={saving} className={primaryButtonClassName}>
                    <Upload size={17} />
                    記録を保存
                  </button>
                </form>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-leaf-900">
                    <CalendarDays size={19} />
                    栽培タイムライン
                  </h2>
                  <span className="text-xs font-semibold text-leaf-900/52">{selectedLogs.length}件</span>
                </div>
                {selectedLogs.length > 0 ? (
                  <div className="space-y-3">
                    {selectedLogs.map((log) => (
                      <LogCard
                        key={log.id}
                        log={log}
                        photoUrl={log.photo_path ? photoUrls[log.photo_path] : undefined}
                        onDelete={() => void deleteLog(log)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-leaf-200 bg-white/70 p-6 text-center text-sm text-leaf-900/58">
                    まだ記録はありません。今日の様子から残してみましょう。
                  </div>
                )}
              </section>
            </>
          ) : null}
        </>
      ) : !loadError ? (
        <section className="rounded-lg border border-dashed border-leaf-200 bg-white/72 p-7 text-center">
          <Sprout className="mx-auto text-leaf-600" size={34} />
          <h2 className="mt-4 font-bold text-leaf-900">最初の所有株を登録しましょう</h2>
          <p className="mt-2 text-sm leading-6 text-leaf-900/58">
            上の「所有株を登録」から、育てている品種と株の名前を登録できます。
          </p>
        </section>
      ) : null}
    </div>
  );
}

function PlantSummary({
  plant,
  cultivar,
  onDelete
}: {
  plant: UserPlant;
  cultivar: ReturnType<typeof findCultivar>;
  onDelete: () => void;
}) {
  return (
    <section className="rounded-lg bg-leaf-800 p-5 text-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-white/64">{cultivar?.fruitName ?? "登録品種"}</p>
          <h2 className="mt-1 text-xl font-bold">{plant.nickname}</h2>
          <p className="mt-1 text-sm text-white/72">{cultivar?.cultivarName ?? "品種情報なし"}</p>
        </div>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`${plant.nickname}を削除`}
          className="flex h-10 w-10 items-center justify-center rounded-md text-white/64 hover:bg-white/10 hover:text-white"
        >
          <Trash2 size={17} />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-white/12 px-3 py-1.5">{methodLabels[plant.cultivation_method]}</span>
        {plant.pot_size ? <span className="rounded-full bg-white/12 px-3 py-1.5">{plant.pot_size}</span> : null}
        {plant.planted_at ? (
          <span className="rounded-full bg-white/12 px-3 py-1.5">{formatJapaneseDate(plant.planted_at)}から</span>
        ) : null}
        {plant.region ? <span className="rounded-full bg-white/12 px-3 py-1.5">{plant.region}</span> : null}
      </div>
      {plant.notes ? <p className="mt-4 text-sm leading-6 text-white/76">{plant.notes}</p> : null}
    </section>
  );
}

function LogCard({
  log,
  photoUrl,
  onDelete
}: {
  log: CultivationLog;
  photoUrl?: string;
  onDelete: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-lg bg-white/84 ring-1 ring-leaf-100">
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt={log.title ?? getEventLabel(log.event_type)} className="aspect-[4/3] w-full object-cover" />
      ) : null}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-700">
              <EventIcon type={log.event_type} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-leaf-700">{getEventLabel(log.event_type)}</p>
              <h3 className="mt-1 font-bold text-leaf-900">{log.title ?? getEventLabel(log.event_type)}</h3>
              <p className="mt-1 text-xs font-semibold text-leaf-900/48">{formatJapaneseDate(log.occurred_at)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onDelete}
            aria-label="この栽培記録を削除"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-leaf-900/38 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 size={16} />
          </button>
        </div>
        {log.notes ? <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-leaf-900/72">{log.notes}</p> : null}
      </div>
    </article>
  );
}

function EventIcon({ type }: { type: CultivationEventType }) {
  if (type === "flowering") return <Flower2 size={18} />;
  if (type === "fruiting" || type === "harvest") return <Wheat size={18} />;
  if (type === "fertilizing" || type === "planting" || type === "repotting") return <Sprout size={18} />;
  if (type === "pruning") return <Scissors size={18} />;
  if (type === "watering") return <Droplets size={18} />;
  if (type === "pest") return <Bug size={18} />;
  return <Leaf size={18} />;
}

function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-leaf-900">{label}</span>
      {hint ? <span className="ml-2 text-xs text-leaf-900/46">{hint}</span> : null}
      {children}
    </label>
  );
}

function MessageBox({ message }: { message: Message }) {
  const classes =
    message.tone === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : message.tone === "success"
        ? "border-leaf-200 bg-leaf-50 text-leaf-800"
        : "border-fruit-200 bg-fruit-50 text-leaf-800";
  return (
    <div className={`flex items-start gap-2 rounded-md border p-3 text-sm leading-6 ${classes}`} role="status">
      {message.tone === "success" ? <CheckCircle2 className="mt-0.5 shrink-0" size={17} /> : null}
      <span>{message.text}</span>
    </div>
  );
}

function getEventLabel(type: CultivationEventType) {
  return eventOptions.find((option) => option.value === type)?.label ?? type;
}

function findCultivar(fruits: PublicFruitOption[], cultivarId: string | null) {
  if (!cultivarId) return null;
  for (const fruit of fruits) {
    const cultivar = fruit.cultivars.find((item) => item.id === cultivarId);
    if (cultivar) {
      return {
        fruitName: fruit.name_ja,
        fruitSlug: fruit.slug,
        cultivarName: cultivar.name_ja,
        cultivarSlug: cultivar.slug
      };
    }
  }
  return null;
}

function todayDateInput() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatJapaneseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return `${year}年${month}月${day}日`;
}

function databaseErrorMessage(message: string) {
  if (/user_plants|cultivation_logs|schema cache|relation .* does not exist/i.test(message)) {
    return "栽培記録用のSupabase SQLを先に実行してください。";
  }
  return `保存に失敗しました: ${message}`;
}

const inputClassName =
  "mt-2 min-h-11 w-full rounded-md border border-leaf-200 bg-white px-3 py-2 text-base text-leaf-900 outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200";

const primaryButtonClassName =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-60";

const secondaryButtonClassName =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-leaf-200 bg-white px-4 py-3 text-sm font-bold text-leaf-800 disabled:opacity-60";
