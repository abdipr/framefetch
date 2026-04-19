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
      isCardOnly: false,

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

      setIsCardOnly: (isCardOnly) => {
        if (isCardOnly) {
          set({ isCardOnly, exportFormat: "png" });
        } else {
          set({ isCardOnly });
        }
      },

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
        const path = window.location.pathname.slice(1);
        const params = new URLSearchParams(window.location.search);
        
        // Define all valid non-landing routes
        const validRoutes = ["music", "x", "tools", "about", "terms", "privacy", "editor"];
        
        // Priority 1: Path-based routing
        if (validRoutes.includes(path)) {
          set({ route: path });
        } 
        // Priority 2: Query-based legacy routing
        else if (params.get("type")) {
          set({ route: "music" });
        }
        // Priority 3: Fallback to landing
        else {
          set({ route: "landing" });
        }

        // --- Sync shared editor settings ---
        const preset = params.get("preset");
        const format = params.get("format");
        const scale = params.get("scale");
        const align = params.get("align");
        const progress = params.get("progress");
        const playing = params.get("playing");
        
        if (preset) set({ preset });
        if (format) set({ format });
        if (scale) set({ cardScale: parseFloat(scale) });
        if (align) set({ textAlign: align });
        if (progress) set({ progress: parseFloat(progress) });
        if (playing) set({ isPlaying: playing === "1" });
        if (params.get("cardOnly")) set({ isCardOnly: params.get("cardOnly") === "1" });

        // --- Selective Syncing based on Route ---
        const currentRoute = get().route;

        if (currentRoute === "music" || currentRoute === "editor") {
          const mode = params.get("type");
          if (mode) set({ mode });

          const lines = params.get("lines");
          if (lines) {
            set({ selectedLines: lines.split(",").map(Number).sort((a, b) => a - b) });
          }

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
        }

        if (currentRoute === "x") {
          const xtype = params.get("xtype");
          const xtheme = params.get("xtheme");
          if (xtype) set({ xType: xtype });
          if (xtheme) set({ xTheme: xtheme });
        }
      },

      syncToUrl: () => {
        const state = get();
        const route = state.route;

        // 1. Determine base path
        let path = "/";
        if (route !== "landing") {
          path = `/${route}`;
        }

        // 2. Determine search params (only for editors)
        const params = new URLSearchParams();

        if (route === "music" || route === "editor") {
          params.set("type", state.mode);
          params.set("preset", state.preset);
          params.set("format", state.format);
          params.set("scale", state.cardScale.toString());
          params.set("align", state.textAlign);
          params.set("progress", state.progress.toFixed(2));
          params.set("playing", state.isPlaying ? "1" : "0");
          params.set("cardOnly", state.isCardOnly ? "1" : "0");
          
          if (state.track?.id) {
            params.set("id", state.track.id.toString());
          }
          
          if (state.selectedLines.length > 0) {
            params.set("lines", state.selectedLines.join(","));
          }
        } else if (route === "x") {
          params.set("xtype", state.xType);
          params.set("xtheme", state.xTheme);
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
