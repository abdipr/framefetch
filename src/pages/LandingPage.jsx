import { useRef, useEffect } from "react";
import {
  ArrowRight,
  Download,
  Sparkles,
  Share2,
  ShieldAlert,
} from "lucide-react";
import useStore from "@/store/useStore";
import Button from "@/components/ui/Button";

const LandingPage = () => {
  const { setRoute } = useStore();
  const heroRef = useRef(null);

  useEffect(() => {
    if (window.gsap) {
      const tl = window.gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        ".hero-el",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 },
      ).fromTo(
        ".preview-card",
        { y: 80, opacity: 0, scale: 0.9, rotateX: -20 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.5, stagger: 0.3 },
        "-=0.8",
      );

      window.gsap.to(".floating", {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        duration: "random(4, 7)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <div className="flex flex-col w-full bg-[#fdfdfd] dark:bg-[#000000]">
      {/* Hero Section */}
      <section className="relative min-h-dvh lg:h-dvh flex flex-col items-center justify-center px-6 pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] floating" />
          <div className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-[140px] floating" />
        </div>

        <div
          ref={heroRef}
          className="relative z-10 max-w-4xl flex flex-col items-center text-center"
        >
          <div className="hero-el inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-6 font-sans">
            <Sparkles className="w-3 h-3 text-orange-500" />
            Experimental Mockup Studio
          </div>

          <h1 className="hero-el text-[clamp(2.2rem,8vw,5.2rem)] font-heading tracking-tighter mb-6 leading-[0.85] text-zinc-900 dark:text-white">
            Visualize your <br />
            digital content.
          </h1>

          <p className="hero-el text-sm md:text-lg text-zinc-500 dark:text-zinc-400 mb-10 max-w-xl leading-relaxed font-medium">
            High-fidelity frame generators for music lyrics, social media posts,
            and interactive mockups. Crafted for creators who share with intent.
            Just for fun!
          </p>

          <div className="hero-el flex flex-col sm:flex-row justify-center gap-4 items-center w-full max-w-lg mx-auto">
            <Button
              onClick={() => setRoute("tools")}
              className="group w-full sm:flex-1 px-8 py-5 text-lg rounded-full shadow-2xl transition-all duration-500 font-bold bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
            >
              Explore Tools
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20 md:flex">
          <div className="w-px h-8 bg-zinc-400" />
          <span className="text-[8px] font-black uppercase tracking-widest font-sans">
            Scroll
          </span>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="relative min-h-dvh lg:h-dvh flex flex-col items-center justify-center py-20 px-6 bg-zinc-50 dark:bg-[#050505] overflow-hidden border-y border-zinc-100 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full">
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-heading tracking-tighter leading-[0.9] text-zinc-900 dark:text-white">
                Engineered for <br />
                Accuracy.
              </h2>
              <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                Bit-perfect rendering ensuring every pixel matches the premium
                aesthetics of native players.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-md mx-auto lg:mx-0">
              <div className="space-y-3 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg">
                  <Download className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold">4K Rendering</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  High resolution exports for stunning visual clarity.
                </p>
              </div>
              <div className="space-y-3 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-lg">
                  <Share2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold">Deep Linking</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Persist your exact design state with one URL.
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center scale-75 sm:scale-90 lg:scale-100 mt-12 lg:mt-0">
            <div className="preview-card absolute -left-4 lg:-left-6 top-0 w-[180px] sm:w-[220px] h-[320px] sm:h-[380px] bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] sm:rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl -rotate-6 z-10 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-b from-indigo-500/5 to-transparent" />
              <div className="absolute bottom-10 left-6 right-6 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                <div className="h-3 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              </div>
            </div>
            <div className="preview-card absolute right-0 bottom-0 w-[300px] sm:w-[380px] h-[220px] sm:h-[280px] bg-white dark:bg-zinc-800 rounded-[2.5rem] sm:rounded-[3rem] border border-zinc-200 dark:border-zinc-700 shadow-2xl rotate-3 z-30 p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-zinc-100 dark:bg-zinc-700 shadow-inner" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-1/2 bg-zinc-100 dark:bg-zinc-700 rounded-full" />
                  <div className="h-3 w-1/3 bg-zinc-100 dark:bg-zinc-700 rounded-full" />
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-700 rounded-full" />
                <div className="flex justify-between text-[9px] font-black opacity-20 tracking-tighter">
                  <span>0:42</span>
                  <span>4:20</span>
                </div>
              </div>
              <div className="flex justify-center gap-8 opacity-10">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-current" />
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-current" />
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-current" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative min-h-dvh lg:h-dvh flex flex-col items-center justify-center px-6 py-20 bg-zinc-900 text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_70%)] from-indigo-500/30" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-10">
          <h2 className="text-3xl md:text-5xl font-heading tracking-tighter leading-none">
            Music is more than <br /> just sound.
          </h2>
          <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
            It's a memory, a feeling, and an art form. We provide the frame it
            deserves.
          </p>
          <div className="flex flex-col items-center gap-6 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button
                onClick={() => setRoute("music")}
                className="px-8 py-5 text-lg bg-white text-black rounded-full font-bold hover:scale-105 active:scale-95 transition-transform"
              >
                Music Editor
              </Button>
              <Button
                onClick={() => setRoute("x")}
                className="px-8 py-5 text-lg bg-zinc-800 text-white border border-zinc-700 rounded-full font-bold hover:scale-105 active:scale-95 transition-transform"
              >
                X Editor
              </Button>
            </div>
            <div className="flex items-center gap-4 text-zinc-500 text-[9px] font-bold tracking-widest uppercase font-sans">
              <span>Personal</span>
              <div className="w-1 h-1 rounded-full bg-zinc-700" />
              <span>Fun</span>
              <div className="w-1 h-1 rounded-full bg-zinc-700" />
              <span>Community</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
