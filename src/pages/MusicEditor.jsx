import { Settings2 } from "lucide-react";
import useStore from "@/store/useStore";
import PreviewArea from "@/components/editor/PreviewArea";
import ControlsSidebar from "@/components/editor/ControlsSidebar";
import MobileDrawer from "@/components/editor/MobileDrawer";

const MusicEditor = () => {
  const { isMobileDrawerOpen, setMobileDrawerOpen } = useStore();

  return (
    <div className="flex h-[calc(100dvh-64px)] lg:h-[calc(100vh-80px)] relative w-full max-w-[1700px] mx-auto gap-4 lg:gap-8 lg:px-8 px-4 py-4 lg:py-8">
      {/* Preview Area */}
      <div className="flex-1 w-full h-[calc(100dvh-100px)] lg:h-[calc(100vh-120px)] relative z-10 flex flex-col min-w-0 bg-white dark:bg-[#09090b] rounded-3xl lg:rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
        <PreviewArea />

        {/* Mobile design settings trigger */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:hidden z-40">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="bg-zinc-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] font-bold flex items-center gap-2 border border-zinc-800 dark:border-zinc-200 hover:scale-105 active:scale-95 transition-all"
          >
            <Settings2 className="w-5 h-5" /> Design Settings
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-[420px] shrink-0 h-full bg-transparent overflow-hidden relative">
        <ControlsSidebar />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      >
        <ControlsSidebar />
      </MobileDrawer>
    </div>
  );
};

export default MusicEditor;
