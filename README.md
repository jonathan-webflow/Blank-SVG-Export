# Blank SVG Export (Figma Plugin)

Batch-export SVGs with per-item width/height, a queue workflow, and optional ZIP or individual downloads.

## Quick start (development)
1. Figma Desktop → Plugins → Development → Import plugin from manifest…
2. Select `manifest.json`.
3. Select layers on the canvas, click “Add” to put them into the queue.
4. Optionally set default dimensions and apply to the queue.
5. Export (ZIP or individual).

## Notes
- `width`/`height` attributes are injected into the <svg> before download, keeping the original `viewBox`.
- If a field is left blank, the existing attribute in the SVG is preserved.
- ZIP uses JSZip via CDN; if not available, use individual export.

## Publish to Community
- Create a Figma Community profile and enable 2FA.
- Figma Desktop → Plugins → Development → Manage plugins in development → select the plugin → Publish to Community.
- Provide name, description, icon (128×128), banner/screenshots, categories.
- Sanity check: no console errors, smooth Windows/macOS flow, clear user messages.

## Git / GitHub
- Main branch: `main`.
- Keep secrets out of commits. Temporary files ignored via `.gitignore`.
- Update flow: `git add -A && git commit -m "chore: update" && git push`.
