import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCcw,
  X,
  Trash2,
} from "lucide-react";
import useStore from "@/store/useStore";
import SearchSection from "./SearchSection";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

const ControlsSidebar = () => {
  const {
    track,
    mode,
    setMode,
    preset,
    setPreset,
    format,
    setFormat,
    lyrics,
    selectedLines,
    toggleLine,
    setLyrics,
    exportQuality,
    exportFormat,
    setExportSettings,
    cardScale,
    textAlign,
    progress,
    isPlaying,
    setCustomization,
    resetToDefault,
    coverBase64,
  } = useStore();

  const presets = [
    {
      id: "apple",
      label: "Apple Classic",
      icon: (
        <div className="w-4 h-4 rounded-full bg-linear-to-br from-pink-500 to-orange-400" />
      ),
    },
    {
      id: "apple-compact",
      label: "Apple Compact",
      icon: (
        <div className="w-5 h-3 rounded bg-zinc-900 border border-white/20" />
      ),
    },
    {
      id: "apple-mini",
      label: "Apple Mini",
      icon: (
        <div className="w-4 h-4 rounded-lg bg-zinc-900 border border-white/20" />
      ),
    },
    {
      id: "apple-bar",
      label: "Apple Bar",
      icon: (
        <div className="w-5 h-1.5 rounded-full bg-zinc-900 border border-white/20" />
      ),
    },
    {
      id: "spotify",
      label: "Spotify",
      icon: <div className="w-4 h-4 rounded-full bg-[#1DB954]" />,
    },
    {
      id: "minimal",
      label: "Minimal",
      icon: <div className="w-4 h-4 rounded-full border-2 border-zinc-400" />,
    },
  ];

  return (
    <div className="flex flex-col gap-8 h-full lg:overflow-y-auto custom-scrollbar lg:pr-2 pb-24 lg:pb-0">
      {/* Global Reset */}
      <div className="flex justify-between items-center px-2">
        <h2 className="font-heading text-lg tracking-tight text-zinc-900 dark:text-white">
          Editor
        </h2>
        <button
          onClick={resetToDefault}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Search Track Section */}
      <section className="flex flex-col gap-4 bg-white dark:bg-zinc-900/50 p-5 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm relative group">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            Source Track
          </h3>
          {track && (
            <button
              onClick={() =>
                setCustomization({
                  track: null,
                  coverBase64: null,
                  lyrics: [],
                  selectedLines: [],
                })
              }
              className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        {track ? (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 group/track">
            <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm shrink-0 bg-zinc-200 dark:bg-zinc-700">
              {coverBase64 ? (
                <img src={coverBase64} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20">
                  <div className="w-6 h-6 rounded-full bg-current" />
                </div>
              )}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[12px] font-bold text-zinc-900 dark:text-white truncate">
                {track.title}
              </span>
              <span className="text-[10px] font-medium text-zinc-500 truncate">
                {track.artist}
              </span>
            </div>
          </div>
        ) : (
          <SearchSection />
        )}
      </section>

      {track && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Display Mode */}
          <section className="flex flex-col gap-4">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1">
              Display Mode
            </h3>
            <Tabs
              value={mode}
              onValueChange={(val) => setMode(val)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-11 bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-1">
                <TabsTrigger value="lyrics" className="rounded-xl font-bold">
                  Lyrics
                </TabsTrigger>
                <TabsTrigger value="player" className="rounded-xl font-bold">
                  Player
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </section>

          {/* Select Lyrics */}
          {mode === "lyrics" && (
            <section className="flex flex-col gap-4 bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  Lyrics Selection
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCustomization({ selectedLines: [] })}
                    className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:opacity-70 transition-opacity flex items-center gap-1"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    Clear
                  </button>
                  <span className="text-[10px] font-bold text-zinc-500 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700">
                    {selectedLines.length} / 6
                  </span>
                </div>
              </div>
              <div className="h-[220px] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 relative shadow-inner">
                {lyrics.length === 0 ? (
                  <div className="flex-1 p-4 flex items-center justify-center text-sm text-zinc-400 italic">
                    Search a track first...
                  </div>
                ) : (
                  <div className="flex-1 h-full overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
                    {lyrics.map((line, i) => {
                      const isSelected = selectedLines.includes(i);
                      const isDisabled =
                        !isSelected && selectedLines.length >= 6;
                      return (
                        <button
                          key={i}
                          disabled={isDisabled}
                          onClick={() => toggleLine(i)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-[13px] leading-snug transition-all duration-300 ${isSelected ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold shadow-lg scale-[1.02]" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"} ${isDisabled ? "opacity-20 translate-x-1" : ""}`}
                        >
                          {line}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Appearance & Settings */}
          <section className="flex flex-col gap-6 pt-4">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" />
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  Customization
                </h3>
              </div>

              {/* Card Size & Alignment */}
              <div className="flex flex-col gap-6 bg-white dark:bg-zinc-900/50 p-5 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      Frame Scale
                    </label>
                    <span className="text-xs font-black text-zinc-400">
                      {Math.round(cardScale * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4 h-10 px-1">
                    <Slider
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      value={[cardScale]}
                      onValueChange={(val) => {
                        if (val && val.length > 0 && !isNaN(val[0])) {
                          setCustomization({ cardScale: val[0] });
                        }
                      }}
                      className="flex-1"
                    />
                  </div>
                </div>

                {mode === "lyrics" && (
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                      Text Alignment
                    </label>
                    <Tabs
                      value={textAlign}
                      onValueChange={(val) =>
                        setCustomization({ textAlign: val })
                      }
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-3 h-11 bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-1">
                        <TabsTrigger value="left" className="rounded-xl">
                          <AlignLeft className="w-4 h-4" />
                        </TabsTrigger>
                        <TabsTrigger value="center" className="rounded-xl">
                          <AlignCenter className="w-4 h-4" />
                        </TabsTrigger>
                        <TabsTrigger value="right" className="rounded-xl">
                          <AlignRight className="w-4 h-4" />
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                )}

                <div className="flex flex-col gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        Track Progress
                      </label>
                      <span className="text-xs font-black text-zinc-400">
                        {Math.round(progress * 100)}%
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={1}
                      step={0.01}
                      value={[progress]}
                      onValueChange={(val) =>
                        setCustomization({ progress: val[0] })
                      }
                      className="flex-1"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                      Visual State
                    </label>
                    <Tabs
                      value={isPlaying ? "playing" : "paused"}
                      onValueChange={(val) =>
                        setCustomization({ isPlaying: val === "playing" })
                      }
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 h-11 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-2xl p-1">
                        <TabsTrigger
                          value="playing"
                          className="rounded-xl font-bold"
                        >
                          Playing
                        </TabsTrigger>
                        <TabsTrigger
                          value="paused"
                          className="rounded-xl font-bold"
                        >
                          Paused
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["1:1", "3:4", "9:16"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`h-16 rounded-2xl border text-[11px] font-black flex flex-col items-center justify-center gap-2 transition-all duration-300 ${format === f ? "border-zinc-900 bg-white ring-4 ring-zinc-900/5 dark:border-white dark:bg-zinc-900 dark:ring-white/5" : "border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"}`}
                    >
                      <div
                        className={`border-2 border-current rounded-sm ${f === "1:1" ? "w-4 h-4" : f === "3:4" ? "w-3 h-4" : "w-2.5 h-4"}`}
                      />
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Style */}
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1">
                  Visual Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {presets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPreset(p.id)}
                      className={`flex flex-col items-center justify-center gap-2 h-20 rounded-2xl border transition-all duration-300 ${preset === p.id ? "border-zinc-900 bg-white ring-4 ring-zinc-900/5 dark:border-white dark:bg-zinc-900 dark:ring-white/5" : "border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"}`}
                    >
                      <div className="scale-75">{p.icon}</div>
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Export Engine */}
            <div className="flex flex-col gap-6 pt-8 mt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  Export Engine
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-5 bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                    Image Quality
                  </label>
                  <Tabs
                    value={exportQuality.toString()}
                    onValueChange={(val) =>
                      setExportSettings({ exportQuality: parseInt(val) })
                    }
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3 h-10 bg-white dark:bg-zinc-900 rounded-xl p-1 shadow-inner">
                      <TabsTrigger
                        value="1"
                        className="text-[10px] font-black rounded-lg"
                      >
                        SD
                      </TabsTrigger>
                      <TabsTrigger
                        value="2"
                        className="text-[10px] font-black rounded-lg"
                      >
                        HD
                      </TabsTrigger>
                      <TabsTrigger
                        value="3"
                        className="text-[10px] font-black rounded-lg"
                      >
                        4K
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                    File Format
                  </label>
                  <Tabs
                    value={exportFormat}
                    onValueChange={(val) =>
                      setExportSettings({ exportFormat: val })
                    }
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 h-10 bg-white dark:bg-zinc-900 rounded-xl p-1 shadow-inner">
                      <TabsTrigger
                        value="png"
                        className="text-[10px] font-black rounded-lg"
                      >
                        PNG
                      </TabsTrigger>
                      <TabsTrigger
                        value="jpeg"
                        className="text-[10px] font-black rounded-lg"
                      >
                        JPG
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ControlsSidebar;
