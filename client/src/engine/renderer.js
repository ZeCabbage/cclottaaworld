/* ============================================
   Three.js Renderer — WebGPU with WebGL2 fallback
   ============================================ */

import * as THREE from 'three';

export const renderer = {
    instance: null,
    type: 'none', // 'webgpu' | 'webgl2'

    async init() {
        // Attempt WebGPU first
        if (navigator.gpu) {
            try {
                const adapter = await navigator.gpu.requestAdapter();
                if (adapter) {
                    // Three.js r160+ has WebGPURenderer
                    // For now, we set up a standard WebGLRenderer and flag WebGPU readiness
                    // Full WebGPU renderer will be swapped in when Three.js WebGPU stabilizes
                    this.type = 'webgpu-ready';
                    console.log('[Renderer] WebGPU adapter available:', adapter);
                }
            } catch (e) {
                console.warn('[Renderer] WebGPU init failed, falling back to WebGL2:', e);
            }
        }

        // For now, use WebGLRenderer (compatible everywhere)
        // The architecture is ready for WebGPURenderer swap
        this.instance = new THREE.WebGLRenderer({
            antialias: false, // PS2-era look: no AA
            powerPreference: 'high-performance',
            alpha: true,
        });

        this.instance.outputColorSpace = THREE.SRGBColorSpace;
        this.instance.toneMapping = THREE.ACESFilmicToneMapping;
        this.instance.toneMappingExposure = 0.8;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;

        if (this.type !== 'webgpu-ready') {
            this.type = 'webgl2';
        }

        return this.instance;
    },

    /**
     * Create a renderer instance sized to a container element.
     * @param {HTMLElement} container
     * @returns {THREE.WebGLRenderer}
     */
    createForContainer(container) {
        const r = new THREE.WebGLRenderer({
            antialias: false,
            powerPreference: 'high-performance',
            alpha: true,
        });
        r.outputColorSpace = THREE.SRGBColorSpace;
        r.setSize(container.clientWidth, container.clientHeight);
        r.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap for perf
        container.appendChild(r.domElement);
        return r;
    },

    dispose() {
        if (this.instance) {
            this.instance.dispose();
            this.instance = null;
        }
    },
};
