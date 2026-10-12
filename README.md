# Portfolio v2

Anshuman Tyagi's interactive portfolio. Vite, React, Tailwind v4, Motion and matter-js.

```bash
npm install
npm run dev
```

`npm run build` outputs a static site to `dist/` (relative paths, so it works on GitHub Pages under any repo name).

## Where things live

- `src/data.js`: all copy, projects, experience and hobbies. Edit this to change content.
- `src/components/ProjectsStage.jsx`: the falling "My projects" title and Sprout's behaviour.
- `src/components/Sprout.jsx` + `sprout.css`: the Sprout character and its poses.
- `src/secrets.jsx`: the easter egg tracker and keyboard secrets.
- `src/index.css`: day/night color tokens.

## Adding photos and videos to a project

Each project in `src/data.js` can have a `media` list. The project view shows the items in order,
with thumbnails when there is more than one. Without `media`, it shows the project's card image.

```js
media: [
  { type: 'video', src: 'media/claimiq-demo.mp4', poster: 'media/claimiq-poster.jpg', caption: 'Optional caption' },
  { type: 'image', src: 'media/claimiq-dashboard.png', caption: 'Optional caption' },
],
```

Put the files in `public/media/` (or use a full `https://` link). Keep videos small: 720p MP4,
ideally under 3 MB, with a still image as the `poster`. Videos start muted, as browsers require.

## The 7 secrets

1. Pull the lamp string in the top right corner.
2. Click the letters of the name twice.
3. Hover or tap the "My projects" title.
4. Click Sprout 10 times.
5. Click the AT logo 5 times quickly.
6. Type "sprout".
7. Double-click the top of the "Six things I grow" tree.
