/* ============================================
   Screen Registry — Self-registering screen system
   Screens register themselves; the router never
   needs to be modified when adding new screens.
   ============================================ */

import { sceneManager } from '../engine/sceneManager.js';

const screens = new Map();
const hooks = { beforeNavigate: [], afterNavigate: [] };

export const screenRegistry = {
    /**
     * Register a screen module.
     * @param {string} id - Screen identifier (e.g., 'town', 'shopArcade')
     * @param {object} screen - Screen object with render(), cleanup?(), cleanup3D?()
     * @param {object} meta - Optional metadata { title, path, icon, category }
     */
    register(id, screen, meta = {}) {
        screens.set(id, {
            ...screen,
            id,
            meta: {
                title: meta.title || id,
                path: meta.path || id,
                icon: meta.icon || '',
                category: meta.category || 'general', // 'shop', 'game', 'social', 'home'
                ...meta,
            },
        });
    },

    /**
     * Get a registered screen.
     */
    get(id) {
        return screens.get(id) || null;
    },

    /**
     * Check if a screen exists.
     */
    has(id) {
        return screens.has(id);
    },

    /**
     * Get all registered screens.
     */
    getAll() {
        return new Map(screens);
    },

    /**
     * Get screens by category.
     */
    getByCategory(category) {
        return [...screens.values()].filter(s => s.meta.category === category);
    },

    /**
     * List all screen IDs.
     */
    list() {
        return [...screens.keys()];
    },

    /**
     * Register a navigation hook.
     * @param {'beforeNavigate' | 'afterNavigate'} event
     * @param {function} callback - (fromId, toId) => void
     */
    on(event, callback) {
        if (hooks[event]) hooks[event].push(callback);
    },

    /**
     * Fire navigation hooks.
     */
    _fireHooks(event, fromId, toId) {
        for (const cb of (hooks[event] || [])) {
            cb(fromId, toId);
        }
    },
};
