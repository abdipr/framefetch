import {
  MessageCircle,
  Repeat2,
  Heart,
  Bookmark,
  Share,
  MoreHorizontal,
  BadgeCheck,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Dot,
} from "lucide-react";
import useStore from "@/store/useStore";

const XWidget = () => {
  const {
    xType,
    xTweetType,
    xName,
    xUsername,
    xVerified,
    xAvatar,
    xContent,
    xImage,
    xDate,
    xStats,
    xTheme,
    xProfile,
  } = useStore();

  const themeStyles = {
    light: {
      bg: "bg-white",
      text: "text-black",
      secondary: "text-zinc-500",
      border: "border-zinc-100",
      accent: "text-[#1d9bf0]",
      hover: "hover:bg-zinc-50",
    },
    dim: {
      bg: "bg-[#15202b]",
      text: "text-white",
      secondary: "text-[#8b98a5]",
      border: "border-[#38444d]",
      accent: "text-[#1d9bf0]",
      hover: "hover:bg-[#1e2732]",
    },
    dark: {
      bg: "bg-black",
      text: "text-white",
      secondary: "text-[#71767b]",
      border: "border-[#2f3336]",
      accent: "text-[#1d9bf0]",
      hover: "hover:bg-[#080808]",
    },
  };

  const currentTheme = themeStyles[xTheme] || themeStyles.dark;

  const VerifiedBadge = ({ type }) => {
    if (type === "none") return null;
    const colors = {
      blue: "text-[#1d9bf0]",
      gold: "text-[#ffd700]",
      grey: "text-[#829aab]",
    };
    return (
      <BadgeCheck
        className={`w-[18px] h-[18px] fill-current ${colors[type]} inline-block ml-1 mb-0.5`}
      />
    );
  };

  if (xType === "profile") {
    return (
      <div
        className={`w-full h-full ${currentTheme.bg} ${currentTheme.text} font-x flex flex-col relative`}
      >
        {/* Banner */}
        <div
          className={`w-full aspect-3/1 ${xTheme === "light" ? "bg-zinc-200" : "bg-zinc-800"} relative shrink-0 overflow-hidden`}
        >
          {xProfile.banner && (
            <img src={xProfile.banner} className="w-full h-full object-cover" />
          )}
        </div>

        {/* Profile Info Area */}
        <div className="px-4 relative flex-1">
          {/* Avatar Area */}
          <div className="flex justify-between items-start h-24 lg:h-32">
            <div
              className={`w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] lg:w-[200px] lg:h-[200px] rounded-full border-[6px] ${xTheme === "light" ? "border-white" : "border-black"} ${currentTheme.bg} -mt-[70px] sm:-mt-[80px] lg:-mt-[100px] relative z-20 overflow-hidden shrink-0 shadow-xl`}
            >
              {xAvatar ? (
                <img src={xAvatar} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800" />
              )}
            </div>
            <div className="pt-6">
              <button
                className={`px-8 py-3 rounded-full border-2 ${currentTheme.border} font-black text-xl hover:opacity-80 transition-opacity`}
              >
                Edit profile
              </button>
            </div>
          </div>

          {/* User Names */}
          <div className="mt-6 font-x">
            <h1 className="text-5xl lg:text-6xl font-black font-x flex items-center tracking-tight gap-2">
              {xName} <VerifiedBadge type={xVerified} />
            </h1>
            <p
              className={`${currentTheme.secondary} text-2xl lg:text-3xl mt-1`}
            >
              @{xUsername}
            </p>
          </div>

          {/* Bio */}
          <div className="mt-6 text-2xl lg:text-3xl leading-relaxed whitespace-pre-wrap">
            {xProfile.bio}
          </div>

          {/* Meta Info */}
          <div
            className={`mt-6 flex flex-wrap gap-y-2 gap-x-8 ${currentTheme.secondary} text-xl lg:text-2xl`}
          >
            {xProfile.location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-6 h-6" /> {xProfile.location}
              </span>
            )}
            {xProfile.link && (
              <span className="flex items-center gap-2 text-[#1d9bf0] hover:underline cursor-pointer">
                <LinkIcon className="w-6 h-6" /> {xProfile.link}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Calendar className="w-6 h-6" /> {xProfile.joinDate}
            </span>
          </div>

          {/* Stats */}
          <div className="mt-6 flex gap-8 text-xl lg:text-2xl">
            <span className="flex gap-2">
              <span className="font-black">{xProfile.following}</span>
              <span className={currentTheme.secondary}>Following</span>
            </span>
            <span className="flex gap-2">
              <span className="font-black">{xProfile.followers}</span>
              <span className={currentTheme.secondary}>Followers</span>
            </span>
          </div>
        </div>

        {/* Tabs Mockup */}
        <div className={`mt-8 border-b-2 ${currentTheme.border} flex`}>
          {["Posts", "Replies", "Highlights", "Media", "Likes"].map(
            (tab, i) => (
              <div
                key={tab}
                className={`flex-1 text-center py-6 text-xl lg:text-2xl font-black font-x relative cursor-pointer ${i === 0 ? currentTheme.text : currentTheme.secondary}`}
              >
                {tab}
                {i === 0 && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-[#1d9bf0] rounded-full" />
                )}
              </div>
            ),
          )}
        </div>
      </div>
    );
  }

  if (xTweetType === "timeline") {
    return (
      <div
        className={`w-full h-full ${currentTheme.bg} ${currentTheme.text} font-x p-6 lg:p-8 flex flex-col`}
      >
        <div className="flex items-start gap-4 lg:gap-6">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-800">
            {xAvatar ? (
              <img src={xAvatar} className="w-full h-full object-cover" />
            ) : null}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <span className="font-black text-xl lg:text-2xl flex items-center gap-1.5">
                  {xName} <VerifiedBadge type={xVerified} />
                </span>
                <span
                  className={`${currentTheme.secondary} text-lg lg:text-xl truncate`}
                >
                  @{xUsername}
                </span>
                <span
                  className={`${currentTheme.secondary} text-lg lg:text-xl`}
                >
                  · Apr 19
                </span>
              </div>
              <MoreHorizontal className={`${currentTheme.secondary} w-6 h-6`} />
            </div>

            <div className="mt-1 text-xl lg:text-2xl leading-normal wrap-break-word">
              {xContent}
            </div>

            {xImage && (
              <div
                className={`mt-3 rounded-[1.5rem] border-2 ${currentTheme.border} overflow-hidden max-h-[600px] w-full shadow-sm`}
              >
                <img src={xImage} className="w-full h-full object-cover" />
              </div>
            )}

            <div
              className={`flex justify-between max-w-md mt-4 ${currentTheme.secondary}`}
            >
              <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1d9bf0]">
                <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                  <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <span className="text-base font-medium">{xStats.retweets}</span>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer hover:text-[#00ba7c]">
                <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10 transition-colors">
                  <Repeat2 className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <span className="text-base font-medium">{xStats.quotes}</span>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer hover:text-[#f91880]">
                <div className="p-2 rounded-full group-hover:bg-[#f91880]/10 transition-colors">
                  <Heart className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <span className="text-base font-medium">{xStats.likes}</span>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1d9bf0]">
                <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                  <Share className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <span className="text-base font-medium">{xStats.views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detail View (current default)
  return (
    <div
      className={`w-full h-full ${currentTheme.bg} ${currentTheme.text} font-x p-8 lg:p-12 flex flex-col`}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-800">
              {xAvatar ? (
                <img src={xAvatar} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-black text-2xl lg:text-3xl truncate flex items-center gap-2">
                {xName} <VerifiedBadge type={xVerified} />
              </span>
              <span
                className={`${currentTheme.secondary} text-xl lg:text-2xl truncate`}
              >
                @{xUsername}
              </span>
            </div>
          </div>
          <MoreHorizontal
            className={`${currentTheme.secondary} w-8 h-8 shrink-0 mt-2`}
          />
        </div>

        <div className="mt-2 text-3xl lg:text-4xl leading-[1.3] whitespace-pre-wrap wrap-break-word font-medium">
          {xContent}
        </div>

        {xImage && (
          <div
            className={`mt-2 rounded-[2rem] border-2 ${currentTheme.border} overflow-hidden max-h-[800px] w-full shadow-sm`}
          >
            <img src={xImage} className="w-full h-full object-cover" />
          </div>
        )}

        <div
          className={`mt-4 flex items-center text-xl lg:text-2xl ${currentTheme.secondary} border-b-2 ${currentTheme.border} pb-6`}
        >
          <span>{xDate}</span>
          <span className="px-2">·</span>
          <span className="font-bold text-white dark:text-white">
            {xStats.views}
          </span>
          <span className="ml-1">Views</span>
        </div>

        <div
          className={`pt-2 pb-6 border-b-2 ${currentTheme.border} flex flex-wrap gap-x-10 gap-y-4 text-xl lg:text-2xl`}
        >
          <div className="flex items-center gap-2">
            <span className="font-black">{xStats.retweets}</span>
            <span className={currentTheme.secondary}>Retweets</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black">{xStats.quotes}</span>
            <span className={currentTheme.secondary}>Quotes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black">{xStats.likes}</span>
            <span className={currentTheme.secondary}>Likes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black">{xStats.bookmarks}</span>
            <span className={currentTheme.secondary}>Bookmarks</span>
          </div>
        </div>

        <div className={`flex justify-between py-2 ${currentTheme.secondary}`}>
          <span
            className={`p-4 rounded-full ${currentTheme.hover} transition-colors`}
          >
            <MessageCircle className="w-8 h-8" />
          </span>
          <span
            className={`p-4 rounded-full ${currentTheme.hover} transition-colors`}
          >
            <Repeat2 className="w-8 h-8" />
          </span>
          <span
            className={`p-4 rounded-full ${currentTheme.hover} transition-colors`}
          >
            <Heart className="w-8 h-8" />
          </span>
          <span
            className={`p-4 rounded-full ${currentTheme.hover} transition-colors`}
          >
            <Bookmark className="w-8 h-8" />
          </span>
          <span
            className={`p-4 rounded-full ${currentTheme.hover} transition-colors`}
          >
            <Share className="w-8 h-8" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default XWidget;
