# THE BLOOM

**THE BLOOM** is an isometric survival-horror game built with vanilla HTML, CSS, and JavaScript.

Arjun protects his daughter Anaya while a biological fungal infection spreads from the coast.

## Run locally

No npm install or build step is required.

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Vercel

- Framework Preset: **Other**
- Build Command: **empty**
- Install Command: **empty**
- Output Directory: **.**

## Structure

```
The-Bloom/
├── index.html
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
│   └── 08-main.js
└── README.md
```

The numbered modules preserve the execution order of the original game source. Do not reorder the script tags in `index.html`.

## Chapters

1. **HOME DEFENSE**
2. **THE BLOOM-WIFE**
3. **THE ROAD**
4. **SCHOOL SHELTER**
5. **FINAL ESCAPE**

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

## Core systems

- Isometric Canvas rendering
- Procedural textures and lighting
- Combat, sprint, stamina and dodge roll
- Infection and antidotes
- Anaya companion/carry system
- Drifters, stalkers and bloated infected
- Maya boss encounter
- Difficulty modes
- Safe-room shop
- Multiple endings
- Web Audio effects
- Local chapter progress

## Deployment

There is no npm dependency tree or compilation step. Every JavaScript module is loaded directly by `index.html`. If Vercel shows a black screen, check the browser console for missing modules or JavaScript runtime errors.

## Author

**Utkarsh Raj**

## License

No license has been added yet.
