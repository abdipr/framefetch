import { Music, MessageSquare, ArrowRight } from "lucide-react";
import useStore from "@/store/useStore";

const ToolCard = ({ title, description, icon: Icon, href, color }) => {
  const { setRoute } = useStore();
  
  return (
    <button
      onClick={() => setRoute(href)}
      className="group relative flex flex-col p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 text-left w-full h-full overflow-hidden"
    >
      <div
        className={`w-16 h-16 rounded-3xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-2xl mb-3">{title}</h3>
      <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
        {description}
      </p>

      <div className="mt-8 flex items-center gap-2 font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
        Launch Editor <ArrowRight className="w-4 h-4" />
      </div>

      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-white/10 to-transparent pointer-none" />
    </button>
  );
};

const ToolsPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 lg:py-24">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl lg:text-7xl tracking-tightest">
          Creative Tools
        </h1>
        <p className="text-xl text-zinc-500 font-medium max-w-2xl mx-auto">
          Experimental mockup generators for sharing your favorite content in
          style. Just for fun!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ToolCard
          title="Music Studio"
          description="Create stunning, shareable frames for your favorite song lyrics. Perfect for stories and posts."
          icon={Music}
          href="music"
          color="bg-green-500"
        />
        <ToolCard
          title="X (Twitter) Mockup"
          description="High-fidelity replicas of Tweets and Profiles for creators, jokes, and storytelling."
          icon={MessageSquare}
          href="x"
          color="bg-[#1d9bf0]"
        />
      </div>
    </div>
  );
};

export default ToolsPage;
