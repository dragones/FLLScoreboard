# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FLL Scrolling Scoreboard - A React application for FIRST LEGO League competitions that displays live team scores with auto-scrolling, Google Sheets integration, and optional QR codes.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production (tsc && vite build)
npm run preview  # Preview production build
```

## Architecture

- **React 18 + TypeScript + Vite** - Single page application
- **Tailwind CSS** - Styling with orange theme for Unearthed season branding
- **Google Sheets CSV** - Live data source without API key requirement

### Key Components

- `src/App.tsx` - Root component handling data fetching, auto-refresh (60s interval), and error states
- `src/components/Scoreboard.tsx` - Main display with infinite scroll animation (30px/sec), team ranking, and optional dual QR codes
- `src/services/googleSheets.ts` - CSV fetching and parsing from Google Sheets

### Data Flow

1. App fetches CSV from Google Sheets via public export URL
2. CSV parser extracts: Team Number, Name, Practice score, Match 1-3 scores
3. Teams sorted by highest individual match score (descending)
4. Scoreboard duplicates array for seamless infinite scroll using requestAnimationFrame

### Environment Variables

Required in `.env` (see `.env.example`):
- `VITE_GOOGLE_SHEET_ID` - Google Sheets document ID

Optional QR codes:
- `VITE_QR_CODE_URL_1` / `VITE_QR_CODE_LABEL_1` - Left QR code
- `VITE_QR_CODE_URL_2` / `VITE_QR_CODE_LABEL_2` - Right QR code

## Customization Points

- **Scroll speed**: `scrollSpeed` constant in `Scoreboard.tsx:60` (default 30px/sec)
- **Refresh interval**: `setInterval` in `App.tsx:32` (default 60000ms)
- **Color theme**: Tailwind orange classes throughout components
