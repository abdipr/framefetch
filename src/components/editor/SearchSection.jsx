import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import useStore from "@/store/useStore";
import { searchITunes, fetchLyricsAPI } from "@/services/api";
import { Input } from "@/components/ui/input";

const SearchSection = () => {
  const { setTrack, setLyrics } = useStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 2) {
        setLoading(true);
        const data = await searchITunes(query);
        setResults(data);
        setIsOpen(true);
        setLoading(false);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = async (track) => {
    setIsOpen(false);
    setQuery("");
    setTrack(track);
    setLyrics("Loading lyrics...");

    const lyricsData = await fetchLyricsAPI(track.title, track.artist);
    if (lyricsData) {
      setLyrics(lyricsData);
    } else {
      setLyrics(
        "Lyrics not found.\nType or paste your lyrics here.\nSeparate each line with an enter."
      );
    }
  };

  return (
    <div className="relative z-50" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <Input
          type="text"
          placeholder="Search track or artist..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="w-full pl-12 pr-4 h-12 rounded-xl text-base"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          {results.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className="w-full flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-left transition-colors"
            >
              <img
                src={item.coverUrl}
                className="w-10 h-10 rounded-md object-cover"
              />
              <div className="flex-1 overflow-hidden">
                <p className="font-medium truncate text-zinc-900 dark:text-zinc-100 text-sm">
                  {item.title}
                </p>
                <p className="text-xs text-zinc-500 truncate">{item.artist}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSection;
