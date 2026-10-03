# THE BLOOM

**THE BLOOM** is an isometric survival-horror game by Utkarsh Raj, built as a static HTML5 Canvas experience with vanilla JavaScript.

## Current architecture

```text
The-Bloom/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── 01-core.js          # canvas, settings, audio primitives, input, textures
│   ├── 02-rendering.js     # drawing primitives and world props
│   ├── 03-level-engine.js  # Level class, world rendering, lighting, minimap
│   ├── 04-entities.js      # Player, Anaya, enemies, combat
│   ├── 05-game-state.js    # run state, HUD, level transitions
│   ├── 06-ui-flow.js       # menu, chapters, intro, pause, shop, endings
│   ├── 07-levels.js        # five chapter builders
│   ├── 08-main.js          # frame loop and boot
│   └── 09-enhancements.js  # cinematic/audio/FX/AI/world enhancement layer
└── README.md
```

### Script order matters

The game uses classic browser scripts rather than ES modules. Keep this exact order in index.html:

```text
01-core.js
02-rendering.js
03-level-engine.js
04-entities.js
05-game-state.js
06-ui-flow.js
07-levels.js
09-enhancements.js
08-main.js
```

09-enhancements.js intentionally runs before 08-main.js: it wraps the existing classes/functions and expands the level builders before the game boots.

## What the enhancement layer adds

The new enhancement patch is additive rather than a rewrite. It hooks into the existing V2 game and adds:

- richer procedural audio and an audio bus/reverb layer
- chapter-specific ambient sound beds
- additional combat, hit, hurt, kill, explosion, boss and environmental SFX
- hit-stop, camera kick, screen flashes and impact rings
- expanded particle effects, spores, smoke, embers, splashes and death FX
- enhanced world-space lighting and atmospheric passes
- improved enemy alert/chase feedback and wind-up cues
- boss cinematics and phase transitions
- low-health heartbeat and exhaustion breathing
- surface-aware footsteps
- additional environmental/world props
- expanded city-style environments for chapters 1, 3 and 5
- ambient enemy populations that do not interfere with chapter wave-clear logic
- additional pickups and environmental notes
- safer optional hooks: missing features fail softly instead of preventing the base game from booting

## Chapters

1. **HOME DEFENSE** — survive three waves and protect Anaya.
2. **THE BLOOM-WIFE** — confront Maya after the Bloom takes her body.
3. **THE ROAD** — cross the infected road and reach evacuation.
4. **SCHOOL SHELTER** — survive 60 seconds with the officer and survivors.
5. **FINAL ESCAPE** — survive the bombardment and reach the bunker.

## Controls

| Input | Action |
|---|---|
| WASD / Arrow keys | Move |
| Space | Attack / nearby auto-target |
| Mouse click | Attack toward cursor |
| Shift | Sprint; consumes stamina and creates noise |
| F | Dodge roll |
| Q | Use medkit |
| E | Carry / put down Anaya |
| M | Toggle large map |
| P / Esc | Pause |
| H | Toggle help |

## Core systems

- Health, stamina and Anaya health
- Infection and trust
- Noise-aware enemies
- Drifter, Stalker and Bloated infected
- Maya boss fight
- Medkits and antidotes
- Upgrade shop between chapters
- Multiple endings based on infection and health
- Difficulty, graphics, lighting, weather, particles, shake, minimap and subtitle settings

## Local development

No build step is required.

```bash
python -m http.server 8000
```

Open http://localhost:8000 in a modern browser.

For deployment on Vercel, use a static deployment:

- **Framework Preset:** Other
- **Build Command:** empty
- **Output Directory:** .
- **Install Command:** empty

index.html is the entry point.

## Validation

The runtime is intentionally dependency-free. Before pushing changes, syntax-check all JavaScript files and verify that the classic-script load order has not changed.

## Author

**Utkarsh Raj**
