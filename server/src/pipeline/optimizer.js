/* ============================================
   Asset Optimizer — Draco/meshopt compression
   ============================================ */

export const optimizer = {
    /**
     * Compress a .glb file using Draco or meshopt.
     * @param {ArrayBuffer} glbBuffer - Raw GLB binary
     * @returns {Promise<ArrayBuffer>} Compressed GLB
     */
    async compress(glbBuffer) {
        // TODO: Implement Draco compression via @gltf-transform
        // For now, pass through uncompressed
        return glbBuffer;
    },
};
