# diagram-notes

A web app to browse SVG diagrams in a grid, view them full-size, and manage notes and publish flags.

## Resources

🚀 **Live**: (coming soon)
📝 **Slides**: (coming soon)

## Features

- Browse SVG diagrams in a Masonry grid
- Click to expand and view full-size
- Add notes (memo) to each diagram
- Track publish status with a checkbox
- Search diagrams by title
- Export / import notes as JSON
- Dark mode support

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
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
