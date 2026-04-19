import { useState, useEffect } from "react";
import { Share2, Moon, Sun } from "lucide-react";
import useStore from "@/store/useStore";
import Button from "@/components/ui/Button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const { theme, toggleTheme, route, setRoute } = useStore();
  const [scrolled, setScrolled] = useState(false);

  const tools = [
    {
      title: "Music Studio",
      description: "Design lyric and song mockups.",
      href: "/music",
    },
    {
      title: "X Mockup",
      description: "Compose fake tweets and profiles.",
      href: "/x",
    },
    {
      title: "View All Tools",
      description: "Explore all generators.",
      href: "/tools",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    const txt = document.getElementById("share-text");
    if (txt) {
      txt.innerText = "Copied!";
      setTimeout(() => (txt.innerText = "Share Link"), 2000);
    }
  };

  const isLanding = route === "landing" || route === "tools";

  return (
    <header
      className={`h-16 lg:h-20 shrink-0 px-6 lg:px-12 flex items-center justify-between z-50 fixed top-0 left-0 right-0 transition-all duration-500 ${
        scrolled || !isLanding
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/30 py-4 shadow-sm"
          : "bg-transparent border-b border-transparent py-8"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-8">
        <button
          onClick={() => setRoute("landing")}
          className="flex items-center gap-3.5 hover:opacity-90 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-black font-heading text-xl leading-none shadow-xl group-hover:scale-105 transition-transform">
            F
          </div>
          <span className="font-heading text-2xl tracking-tighter hidden lg:block bg-clip-text text-transparent bg-linear-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
            FrameFetch
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 data-[state=open]:bg-zinc-100 dark:data-[state=open]:bg-zinc-900 font-black text-sm px-4 h-10 transition-all rounded-full">
                  Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[320px] p-2 bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-1 gap-1">
                    {tools.map((tool) => (
                      <NavigationMenuLink
                        key={tool.href}
                        onClick={() => setRoute(tool.href.replace("/", ""))}
                        className="flex flex-col items-start gap-1 p-4 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer group"
                      >
                        <span className="font-black text-sm group-hover:text-primary dark:group-hover:text-white transition-colors">
                          {tool.title}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                          {tool.description}
                        </span>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <button
                  onClick={() => setRoute("about")}
                  className={`px-5 h-10 rounded-full text-sm font-black transition-all ${
                    route === "about"
                      ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  About
                </button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {(route === "editor" || route === "music" || route === "x") && (
          <Button
            variant="ghost"
            className="hidden sm:flex text-xs lg:text-sm font-semibold rounded-full px-5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={handleShareLink}
          >
            <Share2 className="w-4 h-4 mr-2" />
            <span id="share-text">Share Link</span>
          </Button>
        )}
        <Button
          variant="icon"
          onClick={toggleTheme}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-full w-10 h-10 hover:scale-105 active:scale-95 transition-all"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-zinc-100" />
          ) : (
            <Moon className="w-5 h-5 text-zinc-900" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
