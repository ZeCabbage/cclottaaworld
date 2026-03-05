/* ============================================
   Character Model Bridge
   Takes the 2D canvas character and creates a
   Three.js plane with the canvas as a texture.
   This is used in the 3D preview scene.
   ============================================ */

import * as THREE from 'three';
import { drawCharacter } from './characterDraw.js';

// Reusable canvas for drawing
let _canvas = null;
function getCanvas() {
    if (!_canvas) _canvas = document.createElement('canvas');
    return _canvas;
}

/**
 * Build a Three.js group with the character as a textured sprite.
 * The sprite is placed in the scene and slowly spins.
 */
export function buildCharacterModel(charState) {
    const group = new THREE.Group();

    // Draw character to offscreen canvas
    const canvas = getCanvas();
    drawCharacter(canvas, charState);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Create material
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: true,
    });

    // Scale: canvas is 400x600, we want the character to be ~2.5 units tall
    const aspect = canvas.width / canvas.height;
    const height = 2.5;
    const width = height * aspect;

    const geometry = new THREE.PlaneGeometry(width, height);
    const mesh = new THREE.Mesh(geometry, material);

    // Position the sprite so it stands on the platform
    mesh.position.y = height / 2 - 0.65;

    group.add(mesh);

    return group;
}
