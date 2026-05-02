// ==========================================
// CONSTANTS & CONFIG
// ==========================================

export interface Dimensions {
  width: number;
  height: number;
}

export const DEFAULTS = {
  theme: "dark" as "dark" | "light",
  mode: "lyrics" as "lyrics" | "player",
  preset: "apple" as string,
  format: "9:16" as "1:1" | "3:4" | "9:16",
  cardScale: 0.8,
  textAlign: "left" as "left" | "center" | "right",
};

export const FORMAT_DIMENSIONS: Record<string, Dimensions> = {
  "1:1": { width: 1080, height: 1080 },
  "3:4": { width: 1080, height: 1440 },
  "9:16": { width: 1080, height: 1920 },
};

export const SHOW_VIDEO_FEATURES = false;

