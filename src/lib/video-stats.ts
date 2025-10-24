import { readFileSync } from "fs";
import { join } from "path";

type VideoReport = {
  timestamp: string;
  totalVideos: number;
  byCategory: Record<string, number>;
  byLocale: Record<string, number>;
};

/**
 * 从报告文件读取视频总数
 * 如果文件不存在或读取失败，返回默认值 50
 */
export function getVideoCount(): number {
  try {
    const reportPath = join(process.cwd(), "reports", "latest-fetch.json");
    const reportContent = readFileSync(reportPath, "utf-8");
    const report: VideoReport = JSON.parse(reportContent);
    return report.totalVideos || 50;
  } catch (error) {
    console.warn("Failed to read video report, using default count:", error);
    return 50;
  }
}
