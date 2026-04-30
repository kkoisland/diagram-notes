# diagram-notes

A web app to browse SVG diagrams in a grid, view them full-size, and manage notes and publish flags.

## Resources

🚀 **Live**: (coming soon)
📝 **Slides**: (coming soon)

## Features

- Browse SVG diagrams in a responsive Masonry grid (3 → 2 → 1 columns)
- Click to expand: split view with full-size SVG on the right and scrollable list on the left
- Selected card highlighted and auto-scrolled into view in the side panel
- Published indicator (badge) on cards for diagrams posted to Zenn / Medium
- Dark mode toggle with system preference detection and localStorage persistence
- Add memo and published flag per diagram — auto-saved to localStorage
- Export notes as `notes.json` (download button in the toolbar)
- Import `notes.json` from another device (upload button in the toolbar)
- Search and category filter (coming soon)

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- react-masonry-css
- lucide-react
- Biome (Formatter + Linter)
- GitHub Actions + GitHub Pages

## Local Development

```bash
nvm use
pnpm i
pnpm dev
```

http://localhost:5173/

## Project Structure

```
diagram-notes/
├── public/
│   ├── diagrams/          # SVG files
│   └── diagrams.json      # generated at build time
├── src/
│   ├── App.tsx
│   ├── DiagramCard.tsx
│   ├── DetailView.tsx
│   ├── types.ts
│   └── main.tsx
├── generate-diagrams.ts   # SVG list generation script
└── vite.config.ts
```

## Deploy

Automatically deployed to GitHub Pages via GitHub Actions on every push to `main`.
