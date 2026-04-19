import { useEffect, useRef } from "react";
import useStore from "@/store/useStore";
import { ArrowLeft, Heart, Music, Sparkles } from "lucide-react";

const AboutPage = () => {
  const setRoute = useStore((state) => state.setRoute);
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.gsap) {
      const tl = window.gsap.timeline();
      tl.fromTo(
        ".fade-in",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" },
      );
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-dvh bg-[#fdfdfd] dark:bg-black text-zinc-900 dark:text-zinc-100 py-12 px-6">
      <div ref={containerRef} className="max-w-4xl mx-auto space-y-20">
        <header className="space-y-8 text-center fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-sm font-bold border border-zinc-200 dark:border-zinc-800">
            <Sparkles className="w-4 h-4 text-orange-500" />
            About FrameFetch
          </div>
          <h1 className="text-5xl md:text-7xl font-heading tracking-tighter leading-none">
            Frame your rhythm. <br /> Share your vibe.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-zinc-500 dark:text-zinc-400">
            FrameFetch exists because sharing digital moments—whether it's your favorite song or a viral tweet—shouldn't just be about the raw content. It's about the aesthetic experience of the digital art you love.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 fade-in">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <h2 className="text-3xl font-bold">Just for Fun</h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              This project is built from the ground up for the creative community.
              It's a "just for fun" mockup tool designed to help you create stunning,
              high-fidelity frames for your sharing your digital life. No ads,
              no tracking, just pure aesthetics.
            </p>
          </div>

          <div className="space-y-6">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
              <Music className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">Personal Only</h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              FrameFetch is for personal use only. We celebrate the design
              languages of platforms like Apple Music, Spotify, and X, but we are not affiliated
              with any of them. All brand assets used are for representational purposes
              of your personal mockups.
            </p>
          </div>
        </div>

        <section className="bg-zinc-900 text-white p-12 rounded-[3.5rem] text-center space-y-8 fade-in">
          <h2 className="text-4xl font-heading">Ready to create?</h2>
          <button
            onClick={() => setRoute("editor")}
            className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform"
          >
            Open Editor
          </button>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
