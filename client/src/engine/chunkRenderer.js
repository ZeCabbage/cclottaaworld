/* ============================================
   Chunk Renderer — Greedy Mesh → Three.js geometry
   Receives packed vertex/index buffers from Wasm
   and creates BufferGeometry for efficient rendering.
   ============================================ */

import * as THREE from 'three';

export const chunkRenderer = {
    _chunkMeshes: new Map(), // key: 'cx_cz' → THREE.Mesh

    /**
     * Create a Three.js mesh from Wasm greedy mesh output.
     * @param {Float32Array} vertices - Packed [x, y, z, nx, ny, nz, r, g, b] per vertex
     * @param {Uint32Array} indices - Triangle index buffer
     * @returns {THREE.Mesh}
     */
    createMeshFromBuffers(vertices, indices) {
        const geometry = new THREE.BufferGeometry();

        // Interleaved: position (3) + normal (3) + color (3) = 9 floats per vertex
        const stride = 9;
        const vertexCount = vertices.length / stride;

        const positions = new Float32Array(vertexCount * 3);
        const normals = new Float32Array(vertexCount * 3);
        const colors = new Float32Array(vertexCount * 3);

        for (let i = 0; i < vertexCount; i++) {
            const base = i * stride;
            positions[i * 3] = vertices[base];
            positions[i * 3 + 1] = vertices[base + 1];
            positions[i * 3 + 2] = vertices[base + 2];

            normals[i * 3] = vertices[base + 3];
            normals[i * 3 + 1] = vertices[base + 4];
            normals[i * 3 + 2] = vertices[base + 5];

            colors[i * 3] = vertices[base + 6];
            colors[i * 3 + 1] = vertices[base + 7];
            colors[i * 3 + 2] = vertices[base + 8];
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));

        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.85,
            metalness: 0.05,
        });

        return new THREE.Mesh(geometry, material);
    },

    /**
     * Add or update a chunk mesh in the scene.
     * @param {THREE.Scene} scene
     * @param {number} cx - Chunk X coordinate
     * @param {number} cz - Chunk Z coordinate
     * @param {Float32Array} vertices
     * @param {Uint32Array} indices
     */
    setChunk(scene, cx, cz, vertices, indices) {
        const key = `${cx}_${cz}`;

        // Remove old mesh if exists
        if (this._chunkMeshes.has(key)) {
            const old = this._chunkMeshes.get(key);
            scene.remove(old);
            old.geometry.dispose();
            old.material.dispose();
        }

        const mesh = this.createMeshFromBuffers(vertices, indices);
        mesh.position.set(cx * 16, 0, cz * 16); // 16 = chunk size
        scene.add(mesh);
        this._chunkMeshes.set(key, mesh);
    },

    /**
     * Remove a chunk from the scene.
     */
    removeChunk(scene, cx, cz) {
        const key = `${cx}_${cz}`;
        if (this._chunkMeshes.has(key)) {
            const mesh = this._chunkMeshes.get(key);
            scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            this._chunkMeshes.delete(key);
        }
    },

    /**
     * Dispose all chunk meshes.
     */
    disposeAll(scene) {
        for (const [key, mesh] of this._chunkMeshes) {
            if (scene) scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
        }
        this._chunkMeshes.clear();
    },
};
