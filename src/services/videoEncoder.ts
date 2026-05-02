/**
 * Video Encoder using WebCodecs API + mp4-muxer.
 * - No WASM, no FFmpeg, no CORS headers needed.
 * - Produces real H.264 MP4 files natively in Chrome.
 * - Works on Cloudflare Pages as a purely client-side operation.
 * - Requires Chrome 94+ (WebCodecs API).
 */
import { Muxer, ArrayBufferTarget } from "mp4-muxer";
import { toCanvas } from "html-to-image";

export interface EncodeOptions {
  /** Called for each frame number; returns the rendered HTMLElement to capture */
  getFrameElement: () => HTMLElement | null;
  /** Called to signal the hidden renderer to update to frame `f` */
  setFrame: (f: number) => Promise<void>;
  /** Optional callback to check if export was cancelled */
  checkCancel?: () => boolean;
  totalFrames: number;
  fps: number;
  width: number;
  height: number;
  onProgress?: (percent: number) => void;
}

export async function encodeToMP4({
  getFrameElement,
  setFrame,
  checkCancel,
  totalFrames,
  fps,
  width,
  height,
  onProgress,
}: EncodeOptions): Promise<Uint8Array> {
  // Check WebCodecs support
  if (typeof VideoEncoder === "undefined") {
    throw new Error(
      "WebCodecs API tidak didukung browser ini. Gunakan Chrome 94+ untuk fitur ini.",
    );
  }

  // Setup the MP4 muxer (in-memory, for download)
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: { 
      codec: "avc", 
      width, 
      height,
      frameRate: fps // Crucial for correct duration metadata
    },
    fastStart: "in-memory",
  });

  let encoderError: Error | null = null;

  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (e) => {
      encoderError = e;
    },
  });

  encoder.configure({
    codec: "avc1.640028", // H.264 High Profile Level 4
    width,
    height,
    bitrate: 10_000_000, // 10 Mbps — high quality
    framerate: fps,
  });

  const frameDurationUs = 1_000_000 / fps; // microseconds per frame

  for (let f = 0; f < totalFrames; f++) {
    if (encoderError) throw encoderError;
    if (checkCancel?.()) {
      encoder.close();
      throw new Error("CANCELLED");
    }

    // Signal hidden renderer to show frame `f` and wait for paint
    await setFrame(f);

    const el = getFrameElement();
    if (!el) continue;

    // Capture rendered element to canvas
    const canvas = await toCanvas(el, {
      width,
      height,
      pixelRatio: 1,
      skipFonts: true,
    });

    // Create VideoFrame from canvas and encode
    const videoFrame = new VideoFrame(canvas, {
      timestamp: Math.round(f * frameDurationUs),
      duration: Math.round(frameDurationUs),
    });

    // Key frame every 2 seconds
    encoder.encode(videoFrame, { keyFrame: f % (fps * 2) === 0 });
    videoFrame.close();

    onProgress?.(Math.floor((f / totalFrames) * 85));

    // Backpressure: don't let encoder queue grow too large
    if (encoder.encodeQueueSize > 20) {
      await new Promise((r) => setTimeout(r, 16));
    }
  }

  if (encoderError) throw encoderError;

  await encoder.flush();
  muxer.finalize();

  onProgress?.(100);

  return new Uint8Array(muxer.target.buffer);
}
