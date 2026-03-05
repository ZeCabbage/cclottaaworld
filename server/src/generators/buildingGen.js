/* ============================================
   Building Generator — Procedural building .glb
   Uses headless Three.js to create voxel-style buildings
   and exports as compressed .glb
   ============================================ */

import { glbExporter } from '../pipeline/glbExporter.js';

export const buildingGen = {
    /**
     * Generate a building model.
     * @param {string} id - Building identifier (e.g., 'arcade', 'fashion', 'cafe')
     * @param {object} params - Optional parameters (width, height, style, etc.)
     * @returns {Promise<ArrayBuffer>} GLB binary data
     */
    async generate(id, params = {}) {
        // Stub: will be implemented with full procedural building generation
        // For now, creates a simple placeholder cube
        const { Document, NodeIO } = await import('@gltf-transform/core');

        const doc = new Document();
        const buffer = doc.createBuffer();
        const scene = doc.createScene();

        // Create a simple box mesh as placeholder
        const positions = new Float32Array([
            // Front face
            -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
            // Back face
            -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1,
            // Top face
            -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
            // Bottom face
            -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,
            // Right face
            1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,
            // Left face
            -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1,
        ]);

        const indices = new Uint16Array([
            0, 1, 2, 0, 2, 3,   // front
            4, 5, 6, 4, 6, 7,   // back
            8, 9, 10, 8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23,   // left
        ]);

        const positionAccessor = doc.createAccessor()
            .setArray(positions)
            .setType('VEC3')
            .setBuffer(buffer);

        const indexAccessor = doc.createAccessor()
            .setArray(indices)
            .setType('SCALAR')
            .setBuffer(buffer);

        const material = doc.createMaterial()
            .setBaseColorFactor([0.4, 0.38, 0.36, 1.0])
            .setRoughnessFactor(0.9)
            .setMetallicFactor(0.0);

        const prim = doc.createPrimitive()
            .setAttribute('POSITION', positionAccessor)
            .setIndices(indexAccessor)
            .setMaterial(material);

        const mesh = doc.createMesh().addPrimitive(prim);
        const node = doc.createNode().setMesh(mesh).setTranslation([0, 1, 0]);
        scene.addChild(node);

        const io = new NodeIO();
        const glb = await io.writeBinary(doc);
        return glb;
    },
};
