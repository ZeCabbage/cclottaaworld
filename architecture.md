# ccllottaaWorld - Technical Architecture & Overview
**Project Concept**: A retro, "Y2K aespacecore" browser-based virtual world with classic PS2/anime-style aesthetics.

## High-Level Architecture
The project is split into a **client** (frontend) and **server** (backend), connected by Vite for development.

### Tech Stack
*   **Frontend Ecosystem:** Vanilla JavaScript (ES6 Modules), HTML5, CSS3 built with Vite. No heavy UI frameworks (React/Vue) to maintain maximum performance and fine-grained control over the DOM.
*   **3D Rendering:** `THREE.js` handles all 3D scene rendering, object manipulation, cameras, and lighting.
*   **2D Graphics:** HTML5 Canvas API is used extensively for generating dynamic textures (like the character's face, hair, and clothing patterns) which are then mapped onto 3D geometry.
*   **Styling:** Custom CSS architecture utilizing CSS Variables (tokens) for theming, component-based styling, and a global retro aesthetic.

---

## 1. Directory Structure

```text
ccllottaaWorld/
├── client/                     # Frontend Application
│   ├── index.html              # Main entry point, sets up the full-screen canvas and UI container
│   ├── package.json            # Vite dependencies (three, vite)
│   ├── vite.config.js          # Vite configuration
│   └── src/
│       ├── main.js             # Application bootstrap & lifecycle management
│       ├── engine/             # Core Systems (Rendering, State, Logic)
│       ├── screens/            # Application Views (Title, Select, Town, Shops)
│       ├── state/              # Global State Management (GameState, Inventory)
│       ├── ui/                 # Reusable UI components (Browser Chrome, Icons)
│       ├── styles/             # CSS System
│       └── data/               # Static Configurations & Content
└── server/                     # Backend API & Generators (WIP)
    └── src/                    # Node.js backend logic
```

---

## 2. Core Engine Systems (`client/src/engine/`)

The application avoids monolithic code by using an event-driven, modular registry system.

### A. Lifecycle Management & Routing
*   **`screenRegistry.js`**: A central ledger where different game views (e.g., Title Screen, Character Creator) register themselves via string IDs.
*   **`screenBase.js`**: An abstract base class that defines the lifecycle contract (`init`, `mount`, `unmount`, `update`) for all screens.
*   **`main.js`**: Bootstraps the app, initializes Three.js, and manages transitioning between screens registered in the `ScreenRegistry`.

### B. Graphics & Rendering
*   **`renderer.js`**: Wraps the raw `THREE.WebGLRenderer`, managing the main render loop, resizing, resolution scaling, and passing the `delta` time to the active screen's `update` method.
*   **`sceneManager.js`**: (Future use) Intended to handle overarching scene lighting, global environments, and post-processing effects.

### C. The Hybrid Character System
This is the most complex front-end system, achieving a stylized Y2K anime look by mixing simple 3D geometry with procedurally drawn 2D textures.
*   **`characterModel.js`**: Constructs a `THREE.Group` representing the 3D body. It uses basic primitives (Cylinders, Spheres) shaped with specific mathematical proportions (long legs, short torso, chunky boots) to match the required visual style. 
*   **`characterDraw.js`**: Uses the purely 2D HTML Canvas API to draw highly detailed anime features (layered eyes, expressions, 8 distinct stylized hair silhouettes, clothing patterns). These canvases are exported, converted into `THREE.CanvasTexture` objects, and mapped onto the 3D meshes defined in `characterModel.js`.

---

## 3. Application State (`client/src/state/`)
*   **`gameState.js`**: A centralized proxy object holding global variables (current character customization, unlocked areas, currency). It uses a pub/sub pattern so UI components can listen for changes.
*   **`inventory.js`**: Manages items the player owns.
*   **`saveManager.js`**: serializes `gameState` and saves/loads from `localStorage`.

---

## 4. Screens / Views (`client/src/screens/`)
Each file here extends `ScreenBase` and represents a distinct "page" or "level" of the game.

*   **`title.js`**: The landing page. Renders a distinct 3D scene (floating chrome objects, aespacecore aesthetic) and a DOM-based interactive UI overlay.
*   **`select.js`**: The Character Creator. 
    *   **3D**: Instantiates the character model (`buildCharacterModel`) inside an environment (a chrome platform).
    *   **UI**: Renders a multi-step HTML formulary alongside the 3D canvas, updating the `charState` object when users change hair, skin, clothing, etc.
*   **`town.js` / Shopes (e.g., `shopArcade.js`, `shopCafe.js`)**: (WIP) Future screens for world exploration.

---

## 5. Styling System (`client/src/styles/`)
Uses vanilla HTML/CSS over complex DOM frameworks, overlaid on top of the Three.js `<canvas>`.

*   **`tokens.css`**: Defines global CSS variables for colors, typography, sizing, and the retro aesthetic parameters (e.g., `var(--color-chrome)`, `var(--font-pixel)`).
*   **`retro.css` / `index.css`**: Global resets and specific hacks to achieve the Y2K/PS2 aesthetic (scanlines, bespoke cursors, custom scrollbars).
*   **`chrome.css` / `browser.css`**: Styling specifically for the UI borders and interactive elements that frame the 3D content.

## 6. How It All Connects (The Data Flow)
1. **Init:** `main.js` calls `Renderer.init()` and looks up the active screen from `ScreenRegistry`.
2. **Mount:** The active screen (e.g., `select.js`) is instantiated. Its `mount(container)` method is called.
3. **Setup:** The screen creates its local `THREE.Scene`, `Camera`, and DOM elements, attaching the DOM to the provided `container` overlay.
4. **Loop:** `Renderer.js` triggers `requestAnimationFrame`. Every frame, it clears the WebGL context and calls `activeScreen.update(delta)`. The screen rotates its models and calls `renderer.render(itsScene, itsCamera)`.
5. **Updates:** When a user clicks a button in the DOM UI, it mutates a state object (like `charState`) and calls a local re-render function (like `rebuildCharacter()`) which destroys the old 3D group and builds a new one using the updated state via `characterModel.js`.
