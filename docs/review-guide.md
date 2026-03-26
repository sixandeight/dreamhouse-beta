# Review Guide — Dreamhouse Beta

## Quick Start
1. Visit the deployed site at `https://sixandeight.github.io/dreamhouse-beta/`
2. Or run locally: `npm install && npm run dev`

## What to Look At

### 1. First Impression (House View)
- The dollhouse should render as a **2×3 grid of colorful rooms** with a pink roof
- Each room has a distinct wall color and ceiling light
- Floating sparkle particles add ambient movement
- The camera gently sways — the scene feels alive
- Title bar "Dreamhouse | Naomi & Jana" appears at the top

### 2. Room Hover
- Move your cursor over any room
- A **label tooltip** should follow the cursor showing the room name
- Cursor changes to pointer

### 3. Room Zoom
- **Click any room** to zoom into it
- Camera should smoothly tween to center on that room
- Other rooms fade to near-transparent
- A "← back to house" button appears top-left

### 4. Object Interaction
- While zoomed into a room, hover over furniture
- **Interactive objects** (those linked to projects) scale up on hover
- A tooltip appears with the object name and project hint
- Click an interactive object to open its project page

### 5. Project Overlay
- A frosted overlay slides up with the project details
- Shows title, tag, description, and credits
- Close with: × button, click outside, or Escape key
- After closing, you're still in the room view

### 6. Navigation Back
- Press "← back to house" or Escape to zoom back out
- All rooms fade back to full opacity
- You're back to the house view

## Room Map
```
┌─────────────┬─────────────┬──────────────┐
│ Beauty Room │  Bathroom   │   Studio     │  ← Top Floor
│ (pink)      │  (blue)     │   (lavender) │
│ → Kerastase │  → Gillette │   → Nike     │
├─────────────┼─────────────┼──────────────┤
│ Living Room │   Office    │   Lounge     │  ← Ground Floor
│ (coral)     │  (gold)     │   (magenta)  │
│ → Coca-Cola │  → About Us │   → Aperol   │
└─────────────┴─────────────┴──────────────┘
```

## Known Issues / Limitations
- **No mobile touch support yet** — optimized for desktop mouse interaction
- **No external assets/images** — all visuals are procedural 3D geometry
- **Project pages are placeholder text** — ready for Naomi & Jana to provide real content
- **Bundle size ~600KB** — Three.js is the bulk; could be tree-shaken further
- **No audio** — could add ambient music or click sounds later

## Technical Notes
- Built with Three.js + GSAP + Vite
- All furniture is procedural geometry (no 3D model files)
- Raycasting handles all click/hover detection
- Camera transitions use GSAP timelines
- Static export — no server required
