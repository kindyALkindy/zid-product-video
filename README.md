# Zid Product Video

A lightweight, dependency-free YouTube Web Component built with TypeScript and native Web Component APIs.

Designed for Zid themes, e-commerce product pages, and websites that need a simple YouTube video component without React, Vue, or runtime dependencies.

## Features

- TypeScript source
- Native Custom Element
- Shadow DOM
- Lazy YouTube iframe loading with IntersectionObserver
- Autoplay, muted, loop, controls, and playsinline
- Optional YouTube `nocookie` domain
- Automatic or custom poster
- Customizable with CSS variables
- Supports YouTube watch, short, embed, shorts, and live URLs
- Works directly in HTML/Jinja
- No runtime dependencies

## Install

### npm

```bash
npm install zid-product-video
```

```ts
import "zid-product-video";
```

### CDN

After publishing the package to npm:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/zid-product-video/dist/index.js"></script>
```

You can also pin a version:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/zid-product-video@1.0.0/dist/index.js"></script>
```

## Basic usage

```html
<zid-product-video url="https://youtu.be/VIDEO_ID"></zid-product-video>
```

## Product video / Zid Jinja

```html
{% if p_video.link %}
<zid-product-video
  url="{{ p_video.link }}"
  autoplay
  muted
  loop
  playsinline
  preload-distance="500px"
></zid-product-video>
{% endif %}
```

## Attributes

| Attribute          | Type    | Default              | Description                      |
| ------------------ | ------- | -------------------- | -------------------------------- |
| `url`              | string  | required             | YouTube video URL                |
| `autoplay`         | boolean | false                | Starts playback automatically    |
| `muted`            | boolean | false                | Starts muted                     |
| `loop`             | boolean | false                | Loops the video                  |
| `controls`         | boolean | false                | Shows YouTube controls           |
| `playsinline`      | boolean | false                | Enables inline playback          |
| `allowfullscreen`  | boolean | false                | Allows fullscreen                |
| `poster`           | string  | YouTube thumbnail    | Custom poster URL                |
| `preload-distance` | string  | `300px`              | Distance before viewport to load |
| `nocookie`         | boolean | false                | Uses `youtube-nocookie.com`      |
| `title`            | string  | YouTube video player | iframe title                     |

Boolean attributes are enabled by their presence:

```html
<zid-product-video
  autoplay
  muted
  loop
></zid-product-video>
```

## CSS customization

The component uses Shadow DOM, but exposes CSS custom properties:

```css
zid-product-video {
  --zid-video-height: 500px;
  --zid-video-radius: 16px;
  --zid-video-background: #000;
  --zid-video-object-fit: cover;
}
```

You can also customize an individual instance:

```html
<zid-product-video
  url="https://youtu.be/VIDEO_ID"
  style="
    --zid-video-height: 450px;
    --zid-video-radius: 20px;
  "
></zid-product-video>
```

## Supported URLs

```text
https://youtu.be/VIDEO_ID
https://www.youtube.com/watch?v=VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID
https://www.youtube.com/shorts/VIDEO_ID
https://www.youtube.com/live/VIDEO_ID
```

## Performance

The component initially renders a poster instead of immediately creating a YouTube iframe.

The iframe is created when the component approaches the viewport:

```text
Page load
   ↓
Poster
   ↓
IntersectionObserver
   ↓
YouTube iframe
   ↓
Playback
```

This is useful on product pages with multiple videos.

## API

The package exports:

```ts
import { ZidProductVideo, defineZidProductVideo } from "zid-product-video";
```

The custom element is registered automatically when importing the package.

If you need manual registration:

```ts
defineZidProductVideo();
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage:

```bash
npm run test:coverage
```

The tests cover YouTube URL parsing, player URL generation, provider detection, and source normalization.

## Formatting

This project uses Prettier with formatting rules aligned with the Zid Growth Theme configuration.

Check formatting:

```bash
npm run format:check
```

Format the project:

```bash
npm run format
```

## Multi-provider architecture

The component is intentionally being structured around a provider layer so additional video sources can be added without rewriting the public Web Component API.

The planned providers are:

- YouTube
- Vimeo
- Direct MP4
- Additional providers in the future

The current release contains the YouTube implementation and provider detection for Vimeo and MP4, while Vimeo/MP4 rendering can be added as separate provider implementations.

The goal is to keep the public API stable:

```html
<zid-product-video
  url="VIDEO_URL"
  autoplay
  muted
  loop
></zid-product-video>
```

The component can then decide how to render the source based on its provider.

## Development

```bash
npm install
npm run typecheck
npm run build
```

Run the demo:

```bash
npm run dev
```

Then open the local Vite URL.

## Versioning

This project follows Semantic Versioning.

For production, pin a specific version:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/zid-product-video@1.0.0/dist/index.js"></script>
```

## License

MIT

## Author

kindyALkindy
