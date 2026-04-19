import useStore from "@/store/useStore";
import { ExternalLink } from "lucide-react";
import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const setRoute = useStore((state) => state.setRoute);

  return (
    <footer className="w-full bg-[#fdfdfd] dark:bg-black border-t border-zinc-100 dark:border-zinc-900 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 text-left">
        <div className="col-span-2 space-y-6 flex flex-col items-start">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setRoute("landing")}
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-black font-black text-xs italic">F</span>
            </div>
            <span className="font-heading text-2xl tracking-tighter text-zinc-900 dark:text-white">
              FrameFetch
            </span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed text-sm font-medium">
            Beautifully frame your favorite music lyrics and players for social
            sharing. Designed with precision, created just for fun.
          </p>
          <div className="flex items-center gap-4 text-zinc-400">
            <FaGithub className="w-5 h-5 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors" />
            <FaTwitter className="w-5 h-5 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors" />
            <FaInstagram className="w-5 h-5 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Resources
          </h4>
          <ul className="space-y-4 text-zinc-600 dark:text-zinc-300 text-sm font-bold">
            <li
              className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors"
              onClick={() => setRoute("about")}
            >
              About
            </li>
            <li
              className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors"
              onClick={() => setRoute("terms")}
            >
              Terms of Service
            </li>
            <li
              className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors"
              onClick={() => setRoute("privacy")}
            >
              Privacy Policy
            </li>
          </ul>
        </div>

        <div className="col-span-1 space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Legal
          </h4>
          <div className="p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-3">
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal font-medium">
              <strong>Personal Use Only:</strong> FrameFetch is for personal use and not affiliated with Apple or Spotify.
            </p>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-widest hover:opacity-70 transition-opacity"
            >
              <span>Community Project</span>
              <FaGithub className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-zinc-400 font-bold">
        <p>© 2026 FrameFetch. Built with ❤️ for music lovers.</p>
        <div className="flex items-center gap-2.5">
          <span className="opacity-60">Made in Indonesia</span>
          <div className="flex flex-col w-5 h-3.5 rounded-[3px] overflow-hidden shrink-0 shadow-md">
            <div className="flex-1 bg-[#FF0000]" />
            <div className="flex-1 bg-white" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
