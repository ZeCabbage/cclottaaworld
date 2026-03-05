/* ============================================
   Scene Manager — Scene lifecycle management
   Replaces the old VoxelEngine scene registry
   ============================================ */

import * as THREE from 'three';
import { renderer } from './renderer.js';

const scenes = new Map();

export const sceneManager = {
    _frameBudgetMs: 33, // ~30fps cap

    /**
     * Create a managed scene with camera and renderer.
     * @param {string} sceneId - Unique identifier
     * @param {HTMLElement} container - DOM container for the canvas
     * @param {object} options - { fov, near, far, bgColor }
     * @returns {{ scene, camera, renderer, container }}
     */
    create(sceneId, container, options = {}) {
        const {
            fov = 60,
            near = 0.1,
            far = 500,
            bgColor = 0x1a1025,
        } = options;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(bgColor);
        scene.fog = new THREE.Fog(bgColor, 80, 250);

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 400;

        const camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
        const r = renderer.createForContainer(container);

        const entry = { scene, camera, renderer: r, container, animCallbacks: [], loopId: null };
        scenes.set(sceneId, entry);

        return entry;
    },

    get(sceneId) {
        return scenes.get(sceneId) || null;
    },

    /**
     * Start the render loop for a scene.
     */
    startLoop(sceneId) {
        const entry = scenes.get(sceneId);
        if (!entry) return;

        let lastTime = 0;
        const tick = (now) => {
            entry.loopId = requestAnimationFrame(tick);
            const delta = now - lastTime;
            if (delta < this._frameBudgetMs) return;
            lastTime = now;

            for (const cb of entry.animCallbacks) {
                cb(now * 0.001, delta * 0.001);
            }
            entry.renderer.render(entry.scene, entry.camera);
        };
        entry.loopId = requestAnimationFrame(tick);
    },

    /**
     * Register an animation callback.
     */
    onAnimate(sceneId, callback) {
        const entry = scenes.get(sceneId);
        if (entry) entry.animCallbacks.push(callback);
    },

    /**
     * Dispose a single scene.
     */
    dispose(sceneId) {
        const entry = scenes.get(sceneId);
        if (!entry) return;

        if (entry.loopId) cancelAnimationFrame(entry.loopId);
        entry.renderer.dispose();
        if (entry.renderer.domElement && entry.renderer.domElement.parentNode) {
            entry.renderer.domElement.parentNode.removeChild(entry.renderer.domElement);
        }
        entry.scene.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                else obj.material.dispose();
            }
        });
        scenes.delete(sceneId);
    },

    /**
     * Dispose all managed scenes.
     */
    disposeAll() {
        for (const id of scenes.keys()) {
            this.dispose(id);
        }
    },
};
