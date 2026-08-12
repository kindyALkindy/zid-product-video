export type YouTubeHost = "youtube" | "youtu-be" | "youtube-nocookie";

export interface YouTubeVideo {
  id: string;
  host: YouTubeHost;
}

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{6,20}$/;

export function getYouTubeVideo(url: string): YouTubeVideo | null {
  if (!url.trim()) return null;

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");

    if (hostname === "youtu.be") {
      return normalizeVideoId(parsed.pathname.split("/").filter(Boolean)[0]);
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com" || hostname === "youtube-nocookie.com") {
      const host: YouTubeHost = hostname === "youtube-nocookie.com" ? "youtube-nocookie" : "youtube";

      const watchId = parsed.searchParams.get("v");
      if (watchId) return { id: validateVideoId(watchId), host };

      const parts = parsed.pathname.split("/").filter(Boolean);
      const type = parts[0];
      const id = parts[1];

      if ((type === "embed" || type === "shorts" || type === "live") && id) {
        return { id: validateVideoId(id), host };
      }
    }
  } catch {
    return null;
  }

  return null;
}

function normalizeVideoId(value: string | undefined): YouTubeVideo | null {
  if (!value) return null;

  try {
    return {
      id: validateVideoId(value),
      host: "youtu-be"
    };
  } catch {
    return null;
  }
}

function validateVideoId(value: string): string {
  if (!YOUTUBE_ID_PATTERN.test(value)) {
    throw new Error("Invalid YouTube video ID");
  }

  return value;
}

export interface YouTubePlayerOptions {
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  controls: boolean;
  playsinline: boolean;
  nocookie: boolean;
}

export function buildYouTubeUrl(video: YouTubeVideo, options: YouTubePlayerOptions): string {
  const host = options.nocookie ? "www.youtube-nocookie.com" : "www.youtube.com";

  const params = new URLSearchParams();

  if (options.autoplay) params.set("autoplay", "1");
  if (options.muted) params.set("mute", "1");
  if (options.controls) {
    params.set("controls", "1");
  } else {
    params.set("controls", "0");
  }
  if (options.playsinline) params.set("playsinline", "1");

  if (options.loop) {
    params.set("loop", "1");
    params.set("playlist", video.id);
  }

  return `https://${host}/embed/${video.id}?${params.toString()}`;
}
