import { useCurrentFrame, useVideoConfig } from "remotion";
import BackgroundWrapper from "../components/cards/BackgroundWrapper";
import LyricsWidget from "../components/cards/LyricsWidget";
import { Track, SyncedLine } from "../store/useStore";
import { z } from "zod";

export const VideoSchema = z.object({
  track: z.any(), // Keeping it simple for now
  syncedLyrics: z.array(z.any()),
  range: z.tuple([z.number(), z.number()]),
  preset: z.string(),
  coverImage: z.string().nullable(),
  format: z.string(),
  textAlign: z.enum(["left", "center", "right"]),
});

export type VideoProps = z.infer<typeof VideoSchema>;

export const VideoComposition: React.FC<VideoProps> = ({
  track,
  syncedLyrics,
  range,
  preset,
  coverImage,
  format,
  textAlign,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const startTime = syncedLyrics[range[0]]?.time || 0;
  const currentTime = startTime + frame / fps;

  // Find active line based on current time
  const lyricsPlain = syncedLyrics.map(l => l.text);
  
  let activeIndex = range[0];
  for (let i = range[0]; i <= range[1]; i++) {
    const line = syncedLyrics[i];
    if (line && line.time <= currentTime) {
      activeIndex = i;
    } else {
      break;
    }
  }

  return (
    <div style={{ flex: 1, backgroundColor: "black" }}>
      <BackgroundWrapper
        format={format}
        preset={preset}
        coverImage={coverImage}
        cardScale={1}
        isCardOnly={false}
      >
        <LyricsWidget
          track={track}
          lyrics={lyricsPlain}
          selectedLines={[activeIndex]}
          preset={preset}
          coverImage={coverImage}
          align={textAlign}
          currentTime={currentTime}
        />
      </BackgroundWrapper>
    </div>
  );
};
