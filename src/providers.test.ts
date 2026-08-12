import { describe, expect, it } from "vitest";
import { createVideoSource, detectVideoProvider } from "./providers";

describe("detectVideoProvider", () => {
  it("detects YouTube", () => {
    expect(detectVideoProvider("https://youtu.be/dQw4w9WgXcQ")).toBe("youtube");
    expect(detectVideoProvider("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("youtube");
    expect(detectVideoProvider("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ")).toBe("youtube");
  });

  it("detects Vimeo", () => {
    expect(detectVideoProvider("https://vimeo.com/123456789")).toBe("vimeo");
    expect(detectVideoProvider("https://player.vimeo.com/video/123456789")).toBe("vimeo");
  });

  it("detects MP4", () => {
    expect(detectVideoProvider("https://cdn.example.com/video/product.mp4")).toBe("mp4");
    expect(detectVideoProvider("https://cdn.example.com/video/product.m4v")).toBe("mp4");
  });

  it("returns unknown for unsupported URLs", () => {
    expect(detectVideoProvider("https://example.com/video.webm")).toBe("unknown");
    expect(detectVideoProvider("not-a-url")).toBe("unknown");
  });
});

describe("createVideoSource", () => {
  it("creates a normalized source", () => {
    expect(createVideoSource(" https://vimeo.com/123456789 ")).toEqual({
      provider: "vimeo",
      url: "https://vimeo.com/123456789"
    });
  });

  it("returns null for empty or unsupported sources", () => {
    expect(createVideoSource("")).toBeNull();
    expect(createVideoSource("https://example.com/video.webm")).toBeNull();
  });
});
