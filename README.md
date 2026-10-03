<div align="center">

<style>
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  
  .pixel-title {
    font-family: 'Press Start 2P', cursive;
    font-size: 48px;
    color: #4dffa0;
    text-shadow: 
      4px 4px 0 #000,
      8px 8px 0 #000,
      -4px -4px 0 #000,
      -8px -8px 0 #000;
    animation: flicker 1.5s infinite alternate;
    letter-spacing: 8px;
    image-rendering: pixelated;
  }
  
  .pixel-subtitle {
    font-family: 'Press Start 2P', cursive;
    font-size: 16px;
    color: #ff5a5a;
    text-shadow: 2px 2px 0 #000;
    animation: pulse 2s infinite alternate;
    letter-spacing: 4px;
    margin-top: -10px;
    image-rendering: pixelated;
  }
  
  .pixel-section {
    font-family: 'Press Start 2P', cursive;
    font-size: 14px;
    color: #cfe9da;
    text-shadow: 2px 2px 0 #000;
    background: rgba(5, 7, 9, 0.8);
    padding: 12px;
    margin: 16px 0;
    border: 4px solid #2a2d2f;
    border-radius: 0;
    image-rendering: pixelated;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
  }
  
  .pixel-text {
    font-family: 'Press Start 2P', cursive;
    font-size: 12px;
    color: #b4cdbf;
    line-height: 1.8;
    text-shadow: 1px 1px 0 #000;
    image-rendering: pixelated;
  }
  
  .pixel-list {
    font-family: 'Press Start 2P', cursive;
    font-size: 11px;
    color: #9cb8a8;
    line-height: 2;
    text-shadow: 1px 1px 0 #000;
    image-rendering: pixelated;
    padding-left: 20px;
  }
  
  .pixel-code {
    font-family: 'Press Start 2P', cursive;
    font-size: 10px;
    color: #ffd34d;
    background: rgba(10, 13, 16, 0.9);
    padding: 8px;
    border: 2px solid #34383a;
    text-shadow: 1px 1px 0 #000;
    image-rendering: pixelated;
    overflow-x: auto;
  }
  
  .glitch {
    animation: glitch 3s infinite;
  }
  
  @keyframes flicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
      text-shadow: 
        4px 4px 0 #000,
        8px 8px 0 #000,
        -4px -4px 0 #000,
        -8px -8px 0 #000;
      color: #4dffa0;
    }
    20%, 24%, 55% {
      text-shadow: none;
      color: #ff5a5a;
    }
  }
  
  @keyframes pulse {
    0% { color: #ff5a5a; text-shadow: 2px 2px 0 #000; }
    50% { color: #ff8a8a; text-shadow: 2px 2px 0 #000, 0 0 10px #ff5a5a; }
    100% { color: #ff5a5a; text-shadow: 2px 2px 0 #000; }
  }
  
  @keyframes glitch {
    0%, 90%, 100% { transform: translate(0); }
    92% { transform: translate(-2px, 2px); }
    94% { transform: translate(2px, -2px); }
    96% { transform: translate(-2px, -2px); }
    98% { transform: translate(2px, 2px); }
  }
  
  .pixel-btn {
    display: inline-block;
    font-family: 'Press Start 2P', cursive;
    font-size: 12px;
    color: #000;
    background: #4dffa0;
    padding: 8px 16px;
    border: 4px solid #000;
    text-shadow: 2px 2px 0 #000;
    cursor: pointer;
    image-rendering: pixelated;
    transition: all 0.2s;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
  }
  
  .pixel-btn:hover {
    background: #6ab4ff;
    transform: translateY(-2px);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
  }
  
  .bloom-ring {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid #4dffa0;
    border-radius: 50%;
    animation: bloomPulse 2s infinite;
    image-rendering: pixelated;
  }
  
  @keyframes bloomPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(77, 255, 160, 0.4); }
    50% { box-shadow: 0 0 0 8px rgba(77, 255, 160, 0); }
  }
  
  body {
    background: #07090b;
    color: #cfe9da;
  }
</style>

<div class="glitch">
  <div class="pixel-title">THE BLOOM</div>
  <div class="pixel-subtitle"><span class="bloom-ring"></span> ISOMETRIC SURVIVAL HORROR <span class="bloom-ring"></span></div>
</div>

---

<div class="pixel-section">
  <div class="pixel-text">A BROWSER-BASED ISOMETRIC SURVIVAL HORROR GAME</div>
  <div class="pixel-text">BUILT WITH PLAIN HTML, CSS, AND JAVASCRIPT</div>
</div>

<div class="pixel-section">
  <div class="pixel-text">PLAY AS DAVID, PROTECTING HIS DAUGHTER NANCY</div>
  <div class="pixel-text">WHILE A FUNGAL INFECTION SPREADS ACROSS THE COAST</div>
  <div class="pixel-text">AND THE CITY COLLAPSES INTO DANGER</div>
</div>

---

<div class="pixel-section">
  <div class="pixel-text">
    <span class="bloom-ring"></span> FEATURES <span class="bloom-ring"></span>
  </div>
  <div class="pixel-list">
    ISOMETRIC TOP-DOWN ACTION AND EXPLORATION
  </div>
  <div class="pixel-list">
    SURVIVAL COMBAT WITH SPRINTING, DODGING, AND STAMINA MANAGEMENT
  </div>
  <div class="pixel-list">
    COMBO SYSTEM WITH 3RD-HIT FINISHERS, HEAVY ATTACKS, AND PARRY-RIPOSTE COUNTERS
  </div>
  <div class="pixel-list">
    TELEGRAPHED ENEMY ATTACKS - RED GROUND RINGS WARN BEFORE STRIKE
  </div>
  <div class="pixel-list">
    INFECTION SYSTEM AND ANTIDOTE MECHANICS
  </div>
  <div class="pixel-list">
    COMPANION RESCUE LOGIC FOR NANCY
  </div>
  <div class="pixel-list">
    MULTIPLE ENEMY TYPES, BOSS ENCOUNTER, AND CHAPTER PROGRESSION
  </div>
  <div class="pixel-list">
    MULTIPLE ENDINGS AND LOCAL CHAPTER PROGRESS
  </div>
  <div class="pixel-list">
    AUDIO, PARTICLES, LIGHTING, AND ATMOSPHERIC ENHANCEMENT LAYER
  </div>
  <div class="pixel-list">
    REFINED CHAPTER INTRO SCREENS, ANIMATED PIXEL TITLE SCREEN
  </div>
  <div class="pixel-list">
    FLICKERING LIGHTS, AND A NEW BLOOM-MARK FAVICON/LOGO
  </div>
  <div class="pixel-list">
    FULL MOBILE SUPPORT - AUTO-DETECTED ON TOUCH DEVICES
  </div>
  <div class="pixel-list">
    HALO RINGS UNDER EVERY BEING: GREEN, YELLOW, ORANGE, RED, VIOLET
  </div>
  <div class="pixel-list">
    WRECKED AND BURNING VEHICLES SCATTERED THROUGH LEVELS
  </div>
</div>

---

<div class="pixel-section">
  <div class="pixel-text">
    <span class="bloom-ring"></span> RUN LOCALLY <span class="bloom-ring"></span>
  </div>
  <div class="pixel-code">
    NO NPM, NO BUILD STEP, NO FRAMEWORK NEEDED
  </div>
  <div class="pixel-code">
    PYTHON -M HTTP.SERVER 8000
  </div>
  <div class="pixel-code">
    OPEN: HTTP://LOCALHOST:8000
  </div>
</div>

---

<div class="pixel-section">
  <div class="pixel-text">
    <span class="bloom-ring"></span> PROJECT STRUCTURE <span class="bloom-ring"></span>
  </div>
  <div class="pixel-code">
    THE-BLOOM/
    |-- INDEX.HTML
    |-- FAVICON.SVG
    |-- LOGO.SVG
    |-- CSS/
    |   |-- STYLE.CSS
    |-- JS/
    |   |-- 01-CORE.JS
    |   |-- 02-RENDERING.JS
    |   |-- 03-LEVEL-ENGINE.JS
    |   |-- 04-ENTITIES.JS
    |   |-- 05-GAME-STATE.JS
    |   |-- 06-UI-FLOW.JS
    |   |-- 07-LEVELS.JS
    |   |-- 08-MAIN.JS
    |   |-- 09-ENHANCEMENTS.JS
    |   |-- 10-COMBAT.JS
    |   |-- 11-VISUALS.JS
    |   |-- 12-MOBILE.JS
    |-- README.MD
  </div>
  <div class="pixel-text" style="font-size: 10px; margin-top: 12px;">
    IMPORTANT: SCRIPT ORDER IS INTENTIONAL
  </div>
  <div class="pixel-text" style="font-size: 10px;">
    01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 09 -> 10 -> 11 -> 12 -> 08
  </div>
</div>

---

<div class="pixel-section">
  <div class="pixel-text">
    <span class="bloom-ring"></span> CHAPTERS <span class="bloom-ring"></span>
  </div>
  <div class="pixel-list">
    1. HOME DEFENSE
  </div>
  <div class="pixel-list">
    2. THE BLOOM-WIFE
  </div>
  <div class="pixel-list">
    3. THE ROAD
  </div>
  <div class="pixel-list">
    4. SCHOOL SHELTER
  </div>
  <div class="pixel-list">
    5. FINAL ESCAPE
  </div>
</div>

---

<div class="pixel-section">
  <div class="pixel-text">
    <span class="bloom-ring"></span> CONTROLS <span class="bloom-ring"></span>
  </div>
  
  <div class="pixel-section" style="background: rgba(10, 13, 16, 0.6); border-color: #171a1d;">
    <div class="pixel-text" style="font-size: 11px;">DESKTOP</div>
    <div class="pixel-list">
      WASD / ARROW KEYS - MOVE
    </div>
    <div class="pixel-list">
      SPACE - ATTACK / AUTO-AIM
    </div>
    <div class="pixel-list">
      MOUSE CLICK - ATTACK TOWARD CURSOR
    </div>
    <div class="pixel-list">
      SHIFT - SPRINT
    </div>
    <div class="pixel-list">
      F - DODGE ROLL
    </div>
    <div class="pixel-list">
      R - PARRY (NEGATES HIT, STUNS ATTACKER)
    </div>
    <div class="pixel-list">
      K / RIGHT CLICK - HEAVY SWING
    </div>
    <div class="pixel-list">
      Q - USE MEDKIT
    </div>
    <div class="pixel-list">
      E - CARRY / PUT DOWN NANCY
    </div>
    <div class="pixel-list">
      M - LARGE MAP
    </div>
    <div class="pixel-list">
      P / ESC - PAUSE
    </div>
    <div class="pixel-list">
      H - TOGGLE HELP
    </div>
  </div>
  
  <div class="pixel-section" style="background: rgba(10, 13, 16, 0.6); border-color: #171a1d;">
    <div class="pixel-text" style="font-size: 11px;">TOUCH (PHONES / TABLETS)</div>
    <div class="pixel-list">
      TOUCH AND HOLD ANYWHERE - WALK TOWARD FINGER
    </div>
    <div class="pixel-list">
      QUICK TAP - ATTACK TOWARD THAT SPOT
    </div>
    <div class="pixel-list">
      SECOND FINGER TAP - ATTACK WHILE MOVING
    </div>
    <div class="pixel-list">
      DODGE / PARRY / MED / NANCY BUTTONS - SAME AS F / R / Q / E
    </div>
    <div class="pixel-list">
      MAP BUTTON - OPEN / CLOSE BIG MAP
    </div>
    <div class="pixel-list">
      II BUTTON - PAUSE
    </div>
  </div>
</div>

---

<div class="pixel-section">
  <div class="pixel-text">
    <span class="bloom-ring"></span> DEPLOYMENT <span class="bloom-ring"></span>
  </div>
  <div class="pixel-text">
    THIS IS A STATIC WEB PROJECT
  </div>
  <div class="pixel-text">
    NO NPM DEPENDENCY TREE OR BUILD PROCESS
  </div>
  <div class="pixel-section" style="background: rgba(10, 13, 16, 0.6); border-color: #171a1d;">
    <div class="pixel-text" style="font-size: 11px;">VERCEL SETTINGS</div>
    <div class="pixel-list">
      FRAMEWORK PRESET: OTHER
    </div>
    <div class="pixel-list">
      BUILD COMMAND: EMPTY
    </div>
    <div class="pixel-list">
      INSTALL COMMAND: EMPTY
    </div>
    <div class="pixel-list">
      OUTPUT DIRECTORY: .
    </div>
  </div>
</div>

---

<div class="pixel-section">
  <div class="pixel-text">
    <span class="bloom-ring"></span> ENHANCEMENT LAYER <span class="bloom-ring"></span>
  </div>
  <div class="pixel-list">
    RICHER PROCEDURAL AUDIO AND AMBIENCE
  </div>
  <div class="pixel-list">
    HIT-STOP, CAMERA SHAKE, IMPACT FEEDBACK
  </div>
  <div class="pixel-list">
    EXPANDED LIGHTING AND ATMOSPHERIC WORLD PASSES
  </div>
  <div class="pixel-list">
    IMPROVED BOSS AND ENEMY FEEDBACK
  </div>
  <div class="pixel-list">
    ADDITIONAL PROPS AND CITY-STYLE ENVIRONMENTAL DETAIL
  </div>
  <div class="pixel-list">
    AMBIENT ENEMY DENSITY IN SELECTED CHAPTERS
  </div>
  <div class="pixel-list">
    EXTRA PICKUPS AND ENVIRONMENTAL STORYTELLING ELEMENTS
  </div>
  <div class="pixel-list">
    SAFE FALLBACK HOOKS FOR CORE GAME BOOT
  </div>
  <div class="pixel-text" style="font-size: 10px; margin-top: 12px;">
    ADDITIVE DESIGN - WORKS ON TOP OF BASE GAME
  </div>
</div>

---

<div class="pixel-section">
  <div class="pixel-text">
    <span class="bloom-ring"></span> LICENSE <span class="bloom-ring"></span>
  </div>
  <div class="pixel-text">
    NO LICENSE HAS BEEN ADDED YET
  </div>
</div>

<div class="pixel-section" style="margin-top: 32px; animation: pulse 3s infinite;">
  <div class="pixel-text">
    <span class="bloom-ring" style="animation: bloomPulse 1s infinite;"></span>
    ENJOY THE GAME
    <span class="bloom-ring" style="animation: bloomPulse 1s infinite;"></span>
  </div>
</div>

</div>
