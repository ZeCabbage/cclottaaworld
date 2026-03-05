/* ============================================
   Wasm Bridge — JS ↔ WebAssembly binding layer
   Loads and wraps the Rust-compiled Wasm module.
   ============================================ */

let wasmModule = null;

export const wasmBridge = {
    ready: false,

    /**
     * Initialize the Wasm module.
     * Call this once at app startup.
     */
    async init() {
        try {
            // Dynamic import of the wasm-pack generated JS glue
            // This path is where `wasm-pack build --out-dir ../client/wasm_out` deposits files
            const wasm = await import('../../wasm_out/wasm_engine.js');
            if (wasm.default) {
                await wasm.default(); // Initialize the Wasm module
            }
            wasmModule = wasm;
            this.ready = true;
            console.log('[WasmBridge] Module loaded successfully.');
        } catch (e) {
            console.warn('[WasmBridge] Failed to load Wasm module:', e.message);
            console.warn('[WasmBridge] Running in JS-only fallback mode.');
            this.ready = false;
        }
    },

    /**
     * Generate chunk voxel data at the given chunk coordinates.
     * @param {number} cx - Chunk X
     * @param {number} cz - Chunk Z
     * @returns {{ blocks: Uint8Array }} | null
     */
    generateChunk(cx, cz) {
        if (!this.ready || !wasmModule) return null;
        try {
            return wasmModule.generate_chunk(cx, cz);
        } catch (e) {
            console.error('[WasmBridge] generateChunk error:', e);
            return null;
        }
    },

    /**
     * Run greedy meshing on chunk data.
     * @param {Uint8Array} chunkData - 16×16×16 voxel block IDs
     * @returns {{ vertices: Float32Array, indices: Uint32Array }} | null
     */
    meshChunk(chunkData) {
        if (!this.ready || !wasmModule) return null;
        try {
            return wasmModule.mesh_chunk(chunkData);
        } catch (e) {
            console.error('[WasmBridge] meshChunk error:', e);
            return null;
        }
    },

    /**
     * Generate noise value at a position (for terrain, etc.)
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {number} noise value [-1, 1]
     */
    noise3D(x, y, z) {
        if (!this.ready || !wasmModule) return 0;
        try {
            return wasmModule.noise_3d(x, y, z);
        } catch (e) {
            return 0;
        }
    },
};
