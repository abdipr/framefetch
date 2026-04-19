import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULTS } from "@/lib/constants";
import { getBase64Image } from "@/lib/utils";
import { fetchTrackById, fetchLyricsAPI } from "@/services/api";

const useStore = create(
  persist(
    (set, get) => ({
      route: ["music", "x", "tools", "about", "terms", "privacy"].includes(window.location.pathname.slice(1))
        ? window.location.pathname.slice(1)
        : window.location.search.includes("type") 
          ? "music" 
          : "landing",
      theme: DEFAULTS.theme,
      track: null,
      coverBase64: null,
      lyrics: [],
      selectedLines: [],

      // Customization
      mode: DEFAULTS.mode,
      preset: DEFAULTS.preset,
      format: DEFAULTS.format,
      cardScale: DEFAULTS.cardScale,
      textAlign: DEFAULTS.textAlign,
      progress: 0.3,
      isPlaying: true,

      exportQuality: 2, // 1=SD, 2=HD, 3=FHD
      exportFormat: "png",

      isMobileDrawerOpen: false,

      // --- X/Twitter Mockup State ---
      xType: 'tweet', // 'tweet' | 'profile'
      xTweetType: 'detail', // 'timeline' | 'detail'
      xName: 'Antigravity',
      xUsername: 'antigravity_ai',
      xVerified: 'blue', // 'none' | 'blue' | 'gold' | 'grey'
      xAvatar: null,
      xContent: 'Building the future of coding with FrameFetch! 🚀',
      xImage: null,
      xDate: '10:51 AM · Apr 19, 2026',
      xStats: {
        retweets: 42,
        quotes: 12,
        likes: 128,
        bookmarks: 5,
        views: '1.2K'
      },
      xTheme: 'dark', // 'light' | 'dark' | 'dim'
      xProfile: {
        banner: null,
        bio: 'AI Coding Assistant by Google DeepMind. Helping you build amazing things.',
        location: 'Mountain View, CA',
        link: 'antigravity.ai',
        joinDate: 'Joined January 2024',
        following: 128,
        followers: '10.5K'
      },

      // --- Actions ---
      setRoute: (route) => set({ route }),

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),

      setCustomization: (opts) => set((state) => ({ ...state, ...opts })),

      setExportSettings: (opts) => set((state) => ({ ...state, ...opts })),

      setMobileDrawerOpen: (val) => set({ isMobileDrawerOpen: val }),

      // X Actions
      setXState: (opts) => set((state) => ({ ...state, ...opts })),
      setXStats: (stats) => set((state) => ({ xStats: { ...state.xStats, ...stats } })),
      setXProfile: (profile) => set((state) => ({ xProfile: { ...state.xProfile, ...profile } })),

      setMode: (mode) => set({ mode }),

      setPreset: (preset) => set({ preset }),

      setFormat: (format) => set({ format }),

      setTrack: async (track) => {
        set({ track, lyrics: [], selectedLines: [], coverBase64: null });
        if (track?.coverUrl) {
          const b64 = await getBase64Image(track.coverUrl);
          set({ coverBase64: b64 });
        }
      },

      setLyrics: (lyricsStr) => {
        const lines = typeof lyricsStr === 'string' 
          ? lyricsStr.split("\n").filter((l) => l.trim() !== "")
          : lyricsStr;
        set({ lyrics: lines, selectedLines: [] });
      },

      toggleLine: (index) =>
        set((state) => {
          const current = state.selectedLines;
          if (current.includes(index)) {
            return {
              selectedLines: current.filter((i) => i !== index).sort((a, b) => a - b),
            };
          }
          if (current.length >= 6) return state;
          return { selectedLines: [...current, index].sort((a, b) => a - b) };
        }),

      syncFromUrl: async () => {
        const params = new URLSearchParams(window.location.search);
        
        // Basic settings
        const mode = params.get("type");
        const preset = params.get("preset");
        const format = params.get("format");
        const scale = params.get("scale");
        const align = params.get("align");
        const progress = params.get("progress");
        const playing = params.get("playing");
        
        if (mode) set({ route: "music", mode });
        if (window.location.pathname.includes("/x")) set({ route: "x" });
        if (window.location.pathname.includes("/music")) set({ route: "music" });
        if (window.location.pathname.includes("/tools")) set({ route: "tools" });
        if (preset) set({ preset });
        if (format) set({ format });
        if (scale) set({ cardScale: parseFloat(scale) });
        if (align) set({ textAlign: align });
        if (progress) set({ progress: parseFloat(progress) });
        if (playing) set({ isPlaying: playing === "1" });

        // Selected lines
        const lines = params.get("lines");
        if (lines) {
          set({ selectedLines: lines.split(",").map(Number).sort((a, b) => a - b) });
        }

        // Track recovery
        const id = params.get("id");
        if (id) {
          try {
            const trackData = await fetchTrackById(id);
            if (trackData) {
              set({ track: trackData });
              if (trackData.coverUrl) {
                const b64 = await getBase64Image(trackData.coverUrl);
                set({ coverBase64: b64 });
              }
              
              // Refetch lyrics if in lyrics mode
              const lyricsText = await fetchLyricsAPI(trackData.title, trackData.artist);
              if (lyricsText) {
                const linesArr = lyricsText.split("\n").filter((l) => l.trim() !== "");
                set({ lyrics: linesArr });
              }
            }
          } catch (err) {
            console.error("Failed to sync track from URL", err);
          }
        }
      },

      syncToUrl: () => {
        const state = get();
        let path = "/";
        if (state.route === "music" || state.route === "editor") path = "/music";
        if (state.route === "x") path = "/x";
        if (state.route === "tools") path = "/tools";

        if (state.route === "landing") {
          window.history.replaceState(null, "", "/");
          return;
        }

        const params = new URLSearchParams();
        
        if (state.route === "x") {
          params.set("xtype", state.xType);
          params.set("xtheme", state.xTheme);
          // (Can add more X params here if needed)
        } else {
          params.set("type", state.mode);
          params.set("preset", state.preset);
          params.set("format", state.format);
          params.set("scale", state.cardScale.toString());
          params.set("align", state.textAlign);
          params.set("progress", state.progress.toFixed(2));
          params.set("playing", state.isPlaying ? "1" : "0");
          
          if (state.track?.id) {
            params.set("id", state.track.id.toString());
          }
          
          if (state.selectedLines.length > 0) {
            params.set("lines", state.selectedLines.join(","));
          }
        }

        const search = params.toString() ? `?${params.toString()}` : "";
        window.history.replaceState(null, "", `${path}${search}`);
      },

      resetToDefault: () =>
        set({
          mode: DEFAULTS.mode,
          preset: DEFAULTS.preset,
          format: DEFAULTS.format,
          cardScale: DEFAULTS.cardScale,
          textAlign: DEFAULTS.textAlign,
          progress: 0.3,
          isPlaying: true,
          track: null,
          coverBase64: null,
          lyrics: [],
          selectedLines: [],
        }),
    }),
    {
      name: "framefetch-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["isMobileDrawerOpen"].includes(key)
          )
        ),
    }
  )
);

export default useStore;
