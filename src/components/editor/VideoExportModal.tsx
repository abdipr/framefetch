import { useState, useRef, useCallback } from "react";
import { flushSync } from "react-dom";
import { Player, PlayerRef } from "@remotion/player";
import { VideoComposition, VideoSchema } from "@/remotion/VideoComposition";
import { VideoFrame } from "@/remotion/VideoFrame";
import { encodeToMP4 } from "@/services/videoEncoder";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Info, Cpu, Film } from "lucide-react";
import useStore from "@/store/useStore";
import React from "react";

type ExportPhase = "idle" | "rendering-frames" | "encoding" | "done";

export default function VideoExportModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    track,
    syncedLyrics,
    videoRange,
    preset,
    coverBase64,
    format,
    textAlign,
    videoFps,
    videoResolution,
  } = useStore();

  const [phase, setPhase] = useState<ExportPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [etaText, setEtaText] = useState("");
  const startTimeRef = useRef<number>(0);
  const playerRef = useRef<PlayerRef>(null);
  const hiddenRendererRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef(false);

  // Duration calculation
  const startLine = syncedLyrics[videoRange[0]] || null;
  const endLine = syncedLyrics[videoRange[1]] || null;
  const durationInSeconds = Math.max(
    0,
    (endLine?.time || 0) - (startLine?.time || 0) + 3,
  );
  const totalFrames = Math.floor(durationInSeconds * videoFps);

  // Resolution
  const resolutionMap = {
    "720p": { w: 1280, h: 720 },
    "1080p": { w: 1920, h: 1080 },
    "4k": { w: 3840, h: 2160 },
  };
  const baseRes = resolutionMap[videoResolution];
  const compWidth =
    format === "9:16" ? baseRes.h : format === "1:1" ? baseRes.h : baseRes.w;
  const compHeight = format === "9:16" ? baseRes.w : baseRes.h;

  // Player preview dimensions (always 1080x1920 base for Remotion player)
  const playerWidth = compWidth;
  const playerHeight = compHeight;

  const isExporting = phase !== "idle" && phase !== "done";

  // ── MAIN EXPORT FUNCTION ──
  const handleExport = useCallback(async () => {
    const renderer = hiddenRendererRef.current;
    if (!renderer || !track) return;

    cancelRef.current = false;

    try {
      setPhase("rendering-frames");
      setProgress(0);
      setStatusText(`Rendering ${totalFrames} frames at ${videoFps}fps...`);

      // Helper: signal HiddenFrameRenderer to update
      const setFrame = async (f: number) => {
        const event = new CustomEvent("renderframe", {
          detail: { frame: f },
        });
        renderer.dispatchEvent(event);
        // We removed requestAnimationFrame here! 
        // flushSync already updated the DOM, and html-to-image reads the DOM directly.
        // Skipping browser paint saves ~16ms per frame.
      };

      // Helper: get the visible child element for capture
      const getFrameElement = () =>
        renderer.firstElementChild as HTMLElement | null;

      // Small delay to ensure the hidden renderer is fully mounted
      await new Promise((r) => setTimeout(r, 100));
      
      startTimeRef.current = Date.now();
      setEtaText(`~${Math.floor((totalFrames * 0.2) / 60)}m ${Math.floor((totalFrames * 0.2) % 60)}s`);

      const mp4Data = await encodeToMP4({
        getFrameElement,
        setFrame,
        checkCancel: () => cancelRef.current,
        totalFrames,
        fps: videoFps,
        width: compWidth,
        height: compHeight,
        onProgress: (p) => {
          // Dynamic ETA calculation
          if (p > 2 && p < 100) {
            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            const remainingPercent = (100 - p) / 100;
            const remaining = (elapsed / (p / 100)) * remainingPercent;
            
            if (remaining > 60) {
              setEtaText(`~${Math.floor(remaining / 60)}m ${Math.floor(remaining % 60)}s`);
            } else if (remaining > 0) {
              setEtaText(`~${Math.ceil(remaining)}s`);
            }
          }

          if (p <= 85) {
            setPhase("rendering-frames");
            setProgress(p);
            setStatusText(
              `Encoding frame... ${Math.floor((p / 85) * totalFrames)} / ${totalFrames}`,
            );
          } else {
            setPhase("encoding");
            setProgress(p);
            setStatusText("Finalizing MP4...");
          }
        },
      });

      // Download the MP4
      const blob = new Blob([mp4Data.buffer as ArrayBuffer], {
        type: "video/mp4",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `framefetch-${track.title.toLowerCase().replace(/\s+/g, "-")}.mp4`;
      a.click();
      URL.revokeObjectURL(url);

      setPhase("done");
      setProgress(100);
      setStatusText("Done! Check your downloads.");
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "CANCELLED") {
        console.log("[VideoExport] Export cancelled by user");
        return;
      }

      console.error("[VideoExport] Full error:", err);
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : JSON.stringify(err);
      alert(
        `Export gagal: ${msg}\n\nBuka DevTools (F12) → Console untuk detail.`,
      );
      setPhase("idle");
    }
  }, [totalFrames, videoFps, compWidth, compHeight, track]);

  const handleCancel = () => {
    cancelRef.current = true;
    setPhase("idle");
    setProgress(0);
  };

  const phaseLabel: Record<ExportPhase, string> = {
    idle: "",
    "rendering-frames": statusText,
    encoding: statusText,
    done: "✓ Export complete!",
  };

  if (!track || !syncedLyrics.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={isExporting ? undefined : onClose}>
      <DialogContent className="max-w-[96vw] md:max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-0 overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Preview Panel */}
          <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center p-4 md:p-8 relative min-h-[280px] md:min-h-0">
            <div className="w-full max-h-[48vh] md:max-h-[62vh] aspect-9/16 bg-zinc-200 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-xl border border-black/5 dark:border-white/5">
              {syncedLyrics.length > 0 && totalFrames > 0 && (
                <Player
                  ref={playerRef}
                  component={VideoComposition as any}
                  schema={VideoSchema as any}
                  inputProps={{
                    track,
                    syncedLyrics,
                    range: videoRange,
                    preset,
                    coverImage: coverBase64,
                    format,
                    textAlign,
                  }}
                  durationInFrames={totalFrames}
                  fps={videoFps}
                  compositionWidth={playerWidth}
                  compositionHeight={playerHeight}
                  style={{ width: "100%", height: "100%" }}
                  controls
                />
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="w-full md:w-80 p-6 md:p-8 flex flex-col justify-between bg-white dark:bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800 overflow-y-auto">
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold tracking-tight">Export MP4</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                  H.264 · {videoFps}fps · {videoResolution}
                </p>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Resolution", value: `${compWidth}×${compHeight}` },
                  { label: "FPS", value: videoFps },
                  {
                    label: "Duration",
                    value: `${durationInSeconds.toFixed(1)}s`,
                  },
                  { label: "Frames", value: totalFrames },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-3 space-y-0.5"
                  >
                    <p className="text-[9px] text-zinc-400 font-black uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-sm font-black text-zinc-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Info box */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                <Cpu className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                    Native Browser Encoding
                  </p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-300 font-medium leading-relaxed">
                    Video di-render langsung di browser menggunakan WebCodecs API.
                    Tidak ada upload. Semua data tetap di device kamu.
                  </p>
                </div>
              </div>

              {/* Estimated time */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Est. Time
                </span>
                <span className="text-[11px] font-black text-zinc-900 dark:text-white">
                  {etaText}
                </span>
              </div>
            </div>

            {/* Export CTA */}
            <div className="space-y-3 pt-5">
              {isExporting ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    {phase === "rendering-frames" && (
                      <Film className="w-4 h-4 text-violet-500 animate-pulse" />
                    )}
                    {phase === "encoding" && (
                      <Cpu className="w-4 h-4 text-orange-500 animate-pulse" />
                    )}
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                      {phase === "rendering-frames" && "Rendering Frames"}
                      {phase === "encoding" && "Encoding MP4"}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                        background:
                          phase === "encoding"
                            ? "linear-gradient(90deg, #f97316, #ef4444)"
                            : "linear-gradient(90deg, #8b5cf6, #6366f1)",
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-[9px] text-zinc-400 font-medium truncate pr-2">
                      {phaseLabel[phase]}
                    </p>
                    <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-300 shrink-0">
                      {progress}%
                    </span>
                  </div>

                  <button
                    onClick={handleCancel}
                    className="w-full text-[10px] font-black uppercase tracking-wider text-red-400 hover:text-red-500 py-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : phase === "done" ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-center">
                    <p className="text-2xl mb-1">🎬</p>
                    <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                      Video berhasil diexport!
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-300 mt-1">
                      Cek folder Downloads kamu
                    </p>
                  </div>
                  <Button
                    onClick={() => setPhase("idle")}
                    variant="outline"
                    className="w-full h-11 rounded-xl font-bold"
                  >
                    Export Lagi
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleExport}
                  className="w-full h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                >
                  <Download className="mr-2 w-5 h-5" />
                  Export MP4
                </Button>
              )}
              <p className="text-[9px] text-zinc-400 text-center font-medium">
                WebCodecs API · H.264 · No upload required
              </p>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Hidden off-screen renderer for frame capture */}
      <div
        ref={hiddenRendererRef}
        style={{
          position: "fixed",
          top: -99999,
          left: -99999,
          width: compWidth,
          height: compHeight,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        <HiddenFrameRenderer
          containerRef={hiddenRendererRef}
          track={track}
          syncedLyrics={syncedLyrics}
          range={videoRange}
          preset={preset}
          coverImage={coverBase64}
          format={format}
          textAlign={textAlign}
          fps={videoFps}
          compWidth={compWidth}
          compHeight={compHeight}
        />
      </div>
    </Dialog>
  );
}

// Sub-component that listens for custom events to update its frame
function HiddenFrameRenderer({
  containerRef,
  track,
  syncedLyrics,
  range,
  preset,
  coverImage,
  format,
  textAlign,
  fps,
  compWidth,
  compHeight,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  track: any;
  syncedLyrics: any[];
  range: [number, number];
  preset: string;
  coverImage: string | null;
  format: string;
  textAlign: "left" | "center" | "right";
  fps: number;
  compWidth: number;
  compHeight: number;
}) {
  const [frame, setFrame] = useState(0);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ frame: number }>;
      flushSync(() => {
        setFrame(customEvent.detail.frame);
      });
    };

    el.addEventListener("renderframe", handler);
    return () => el.removeEventListener("renderframe", handler);
  }, [containerRef]);

  return (
    <VideoFrame
      track={track}
      syncedLyrics={syncedLyrics}
      range={range}
      preset={preset}
      coverImage={coverImage}
      format={format}
      textAlign={textAlign}
      frame={frame}
      fps={fps}
      compositionWidth={compWidth}
      compositionHeight={compHeight}
    />
  );
}
