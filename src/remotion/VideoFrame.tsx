/**
 * VideoFrame - Pixel-accurate frame renderer for video export.
 *
 * Uses the EXACT same BackgroundWrapper + LyricsWidget structure as the preview,
 * but renders statically for a given frame/fps with frame-based animation math
 * (no GSAP needed since we're capturing static frames).
 *
 * html-to-image cannot render `backdrop-filter`, so card backgrounds use
 * `background-color` + `opacity` instead (looks nearly identical).
 */
import BackgroundWrapper from "@/components/cards/BackgroundWrapper";
import ImageLogo from "@/components/ui/ImageLogo";
import { SkipBack, SkipForward, Heart } from "lucide-react";
import type { Track, SyncedLine } from "@/store/useStore";

export interface VideoFrameProps {
  track: Track | null;
  syncedLyrics: SyncedLine[];
  range: [number, number];
  preset: string;
  coverImage: string | null;
  format: string;
  textAlign: "left" | "center" | "right";
  frame: number;
  fps: number;
  compositionWidth: number;
  compositionHeight: number;
}

export const VideoFrame: React.FC<VideoFrameProps> = ({
  track,
  syncedLyrics,
  range,
  preset,
  coverImage,
  format,
  textAlign,
  frame,
  fps,
  compositionWidth,
  compositionHeight,
}) => {
  const startTime = syncedLyrics[range[0]]?.time || 0;
  const currentTime = startTime + frame / fps;

  // Find active lyric line for current time
  let activeIndex = range[0];
  for (let i = range[0]; i <= range[1]; i++) {
    const line = syncedLyrics[i];
    if (line && line.time <= currentTime) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Per-frame animation: scale + fade + slide-up (ease-out cubic)
  const lineStartTime = syncedLyrics[activeIndex]?.time || 0;
  const timeSinceStart = Math.max(0, currentTime - lineStartTime);
  const animDuration = 0.45;
  const rawProgress = Math.min(1, timeSinceStart / animDuration);
  // Ease-out cubic
  const eased = 1 - Math.pow(1 - rawProgress, 3);

  const animStyle: React.CSSProperties = {
    opacity: eased,
    transform: `scale(${0.88 + 0.12 * eased}) translateY(${(1 - eased) * 28}px)`,
  };

  const lyrics = syncedLyrics.map((l) => l.text);
  const activeLyric = lyrics[activeIndex] || "";

  const alignClass =
    textAlign === "center"
      ? "items-center text-center"
      : textAlign === "right"
        ? "items-end text-right"
        : "items-start text-left";

  const widgetWidth = "w-[940px]";

  const renderContent = () => {
    // ══ APPLE COMPACT ══
    if (preset === "apple-compact") {
      return (
        <div className={`${widgetWidth} font-apple bg-zinc-900/70 rounded-[3.5rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col gap-10 overflow-hidden`}>
          <div className="flex gap-8 items-center">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl shrink-0">
              {coverImage && (
                <img src={coverImage} className="w-full h-full object-cover" crossOrigin="anonymous" />
              )}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <h2 className="text-white text-[2.8rem] font-bold truncate tracking-tight font-apple">
                {track?.title || "Track Title"}
              </h2>
              <p className="text-white/60 text-[1.8rem] font-medium truncate font-apple">
                {track?.artist || "Artist Name"}
              </p>
            </div>
          </div>
          <div className={`flex flex-col gap-5 py-4 ${alignClass}`}>
            <div style={animStyle}>
              <p className="text-white text-[3.8rem] font-bold tracking-tight leading-tight">
                {activeLyric}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <Heart className="w-12 h-12 text-white/40" />
            <div className="flex items-center gap-20">
              <SkipBack className="w-14 h-14 text-white fill-current" />
              <div className="w-16 h-20 bg-white/10 rounded-2xl flex items-center justify-center">
                <div className="w-2.5 h-8 bg-white rounded-full mr-2" />
                <div className="w-2.5 h-8 bg-white rounded-full" />
              </div>
              <SkipForward className="w-14 h-14 text-white fill-current" />
            </div>
            <ImageLogo type="apple" className="w-12 h-12 text-white opacity-40" />
          </div>
        </div>
      );
    }

    // ══ APPLE MINI ══
    if (preset === "apple-mini") {
      return (
        <div className={`w-[500px] font-apple bg-zinc-900/70 rounded-[4rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col gap-8 min-h-[500px] justify-between overflow-hidden`}>
          <div className="flex justify-between items-start">
            <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-xl shrink-0">
              {coverImage && (
                <img src={coverImage} className="w-full h-full object-cover" crossOrigin="anonymous" />
              )}
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <ImageLogo type="apple" className="w-5 h-5 opacity-60" />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div style={animStyle} className={`flex flex-col gap-4 ${alignClass}`}>
              <p className="text-white text-[2.6rem] font-bold tracking-tight leading-tight">
                {activeLyric}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-10 pt-4">
            <SkipBack className="w-10 h-10 text-white fill-current" />
            <div className="flex gap-2">
              <div className="w-2 h-8 bg-white rounded-full" />
              <div className="w-2 h-8 bg-white rounded-full" />
            </div>
            <SkipForward className="w-10 h-10 text-white fill-current" />
          </div>
        </div>
      );
    }

    // ══ APPLE BAR ══
    if (preset === "apple-bar") {
      return (
        <div className={`w-[980px] font-apple bg-zinc-900/70 rounded-[2.5rem] p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border border-white/10 flex items-center gap-8`}>
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl shrink-0">
            {coverImage && (
              <img src={coverImage} className="w-full h-full object-cover" crossOrigin="anonymous" />
            )}
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <h2 className="text-white/40 text-[1.8rem] font-bold truncate">
              {track?.title || "Track Title"}
            </h2>
            <div style={animStyle}>
              <p className="text-white text-[2.8rem] font-bold tracking-tight">
                {activeLyric}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-10 pr-4">
            <SkipBack className="w-10 h-10 text-white fill-current" />
            <div className="flex gap-2">
              <div className="w-2 h-8 bg-white rounded-full" />
              <div className="w-2 h-8 bg-white rounded-full" />
            </div>
            <SkipForward className="w-10 h-10 text-white fill-current" />
          </div>
        </div>
      );
    }

    // ══ SPOTIFY ══
    if (preset === "spotify") {
      return (
        <div className={`${widgetWidth} font-spotify bg-[#181818]/95 rounded-[3.5rem] p-16 shadow-2xl flex flex-col gap-16 border border-white/5 overflow-hidden`}>
          <div className={`flex flex-col gap-6 ${alignClass}`}>
            <div style={animStyle}>
              <p className="text-white text-[5rem] font-bold tracking-tight" style={{ lineHeight: 1.15 }}>
                {activeLyric}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-8 mt-6">
            {coverImage ? (
              <img src={coverImage} className="w-28 h-28 rounded-[2rem] shadow-lg object-cover" crossOrigin="anonymous" />
            ) : (
              <div className="w-28 h-28 rounded-[2rem] bg-[#282828]" />
            )}
            <div className="flex flex-col flex-1 text-left">
              <span className="text-white text-[2.75rem] font-bold line-clamp-1 leading-tight">
                {track?.title || "Track Title"}
              </span>
              <span className="text-white/70 text-3xl line-clamp-1 mt-2">
                {track?.artist || "Artist Name"}
              </span>
            </div>
            <ImageLogo type="spotify" className="w-20 h-20 text-[#1DB954]" />
          </div>
        </div>
      );
    }

    // ══ APPLE (default) ══
    if (preset === "apple") {
      return (
        <div className={`${widgetWidth} font-apple bg-black/10 rounded-[2.6rem] p-12 pb-0 flex flex-col gap-12 overflow-hidden`}>
          <div className={`flex-1 flex flex-col gap-6 ${alignClass} py-2`}>
            <div style={animStyle}>
              <p className="text-white text-[4.7rem] font-bold tracking-tight" style={{ lineHeight: 1.1 }}>
                {activeLyric}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-8 p-10 px-16 -mx-16 bg-black/10">
            <div className="w-36 h-36 rounded-xl overflow-hidden shrink-0">
              {coverImage ? (
                <img src={coverImage} className="w-full h-full object-cover" crossOrigin="anonymous" />
              ) : (
                <div className="w-full h-full bg-white/10" />
              )}
            </div>
            <div className="flex flex-col flex-1 text-left justify-center min-w-0">
              <div className="text-white text-[2.7rem] font-medium line-clamp-1 leading-tight">
                {track?.title || "Track Title"}
              </div>
              <div className="text-white/90 text-[2.7rem] line-clamp-1 leading-tight">
                {track?.artist || "Artist Name"}
              </div>
              <div className="flex items-center -translate-x-1 translate-y-1">
                <ImageLogo type="apple" className="h-8 text-white/40 mb-[0.05rem]" />
                <span className="text-white/40 text-[2.3rem] line-clamp-1 leading-tight">Music</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ══ MINIMAL (fallback) ══
    return (
      <div className={`${widgetWidth} bg-zinc-900 rounded-[3rem] p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] flex flex-col gap-16 border border-zinc-800 overflow-hidden`}>
        <div className={`flex flex-col gap-6 ${alignClass}`}>
          <div style={animStyle}>
            <p className="text-white text-[4.5rem] font-medium tracking-tight" style={{ lineHeight: 1.2 }}>
              {activeLyric}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-8 pt-10 border-t border-zinc-800">
          <div className="flex flex-col flex-1 text-left">
            <span className="text-white text-[2.5rem] font-bold leading-tight">
              {track?.title || "Track Title"}
            </span>
            <span className="text-zinc-500 text-2xl mt-1">
              {track?.artist || "Artist Name"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        width: compositionWidth,
        height: compositionHeight,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Full-size background using BackgroundWrapper */}
      <div style={{ position: "absolute", inset: 0 }}>
        <BackgroundWrapper
          format={format}
          preset={preset}
          coverImage={coverImage}
          cardScale={1}
          isCardOnly={false}
        >
          {renderContent()}
        </BackgroundWrapper>
      </div>
    </div>
  );
};
