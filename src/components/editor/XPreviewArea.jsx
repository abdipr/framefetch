import { useState, useEffect, useRef } from "react";
import { Download, Layout } from "lucide-react";
import useStore from "@/store/useStore";
import { FORMAT_DIMENSIONS } from "@/lib/constants";
import Button from "@/components/ui/Button";
import XWidget from "@/components/cards/XWidget";

const XPreviewArea = () => {
  const {
    format,
    preset,
    cardScale,
    exportQuality,
    exportFormat,
    xType,
    xTheme,
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
      const padding = window.innerWidth < 1024 ? 10 : 20;
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

  // GSAP entrance animation on type change
  useEffect(() => {
    if (animRef.current && window.gsap && !exporting) {
      window.gsap.fromTo(
        animRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
      );
    }
  }, [xType, xTheme, preset, format]);

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
      link.download = `XMockup-${xType}-${Date.now()}.${exportFormat}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export mockup.");
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

      {/* Preview canvas */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden flex items-center justify-center p-8"
      >
        <div
          ref={animRef}
          className="relative will-change-transform flex items-center justify-center"
          style={{ width: targetW * scale, height: targetH * scale }}
        >
          <div
            ref={cardRef}
            className="absolute top-0 left-0 shadow-[0_40px_80px_rgba(0,0,0,0.25)] overflow-hidden rounded-[2rem]"
            style={{
              width: targetW,
              height: targetH,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <XWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default XPreviewArea;
