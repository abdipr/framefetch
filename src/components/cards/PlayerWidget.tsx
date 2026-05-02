import { useState } from "react";
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

import { Track } from "@/store/useStore";

interface PlayerWidgetProps {
  track: Track | null;
  preset: string;
  coverImage: string | null;
  progress: number;
  isPlaying: boolean;
}

const PlayerWidget = ({
  track,
  preset,
  coverImage,
  progress,
  isPlaying,
}: PlayerWidgetProps) => {
  const [providerIndex, setProviderIndex] = useState(0);
  const [signalStrength, setSignalStrength] = useState(4);
  const [networkType, setNetworkType] = useState("4G");
  const [batteryIndex, setBatteryIndex] = useState(4); // Default to 90%
  const batteryLevels = [5, 25, 50, 75, 90];
  const providers = [
    "Smartfren",
    "Telkomsel",
    "Indosat Ooredoo",
    "XL Axiata",
    "3",
    "by.U",
    "No Service",
  ];

  if (preset === "lockscreen") {
    const officialToggleStyle = {
      width: "58px",
      height: "58px",
      borderRadius: "1000px",
      backgroundColor: "transparent",
    };

    const now = new Date();
    const timeStr = now
      .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      .replace(":", ".");
    const dateStr = now.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    const durationMs = track?.duration_ms || 180000;
    const currentMs = durationMs * (progress || 0);
    const formatTimeLocal = (ms: number) => {
      const totalSeconds = Math.floor(ms / 1000);
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      return `${m}.${s.toString().padStart(2, "0")}`;
    };

    const p = progress || 0;

    return (
      <div className="relative w-[591px] h-[1280px] shrink-0 overflow-hidden flex flex-col font-apple bg-zinc-800">
        {/* Blurred Background - uses <img> (already loaded in DOM, safe for html-to-image) */}
        {coverImage && (
          <img
            src={coverImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-140 saturate-80 opacity-70 blur-2xl top-[-15%] left-[-50%]"
          />
        )}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full px-5 pt-6">
          {/* Status Bar */}
          <div className="flex justify-between items-center text-white text-[21px] font-semibold font-apple tracking-wide px-2">
            <span
              className="opacity-80 font-medium tracking-tight relative left-[30px] cursor-pointer hover:opacity-100 active:scale-95 transition-all select-none"
              onClick={() =>
                setProviderIndex((prev) => (prev + 1) % providers.length)
              }
            >
              {providers[providerIndex]}
            </span>
            <div className="flex items-center gap-1 ">
              <svg
                width="27"
                height="18"
                viewBox="0 0 18 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer hover:opacity-100 active:scale-95 transition-all select-none"
                onClick={() => setSignalStrength((prev) => (prev + 1) % 5)}
              >
                <rect
                  y="8"
                  width="3"
                  height="4"
                  rx="1"
                  fill="white"
                  fillOpacity={signalStrength >= 1 ? 1 : 0.3}
                  className={`transition-all`}
                />
                <rect
                  x="4.5"
                  y="5"
                  width="3"
                  height="7"
                  rx="1"
                  fill="white"
                  fillOpacity={signalStrength >= 2 ? 1 : 0.3}
                  className={`transition-all`}
                />
                <rect
                  x="9"
                  y="2"
                  width="3"
                  height="10"
                  rx="1"
                  fill="white"
                  fillOpacity={signalStrength >= 3 ? 1 : 0.3}
                  className={`transition-all`}
                />
                <rect
                  x="13.5"
                  width="3"
                  height="12"
                  rx="1"
                  fill="white"
                  fillOpacity={signalStrength >= 4 ? 1 : 0.3}
                  className={`transition-all`}
                />
              </svg>
              <span
                className="text-[18px] ml-[2px] font-medium tracking-tight opacity-90 cursor-pointer hover:opacity-100 active:scale-95 transition-all select-none w-7 text-center"
                onClick={() =>
                  setNetworkType((prev) => (prev === "4G" ? "5G" : "4G"))
                }
              >
                {networkType}
              </span>
              <svg
                width="39"
                height="18"
                viewBox="0 0 26 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1.5 cursor-pointer hover:opacity-100 active:scale-95 transition-all select-none"
                onClick={() =>
                  setBatteryIndex((prev) => (prev + 1) % batteryLevels.length)
                }
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="21"
                  height="11"
                  rx="3.5"
                  stroke="white"
                  strokeWidth="1"
                  className="opacity-40"
                />
                <rect
                  x="2"
                  y="2"
                  width={(batteryLevels[batteryIndex] / 100) * 18}
                  height="8"
                  rx="1.5"
                  fill={batteryLevels[batteryIndex] <= 20 ? "#ff453a" : "white"}
                  className={`transition-all`}
                />
                <path
                  d="M23 4C24.1046 4 25 4.89543 25 6C25 7.10457 24.1046 8 23 8V4Z"
                  fill="white"
                  className="opacity-40"
                />
              </svg>
            </div>
          </div>

          {/* Lock Icon */}
          <div className="flex justify-center mt-6">
            <svg
              width="24"
              height="30"
              viewBox="0 0 16 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.6667 8.66667H13.3333C14.4379 8.66667 15.3333 9.5621 15.3333 10.6667V16.6667C15.3333 17.7712 14.4379 18.6667 13.3333 18.6667H2.66667C1.5621 18.6667 0.666668 17.7712 0.666668 16.6667V10.6667C0.666668 9.5621 1.5621 8.66667 2.66667 8.66667H3.33333V5.33333C3.33333 2.756 5.424 0.666668 8 0.666668C10.576 0.666668 12.6667 2.756 12.6667 5.33333V8.66667ZM10.6667 8.66667V5.33333C10.6667 3.86057 9.47276 2.66667 8 2.66667C6.52724 2.66667 5.33333 3.86057 5.33333 5.33333V8.66667H10.6667Z"
                fill="white"
              />
            </svg>
          </div>

          {/* Time & Date */}
          <div className="flex justify-center items-baseline gap-7 mt-6 text-white">
            <span className="text-[33px] font-medium font-apple tracking-tight">
              {timeStr}
            </span>
            <span className="text-[30px] font-medium font-apple tracking-tight capitalize opacity-80">
              {dateStr}
            </span>
          </div>

          {/* Album Cover */}
          <div className="mt-16 mx-auto w-full aspect-square rounded-[32px] overflow-hidden shadow-xl relative">
            <div
              className="w-full h-full scale-105"
              style={{
                backgroundImage: coverImage ? `url(${coverImage})` : undefined,
                backgroundColor: coverImage ? undefined : "#27272a",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>

          {/* Music Player Container (Liquid Glass) */}
          <div className="relative mt-auto mb-12 w-full rounded-[32px] overflow-hidden">
            <div className="absolute inset-0 bg-white/12 rounded-[32px]"></div>

            {/* Gradient Border Highlight (SVG for perfect gradient stroke) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="widget-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                  <stop offset="45%" stopColor="white" stopOpacity="0" />
                  <stop offset="55%" stopColor="white" stopOpacity="0" />
                  <stop offset="100%" stopColor="white" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <rect
                x="0.75"
                y="0.75"
                width="calc(100% - 1.5px)"
                height="calc(100% - 1.5px)"
                rx="32"
                ry="32"
                fill="none"
                stroke="url(#widget-grad)"
                strokeWidth="1.5"
              />
            </svg>

            {/* Widget Content */}
            <div className="relative z-10 px-8 py-5 flex flex-col w-full">
              <div className="flex items-center justify-between">
                <div className="w-12"></div>

                <div className="flex flex-col items-center flex-1 font-apple">
                  <span className="text-white/90 text-[24px] font-medium tracking-tight leading-tight truncate w-full text-center">
                    {track?.title || "Track Title"}
                  </span>
                  <span className="text-white/50 text-[24px] truncate w-full text-center tracking-tight leading-tight">
                    {track?.artist || "Artist"}
                  </span>
                </div>

                <div className="w-12 flex justify-end items-center gap-[2px] opacity-80 relative top-[-10px] left-[-8px]">
                  <div
                    className={`w-[3px] h-[16px] bg-white rounded-full ${isPlaying ? "animate-pulse" : ""}`}
                  ></div>
                  <div
                    className={`w-[3px] h-[14px] bg-white rounded-full ${isPlaying ? "animate-pulse" : ""}`}
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className={`w-[3px] h-[16px] bg-white rounded-full ${isPlaying ? "animate-pulse" : ""}`}
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className={`w-[3px] h-[10px] bg-white rounded-full ${isPlaying ? "animate-pulse" : ""}`}
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                  <div
                    className={`w-[3px] h-[12px] bg-white rounded-full ${isPlaying ? "animate-pulse" : ""}`}
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <div
                    className={`w-[3px] h-[8px] bg-white rounded-full ${isPlaying ? "animate-pulse" : ""}`}
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[16px] font-medium text-white/50 w-12 text-left font-apple tracking-wide">
                  {formatTimeLocal(currentMs)}
                </span>
                <div className="flex-1 h-[9px] bg-white/15 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-white/40 transition-all duration-300 ease-out"
                    style={{ width: `${p * 100}%` }}
                  ></div>
                </div>
                <span className="text-[16px] font-medium text-white/50 w-12 text-right font-apple tracking-wide">
                  -{formatTimeLocal(durationMs - currentMs)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-7 px-3 pb-3">
                <div className="w-12"></div>

                <div className="flex items-center gap-18">
                  <button className="text-white/30 scale-200">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 26 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M23.120291 14.390625Q23.120291 15.051636 22.773672 15.381592Q22.427053 15.711548 21.955618 15.711548Q21.532644 15.711548 21.127493 15.474243L12.723562 10.581665Q12.248953 10.304077 12.013235 10.02594Q11.777517 9.7478027 11.777517 9.359375Q11.777517 8.9685059 12.013235 8.6915894Q12.248953 8.4146729 12.723562 8.137085L21.127493 3.2445068Q21.532644 3.0072021 21.955618 3.0072021Q22.427053 3.0072021 22.773672 3.3358765Q23.120291 3.6645508 23.120291 4.3227539L23.120291 14.390625ZM11.828909 14.390625Q11.828909 15.051636 11.484976 15.381592Q11.141043 15.711548 10.664236 15.711548Q10.241262 15.711548 9.8361111 15.474243L1.4375515 10.581665Q0.95757103 10.304077 0.72185326 10.02594Q0.48613548 9.7478027 0.48613548 9.359375Q0.48613548 8.9685059 0.72185326 8.6915894Q0.95757103 8.4146729 1.4375515 8.137085L9.8361111 3.2445068Q10.241262 3.0072021 10.664236 3.0072021Q11.141043 3.0072021 11.484976 3.3358765Q11.828909 3.6645508 11.828909 4.3227539L11.828909 14.390625Z"
                      />
                    </svg>
                  </button>

                  <button className="text-white/85 scale-200">
                    {isPlaying ? (
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 30"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="currentColor"
                          d="M5.2159152 25.857758Q4.2902789 25.857758 3.8349948 25.39246Q3.3797107 24.927162 3.3797107 24.013161L3.3797107 6.3514938Q3.3797107 5.4376831 3.8408122 4.9764862Q4.3019137 4.5152893 5.2159152 4.5152893L8.1419783 4.5152893Q9.0437727 4.5152893 9.5090704 4.9697151Q9.9743681 5.4241409 9.9743681 6.3514938L9.9743681 24.013161Q9.9743681 24.927162 9.5090704 25.39246Q9.0437727 25.857758 8.1419783 25.857758L5.2159152 25.857758ZM14.732059 25.857758Q13.810428 25.857758 13.348945 25.39246Q12.887462 24.927162 12.887462 24.013161L12.887462 6.3514938Q12.887462 5.4376831 13.352759 4.9764862Q13.818057 4.5152893 14.732059 4.5152893L17.649921 4.5152893Q18.563732 4.5152893 19.024834 4.9697151Q19.485935 5.4241409 19.485935 6.3514938L19.485935 24.013161Q19.485935 24.927162 19.024834 25.39246Q18.563732 25.857758 17.649921 25.857758L14.732059 25.857758Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="32"
                        height="32"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        fill="#ffffff"
                      >
                        <path
                          d="M128 104.3v303.4c0 6.4 6.5 10.4 11.7 7.2l240.5-151.7c5.1-3.2 5.1-11.1 0-14.3L139.7 97.2c-5.2-3.3-11.7.7-11.7 7.1z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                  </button>

                  <button className="text-white/85 scale-200">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 26 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M2.1897488 14.390625L2.1897488 4.3227539Q2.1897488 3.6645508 2.5375881 3.3358765Q2.8854275 3.0072021 3.3569851 3.0072021Q3.7798367 3.0072021 4.184988 3.2445068L12.588919 8.137085Q13.061087 8.4146729 13.296804 8.6915894Q13.532522 8.9685059 13.532522 9.359375Q13.532522 9.7478027 13.296804 10.02594Q13.061087 10.304077 12.588919 10.581665L4.184988 15.474243Q3.7798367 15.711548 3.3569851 15.711548Q2.8854275 15.711548 2.5375881 15.381592Q2.1897488 15.051636 2.1897488 14.390625ZM13.481131 14.390625L13.481131 4.3227539Q13.481131 3.6645508 13.826284 3.3358765Q14.171438 3.0072021 14.648245 3.0072021Q15.071218 3.0072021 15.47637 3.2445068L23.874929 8.137085Q24.352468 8.4146729 24.588186 8.6915894Q24.823904 8.9685059 24.823904 9.359375Q24.823904 9.7478027 24.588186 10.02594Q24.352468 10.304077 23.874929 10.581665L15.47637 15.474243Q15.071218 15.711548 14.648245 15.711548Q14.171438 15.711548 13.826284 15.381592Q13.481131 15.051636 13.481131 14.390625Z"
                      />
                    </svg>
                  </button>
                </div>

                <button className="w-12 flex justify-end text-white/35 scale-150 left-[25px]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="currentColor"
                      transform="translate(-9.53674e-07 0)"
                      fillRule="evenodd"
                      d="M0 9.9642096C0 12.6082 1.04041 15.0197 2.72947 16.798C2.90257 16.986601 3.13833 16.9827 3.29866 16.785801L3.79582 16.235901C3.9367399 16.0623 3.9284201 15.882 3.7913799 15.7211C2.38252 14.2057 1.508 12.1787 1.508 9.9642096C1.508 5.3554702 5.3310499 1.52021 9.9642096 1.52021C14.5974 1.52021 18.420401 5.3554702 18.420401 9.9642096C18.420401 12.1749 17.5459 14.2057 16.1409 15.7172C16 15.8781 15.9917 16.058399 16.132601 16.235901L16.629801 16.785801C16.7901 16.978901 17.025801 16.986601 17.1989 16.798C18.888 15.0197 19.9284 12.6082 19.9284 9.9642096C19.9284 4.5021501 15.4629 0 9.9642096 0C4.4655299 0 0 4.5021501 0 9.9642096ZM9.4931402 11.979C9.7367201 11.6988 10.1834 11.6988 10.4353 11.979L16.3528 18.6805C16.6819 19.058399 16.4827 19.602699 15.9628 19.602699L3.9656501 19.602699C3.44575 19.602699 3.2465601 19.058399 3.5755899 18.6805L9.4931402 11.979ZM9.9642096 2.7832C13.9248 2.7832 17.145201 6.0280299 17.145201 9.9642096C17.145201 11.7742 16.474899 13.4128 15.3557 14.6829C15.1826 14.8915 14.9391 14.8831 14.7749 14.6867L14.2655 14.133C14.124 13.9715 14.1368 13.7868 14.266 13.6215C15.1173 12.6388 15.625 11.3647 15.625 9.9642096C15.625 6.8691401 13.0715 4.3034101 9.9642096 4.3034101C6.8569298 4.3034101 4.3034101 6.8691401 4.3034101 9.9642096C4.3034101 11.3609 4.8150401 12.6388 5.6623802 13.6337C5.7877698 13.799 5.80442 13.9799 5.66294 14.1413L5.16189 14.6867C4.9976802 14.8792 4.7458301 14.8915 4.5727301 14.6829C3.4535201 13.4128 2.7832 11.7742 2.7832 9.9642096C2.7832 6.0280299 6.0036101 2.7832 9.9642096 2.7832ZM9.9642096 5.5664101C12.3867 5.5664101 14.362 7.5539098 14.362 9.9642096C14.362 10.9242 14.0501 11.8148 13.5047 12.52C13.3515 12.7602 13.0847 12.7641 12.9044 12.5516L12.379 12.0029C12.2491 11.857 12.2536 11.6916 12.3473 11.5341C12.6603 11.0879 12.8418 10.5424 12.8418 9.9642096C12.8418 8.3950195 11.5334 7.0866199 9.9642096 7.0866199C8.3950195 7.0866199 7.0866199 8.3950195 7.0866199 9.9642096C7.0866199 10.5385 7.2680898 11.0879 7.58108 11.5341C7.67485 11.6916 7.6792998 11.857 7.5494599 12.0029L7.0240002 12.5478C6.8436999 12.7602 6.57688 12.7602 6.4237599 12.5283C5.8782701 11.8064 5.5664101 10.9242 5.5664101 9.9642096C5.5664101 7.5539098 7.5416999 5.5664101 9.9642096 5.5664101Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-80 justify-center pb-18">
            <button
              className="relative flex items-center justify-center scale-160 transition-transform overflow-hidden group"
              style={officialToggleStyle}
            >
              {/* Solid Glass Background Fill */}
              <div className="absolute inset-0 bg-white/12 rounded-full"></div>

              {/* Corner Reflection Border Highlights (SVG for perfect gradient stroke) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 58 58"
              >
                <defs>
                  <linearGradient id="btn-grad-1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                    <stop offset="40%" stopColor="white" stopOpacity="0" />
                    <stop offset="60%" stopColor="white" stopOpacity="0" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <circle
                  cx="29"
                  cy="29"
                  r="28.5"
                  fill="none"
                  stroke="url(#btn-grad-1)"
                  strokeWidth="1"
                />
              </svg>

              <div className="relative z-10 flex items-center justify-center scale-150 opacity-90">
                <svg width="25" height="25" viewBox="0 0 512 512" fill="white">
                  <path d="M317 32H195c-17.6 0-24 14.4-24 32h170c0-17.6-6.4-32-24-32z" />
                  <path d="M196.1 147.5c7.6 8.8 11.9 20 11.9 31.7v265.9c0 21.9 17.9 34.9 39.9 34.9h16.3c21.9 0 39.9-12.9 39.9-34.9V179.2c0-11.7 4.3-22.8 11.9-31.7 15.4-17.9 25-34.5 25-67.5H171c0 35 9.6 49.6 25.1 67.5zm31.9 90.8c0-15.6 12.6-28.3 28-28.3s28 12.7 28 28.3v35.4c0 15.6-12.6 28.3-28 28.3s-28-12.7-28-28.3v-35.4z" />
                  <circle cx="256" cy="273" r="20" />
                </svg>
              </div>
            </button>

            <button
              className="relative flex items-center justify-center scale-160 transition-transform overflow-hidden group"
              style={officialToggleStyle}
            >
              {/* Solid Glass Background Fill */}
              <div className="absolute inset-0 bg-white/12 rounded-full"></div>

              {/* Corner Reflection Border Highlights (SVG for perfect gradient stroke) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 58 58"
              >
                <defs>
                  <linearGradient id="btn-grad-2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                    <stop offset="40%" stopColor="white" stopOpacity="0" />
                    <stop offset="60%" stopColor="white" stopOpacity="0" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <circle
                  cx="29"
                  cy="29"
                  r="28.5"
                  fill="none"
                  stroke="url(#btn-grad-2)"
                  strokeWidth="1"
                />
              </svg>

              <div className="relative z-10 flex items-center justify-center scale-200 opacity-90">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 50 50"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="white"
                    transform="translate(0 14)"
                    d="M34.650043 8.2322235Q35.257587 8.2293396 35.68832 7.8014221Q36.119053 7.3735046 36.119053 6.7632141Q36.119053 6.1645966 35.686947 5.7324219Q35.254841 5.3002472 34.650043 5.3002472Q34.048679 5.3002472 33.616505 5.7324219Q33.18433 6.1645966 33.18433 6.7632141Q33.18433 7.3735046 33.615063 7.8028641Q34.045795 8.2322235 34.650043 8.2322235ZM14.959248 21.243881Q13.148838 21.243881 12.204014 20.307846Q11.25919 19.371811 11.25919 17.573486L11.25919 5.6508484Q11.25919 3.8523865 12.204014 2.91642Q13.148838 1.9804535 14.959248 1.9804535L17.856068 1.9804535Q18.298817 1.9804535 18.581234 1.9230499Q18.863651 1.8656464 19.095875 1.7072372Q19.328098 1.5488281 19.605228 1.2560425L20.514622 0.29089355Q20.818668 -0.022766113 21.140156 -0.22237396Q21.461643 -0.42198181 21.865528 -0.51886749Q22.269413 -0.61575317 22.837955 -0.61575317L27.511402 -0.61575317Q28.079945 -0.61575317 28.486851 -0.51886749Q28.893757 -0.42198181 29.212223 -0.22237396Q29.530689 -0.022766113 29.831989 0.29089355L30.741245 1.2560425Q31.027302 1.5548706 31.256504 1.7102585Q31.485706 1.8656464 31.76675 1.9230499Q32.047794 1.9804535 32.49329 1.9804535L35.480198 1.9804535Q37.290607 1.9804535 38.235432 2.91642Q39.180256 3.8523865 39.180256 5.6508484L39.180256 17.573486Q39.180256 19.371811 38.235432 20.307846Q37.290607 21.243881 35.480198 21.243881L14.959248 21.243881ZM25.221302 17.704361Q26.493793 17.704361 27.602108 17.232292Q28.710423 16.760223 29.549091 15.920181Q30.38776 15.080139 30.862782 13.965851Q31.337803 12.851562 31.337803 11.579071Q31.337803 10.300537 30.865734 9.1892014Q30.393665 8.0778656 29.555065 7.2348709Q28.716465 6.3918762 27.605129 5.9198074Q26.493793 5.4477386 25.221302 5.4477386Q23.951557 5.4477386 22.84029 5.9198074Q21.729023 6.3918762 20.890423 7.2348709Q20.051823 8.0778656 19.579754 9.1892014Q19.107685 10.300537 19.107685 11.579071Q19.107685 12.851562 19.579754 13.965851Q20.051823 15.080139 20.890423 15.920181Q21.729023 16.760223 22.84029 17.232292Q23.951557 17.704361 25.221302 17.704361ZM25.221302 15.701279Q24.367802 15.701279 23.622173 15.382469Q22.876545 15.06366 22.311024 14.498138Q21.745502 13.932617 21.425114 13.184036Q21.104725 12.435455 21.104725 11.579071Q21.104725 10.716644 21.425114 9.9696426Q21.745502 9.222641 22.311024 8.6541672Q22.876545 8.0856934 23.622173 7.7682571Q24.367802 7.4508209 25.221302 7.4508209Q26.074528 7.4508209 26.823109 7.7682571Q27.57169 8.0856934 28.135838 8.6541672Q28.699986 9.222641 29.017422 9.9696426Q29.334858 10.716644 29.334858 11.579071Q29.334858 12.435455 29.017422 13.184036Q28.699986 13.932617 28.135838 14.498138Q27.57169 15.06366 26.823109 15.382469Q26.074528 15.701279 25.221302 15.701279Z"
                  />
                </svg>
              </div>
            </button>
          </div>

          <div className="w-[210px] h-[8px] bg-white rounded-full mx-auto mt-2 mb-4 shrink-0"></div>
        </div>
      </div>
    );
  }

  const widgetWidth = "w-[940px]";

  if (preset === "spotify") {
    return (
      <div
        className={`${widgetWidth} font-spotify bg-[#121212] rounded-[2.5rem] p-12 shadow-2xl border border-white/5 flex flex-col gap-8`}
      >
        {/* Header/Album Art Area */}
        <div className="w-full aspect-square rounded-[1.5rem] overflow-hidden shadow-2xl relative group">
          {coverImage ? (
            <img src={coverImage} className="w-full h-full object-cover" />
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
              <span>
                {formatTime((track?.duration_ms || 180000) * progress)}
              </span>
              <span>{formatTime(track?.duration_ms || 180000)}</span>
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
              <img src={coverImage} className="w-full h-full object-cover" />
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
            <span>{formatTime((track?.duration_ms || 180000) * progress)}</span>
            <span>
              -{formatTime((track?.duration_ms || 180000) * (1 - progress))}
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
              <img src={coverImage} className="w-full h-full object-cover" />
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
            <img src={coverImage} className="w-full h-full object-cover" />
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
            <img src={coverImage} className="w-full h-full object-cover" />
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
              <span>
                {formatTime((track?.duration_ms || 180000) * progress)}
              </span>
              <span>
                -{formatTime((track?.duration_ms || 180000) * (1 - progress))}
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
          <img src={coverImage} className="w-full h-full object-cover" />
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
