/* ============================================
   cclottaaWorld — Main App Bootstrap
   ES Module entry point
   ============================================ */

// Styles — tokens first (design system foundation)
import './styles/tokens.css';
import './styles/components.css';
import './styles/chrome.css';
import './styles/index.css';
import './styles/browser.css';
import './styles/retro.css';
import './styles/shops.css';
import './styles/creatures.css';

// Engine
import { renderer } from './engine/renderer.js';
import { sceneManager } from './engine/sceneManager.js';
import { screenRegistry } from './engine/screenRegistry.js';
import { devTools } from './engine/devTools.js';

// State
import { gameState } from './state/gameState.js';
import { saveManager } from './state/saveManager.js';

// Wasm bridge
import { wasmBridge } from './wasm/bridge.js';

// UI
import { browserChrome } from './ui/browserChrome.js';

// Registries (self-register their defaults on import)
import './engine/blockRegistry.js';
import './engine/shopRegistry.js';

// Screens — each self-registers with the ScreenRegistry
import './screens/title.js';
import './screens/select.js';
import './screens/town.js';
import './screens/petView.js';
import './screens/apartment.js';
import './screens/shopFashion.js';
import './screens/shopArcade.js';
import './screens/shopPark.js';
import './screens/shopFortune.js';
import './screens/shopVinyl.js';
import './screens/shopWork.js';
import './screens/shopCafe.js';
import './screens/shopGarden.js';

/* ---- App Router ---- */
const App = {
    screenHistory: [],

    async init() {
        console.log('[cclottaaWorld] Initializing...');
        console.log(`[cclottaaWorld] ${screenRegistry.list().length} screens registered`);

        // Dev tools (FPS counter, memory monitor — dev only)
        devTools.init();

        // Initialize Wasm engine (async)
        try {
            await wasmBridge.init();
            console.log('[cclottaaWorld] Wasm engine loaded.');
        } catch (e) {
            console.warn('[cclottaaWorld] Wasm not available, running in JS-only mode:', e.message);
        }

        // Initialize renderer (WebGPU with WebGL2 fallback)
        try {
            await renderer.init();
            console.log(`[cclottaaWorld] Renderer initialized: ${renderer.type}`);
        } catch (e) {
            console.warn('[cclottaaWorld] Renderer init failed:', e);
        }

        // Set up backward compat
        gameState._initCompat();

        // Try to load saved game
        const hasLoaded = saveManager.load();

        // Wire up browser chrome UI
        browserChrome.init(this);

        // Start auto-save
        saveManager.startAutoSave();

        // Update coins display
        gameState.updateCoinDisplay();

        // Navigate to appropriate screen
        if (hasLoaded && gameState.player.gameStarted) {
            this.navigateTo('town');
        } else {
            this.navigateTo('title');
        }

        console.log('[cclottaaWorld] Ready.');
    },

    navigateTo(screenId) {
        gameState.updateStatus('Loading...', '⏳');

        // Fire before-navigate hooks
        screenRegistry._fireHooks('beforeNavigate', gameState.currentScreen, screenId);

        // Dispose all 3D scenes
        sceneManager.disposeAll();

        // Screen-specific cleanup
        const currentScreenId = gameState.currentScreen;
        if (currentScreenId && currentScreenId !== screenId) {
            const screen = screenRegistry.get(currentScreenId);
            if (screen && screen.cleanup) screen.cleanup();
            if (screen && screen.cleanup3D) screen.cleanup3D();
        }

        // Track history
        if (gameState.currentScreen && gameState.currentScreen !== screenId) {
            this.screenHistory.push(gameState.currentScreen);
            if (this.screenHistory.length > 20) this.screenHistory.shift();
        }

        gameState.previousScreen = gameState.currentScreen;
        gameState.currentScreen = screenId;

        const screen = screenRegistry.get(screenId);
        if (screen && screen.render) {
            setTimeout(() => {
                try {
                    screen.render();
                    gameState.updateCoinDisplay();
                    screenRegistry._fireHooks('afterNavigate', gameState.previousScreen, screenId);
                } catch (err) {
                    console.error(`[cclottaaWorld] Error rendering screen '${screenId}':`, err);
                    document.getElementById('screen-container').innerHTML = `
                        <div style="padding: 32px; text-align: center;">
                            <h2 style="font-family: var(--font-pixel); font-size: 12px; color: var(--color-error); margin-bottom: 16px;">Screen Error</h2>
                            <pre style="font-family: monospace; font-size: 12px; color: var(--color-text-secondary); text-align: left; background: rgba(0,0,0,0.5); padding: 16px; border-radius: 4px; overflow: auto; max-width: 600px; margin: 0 auto;">${err.stack || err.message}</pre>
                        </div>
                    `;
                }
            }, 150);
        } else {
            document.getElementById('screen-container').innerHTML = `
        <div style="padding: var(--space-2xl); text-align: center;">
          <h1 style="font-family: var(--font-pixel); font-size: var(--text-sm); color: var(--color-error);">404 — Page Not Found</h1>
          <p style="margin-top: var(--space-md);">The page you're looking for doesn't exist in cclottaaWorld!</p>
          <button class="retro-btn" onclick="window.__app.navigateTo('town')" style="margin-top: var(--space-lg);">Go Home</button>
        </div>
      `;
        }
    },

    goBack() {
        if (this.screenHistory.length > 0) {
            const prev = this.screenHistory.pop();
            this.navigateTo(prev);
        }
    },

    continueGame() {
        if (saveManager.load()) {
            this.navigateTo('town');
        }
    },
};

// Expose for onclick handlers in HTML strings
window.__app = App;

// Boot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

export default App;
