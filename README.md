# THE BLOOM

THE BLOOM is a browser-based isometric survival-horror game built with plain HTML, CSS, and JavaScript. You play as Arjun, protecting his daughter Anaya while a fungal infection spreads across the coast and the city collapses into danger.

## Features

- Isometric top-down action and exploration
- Survival combat with sprinting, dodging, and stamina management
- Infection system and antidote mechanics
- Companion rescue logic for Anaya
- Multiple enemy types, boss encounter, and chapter progression
- Multiple endings and local chapter progress
- Audio, particles, lighting, and atmospheric enhancement layer

## Run locally

This project does not require npm, a build step, or a framework.

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Project structure

```text
The-Bloom/
├── index.html
├── favicon.svg
├── logo.svg
├── css/
│   └── style.css
├── js/
│   ├── 01-core.js
│   ├── 02-rendering.js
│   ├── 03-level-engine.js
│   ├── 04-entities.js
│   ├── 05-game-state.js
│   ├── 06-ui-flow.js
│   ├── 07-levels.js
│   ├── 09-enhancements.js
│   └── 08-main.js
├── README.md
└── (static game files as needed)
```

Important: the script order in `index.html` is intentional and should remain as-is:

```text
01 → 02 → 03 → 04 → 05 → 06 → 07 → 09 → 08
```

The final enhancement layer is loaded before the game bootstrap so it can extend the base systems without breaking the original module flow.

## Chapters

1. HOME DEFENSE
2. THE BLOOM-WIFE
3. THE ROAD
4. SCHOOL SHELTER
5. FINAL ESCAPE

## Controls

| Input | Action |
|---|---|
| WASD / Arrow keys | Move |
| SPACE | Attack / auto-aim |
| Mouse click | Attack toward cursor |
| SHIFT | Sprint |
| F | Dodge roll |
| Q | Use medkit |
| E | Carry / put down Anaya |
| M | Large map |
| P / ESC | Pause |
| H | Toggle help |

## Deployment

This is a static web project, so there is no npm dependency tree or build process.

### Vercel

Use these settings if deploying on Vercel:

- Framework Preset: Other
- Build Command: empty
- Install Command: empty
- Output Directory: .

If you see a black screen after deployment, open the browser console and check for missing script paths, 404 assets, or JavaScript errors.

## Author

Utkarsh Raj

## License

No license has been added yet.

## Enhancement layer

The game includes an optional enhancement layer in `js/09-enhancements.js`. It adds:

- richer procedural audio and ambience
- hit-stop, camera shake, impact feedback, and extra visual effects
- expanded lighting and atmospheric world passes
- improved boss and enemy feedback
- additional props and city-style environmental detail
- ambient enemy density in selected chapters
- extra pickups and environmental storytelling elements
- safe fallback hooks so the core game can still boot if an optional enhancement fails

This enhancement layer is additive and designed to work on top of the base game without requiring a full rewrite.
