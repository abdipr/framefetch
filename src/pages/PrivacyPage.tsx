import { useEffect, useRef } from "react";
import useStore from "@/store/useStore";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const PrivacyPage = () => {
  const setRoute = useStore((state) => state.setRoute);
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.gsap) {
      window.gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
      );
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-dvh bg-[#fdfdfd] dark:bg-black text-zinc-900 dark:text-zinc-100 py-12 px-6">
      <div ref={containerRef} className="max-w-3xl mx-auto space-y-12">
        <button
          onClick={() => setRoute("landing")}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <header className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-zinc-900 dark:text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading tracking-tight">
              Privacy Policy
            </h1>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            At FrameFetch, your privacy is simple because we don't collect
            anything.
          </p>
        </header>

        <section className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">1. No Data Collection</h2>
            <p>
              FrameFetch is a client-side tool. All your design settings, track
              selections, social media content, and base64 encoded images are stored locally in your
              browser's <code>localStorage</code>. We do not have a backend
              database that stores your personal information.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">2. Local Storage</h2>
            <p>
              We use <code>localStorage</code> to remember your theme, chosen
              preset, and the last editor state (music or social) so you can continue your
              work when you return. You can clear this data at any time by
              clearing your browser's site data.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">3. Third Party Services</h2>
            <p>
              When you search for a song, we make requests to the iTunes Search
              API. When you look for lyrics, we connect to LRCLib. These
              services may collect information according to their respective
              privacy policies. We do not share your private data with them.
            </p>
          </div>

          <div className="pt-20 border-t border-zinc-100 dark:border-zinc-800 text-center text-zinc-500 text-sm">
            FrameFetch • Designed just for fun.
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
