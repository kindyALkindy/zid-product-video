export const styles = `
  :host {
    --zid-video-height: 300px;
    --zid-video-aspect-ratio: auto;
    --zid-video-radius: 0px;
    --zid-video-background: #000;
    --zid-video-object-fit: cover;

    display: block;
    width: 100%;
  }

  .video {
    position: relative;
    width: 100%;
    height: var(--zid-video-height);
    aspect-ratio: var(--zid-video-aspect-ratio);
    overflow: hidden;
    background: var(--zid-video-background);
    border-radius: var(--zid-video-radius);
  }

  .poster,
  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .poster {
    background-position: center;
    background-repeat: no-repeat;
    background-size: var(--zid-video-object-fit);
  }

  iframe {
    display: block;
    border: 0;
  }

  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 32px;
    height: 32px;
    transform: translate(-50%, -50%);
    border: 3px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: zid-video-spin .8s linear infinite;
  }

  @keyframes zid-video-spin {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;
