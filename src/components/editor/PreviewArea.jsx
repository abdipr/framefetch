import { useState, useEffect, useRef } from "react";
import { Download, Layout } from "lucide-react";
import useStore from "@/store/useStore";
import { FORMAT_DIMENSIONS } from "@/lib/constants";
import Button from "@/components/ui/Button";
import BackgroundWrapper from "@/components/cards/BackgroundWrapper";
import LyricsWidget from "@/components/cards/LyricsWidget";
import PlayerWidget from "@/components/cards/PlayerWidget";

const PreviewArea = () => {
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
  } = useStore();

  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const animRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [exporting, setExporting] = useState(false);

  // Responsive scaling based on container size
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width: containerW, height: containerH } = entries[0].contentRect;
      const padding = window.innerWidth < 1024 ? 32 : 64;
      const targetW = FORMAT_DIMENSIONS[format].width;
      const targetH = FORMAT_DIMENSIONS[format].height;

      const newScale = Math.min(
        (containerW - padding) / targetW,
        (containerH - padding) / targetH,
      );

      setScale(newScale);

      // Smoothly animate the card size change if GSAP is available
      if (cardRef.current && window.gsap) {
        window.gsap.to(cardRef.current, {
          width: targetW,
          height: targetH,
          duration: 0.8,
          ease: "elastic.out(1, 0.8)",
          overwrite: true,
        });
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [format]);

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
      const options = {
        quality: 1,
        pixelRatio: exportQuality,
        width: FORMAT_DIMENSIONS[format].width,
        height: FORMAT_DIMENSIONS[format].height,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          margin: "0",
        },
      };

      const dataUrl =
        exportFormat === "jpeg"
          ? await window.htmlToImage.toJpeg(el, options)
          : await window.htmlToImage.toPng(el, options);

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

  const targetW = FORMAT_DIMENSIONS[format].width;
  const targetH = FORMAT_DIMENSIONS[format].height;

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

      {/* Export button */}
      <div className="absolute top-10 right-8 lg:top-12 lg:right-12 z-30 flex gap-2">
        {track && (
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
        )}
      </div>

      {/* Preview canvas */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden flex items-center justify-center"
      >
        {track ? (
          <div
            ref={animRef}
            className="relative will-change-transform flex items-center justify-center"
            style={{ width: targetW * scale, height: targetH * scale }}
          >
            <div
              ref={cardRef}
              className="absolute top-0 left-0 shadow-[0_0_50px_rgba(0,0,0,0.15)] overflow-hidden"
              style={{
                width: targetW,
                height: targetH,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <BackgroundWrapper
                format={format}
                preset={preset}
                coverImage={coverBase64}
                cardScale={cardScale}
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
