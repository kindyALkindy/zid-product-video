export type VideoProvider = "youtube" | "vimeo" | "mp4" | "unknown";

export interface VideoSource {
  provider: VideoProvider;
  url: string;
}

const MP4_EXTENSIONS = [".mp4", ".m4v"];

export function detectVideoProvider(url: string): VideoProvider {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const pathname = parsed.pathname.toLowerCase();

    if (
      hostname === "youtu.be" ||
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      return "youtube";
    }

    if (hostname === "vimeo.com" || hostname === "player.vimeo.com") {
      return "vimeo";
    }

    if (MP4_EXTENSIONS.some((extension) => pathname.endsWith(extension))) {
      return "mp4";
    }
  } catch {
    return "unknown";
  }

  return "unknown";
}

export function createVideoSource(url: string): VideoSource | null {
  const value = url.trim();

  if (!value) {
    return null;
  }

  const provider = detectVideoProvider(value);

  if (provider === "unknown") {
    return null;
  }

  return {
    provider,
    url: value
  };
}
