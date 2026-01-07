"use client";

import { useCallback } from "react";

type AnalyticsEvent =
  | "video_play"
  | "video_click"
  | "cta_click"
  | "language_switch"
  | "social_click"
  | "external_link_click"
  | "faq_expand"
  | "navigation_click"
  | "share_click";

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

// 扩展 Window 类型以支持 Google Analytics
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const useAnalytics = () => {
  const track = useCallback(
    (event: AnalyticsEvent, payload: AnalyticsPayload = {}) => {
      // 开发环境：输出到控制台
      if (process.env.NODE_ENV !== "production") {
        console.log(`[analytics] ${event}`, payload);
      }

      // 生产环境：发送到 Google Analytics 4
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", event, payload);
      }

      // 自定义事件：用于内部监听
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