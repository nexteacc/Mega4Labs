import type { Locale } from "@/lib/i18n";

const LOCALE_MAP: Record<Locale, string> = {
  en: "en-US",
  ko: "ko-KR",
  ja: "ja-JP",
  zh: "zh-CN",
};

const padNumber = (value: number) => value.toString().padStart(2, "0");

const parseIsoDurationToSeconds = (isoDuration: string): number | null => {
  const pattern = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/;
  const match = pattern.exec(isoDuration);
  if (!match) {
    return null;
  }

  const [, days, hours, minutes, seconds] = match;
  const totalSeconds =
    (Number(days ?? 0) * 24 * 3600) +
    (Number(hours ?? 0) * 3600) +
    (Number(minutes ?? 0) * 60) +
    Number(seconds ?? 0);

  return Number.isFinite(totalSeconds) ? totalSeconds : null;
};

export const formatDuration = (isoDuration: string): string => {
  const totalSeconds = parseIsoDurationToSeconds(isoDuration);
  if (totalSeconds === null || totalSeconds <= 0) {
    return "--:--";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.round(remainingSeconds % 60);

  if (hours > 0) {
    return `${hours}:${padNumber(minutes)}:${padNumber(seconds)}`;
  }

  return `${padNumber(minutes)}:${padNumber(seconds)}`;
};

export const formatPublishDate = (isoDate: string, locale: Locale): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  const resolvedLocale = LOCALE_MAP[locale] ?? "en-US";
  try {
    return new Intl.DateTimeFormat(resolvedLocale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return date.toISOString().split("T")[0] ?? isoDate;
  }
};

export const formatEmbedUrl = (videoId: string): string =>
  `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?enablejsapi=1&rel=0`;

export const formatVideoUrl = (videoId: string): string =>
  `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
