# Real & Raw Gospel

A spiritually-focused training website for the remnant. No fluff, no compromise—pure truth from the Word of YAHUAH.

## Sacred Names

This website honors the sacred Names throughout:
- **YAHUAH** - The Name of the Father
- **YAHUSHA** / **YAHUSHA HAMASHIACH** - The Name of the Messiah
- **RUACH HAQODESH** - The Holy Spirit
- **EL ELYON** - The Most High
- **YAH** - Shortened form of YAHUAH
- **MASHIACH** - The Anointed One

## Tech Stack

- **Astro** - Fast, modern static site framework
- **Tailwind CSS** - Utility-first CSS framework
- **MDX** - Markdown with JSX components
- **React** - For interactive islands (Bible reader, media players)
- **TypeScript** - Type-safe JavaScript

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── AudioPlayer.tsx
│   │   ├── BibleReader.tsx
│   │   └── UniversalVideoEmbed.tsx
│   ├── data/            # JSON data files
│   │   └── bible/
│   │       └── kjv.sample.json
│   ├── layouts/         # Astro layouts
│   │   └── Base.astro
│   ├── pages/           # File-based routing
│   │   ├── index.astro
│   │   ├── start-here.astro
│   │   ├── walk-in-the-spirit.astro
│   │   ├── prayer-and-fasting.astro
│   │   ├── feasts.astro
│   │   ├── spiritual-warfare.astro
│   │   ├── identity-and-messiah.astro
│   │   ├── end-times.astro
│   │   ├── videos/
│   │   ├── bible.astro
│   │   ├── blog/
│   │   ├── music/
│   │   ├── books/
│   │   └── privacy.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

## Core Sections

1. **Start Here** - Introduction and foundation
2. **Walk in the Spirit** - Daily consecration and obedience
3. **Prayer & Fasting** - Spiritual disciplines
4. **Feasts of YAH** - Biblical calendar and appointed times
5. **Spiritual Warfare** - Authority and armor of YAHUAH
6. **Identity & Mashiach** - Who you are in YAHUSHA
7. **End-Times** - Prophetic understanding and preparation
8. **Videos** - Teaching videos and testimonies
9. **Bible** - Scripture reader with Sacred Names toggle
10. **Blog** - Articles and teachings
11. **Music** - Worship music honoring the sacred Names
12. **Books** - Recommended reading (affiliate links)
13. **Privacy** - Privacy policy

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

### Development

```bash
# Start dev server
npm run dev
# or
pnpm dev
```

The site will be available at `http://localhost:4321`

### Build for Production

```bash
# Build the static site
npm run build
# or
pnpm build

# Preview the build
npm run preview
# or
pnpm preview
```

## Components

### BibleReader
Interactive Bible reader with Sacred Names toggle. Allows users to switch between standard and sacred name translations.

### UniversalVideoEmbed
Supports YouTube, Vimeo, and direct video URLs. Automatically detects video source and creates appropriate embed.

### AudioPlayer
Custom audio player with play/pause, progress bar, and time display.

## Development Standards

- **TypeScript** for all React components
- **Semantic HTML** for accessibility
- **Tailwind utilities** for styling
- **Sacred Name accuracy** in all content
- **WCAG compliance** for accessibility

## Future Enhancements

- Full Bible data integration
- Static search with Pagefind
- Blog post system with MDX
- Video library with categorization
- Music player with playlists
- Community features
- Giving/donation integration
- Private analytics (privacy-respecting)

## License

All glory to YAHUAH.

---

**Real & Raw Gospel** - Training the Remnant in the Ways of YAHUAH
