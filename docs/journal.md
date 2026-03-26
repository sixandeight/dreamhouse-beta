# Development Journal — Dreamhouse Beta (Three.js Approach)

## 2026-03-26 — Initial Build

### 17:30 — Project Setup
- Chose **Vite + vanilla JS + Three.js** over Next.js for speed and simplicity
- Three.js via npm, GSAP for camera tweens, gh-pages for deployment
- `basePath: '/dreamhouse-beta/'` set in Vite config for GitHub Pages

### 17:45 — Dollhouse Architecture Decisions
- 2x3 grid: 3 columns × 2 rows
- Each room is `1.4 × 1.0 × 1.0` units (W × H × D)
- Rooms are positioned by `col * ROOM_W` and `floor * ROOM_H`
- Front wall is completely removed — you see inside like a real dollhouse cross-section
- Back walls get the room's theme color, floors get a lighter variant
- Divider walls between columns, side walls on edges only

### 18:00 — Camera Strategy
- PerspectiveCamera at 35° FOV, positioned high and back (isometric-ish angle)
- House view: camera slightly above center, looking down at the house
- Room view: camera zooms forward and centers on the clicked room
- GSAP timeline drives the transition with `power3.inOut` easing
- Subtle idle sway in house view (sin-based position offset)

### 18:15 — Furniture System
- Each furniture type is a builder function returning a `THREE.Group`
- All objects built from primitive geometries: boxes, cylinders, spheres, cones, tori
- `MeshToonMaterial` everywhere for that flat cel-shaded aesthetic
- Furniture scales at 0.85x in default state, 1.0x on hover (GSAP spring)
- Interactive objects store `userData.furnitureDef` for raycasting identification

### 18:30 — Room Themes & Content Mapping
| Room | Floor | Color | Key Object → Project |
|------|-------|-------|---------------------|
| Beauty Room | Top-Left | Light Pink | Vanity → Kerastase |
| Bathroom | Top-Center | Baby Blue | Bathtub → Gillette |
| Creative Studio | Top-Right | Lavender | Desk → Nike |
| Living Room | Bottom-Left | Coral | Sofa → Coca-Cola |
| Office | Bottom-Center | Gold | Computer → About Us |
| Lounge | Bottom-Right | Magenta | Bar Cart → Aperol |

### 18:45 — Interaction Layers
1. **House view**: hover rooms → label tooltip follows cursor; click → zoom to room
2. **Room view**: hover interactive objects → scale up + tooltip; click → project overlay
3. **Project overlay**: HTML panel on top of canvas; close with ×, click outside, or Escape
4. **Back navigation**: button in top-left, or Escape key

### 19:00 — Visual Polish
- Point light inside each room using the room's accent color — warm glow effect
- Ceiling light fixtures (emissive spheres)
- Sparkle particle system: 120 particles floating through the scene with additive blending
- Fog (`FogExp2`) to fade distant elements
- ACES filmic tone mapping for richer colors
- Pink roof with ridge cap — the house actually looks like a dollhouse

### 19:15 — Project Overlay Design
- Frosted dark overlay (92% opacity) over the 3D scene
- Content card with gradient background, pink accent border
- Spring animation on open (scale + translate)
- Gradient text for project titles
- Credits section at the bottom

### 19:30 — Build & Deploy Prep
- Vite builds clean with ~600KB JS bundle (Three.js is the bulk)
- `.nojekyll` file for GitHub Pages
- `gh-pages` package for deployment
