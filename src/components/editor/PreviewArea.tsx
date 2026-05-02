import { useState, useEffect, useRef } from "react";
import { Download, Sparkles, Layout, Settings2 } from "lucide-react";
import { SHOW_VIDEO_FEATURES } from "@/lib/constants";
import useStore from "@/store/useStore";
import { FORMAT_DIMENSIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import BackgroundWrapper from "@/components/cards/BackgroundWrapper";
import LyricsWidget from "@/components/cards/LyricsWidget";
import PlayerWidget from "@/components/cards/PlayerWidget";

const PreviewArea = () => {
  const [bgType, setBgType] = useState<
    "black" | "dark" | "white" | "checkered" | "checkered-dark"
  >("black");
  const {
    track,
    mode,
    preset,
    format,
    lyrics,
    selectedLines,
    coverBase64,
    exportQuality,
    exportFormat,
    cardScale,
    textAlign,
    progress,
    isPlaying,
    isCardOnly,
    syncedLyrics,
    videoRange,
    setCustomization,
    setMobileDrawerOpen,
  } = useStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [exporting, setExporting] = useState<boolean>(false);
  const [targetSize, setTargetSize] = useState<{
    width: number;
    height: number;
  }>({ width: 1080, height: 1080 });
  const [isPreviewingVideo, setIsPreviewingVideo] = useState(false);

  const playVideoPreview = () => {
    if (!syncedLyrics || syncedLyrics.length === 0 || isPreviewingVideo) return;

    setIsPreviewingVideo(true);
    const startIdx = videoRange[0];
    const endIdx = videoRange[1];

    const startTime = syncedLyrics[startIdx].time;
    const endTime = syncedLyrics[endIdx].time;
    const totalDuration = endTime - startTime + 2; // extra 2s

    // Set initial line
    setCustomization({ selectedLines: [startIdx], progress: 0 });

    let currentIdx = startIdx;

    const timeline = window.gsap.timeline({
      onComplete: () => {
        setIsPreviewingVideo(false);
      },
    });

    for (let i = startIdx; i <= endIdx; i++) {
      const line = syncedLyrics[i];
      const nextLine = syncedLyrics[i + 1];
      const duration = nextLine ? nextLine.time - line.time : 2;

      timeline.call(
        () => {
          setCustomization({ selectedLines: [i] });
        },
        [],
        "+=" + (i === startIdx ? 0 : duration),
      );
    }
  };

  // 1. Responsive scaling: Fits the 'canvas' into the 'PreviewArea'
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width: containerW, height: containerH } = entries[0].contentRect;
      const padding = window.innerWidth < 1024 ? 32 : 64;

      const newScale = Math.min(
        (containerW - padding) / targetSize.width,
        (containerH - padding) / targetSize.height,
      );

      setScale(newScale);
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [targetSize, format, isCardOnly]);

  // 2. Content measuring: Gets the natural size of the card
  useEffect(() => {
    // Lockscreen is always 591x1280 (portrait phone)
    if (preset === "lockscreen") {
      setTargetSize({ width: 591, height: 1280 });
      return;
    }

    if (!isCardOnly) {
      setTargetSize({
        width: FORMAT_DIMENSIONS[format].width,
        height: FORMAT_DIMENSIONS[format].height,
      });
      return;
    }

    // Measure the actual card content
    const observer = new ResizeObserver(() => {
      if (cardRef.current) {
        setTargetSize({
          width: cardRef.current.scrollWidth,
          height: cardRef.current.scrollHeight,
        });
      }
    });

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isCardOnly, format, mode, preset, selectedLines, track]);

  // GSAP entrance animation on track/mode change
  useEffect(() => {
    if (animRef.current && window.gsap && !exporting) {
      window.gsap.fromTo(
        animRef.current,
        { scale: 0.9 },
        { scale: 1, duration: 0.6, ease: "back.out(1.4)" },
      );
    }
  }, [track, mode, preset, format]);

  const handleExport = async () => {
    if (!cardRef.current || exporting) return;
    if (!window.htmlToImage) {
      alert("Hold on, the export module is still loading.");
      return;
    }
    setExporting(true);
    try {
      const el = cardRef.current;

      // Pre-load all images in the element before capturing
      const images = el.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) {
                resolve();
              } else {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              }
            }),
        ),
      );

      const options = {
        quality: 1,
        pixelRatio: exportQuality,
        width: targetSize.width,
        height: targetSize.height,
        backgroundColor: null,
        // Fallback placeholder for any image that fails to load in the clone
        imagePlaceholder:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          margin: "0",
        },
      };

      // Retry up to 3 times — html-to-image sometimes needs images to settle in the clone
      let dataUrl: string | null = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          dataUrl =
            exportFormat === "jpg"
              ? await window.htmlToImage.toJpeg(el, options)
              : await window.htmlToImage.toPng(el, options);
          break;
        } catch (e) {
          console.error(`Attempt ${attempt + 1} failed:`, e);
          if (attempt === 2) throw e;
          await new Promise((r) => setTimeout(r, 400));
        }
      }

      if (!dataUrl) throw new Error("No data URL generated");

      const link = document.createElement("a");
      link.download = `FrameFetch-${preset}-${Date.now()}.${exportFormat}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export. Please ensure the album cover is fully loaded.");
    } finally {
      setExporting(false);
    }
  };

  const targetW = targetSize.width;
  const targetH = targetSize.height;

  return (
    <div className="w-full h-full flex flex-col bg-zinc-50 dark:bg-[#000000] relative overflow-hidden group">
      {/* Background patterns */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Export button + BG presets */}
      <div className="absolute top-10 right-8 lg:top-12 lg:right-12 z-30 flex flex-col items-end gap-2">
        {track && (
          <div className="flex gap-2">
            {SHOW_VIDEO_FEATURES && syncedLyrics.length > 0 && (
              <Button
                variant="outline"
                className="shadow-2xl rounded-full! px-4 py-5 h-2 text-xs lg:text-sm font-bold bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border dark:border-zinc-800 hover:scale-105 active:scale-95 transition-all text-rose-500 border-rose-500/20"
                onClick={playVideoPreview}
                disabled={isPreviewingVideo || exporting}
              >
                <Sparkles
                  className={`w-4 h-4 lg:mr-3 ${isPreviewingVideo ? "animate-spin" : ""}`}
                />
                <span>
                  {isPreviewingVideo ? "Playing..." : "Preview Video"}
                </span>
              </Button>
            )}
            <Button
              variant="secondary"
              className="shadow-2xl rounded-full! px-4 py-5 h-2 text-xs lg:text-sm font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:scale-105 active:scale-95 transition-all"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin lg:mr-3" />
              ) : (
                <Download className="w-4 h-4 lg:mr-3 text-zinc-500" />
              )}
              <span className="inline">
                {exporting ? "Generating..." : "Export"}
              </span>
            </Button>
          </div>
        )}

        {/* Background Presets - compact vertical column */}
        <div className="flex flex-col gap-1 p-1 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xl">
          {[
            { id: "black", color: "bg-black", label: "Black" },
            { id: "dark", color: "bg-zinc-900", label: "Dark" },
            {
              id: "white",
              color: "bg-white border border-zinc-200",
              label: "White",
            },
            {
              id: "checkered",
              color: "bg-zinc-200",
              label: "Light Transparent",
              isCheckered: true,
              checkColor: "#808080",
              baseColor: "#ccc",
            },
            {
              id: "checkered-dark",
              color: "bg-zinc-800",
              label: "Dark Transparent",
              isCheckered: true,
              checkColor: "#000",
              baseColor: "#18181b",
            },
          ].map((bg) => (
            <button
              key={bg.id}
              onClick={() => setBgType(bg.id as any)}
              className={`w-6 h-6 rounded-lg transition-all relative overflow-hidden flex items-center justify-center ${bgType === bg.id ? "ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-zinc-900 scale-110" : "hover:scale-105 opacity-60 hover:opacity-100"}`}
              title={bg.label}
            >
              {bg.isCheckered ? (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `linear-gradient(45deg, ${bg.checkColor} 25%, transparent 25%), linear-gradient(-45deg, ${bg.checkColor} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${bg.checkColor} 75%), linear-gradient(-45deg, transparent 75%, ${bg.checkColor} 75%)`,
                    backgroundSize: "6px 6px",
                    backgroundPosition: "0 0, 0 3px, 3px -3px, -3px 0px",
                    backgroundColor: bg.baseColor,
                  }}
                />
              ) : (
                <div className={`absolute inset-0 ${bg.color}`} />
              )}
              {bgType === bg.id && (
                <div className="z-10 w-1 h-1 rounded-full bg-indigo-500 shadow-sm" />
              )}
            </button>
          ))}
        </div>

        {/* Design Settings trigger - mobile only, icon-only */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center bg-black dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95 transition-all"
          title="Design Settings"
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      {/* Preview canvas */}
      <div
        ref={containerRef}
        className={`flex-1 relative overflow-hidden flex items-center justify-center transition-colors duration-500 ${
          bgType === "black"
            ? "bg-black"
            : bgType === "dark"
              ? "bg-zinc-900"
              : bgType === "white"
                ? "bg-white"
                : ""
        }`}
        style={
          bgType === "checkered"
            ? {
                backgroundImage: `linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)`,
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                backgroundColor: "#ffffff",
              }
            : bgType === "checkered-dark"
              ? {
                  backgroundImage: `linear-gradient(45deg, #09090b 25%, transparent 25%), linear-gradient(-45deg, #09090b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #09090b 75%), linear-gradient(-45deg, transparent 75%, #09090b 75%)`,
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                  backgroundColor: "#18181b",
                }
              : {}
        }
      >
        {track ? (
          <div
            ref={animRef}
            className="relative will-change-transform flex items-center justify-center"
            style={{
              width: targetW * scale,
              height: targetH * scale,
            }}
          >
            <div
              ref={cardRef}
              className={`${isCardOnly ? "relative w-max h-fit overflow-visible" : "absolute top-0 left-0 w-full h-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.15)]"}`}
              style={{
                width: isCardOnly ? "max-content" : targetW,
                height: isCardOnly ? "auto" : targetH,
                transform: `scale(${scale})`,
                transformOrigin: isCardOnly ? "center center" : "top left",
              }}
            >
              {preset === "lockscreen" ? (
                // Lockscreen bypasses BackgroundWrapper to avoid html-to-image CSS re-fetch bug
                <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-black">
                  <PlayerWidget
                    track={track}
                    preset={preset}
                    coverImage={coverBase64}
                    progress={progress}
                    isPlaying={isPlaying}
                  />
                </div>
              ) : (
                <BackgroundWrapper
                  format={format}
                  preset={preset}
                  coverImage={coverBase64}
                  cardScale={cardScale}
                  isCardOnly={isCardOnly}
                >
                  {mode === "lyrics" ? (
                    <LyricsWidget
                      track={track}
                      lyrics={lyrics}
                      selectedLines={selectedLines}
                      preset={preset}
                      coverImage={coverBase64}
                      align={textAlign}
                      progress={progress}
                      isPlaying={isPlaying}
                    />
                  ) : (
                    <PlayerWidget
                      track={track}
                      preset={preset}
                      coverImage={coverBase64}
                      progress={progress}
                      isPlaying={isPlaying}
                    />
                  )}
                </BackgroundWrapper>
              )}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-40 gap-4">
            <Layout className="w-16 h-16" />
            <p className="text-sm">
              Search a track{" "}
              {window.innerWidth < 1024 ? "below" : "on the right"} to start
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewArea;
