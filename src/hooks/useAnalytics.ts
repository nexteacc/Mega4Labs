"use client";

import { useCallback } from "react";

type AnalyticsEvent = "video_play" | "cta_click" | "language_switch";

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

export const useAnalytics = () => {
  const track = useCallback(
    (event: AnalyticsEvent, payload: AnalyticsPayload = {}) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[analytics] ${event}`, payload);
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(`analytics:${event}`, {
            detail: { ...payload, event },
          }),
        );
      }
    },
    [],
  );

  return { track };
};