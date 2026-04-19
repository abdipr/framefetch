import { useEffect, useRef, useState } from "react";
import { Play, SkipBack, SkipForward, Heart } from "lucide-react";
import ImageLogo from "@/components/ui/ImageLogo";

const LyricsWidget = ({
  track,
  lyrics,
  selectedLines,
  preset,
  coverImage,
  align,
}) => {
  const [displayLines, setDisplayLines] = useState(selectedLines);
  const containerRef = useRef(null);
  const widgetRef = useRef(null);
  const lastState = useRef({
    lines: selectedLines,
    align,
    height: 0,
    width: 0,
    preset,
  });
  const animatedIndices = useRef(new Set(selectedLines));

  // 1. Sync Logic and Exit Orchestration
  useEffect(() => {
    if (!window.gsap) return;
    const current = selectedLines;
    const prev = lastState.current.lines;

    const removed = prev.filter((i) => !current.includes(i));
    if (removed.length > 0) {
      removed.forEach((idx) => {
        const el = containerRef.current?.querySelector(
          `[data-line-idx="${idx}"]`,
        );
        if (el) {
          window.gsap.to(el, {
            opacity: 0,
            scale: 0.9,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              setDisplayLines(current);
              animatedIndices.current.delete(idx);
            },
          });
        } else {
          setDisplayLines(current);
        }
      });
    } else {
      setDisplayLines(current);
    }
  }, [selectedLines]);

  // 2. Layout & Dimension Orchestration
  useEffect(() => {
    if (!window.gsap || !containerRef.current || !widgetRef.current) return;

    const el = widgetRef.current;

    // Measure natural height immediately
    window.gsap.set(el, { height: "auto", width: "" });
    const targetHeight = el.offsetHeight;
    const targetWidth = el.offsetWidth;

    // Dimension Animation
    if (
      lastState.current.height &&
      (Math.abs(lastState.current.height - targetHeight) > 1 ||
        Math.abs(lastState.current.width - targetWidth) > 1)
    ) {
      window.gsap.fromTo(
        el,
        { height: lastState.current.height, width: lastState.current.width },
        {
          height: targetHeight,
          width: targetWidth,
          duration: 0.5,
          ease: "expo.out",
          overwrite: true,
          onComplete: () => window.gsap.set(el, { clearProps: "height,width" }),
        },
      );
    } else {
      window.gsap.set(el, { clearProps: "height,width" });
    }

    // Entry & Sliding
    const children = containerRef.current.querySelectorAll("[data-line-idx]");
    children.forEach((child) => {
      const idx = child.getAttribute("data-line-idx");
      const numericIdx = parseInt(idx);

      if (!animatedIndices.current.has(numericIdx)) {
        window.gsap.fromTo(
          child,
          { opacity: 0, scale: 0.9, y: 15 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            overwrite: true,
          },
        );
        animatedIndices.current.add(numericIdx);
      }
    });

    if (lastState.current.align !== align) {
      window.gsap.fromTo(
        containerRef.current,
        { x: lastState.current.align === "left" ? -15 : 15 },
        { x: 0, duration: 0.5, ease: "power3.out" },
      );
    }

    // Update stable ref
    lastState.current = {
      lines: displayLines,
      align,
      height: targetHeight,
      width: targetWidth,
      preset,
    };
  }, [displayLines, align, preset]);

  const hasText = displayLines.length > 0;

  const widgetWidth = "w-[940px]";
  const alignClass =
    align === "center"
      ? "items-center text-center"
      : align === "right"
        ? "items-end text-right"
        : "items-start text-left";

  if (preset === "apple-compact") {
    return (
      <div
        ref={widgetRef}
        className={`w-[900px] font-apple bg-white/40 dark:bg-zinc-900/60 backdrop-blur-3xl rounded-[3.5rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white/30 dark:border-white/10 flex flex-col gap-10 overflow-hidden`}
      >
        <div className="flex gap-8 items-center">
          <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl shrink-0">
            {coverImage && (
              <img
                src={coverImage}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            )}
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <h2 className="text-zinc-900 dark:text-white text-[2.8rem] font-bold truncate tracking-tight font-apple">
              {track?.title || "Track Title"}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-[1.8rem] font-medium truncate font-apple">
              {track?.artist || "Artist Name"}
            </p>
          </div>
        </div>

        <div
          ref={containerRef}
          className={`flex flex-col gap-5 py-4 ${alignClass}`}
        >
          {hasText ? (
            displayLines.map((idx, i) => (
              <p
                key={idx}
                data-line-idx={idx}
                className="text-zinc-900 dark:text-white text-[3.8rem] font-bold tracking-tight leading-tight"
              >
                {lyrics[idx]}
              </p>
            ))
          ) : (
            <p className="text-zinc-400/50 dark:text-white/20 text-4xl italic font-bold">
              Select lyrics...
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <Heart className="w-12 h-12 text-zinc-400 dark:text-white/40" />
          <div className="flex items-center gap-20">
            <SkipBack className="w-14 h-14 text-zinc-900 dark:text-white fill-current" />
            <div className="w-16 h-20 bg-zinc-900/10 dark:bg-white/10 rounded-2xl flex items-center justify-center">
              <div className="w-2.5 h-8 bg-zinc-900 dark:bg-white rounded-full mr-2" />
              <div className="w-2.5 h-8 bg-zinc-900 dark:bg-white rounded-full" />
            </div>
            <SkipForward className="w-14 h-14 text-zinc-900 dark:text-white fill-current" />
          </div>
          <ImageLogo
            type="apple"
            className="w-12 h-12 text-zinc-900 dark:text-white opacity-40"
          />
        </div>
      </div>
    );
  }

  if (preset === "apple-mini") {
    return (
      <div
        ref={widgetRef}
        className={`w-[500px] font-apple bg-white/40 dark:bg-zinc-900/60 backdrop-blur-3xl rounded-[4rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white/30 dark:border-white/10 flex flex-col gap-8 min-h-[500px] justify-between overflow-hidden`}
      >
        <div className="flex justify-between items-start">
          <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-xl shrink-0">
            {coverImage && (
              <img
                src={coverImage}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            )}
          </div>
          <div className="w-12 h-12 bg-black/5 dark:bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-900 dark:text-white">
            <ImageLogo type="apple" className="w-5 h-5 opacity-60" />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div
            ref={containerRef}
            className={`flex flex-col gap-4 ${alignClass}`}
          >
            {hasText ? (
              displayLines.slice(0, 3).map((idx, i) => (
                <p
                  key={idx}
                  data-line-idx={idx}
                  className="text-zinc-900 dark:text-white text-[2.6rem] font-bold tracking-tight leading-tight"
                >
                  {lyrics[idx]}
                </p>
              ))
            ) : (
              <p className="text-zinc-400/50 dark:text-white/20 text-3xl font-bold italic">
                Select lyrics...
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-10 pt-4">
          <SkipBack className="w-10 h-10 text-zinc-900 dark:text-white fill-current" />
          <div className="flex gap-2">
            <div className="w-2 h-8 bg-zinc-900 dark:bg-white rounded-full" />
            <div className="w-2 h-8 bg-zinc-900 dark:bg-white rounded-full" />
          </div>
          <SkipForward className="w-10 h-10 text-zinc-900 dark:text-white fill-current" />
        </div>
      </div>
    );
  }

  if (preset === "apple-bar") {
    return (
      <div
        className={`w-[980px] font-apple bg-white/40 dark:bg-zinc-900/60 backdrop-blur-3xl rounded-[2.5rem] p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border border-white/30 dark:border-white/10 flex items-center gap-8`}
      >
        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl shrink-0">
          {coverImage && (
            <img
              src={coverImage}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          )}
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <h2 className="text-zinc-900 dark:text-white text-[1.8rem] font-bold truncate font-inherit opacity-40">
            {track?.title || "Track Title"}
          </h2>
          <div ref={containerRef} className="truncate">
            {hasText ? (
              <p className="text-zinc-900 dark:text-white text-[2.8rem] font-bold tracking-tight">
                {selectedText[0]}
              </p>
            ) : (
              <p className="text-zinc-400/50 dark:text-white/20 text-2xl font-bold">
                Select lyrics...
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-10 pr-4">
          <SkipBack className="w-10 h-10 text-zinc-900 dark:text-white fill-current" />
          <div className="flex gap-2">
            <div className="w-2 h-8 bg-zinc-900 dark:bg-white rounded-full" />
            <div className="w-2 h-8 bg-zinc-900 dark:bg-white rounded-full" />
          </div>
          <SkipForward className="w-10 h-10 text-zinc-900 dark:text-white fill-current" />
        </div>
      </div>
    );
  }

  if (preset === "spotify") {
    return (
      <div
        ref={widgetRef}
        className={`${widgetWidth} font-spotify bg-[#181818]/90 backdrop-blur-md rounded-[3.5rem] p-16 shadow-2xl flex flex-col gap-16 border border-white/5 overflow-hidden`}
      >
        <div ref={containerRef} className={`flex flex-col gap-6 ${alignClass}`}>
          {hasText ? (
            displayLines.map((idx, i) => (
              <p
                key={idx}
                data-line-idx={idx}
                className="text-white text-[5rem] font-bold tracking-tight"
                style={{ lineHeight: 1.15 }}
              >
                {lyrics[idx]}
              </p>
            ))
          ) : (
            <p className="text-white/30 text-5xl font-bold italic">
              Select lyrics...
            </p>
          )}
        </div>

        <div className="flex items-center gap-8 mt-6">
          {coverImage ? (
            <img
              src={coverImage}
              className="w-28 h-28 rounded-[2rem] shadow-lg object-cover"
              crossOrigin="anonymous"
            />
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

  if (preset === "apple") {
    return (
      <div
        ref={widgetRef}
        className={`${widgetWidth} font-apple bg-black/10 rounded-[2.6rem] p-12 pb-0 flex flex-col gap-12 overflow-hidden`}
      >
        <div
          ref={containerRef}
          className={`flex-1 flex flex-col gap-6 ${alignClass} py-2`}
        >
          {hasText ? (
            displayLines.map((idx, i) => (
              <p
                key={idx}
                data-line-idx={idx}
                className="text-white text-[4.7rem] font-bold tracking-tight"
                style={{ lineHeight: 1.1 }}
              >
                {lyrics[idx]}
              </p>
            ))
          ) : (
            <p className="text-white/30 text-5xl font-bold italic">
              Select lyrics...
            </p>
          )}
        </div>

        <div className="flex items-center gap-8 p-10 px-16 -mx-16 bg-black/10">
          <div className="w-36 h-36 rounded-xl overflow-hidden shrink-0">
            {coverImage ? (
              <img
                src={coverImage}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full bg-white/10" />
            )}
          </div>
          <div className="flex flex-col flex-1 text-left justify-center min-w-0">
            <div className="text-white text-[2.7rem] font-medium line-clamp-1 leading-tight font-inherit">
              {track?.title || "Track Title"}
            </div>
            <div className="text-white/90 text-[2.7rem] line-clamp-1 leading-tight">
              {track?.artist || "Artist Name"}
            </div>
            <div className="flex items-center -translate-x-1 translate-y-1">
              <ImageLogo
                type="apple"
                className="h-8 text-white/40 mb-[0.05rem]"
              />
              <span className="text-white/40 text-[2.3rem] line-clamp-1 leading-tight">
                Music
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Minimal preset
  return (
    <div
      ref={widgetRef}
      className={`${widgetWidth} bg-white dark:bg-zinc-900 rounded-[3rem] p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col gap-16 border border-zinc-200 dark:border-zinc-800 overflow-hidden`}
    >
      <div ref={containerRef} className={`flex flex-col gap-6 ${alignClass}`}>
        {hasText ? (
          displayLines.map((idx, i) => (
            <p
              key={idx}
              data-line-idx={idx}
              className="text-black dark:text-white text-[4.5rem] font-medium tracking-tight"
              style={{ lineHeight: 1.2 }}
            >
              {lyrics[idx]}
            </p>
          ))
        ) : (
          <p className="text-zinc-400 text-5xl italic">Select lyrics...</p>
        )}
      </div>
      <div className="flex items-center gap-8 pt-10 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col flex-1 text-left">
          <span className="text-black dark:text-white text-[2.5rem] font-bold leading-tight">
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

export default LyricsWidget;
