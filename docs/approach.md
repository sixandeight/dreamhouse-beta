# Approach — Dreamhouse Beta

## Architecture

```
index.html          → Entry point, all HTML overlays
src/
  main.js           → Three.js scene, camera, raycasting, animation loop
  rooms.js          → Room definitions (themes, colors, furniture placements)
  projects.js       → Project content (titles, descriptions, credits)
  furniture.js      → 3D furniture builders (geometry + materials)
  style.css         → All CSS (loader, overlays, tooltips, UI)
```

## Tech Stack
- **Three.js** — 3D rendering engine
- **GSAP** — Camera tweens and UI animations
- **Vite** — Build tool and dev server
- **gh-pages** — Deployment to GitHub Pages

## Design Philosophy

### "Diorama, Not Game"
The goal is a **cross-section dollhouse** — like looking into a real dollhouse with the front removed. Not a first-person walkthrough, not a top-down map. The isometric-ish camera angle gives depth while keeping all rooms visible simultaneously.

### Y2K Aesthetic in 3D
The reference images (Totally Spies, Bratz, My Scene, Barbie) share these traits:
- **Bold, flat color** — no photorealistic textures. `MeshToonMaterial` gives us cel-shading.
- **Hot pink as the anchor** — roof, accents, hover states all use #FF69B4
- **Saturated per-room palettes** — each room has a distinct wall color from the Y2K palette
- **Sparkle and glow** — particle system + emissive materials + point lights per room

### Navigation Flow
```
HOUSE VIEW ──click room──→ ROOM VIEW ──click object──→ PROJECT OVERLAY
    ↑                          ↑                             │
    └────── Escape/Back ───────┘←──── Escape/Close ──────────┘
```

### Furniture as Simple Geometry
Every piece of furniture is built from **primitive Three.js geometries** — no external models, no loading time. This keeps the build fast and the aesthetic consistent. A bathtub is a white box with a blue box on top. A vanity is a table with a torus-framed circle mirror. The simplicity IS the style.

### Camera System
- House view: high-angle perspective looking down and forward at the dollhouse
- Room zoom: GSAP tweens camera position and continuously updates lookAt target
- Idle sway: subtle sin-based position oscillation in house view for liveliness
- Other rooms fade to 8% opacity when zoomed into one room

## Color Palette
| Name | Hex | Used For |
|------|-----|----------|
| Hot Pink | #FF69B4 | Roof, accents, hover states |
| Deep Pink | #FF1493 | Strong accents, lipstick |
| Magenta | #FF00FF | Lounge room, sparkles |
| Baby Blue | #87CEEB | Bathroom room |
| Lavender | #E6E6FA | Studio room |
| Coral | #FF6F61 | Living room |
| Gold | #FFD700 | Office room, metallic accents |
| Dark Navy | #1A1A2E | Background, overlays |
