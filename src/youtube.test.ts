import { describe, expect, it } from "vitest";
import { buildYouTubeUrl, getYouTubeVideo } from "./youtube";

describe("getYouTubeVideo", () => {
  it("parses youtu.be URLs", () => {
    expect(getYouTubeVideo("https://youtu.be/dQw4w9WgXcQ")).toEqual({
      id: "dQw4w9WgXcQ",
      host: "youtu-be"
    });
  });

  it("parses YouTube watch URLs", () => {
    expect(getYouTubeVideo("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s")).toEqual({
      id: "dQw4w9WgXcQ",
      host: "youtube"
    });
  });

  it("parses embed URLs", () => {
    expect(getYouTubeVideo("https://www.youtube.com/embed/dQw4w9WgXcQ")).toEqual({
      id: "dQw4w9WgXcQ",
      host: "youtube"
    });
  });

  it("parses Shorts URLs", () => {
    expect(getYouTubeVideo("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toEqual({
      id: "dQw4w9WgXcQ",
      host: "youtube"
    });
  });

  it("parses nocookie URLs", () => {
    expect(getYouTubeVideo("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ")).toEqual({
      id: "dQw4w9WgXcQ",
      host: "youtube-nocookie"
    });
  });

  it("rejects invalid URLs and IDs", () => {
    expect(getYouTubeVideo("not-a-youtube-url")).toBeNull();
    expect(getYouTubeVideo("")).toBeNull();
    expect(getYouTubeVideo("https://youtu.be/short")).toBeNull();
  });
});

describe("buildYouTubeUrl", () => {
  it("builds autoplay, muted and loop parameters", () => {
    const url = buildYouTubeUrl(
      {
        id: "dQw4w9WgXcQ",
        host: "youtube"
      },
      {
        autoplay: true,
        muted: true,
        loop: true,
        controls: false,
        playsinline: true,
        nocookie: false
      }
    );

    const parsed = new URL(url);

    expect(parsed.hostname).toBe("www.youtube.com");
    expect(parsed.pathname).toBe("/embed/dQw4w9WgXcQ");
    expect(parsed.searchParams.get("autoplay")).toBe("1");
    expect(parsed.searchParams.get("mute")).toBe("1");
    expect(parsed.searchParams.get("loop")).toBe("1");
    expect(parsed.searchParams.get("playlist")).toBe("dQw4w9WgXcQ");
    expect(parsed.searchParams.get("controls")).toBe("0");
    expect(parsed.searchParams.get("playsinline")).toBe("1");
  });

  it("supports privacy-enhanced mode", () => {
    const url = buildYouTubeUrl(
      {
        id: "dQw4w9WgXcQ",
        host: "youtube"
      },
      {
        autoplay: false,
        muted: false,
        loop: false,
        controls: true,
        playsinline: false,
        nocookie: true
      }
    );

    expect(new URL(url).hostname).toBe("www.youtube-nocookie.com");
    expect(new URL(url).searchParams.get("controls")).toBe("1");
  });
});
