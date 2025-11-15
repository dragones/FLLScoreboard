# FLL Scrolling Scoreboard - Unearthed

A React-based scrolling scoreboard application for FIRST LEGO League competitions, featuring automatic scrolling, live Google Sheets integration, and team rankings based on highest individual match scores.

## Features

- **Live Google Sheets integration**: Automatically fetches team data from Google Sheets CSV export
- **Auto-refresh**: Updates data every 60 seconds
- **Error resilience**: Caches data and shows errors in footer when connection fails
- **Auto-scrolling display**: Infinite scroll that smoothly loops through all teams
- **Dynamic ranking**: Teams sorted by their highest individual match score
- **Score highlighting**: Automatically highlights each team's best score in orange
- **Optional QR codes**: Display up to two QR codes in the header (configurable via environment variables)
- **Responsive design**: Built with Tailwind CSS for a clean, modern look
- **Orange theme**: Matching the Unearthed season branding

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```bash
# Required: Google Sheets ID
VITE_GOOGLE_SHEET_ID=your_google_sheet_id_here

# Optional: QR Code 1 (displays on left)
VITE_QR_CODE_URL_1=https://example.com
VITE_QR_CODE_LABEL_1=Upload Photos!

# Optional: QR Code 2 (displays on right)
VITE_QR_CODE_URL_2=https://example.com
VITE_QR_CODE_LABEL_2=Kids Choice Voting!
```

**Getting your Google Sheet ID:**
1. Open your Google Sheet
2. Make sure it's published or shared publicly (View access)
3. Get the ID from the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`

**Sheet Format:**
Your Google Sheet should have these columns in order:
- Team Number
- Name
- P (Practice)
- Match 1
- Match 2
- Match 3

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

### Google Sheets Data

The scoreboard automatically fetches data from your configured Google Sheet. To update data, simply edit your Google Sheet - changes will appear within 60 seconds.

### QR Codes

QR codes are optional and configured via environment variables:
- **QR Code 1**: Displays on the left side of the header
- **QR Code 2**: Displays on the right side of the header
- Both require a URL and label to be set
- QR codes appear independently - you can show one, both, or none

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
│   │   └── season-logo.webp      # Season logo
│   ├── components/
│   │   └── Scoreboard.tsx        # Main scoreboard component
│   ├── services/
│   │   └── googleSheets.ts       # Google Sheets integration
│   ├── App.tsx                   # Root component with data fetching
│   └── main.tsx                  # Application entry point
├── .env.example                  # Environment variable template
├── .env                          # Your environment configuration (not committed)
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── vite.config.ts               # Vite configuration
```

## Technical Details

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Data Source**: Google Sheets CSV export
- **QR Codes**: qrcode.react library
- **Features**:
  - Live data fetching with auto-refresh
  - Error caching and graceful degradation
  - Infinite scroll using array duplication
  - RequestAnimationFrame for smooth animations
  - Memoized sorting for performance
  - Responsive table layout
  - Optional dual QR code display

## License

Created for FLL competitions.
