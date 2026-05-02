import { Composition, registerRoot } from "remotion";
import { VideoComposition, VideoProps, VideoSchema } from "./VideoComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FFVideo"
        component={VideoComposition as any}
        schema={VideoSchema as any}
        durationInFrames={300} // Default, will be overridden by props
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          track: null,
          syncedLyrics: [],
          range: [0, 1] as [number, number],
          preset: "apple",
          coverImage: null,
          format: "9:16",
          textAlign: "left" as const,
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
