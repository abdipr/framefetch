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
