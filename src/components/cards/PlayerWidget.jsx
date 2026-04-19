import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Plus,
  MoreHorizontal,
  Repeat2,
  Shuffle,
} from "lucide-react";
import ImageLogo from "@/components/ui/ImageLogo";
import { formatTime } from "@/lib/utils";

const PlayerWidget = ({ track, preset, coverImage, progress, isPlaying }) => {
  const widgetWidth = "w-[940px]";

  if (preset === "spotify") {
    return (
      <div
        className={`${widgetWidth} font-spotify bg-[#121212] rounded-[2.5rem] p-12 shadow-2xl border border-white/5 flex flex-col gap-8`}
      >
        {/* Header/Album Art Area */}
        <div className="w-full aspect-square rounded-[1.5rem] overflow-hidden shadow-2xl relative group">
          {coverImage ? (
            <img
              src={coverImage}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full bg-[#282828] flex items-center justify-center">
              <ImageLogo type="spotify" className="w-24 h-24 text-white/10" />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-8 mt-2 px-2">
          <div className="flex justify-between items-center">
            <div className="flex flex-col flex-1 overflow-hidden pr-6">
              <h2 className="text-zinc-900 dark:text-white text-[4.2rem] font-bold truncate tracking-tight leading-tight font-spotify">
                {track?.title || "Track Title"}
              </h2>
              <p className="text-zinc-500 dark:text-white/70 text-[2.4rem] font-medium truncate mt-1 font-spotify">
                {track?.artist || "Artist Name"}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Plus className="w-12 h-12 text-zinc-900 dark:text-white/60 hover:text-white transition-colors" />
              <Heart className="w-14 h-14 text-[#1DB954] fill-[#1DB954]" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-3">
            <div className="w-full h-2 rounded-full bg-zinc-900/10 dark:bg-white/10 relative">
              <div
                className="absolute top-0 left-0 h-full bg-zinc-900 dark:bg-white rounded-full group transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              >
                <div className="absolute -right-2 -top-1.5 w-5 h-5 bg-zinc-900 dark:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex justify-between text-zinc-400 dark:text-white/50 text-[1.4rem] font-medium tracking-tighter">
              <span>{formatTime((track?.duration || 180000) * progress)}</span>
              <span>{formatTime(track?.duration || 180000)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-4">
            <Shuffle className="w-10 h-10 text-zinc-400 dark:text-white/40" />
            <div className="flex items-center gap-14">
              <SkipBack className="w-14 h-14 text-zinc-900 dark:text-white fill-current" />
              <div className="w-28 h-28 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                {isPlaying ? (
                  <Pause className="w-12 h-12 text-white dark:text-black fill-current" />
                ) : (
                  <Play className="w-12 h-12 text-white dark:text-black fill-current translate-x-1" />
                )}
              </div>
              <SkipForward className="w-14 h-14 text-zinc-900 dark:text-white fill-current" />
            </div>
            <Repeat2 className="w-10 h-10 text-zinc-400 dark:text-white/40" />
          </div>

          {/* Footer Logo */}
          <div className="flex justify-center mt-2 opacity-20">
            <ImageLogo type="spotify" className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>
    );
  }

  if (preset === "apple-compact") {
    return (
      <div
        className={`w-[840px] font-apple bg-white/40 dark:bg-zinc-900/60 backdrop-blur-3xl rounded-[3.5rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white/30 dark:border-white/10 flex flex-col gap-10`}
      >
        <div className="flex gap-8 items-center">
          <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-xl shrink-0">
            {coverImage && (
              <img
                src={coverImage}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            )}
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <h2 className="text-white text-[3.2rem] font-bold truncate tracking-tight font-apple">
              {track?.title || "Track Title"}
            </h2>
            <p className="text-zinc-400 text-[2.2rem] font-medium truncate">
              {track?.artist || "Artist Name"}
            </p>
          </div>
          <div className="flex items-center text-white/20 gap-1 pr-2">
            <div className="w-1.5 h-6 bg-current rounded-full" />
            <div className="w-1.5 h-4 bg-current rounded-full" />
            <div className="w-1.5 h-8 bg-current rounded-full" />
            <div className="w-1.5 h-5 bg-current rounded-full" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="w-full h-1.5 rounded-full bg-zinc-900/10 dark:bg-white/10 relative">
            <div
              className="absolute top-0 left-0 h-full bg-zinc-900/80 dark:bg-white/80 rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-zinc-900/30 dark:text-white/30 text-xl font-bold tracking-tight px-1 font-sans">
            <span>{formatTime((track?.duration || 180000) * progress)}</span>
            <span>
              -{formatTime((track?.duration || 180000) * (1 - progress))}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between px-4">
          <Heart className="w-12 h-12 text-zinc-400 dark:text-white/40" />
          <div className="flex items-center gap-20">
            <SkipBack className="w-16 h-16 text-zinc-900 dark:text-white fill-current" />
            <div className="w-20 h-24 bg-zinc-900/10 dark:bg-white/10 rounded-2xl flex items-center justify-center shadow-sm">
              {isPlaying ? (
                <div className="flex gap-2">
                  <div className="w-3 h-10 bg-zinc-900 dark:bg-white rounded-full" />
                  <div className="w-3 h-10 bg-zinc-900 dark:bg-white rounded-full" />
                </div>
              ) : (
                <Play className="w-12 h-12 text-zinc-900 dark:text-white fill-current translate-x-1" />
              )}
            </div>
            <SkipForward className="w-16 h-16 text-zinc-900 dark:text-white fill-current" />
          </div>
          <ImageLogo
            type="apple"
            className="w-12 h-12 text-zinc-900 dark:text-white opacity-40 transition-opacity"
          />
        </div>
      </div>
    );
  }

  if (preset === "apple-mini") {
    return (
      <div
        className={`w-[450px] font-apple bg-white/40 dark:bg-zinc-900/60 backdrop-blur-3xl rounded-[4rem] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white/30 dark:border-white/10 flex flex-col gap-10 aspect-square justify-center`}
      >
        <div className="flex justify-between items-start">
          <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-xl shrink-0">
            {coverImage && (
              <img
                src={coverImage}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            )}
          </div>
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
            <ImageLogo type="apple" className="w-6 h-6 text-white/60" />
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <h2 className="text-zinc-900 dark:text-white text-[2.8rem] font-bold truncate font-apple">
            {track?.title || "Track Title"}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-[2rem] font-medium truncate font-apple">
            {track?.artist || "Artist Name"}
          </p>
        </div>

        <div className="flex items-center justify-center gap-12 pt-2 text-zinc-900 dark:text-white">
          <SkipBack className="w-12 h-12 fill-current" />
          <div className="flex items-center justify-center w-20 h-20 bg-zinc-900/5 dark:bg-white/10 rounded-2xl">
            {isPlaying ? (
              <div className="flex gap-1.5">
                <div className="w-2.5 h-8 bg-current rounded-full" />
                <div className="w-2.5 h-8 bg-current rounded-full" />
              </div>
            ) : (
              <Play className="w-10 h-10 fill-current translate-x-1" />
            )}
          </div>
          <SkipForward className="w-12 h-12 fill-current" />
        </div>
      </div>
    );
  }

  if (preset === "apple-bar") {
    return (
      <div
        className={`w-[940px] font-apple bg-white/30 dark:bg-zinc-900/60 backdrop-blur-3xl rounded-[2.5rem] h-[140px] px-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] flex items-center gap-8 border border-white/30 dark:border-white/10`}
      >
        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl shrink-0">
          {coverImage && (
            <img
              src={coverImage}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          )}
        </div>
        <h2 className="text-zinc-900 dark:text-white text-[2.8rem] font-bold truncate flex-1 font-apple">
          {track?.title || "Track Title"}
        </h2>
        <div className="flex items-center gap-14 pr-4">
          <SkipBack className="w-10 h-10 text-zinc-900 dark:text-white fill-current" />
          <div className="flex items-center justify-center">
            {isPlaying ? (
              <div className="flex gap-1.5">
                <div className="w-2 h-7 bg-zinc-900 dark:bg-white rounded-full" />
                <div className="w-2 h-7 bg-zinc-900 dark:bg-white rounded-full" />
              </div>
            ) : (
              <Play className="w-8 h-8 text-zinc-900 dark:text-white fill-current translate-x-0.5" />
            )}
          </div>
          <SkipForward className="w-10 h-10 text-zinc-900 dark:text-white fill-current" />
        </div>
      </div>
    );
  }

  if (preset === "apple") {
    return (
      <div
        className={`${widgetWidth} font-apple bg-zinc-100/30 dark:bg-zinc-900/40 backdrop-blur-3xl rounded-[4.5rem] p-16 shadow-[0_45px_100px_-20px_rgba(0,0,0,0.4)] border border-white/20 dark:border-white/10 flex flex-col items-center text-center gap-12`}
      >
        {/* Cover Art - Apple Style (Floating) */}
        <div className="w-full aspect-square rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-10px_rgba(0,0,0,0.3)] bg-black/10 transition-transform hover:scale-[1.02] duration-700">
          {coverImage ? (
            <img
              src={coverImage}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
              <ImageLogo type="apple" className="w-48 h-48 opacity-10" />
            </div>
          )}
        </div>

        {/* Info & Controls */}
        <div className="flex flex-col w-full gap-10">
          <div className="space-y-2">
            <h2 className="text-zinc-900 dark:text-white text-[3.8rem] font-bold tracking-tight px-4 truncate font-apple">
              {track?.title || "Track Title"}
            </h2>
            <p className="text-rose-500 dark:text-rose-400 text-[2.6rem] font-medium tracking-tight px-4 truncate">
              {track?.artist || "Artist Name"}
            </p>
          </div>

          {/* Apple Progress Slider */}
          <div className="flex flex-col gap-4 px-2">
            <div className="w-full h-[10px] rounded-full bg-black/10 dark:bg-white/10 relative backdrop-blur-sm">
              <div
                className="absolute top-0 left-0 h-full bg-zinc-600 dark:bg-white/90 rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-zinc-500 font-semibold text-[1.5rem] px-1">
              <span>{formatTime((track?.duration || 180000) * progress)}</span>
              <span>
                -{formatTime((track?.duration || 180000) * (1 - progress))}
              </span>
            </div>
          </div>

          {/* Minimal Controls */}
          <div className="flex items-center justify-center gap-24 py-4">
            <SkipBack className="w-20 h-20 text-zinc-900 dark:text-white fill-current opacity-80" />
            <div className="hover:scale-110 transition-transform">
              {isPlaying ? (
                <Pause className="w-24 h-24 text-zinc-900 dark:text-white fill-current" />
              ) : (
                <Play className="w-24 h-24 text-zinc-900 dark:text-white fill-current" />
              )}
            </div>
            <SkipForward className="w-20 h-20 text-zinc-900 dark:text-white fill-current opacity-80" />
          </div>

          {/* Volume Slider - Subtle Apple touch */}
          <div className="flex items-center gap-6 px-12 opacity-30 mt-2">
            <div className="w-4 h-4 rounded-full bg-current" />
            <div className="h-[4px] flex-1 bg-current/20 rounded-full" />
            <div className="w-5 h-5 rounded-full border-2 border-current" />
          </div>
        </div>
      </div>
    );
  }

  // Minimal preset - Clean & Professional
  return (
    <div
      className={`${widgetWidth} bg-white dark:bg-zinc-900 rounded-[3rem] p-12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] flex items-center gap-14 border border-zinc-200 dark:border-zinc-800`}
    >
      <div className="w-64 h-64 rounded-[2rem] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 shadow-md">
        {coverImage && (
          <img
            src={coverImage}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        )}
      </div>
      <div className="flex flex-col flex-1 overflow-hidden pr-4">
        <h2 className="text-black dark:text-white text-[3.2rem] font-bold truncate tracking-tight font-inherit">
          {track?.title || "Track Title"}
        </h2>
        <p className="text-zinc-500 text-[2rem] truncate mt-1">
          {track?.artist || "Artist Name"}
        </p>

        <div className="flex items-center gap-8 mt-12">
          <div className="w-20 h-20 rounded-full bg-black dark:bg-white flex items-center justify-center shrink-0 shadow-xl">
            {isPlaying ? (
              <Pause className="w-10 h-10 text-white dark:text-black fill-current" />
            ) : (
              <Play className="w-10 h-10 text-white dark:text-black fill-current translate-x-1" />
            )}
          </div>
          <div className="h-3 flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-full relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-black dark:bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerWidget;
