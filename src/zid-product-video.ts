import { buildYouTubeUrl, getYouTubeVideo, type YouTubeVideo } from "./youtube";
import { styles } from "./styles";

const TAG_NAME = "zid-product-video";

export class ZidProductVideo extends HTMLElement {
  private observer: IntersectionObserver | null = null;
  private loaded = false;
  private initialized = false;

  static get observedAttributes(): string[] {
    return [
      "url",
      "autoplay",
      "muted",
      "loop",
      "controls",
      "playsinline",
      "allowfullscreen",
      "poster",
      "preload-distance",
      "nocookie",
      "title"
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.initialize();
  }

  disconnectedCallback(): void {
    this.disconnectObserver();
  }

  attributeChangedCallback(): void {
    if (!this.isConnected || !this.initialized) return;

    const video = this.getVideo();
    if (!video) return;

    this.loaded = false;
    this.render(video);
    this.observe();
  }

  private initialize(): void {
    if (this.initialized) return;

    this.initialized = true;

    const video = this.getVideo();

    if (!video) {
      this.renderError("Invalid or missing YouTube URL.");
      return;
    }

    this.render(video);
    this.observe();
  }

  private getVideo(): YouTubeVideo | null {
    return getYouTubeVideo(this.getAttribute("url") ?? "");
  }

  private has(name: string): boolean {
    return this.hasAttribute(name);
  }

  private getPoster(video: YouTubeVideo): string {
    return this.getAttribute("poster") ?? `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
  }

  private render(video: YouTubeVideo): void {
    const poster = this.getPoster(video);

    this.shadowRoot!.innerHTML = `
      <style>${styles}</style>

      <div class="video">
        <div
          class="poster"
          part="poster"
          style="background-image:url('${escapeCssUrl(poster)}')"
          aria-hidden="true"
        >
          <span class="loader" part="loader"></span>
        </div>
      </div>
    `;
  }

  private renderError(message: string): void {
    this.shadowRoot!.innerHTML = `
      <style>${styles}</style>
      <div part="error" role="status" style="padding:1rem">
        ${escapeHtml(message)}
      </div>
    `;
  }

  private observe(): void {
    this.disconnectObserver();

    if (!("IntersectionObserver" in window)) {
      this.loadVideo();
      return;
    }

    const distance = this.getAttribute("preload-distance") ?? "300px";

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        this.loadVideo();
        this.disconnectObserver();
      },
      {
        root: null,
        rootMargin: `${distance} 0px`,
        threshold: 0
      }
    );

    this.observer.observe(this);
  }

  private disconnectObserver(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  private loadVideo(): void {
    if (this.loaded) return;

    const video = this.getVideo();
    const container = this.shadowRoot?.querySelector<HTMLDivElement>(".video");

    if (!video || !container) return;

    const iframe = document.createElement("iframe");

    iframe.src = buildYouTubeUrl(video, {
      autoplay: this.has("autoplay"),
      muted: this.has("muted"),
      loop: this.has("loop"),
      controls: this.has("controls"),
      playsinline: this.has("playsinline"),
      nocookie: this.has("nocookie")
    });

    iframe.title = this.getAttribute("title") ?? "YouTube video player";

    iframe.loading = "lazy";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";

    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";

    if (this.has("allowfullscreen")) {
      iframe.allowFullscreen = true;
    }

    container.replaceChildren(iframe);

    this.loaded = true;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeCssUrl(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\)/g, "\\)");
}

export function defineZidProductVideo(): void {
  if (!customElements.get(TAG_NAME)) {
    customElements.define(TAG_NAME, ZidProductVideo);
  }
}
