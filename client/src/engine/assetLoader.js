/* ============================================
   Asset Loader — Fetches .glb models from backend
   ============================================ */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const cache = new Map();

export const assetLoader = {
    _loader: null,
    _dracoLoader: null,

    init() {
        this._dracoLoader = new DRACOLoader();
        this._dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

        this._loader = new GLTFLoader();
        this._loader.setDRACOLoader(this._dracoLoader);
    },

    /**
     * Load a .glb model from the backend.
     * @param {string} type - Asset type (building, character, item)
     * @param {string} id - Asset ID
     * @returns {Promise<THREE.Group>}
     */
    async load(type, id) {
        const cacheKey = `${type}/${id}`;

        // Return cached clone
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey).clone();
        }

        if (!this._loader) this.init();

        const url = `/api/assets/${type}/${id}`;

        return new Promise((resolve, reject) => {
            this._loader.load(
                url,
                (gltf) => {
                    cache.set(cacheKey, gltf.scene);
                    resolve(gltf.scene.clone());
                },
                undefined,
                (error) => {
                    console.error(`[AssetLoader] Failed to load ${cacheKey}:`, error);
                    reject(error);
                }
            );
        });
    },

    /**
     * Load a .glb from a direct URL or local path.
     * @param {string} url
     * @returns {Promise<THREE.Group>}
     */
    async loadUrl(url) {
        if (cache.has(url)) return cache.get(url).clone();
        if (!this._loader) this.init();

        return new Promise((resolve, reject) => {
            this._loader.load(
                url,
                (gltf) => {
                    cache.set(url, gltf.scene);
                    resolve(gltf.scene.clone());
                },
                undefined,
                reject
            );
        });
    },

    /**
     * Clear the asset cache.
     */
    clearCache() {
        cache.clear();
    },

    dispose() {
        if (this._dracoLoader) this._dracoLoader.dispose();
        cache.clear();
    },
};
