import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileDrawer = ({ isOpen, onClose, children }: MobileDrawerProps) => {
  const [snap, setSnap] = useState<string | number | null>(0.5);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      snapPoints={[0.5, 1]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      dismissible={true}
    >
      <DrawerContent className="bg-white dark:bg-[#09090b] border-t border-zinc-200 dark:border-zinc-800 flex flex-col h-[90dvh] outline-none">
        <div className="w-full h-4 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing">
          <div className="h-1 w-12" />
        </div>

        <DrawerHeader className="sr-only">
          <DrawerTitle>Design Settings</DrawerTitle>
          <DrawerDescription>Adjust your layout</DrawerDescription>
        </DrawerHeader>

        {/* Scrollable Content */}
        <div
          data-vaul-no-drag
          className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar overscroll-contain"
        >
          <div className="flex flex-col gap-6">{children}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileDrawer;
