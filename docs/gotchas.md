# Gotchas & Solutions

## 1. Vite basePath for GitHub Pages
**Problem**: Assets (JS, CSS) 404 when deployed to `sixandeight.github.io/dreamhouse-beta/`
**Solution**: Set `base: '/dreamhouse-beta/'` in `vite.config.js`. Vite prepends this to all asset paths in the built HTML.

## 2. `.nojekyll` Required
**Problem**: GitHub Pages uses Jekyll by default, which ignores files starting with `_` (like `_assets/`).
**Solution**: Add an empty `.nojekyll` file to the deploy directory. The deploy script creates it automatically.

## 3. MeshToonMaterial Transparency
**Problem**: When fading out rooms (zooming into one), toon materials don't support opacity by default.
**Solution**: Set `transparent: true` on the material before tweening `opacity`. GSAP handles this via `onUpdate`. **Important**: When fading back in, reset `transparent = false` in the tween's `onComplete` — leaving it `true` permanently causes z-sorting artifacts.

## 4. Raycaster Hit on Furniture Groups
**Problem**: Furniture is built as `THREE.Group` with many child meshes. Raycaster might hit a tiny sub-mesh (like a leg) instead of the main piece.
**Solution**: Store `userData.furnitureDef` on every mesh child in the group via `traverse()`. Any hit on any child resolves to the same furniture definition.

## 5. GSAP Scale Animation + Position
**Problem**: Scaling a furniture group from its origin (0,0,0) looks wrong if the group isn't centered.
**Solution**: Furniture groups are positioned via `group.position.set()` at their base. Scale animates from 0.85 to 1.0 which creates a subtle "grow" effect that works well from any origin.

## 6. Camera LookAt During Tween
**Problem**: If you tween camera position without updating lookAt each frame, the camera drifts weirdly.
**Solution**: Use `onUpdate: () => camera.lookAt(target)` in the GSAP tween.

## 7. Click-Through on Overlay
**Problem**: Clicks on the project overlay also register on the 3D scene behind it.
**Solution**: The overlay uses `pointer-events: all` when visible and `pointer-events: none` when hidden. The overlay click handler calls `e.stopPropagation()` isn't needed because the canvas is a separate element.

## 8. Particle System Performance
**Problem**: Too many particles + per-frame position updates can drop FPS.
**Solution**: Keep particle count modest (120), use simple `PointsMaterial` with `sizeAttenuation`, and only update Y positions. Additive blending makes even sparse particles look rich.
