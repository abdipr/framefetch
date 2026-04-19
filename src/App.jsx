import { useEffect } from "react";
import useStore from "@/store/useStore";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LandingPage from "@/pages/LandingPage";
import MusicEditor from "@/pages/MusicEditor";
import XEditor from "@/pages/XEditor";
import AboutPage from "@/pages/AboutPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ToolsPage from "@/pages/ToolsPage";

// External scripts loaded dynamically to keep bundle size lean
const EXTERNAL_SCRIPTS = [
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js",
];

const loadScript = (src) => {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
};

export default function App() {
  const {
    theme,
    route,
    track,
    mode,
    preset,
    format,
    cardScale,
    textAlign,
    syncFromUrl,
    syncToUrl,
    progress,
    isPlaying,
    selectedLines,
  } = useStore();

  // Load external scripts once
  useEffect(() => {
    EXTERNAL_SCRIPTS.forEach(loadScript);
  }, []);

  // Sync state from URL on mount
  useEffect(() => {
    syncFromUrl();
  }, []);

  // Debounced URL sync on state changes
  useEffect(() => {
    const timer = setTimeout(syncToUrl, 500);
    return () => clearTimeout(timer);
  }, [
    track,
    mode,
    preset,
    format,
    cardScale,
    textAlign,
    route,
    progress,
    isPlaying,
    selectedLines,
  ]);

  // Apply dark/light theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#000000";
      document.body.style.color = "#ffffff";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#fdfdfd";
      document.body.style.color = "#000000";
    }
  }, [theme]);

  const renderPage = () => {
    switch (route) {
      case "about":
        return <AboutPage />;
      case "terms":
        return <TermsPage />;
      case "privacy":
        return <PrivacyPage />;
      case "music":
      case "editor":
        return <MusicEditor />;
      case "x":
        return <XEditor />;
      case "tools":
        return <ToolsPage />;
      default:
        return <LandingPage />;
    }
  };

  const isEditor = route === "editor" || route === "music" || route === "x";
  const isLanding = route === "landing" || route === "tools";

  return (
    <div className="min-h-dvh flex flex-col selection:bg-zinc-300 dark:selection:bg-zinc-700 selection:text-current">
      <Header />
      <main
        className={`flex-1 w-full ${!isEditor ? "overflow-y-auto" : "overflow-hidden"} ${!isLanding ? "pt-16 lg:pt-20" : ""}`}
      >
        {renderPage()}
        {!isEditor && <Footer />}
      </main>
    </div>
  );
}
