# FLL Scrolling Scoreboard - Unearthed

A React-based scrolling scoreboard application for FIRST LEGO League competitions, featuring automatic scrolling and team rankings based on highest individual match scores.

## Features

- **Auto-scrolling display**: Infinite scroll that smoothly loops through all teams
- **Dynamic ranking**: Teams sorted by their highest individual match score
- **Score highlighting**: Automatically highlights each team's best score in orange
- **56 teams**: Pre-populated with mock data for demonstration
- **Responsive design**: Built with Tailwind CSS for a clean, modern look
- **Orange theme**: Matching the Unearthed season branding

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Season Logo

Replace the placeholder file at `src/assets/season-logo.png` with the actual Unearthed season logo image you provided.

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

## Customization

### Update Team Data

Edit the `teams` array in `src/App.tsx` to update team names, numbers, and scores.

### Adjust Scroll Speed

In `src/components/Scoreboard.tsx`, modify the `scrollSpeed` constant (default: 30 pixels per second).

### Change Color Theme

The app uses Tailwind's orange color palette. To change colors, edit the Tailwind classes in:
- `src/App.tsx` - Background gradient
- `src/components/Scoreboard.tsx` - Header, table, and highlight colors

## Project Structure

```
claude-fll/
├── src/
│   ├── assets/
│   │   └── season-logo.png      # Season logo
│   ├── components/
│   │   └── Scoreboard.tsx       # Main scoreboard component
│   ├── styles/
│   │   └── globals.css          # Global styles
│   ├── App.tsx                  # Root component with team data
│   └── main.tsx                 # Application entry point
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

## Technical Details

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Features**:
  - Infinite scroll using array duplication
  - RequestAnimationFrame for smooth animations
  - Memoized sorting for performance
  - Responsive table layout

## License

Created for FLL competitions.
