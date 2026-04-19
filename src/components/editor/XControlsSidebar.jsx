import {
  RotateCcw,
  User,
  MessageSquare,
  BadgeCheck,
  Image as ImageIcon,
  BarChart2,
  Calendar,
  Layers,
  Palette,
  Layout,
  Globe,
  MapPin,
} from "lucide-react";
import useStore from "@/store/useStore";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const XControlsSidebar = () => {
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
    setXState,
    setXStats,
    setXProfile,
    format,
    setFormat,
    cardScale,
    setCustomization,
    resetToDefault,
  } = useStore();

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setXState({ [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full lg:overflow-y-auto custom-scrollbar lg:pr-2 pb-24 lg:pb-0">
      {/* Global Reset */}
      <div className="flex justify-between items-center px-2">
        <h2 className="font-heading text-lg tracking-tight text-zinc-900 dark:text-white">
          X Mockup Editor
        </h2>
        <button
          onClick={resetToDefault}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Type Selector */}
      <section className="flex flex-col gap-4">
        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1">
          Mockup Type
        </h3>
        <Tabs
          value={xType}
          onValueChange={(val) => setXState({ xType: val })}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-11 bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-1">
            <TabsTrigger
              value="tweet"
              className="rounded-xl font-bold flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Tweet
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="rounded-xl font-bold flex items-center gap-2"
            >
              <User className="w-4 h-4" /> Profile
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {/* User Info Section */}
      <section className="flex flex-col gap-4 bg-white dark:bg-zinc-900/50 p-5 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm relative group">
        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1">
          Identity
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
              Display Name
            </label>
            <Input
              value={xName}
              onChange={(e) => setXState({ xName: e.target.value })}
              placeholder="Display Name"
              className="rounded-xl border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">
                @
              </span>
              <Input
                value={xUsername}
                onChange={(e) => setXState({ xUsername: e.target.value })}
                placeholder="username"
                className="pl-7 rounded-xl border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
              Verification
            </label>
            <Tabs
              value={xVerified}
              onValueChange={(val) => setXState({ xVerified: val })}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl p-1">
                <TabsTrigger
                  value="none"
                  className="rounded-lg text-[10px] font-bold"
                >
                  None
                </TabsTrigger>
                <TabsTrigger
                  value="blue"
                  className="rounded-lg text-[10px] font-bold text-blue-500"
                >
                  Blue
                </TabsTrigger>
                <TabsTrigger
                  value="gold"
                  className="rounded-lg text-[10px] font-bold text-yellow-500"
                >
                  Gold
                </TabsTrigger>
                <TabsTrigger
                  value="grey"
                  className="rounded-lg text-[10px] font-bold text-zinc-500"
                >
                  Grey
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 flex items-center justify-between">
              Avatar Image
              {xAvatar && (
                <button
                  onClick={() => setXState({ xAvatar: null })}
                  className="text-rose-500 hover:underline"
                >
                  Remove
                </button>
              )}
            </label>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 shrink-0">
                {xAvatar ? (
                  <img src={xAvatar} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
              <label className="flex-1 cursor-pointer">
                <div className="px-4 py-2 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors text-center text-xs font-bold text-zinc-500">
                  Click to Upload
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "xAvatar")}
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section (for Tweet) */}
      {xType === "tweet" && (
        <section className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1">
            Tweet Settings
          </h3>
          <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Tweet Type</label>
              <Tabs
                value={xTweetType}
                onValueChange={(val) => setXState({ xTweetType: val })}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl p-1">
                  <TabsTrigger value="timeline" className="rounded-lg text-[10px] font-bold">Timeline</TabsTrigger>
                  <TabsTrigger value="detail" className="rounded-lg text-[10px] font-bold">Detail (Enlarged)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
                Tweet Text
              </label>
              <Textarea
                value={xContent}
                onChange={(e) => setXState({ xContent: e.target.value })}
                placeholder="What's happening?"
                className="rounded-xl min-h-[100px] border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 flex items-center justify-between">
                Attachment Image
                {xImage && (
                  <button
                    onClick={() => setXState({ xImage: null })}
                    className="text-rose-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </label>
              <label className="block cursor-pointer">
                <div
                  className={`rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors overflow-hidden ${xImage ? "aspect-video" : "p-6"}`}
                >
                  {xImage ? (
                    <img src={xImage} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-xs font-bold tracking-tight">
                        Upload media
                      </span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "xImage")}
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
                Date String
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  value={xDate}
                  onChange={(e) => setXState({ xDate: e.target.value })}
                  placeholder="10:51 AM · Apr 19, 2026"
                  className="pl-9 rounded-xl border-zinc-200 dark:border-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
                  Stats - Likes
                </label>
                <Input
                  value={xStats.likes}
                  onChange={(e) => setXStats({ likes: e.target.value })}
                  className="rounded-xl border-zinc-200 dark:border-zinc-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
                  Stats - Retweets
                </label>
                <Input
                  value={xStats.retweets}
                  onChange={(e) => setXStats({ retweets: e.target.value })}
                  className="rounded-xl border-zinc-200 dark:border-zinc-800"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Section (for Profile) */}
      {xType === "profile" && (
        <section className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1">
            Profile Details
          </h3>
          <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 flex items-center justify-between">
                Banner Image
                {xProfile.banner && (
                  <button
                    onClick={() => setXProfile({ banner: null })}
                    className="text-rose-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </label>
              <label className="block cursor-pointer">
                <div
                  className={`rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors overflow-hidden ${xProfile.banner ? "aspect-3/1" : "py-4"}`}
                >
                  {xProfile.banner ? (
                    <img
                      src={xProfile.banner}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-zinc-400">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-[10px] font-bold">
                        Upload banner
                      </span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () =>
                        setXProfile({ banner: reader.result });
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
                Bio
              </label>
              <Textarea
                value={xProfile.bio}
                onChange={(e) => setXProfile({ bio: e.target.value })}
                placeholder="Tell us about yourself"
                className="rounded-xl min-h-[80px] border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <Input
                    value={xProfile.location}
                    onChange={(e) => setXProfile({ location: e.target.value })}
                    className="pl-9 rounded-xl text-xs h-9 border-zinc-200 dark:border-zinc-800"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <Input
                    value={xProfile.link}
                    onChange={(e) => setXProfile({ link: e.target.value })}
                    className="pl-9 rounded-xl text-xs h-9 border-zinc-200 dark:border-zinc-800"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
                  Following
                </label>
                <Input
                  value={xProfile.following}
                  onChange={(e) => setXProfile({ following: e.target.value })}
                  className="rounded-xl text-xs h-9 border-zinc-200 dark:border-zinc-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
                  Followers
                </label>
                <Input
                  value={xProfile.followers}
                  onChange={(e) => setXProfile({ followers: e.target.value })}
                  className="rounded-xl text-xs h-9 border-zinc-200 dark:border-zinc-800"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Style & Layout Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 px-1">
          <Palette className="w-4 h-4 text-zinc-400" />
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            Appearance
          </h3>
        </div>

        <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-sm">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
              X Theme
            </label>
            <Tabs
              value={xTheme}
              onValueChange={(val) => setXState({ xTheme: val })}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 h-11 bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-1">
                <TabsTrigger
                  value="light"
                  className="rounded-xl font-bold bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800"
                >
                  Light
                </TabsTrigger>
                <TabsTrigger
                  value="dim"
                  className="rounded-xl font-bold bg-[#15202b] text-white"
                >
                  Dim
                </TabsTrigger>
                <TabsTrigger
                  value="dark"
                  className="rounded-xl font-bold bg-black text-white"
                >
                  Dark
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Frame Scale
              </label>
              <span className="text-xs font-black text-zinc-400">
                {Math.round(cardScale * 100)}%
              </span>
            </div>
            <Slider
              min={0.5}
              max={1.5}
              step={0.1}
              value={[cardScale]}
              onValueChange={(val) => setCustomization({ cardScale: val[0] })}
              className="flex-1"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["1:1", "3:4", "9:16"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`h-12 rounded-xl border text-[10px] font-black flex flex-col items-center justify-center gap-1 transition-all duration-300 ${format === f ? "border-zinc-900 bg-white ring-2 ring-zinc-900/5 dark:border-white dark:bg-zinc-900 dark:ring-white/5" : "border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Export Section */}
      <section className="flex flex-col gap-6 pt-8 mt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 text-center">
            Export Settings
          </h3>
          {/* Reuse generic export settings if possible, or just copy-paste for simplicity */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 text-center block">
                Format
              </label>
              <Tabs defaultValue="png" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-9 bg-white dark:bg-zinc-800 rounded-xl p-1">
                  <TabsTrigger
                    value="png"
                    className="rounded-lg text-[10px] font-bold"
                  >
                    PNG
                  </TabsTrigger>
                  <TabsTrigger
                    value="jpeg"
                    className="rounded-lg text-[10px] font-bold"
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
  );
};

export default XControlsSidebar;
