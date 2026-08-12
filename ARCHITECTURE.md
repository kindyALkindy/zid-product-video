# Architecture

The package is intentionally provider-oriented.

```text
<zid-product-video>
        |
        v
  Source detection
        |
   +----+---------+----------+
   |              |          |
YouTube         Vimeo       MP4
   |              |          |
YouTube API     iframe      <video>
```

## Why this architecture?

The public Web Component should not need to know the details of every video platform.

Each provider should eventually expose a small contract for:

- validating the source
- creating the player element
- applying common playback options
- applying provider-specific options
- cleaning up the player

This allows new providers to be added without changing the HTML API used by Zid themes.

## Current state

YouTube rendering is implemented.

Provider detection already recognizes:

- YouTube
- Vimeo
- MP4 / M4V

Vimeo and MP4 rendering are intentionally left as separate provider implementations for the next release.
