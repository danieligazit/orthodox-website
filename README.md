# Orthodox Recordings Website

A modern, interactive website for Orthodox Recordings - a musique concrète label. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Scroll-driven animations**: Smooth logo transformation and background rotation
- **Album catalog**: Browse and explore the label's releases
- **Detail views**: Click on albums to see full track listings and descriptions
- **Responsive design**: Works beautifully on desktop and mobile devices
- **Typography**: Uses IM Fell English serif font for an elegant, classic feel

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
orthodox-website/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # React entry point
│   ├── index.css       # Global styles and Tailwind imports
│   └── types.ts        # TypeScript type definitions
├── archive/            # Original concept files
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── postcss.config.js   # PostCSS configuration
```

## Development

The website features a scroll-driven animation where:
- The logo transforms from a large centered display to a compact header logo
- A black plane rotates as you scroll
- Album content fades in as you scroll down
- Click on any album card to view detailed information

## License

© 2024 Orthodox Recordings. Musique Concrète.
