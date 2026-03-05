/* ============================================
   ScreenBase — Lifecycle mixin for all screens
   Handles mount/unmount, 3D scene setup/teardown,
   timer management, and cleanup.
   ============================================ */

import { sceneManager } from './sceneManager.js';
import { gameState } from '../state/gameState.js';

/**
 * Create a screen with standard lifecycle methods.
 * Usage:
 *   export const myScreen = createScreen('myScreen', {
 *     title: 'My Screen',
 *     path: 'my-screen',
 *     onRender(container) { ... },         // Required
 *     onMount3D(sceneEntry) { ... },       // Optional
 *     onAnimate(elapsed, delta) { ... },   // Optional
 *     onCleanup() { ... },                 // Optional
 *   });
 */
export function createScreen(id, definition) {
    const timers = [];
    const listeners = [];
    let sceneEntry = null;

    return {
        id,
        meta: {
            title: definition.title || id,
            path: definition.path || id,
            icon: definition.icon || '',
            category: definition.category || 'general',
        },

        /**
         * Main render — called by the App router.
         */
        render() {
            const container = document.getElementById('screen-container');
            if (!container) return;

            // Clear previous
            container.innerHTML = '';

            // Update browser chrome
            gameState.updateAddressBar(this.meta.path);
            gameState.updateStatus(`Loading ${this.meta.title}...`, '⏳');

            // Call the screen's render logic
            if (definition.onRender) {
                definition.onRender(container);
            }

            // Mount 3D scene if the screen defines it
            if (definition.onMount3D) {
                const viewport = container.querySelector('.voxel-viewport');
                if (viewport) {
                    sceneEntry = sceneManager.create(id, viewport, definition.sceneOptions || {});
                    definition.onMount3D(sceneEntry);

                    // Register animation callback if provided
                    if (definition.onAnimate) {
                        sceneManager.onAnimate(id, definition.onAnimate.bind(definition));
                    }

                    sceneManager.startLoop(id);
                }
            }

            // Update status
            gameState.updateStatus(this.meta.title, '✅');
        },

        /**
         * Register a timer that will be auto-cleared on cleanup.
         */
        addTimer(fn, ms, isInterval = false) {
            const timerId = isInterval ? setInterval(fn, ms) : setTimeout(fn, ms);
            timers.push({ id: timerId, isInterval });
            return timerId;
        },

        /**
         * Register an event listener that will be auto-removed on cleanup.
         */
        addListener(element, event, handler, options) {
            element.addEventListener(event, handler, options);
            listeners.push({ element, event, handler, options });
        },

        /**
         * Cleanup — called when navigating away.
         */
        cleanup() {
            // Clear all timers
            for (const t of timers) {
                if (t.isInterval) clearInterval(t.id);
                else clearTimeout(t.id);
            }
            timers.length = 0;

            // Remove all event listeners
            for (const l of listeners) {
                l.element.removeEventListener(l.event, l.handler, l.options);
            }
            listeners.length = 0;

            // Screen-specific cleanup
            if (definition.onCleanup) {
                definition.onCleanup();
            }
        },

        /**
         * 3D cleanup — called when navigating away.
         */
        cleanup3D() {
            if (sceneEntry) {
                sceneManager.dispose(id);
                sceneEntry = null;
            }
        },
    };
}
