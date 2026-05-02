export interface TrackData {
  id: number;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number;
}

/**
 * Searches iTunes for songs matching the query.
 * Returns a normalized array of track objects.
 */
export const searchITunes = async (query: string): Promise<TrackData[]> => {
  const res = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5`
  );
  const data = await res.json();
  return data.results.map((t: any) => ({
    id: t.trackId,
    title: t.trackName,
    artist: t.artistName,
    album: t.collectionName,
    coverUrl: t.artworkUrl100.replace("100x100bb", "1000x1000bb"),
    duration: t.trackTimeMillis,
  }));
};

/**
 * Fetches a single track from iTunes by its ID.
 */
export const fetchTrackById = async (id: string | number): Promise<TrackData | null> => {
  const res = await fetch(`https://itunes.apple.com/lookup?id=${id}`);
  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;
  const t = data.results[0];
  return {
    id: t.trackId,
    title: t.trackName,
    artist: t.artistName,
    album: t.collectionName,
    coverUrl: t.artworkUrl100.replace("100x100bb", "1000x1000bb"),
    duration: t.trackTimeMillis,
  };
};

/**
 * Parses LRC content into SyncedLine array.
 */
const parseLRC = (lrc: string): { time: number; text: string }[] => {
  const lines = lrc.split("\n");
  const result: { time: number; text: string }[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  lines.forEach((line) => {
    const match = timeRegex.exec(line);
    if (match) {
      const mins = parseInt(match[1]);
      const secs = parseInt(match[2]);
      const ms = parseInt(match[3]);
      const time = mins * 60 + secs + (ms > 99 ? ms / 1000 : ms / 100);
      const text = line.replace(timeRegex, "").trim();
      if (text) {
        result.push({ time, text });
      }
    }
  });
  return result;
};

/**
 * Fetches lyrics from lrclib.net.
 * Returns both plain and synced lyrics if found.
 */
export const fetchLyricsAPI = async (
  title: string,
  artist: string
): Promise<{ plain: string; synced: { time: number; text: string }[] } | null> => {
  try {
    const res = await fetch(
      `https://lrclib.net/api/search?track_name=${encodeURIComponent(title)}&artist_name=${encodeURIComponent(artist)}`
    );
    if (!res.ok) throw new Error("Not found");
    const data = await res.json();
    if (data && data.length > 0) {
      const bestMatch = data[0];
      return {
        plain: bestMatch.plainLyrics || "",
        synced: bestMatch.syncedLyrics ? parseLRC(bestMatch.syncedLyrics) : [],
      };
    }
    return null;
  } catch {
    return null;
  }
};
