/**
 * Searches iTunes for songs matching the query.
 * Returns a normalized array of track objects.
 */
export const searchITunes = async (query) => {
  const res = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5`
  );
  const data = await res.json();
  return data.results.map((t) => ({
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
export const fetchTrackById = async (id) => {
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
 * Fetches plain lyrics from lrclib.net.
 * Returns lyrics string if found, otherwise null.
 */
export const fetchLyricsAPI = async (title, artist) => {
  try {
    const res = await fetch(
      `https://lrclib.net/api/search?track_name=${encodeURIComponent(title)}&artist_name=${encodeURIComponent(artist)}`
    );
    if (!res.ok) throw new Error("Not found");
    const data = await res.json();
    if (data && data.length > 0 && data[0].plainLyrics) return data[0].plainLyrics;
    return null;
  } catch {
    return null;
  }
};
