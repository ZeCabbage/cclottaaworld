/* ============================================
   Hybrid Character Model — v4
   Simple 3D body (sphere head, cylinder torso,
   capsule limbs) with 2D canvas textures for
   face, hair, and clothing details.
   ============================================ */

import * as THREE from 'three';
import { characterConfig } from '../data/characterConfig.js';
import { drawFaceTexture, drawHairTexture, drawTopTexture, drawBottomTexture } from './characterDraw.js';

/* ═══════════════════════════════════════════
   Build the character — few 3D pieces, rich textures
   ═══════════════════════════════════════════ */

export function buildCharacterModel(charState) {
    const group = new THREE.Group();

    // Resolve colors
    const skinHex = getC(characterConfig.skinTones, charState.skinTone, '#FFDFC4');
    const hairHex = getC(characterConfig.hairColors, charState.hairColor, '#1A1A1A');
    const eyeHex = getC(characterConfig.eyeColors, charState.eyeColor, '#8B4513');
    const topHex = getC(characterConfig.topColors, charState.topColor, '#F0F0F0');
    const botHex = getC(characterConfig.bottomColors, charState.bottomColor, '#4B6C98');

    const skinCol = new THREE.Color(skinHex);

    // ═══════════ HEAD (sphere with face texture on front) ═══════════
    const headR = 0.32;
    const headY = 1.95;

    // Back of head — plain skin
    const headGeo = new THREE.SphereGeometry(headR, 24, 24);
    const headMat = new THREE.MeshStandardMaterial({
        color: skinCol, roughness: 0.5, metalness: 0.05,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = headY;
    group.add(head);

    // Face decal — canvas texture on a front-facing sphere slice
    const faceTex = canvasTex(256, 256, (ctx, w, h) => {
        drawFaceTexture(ctx, w, h, charState.eyeType, eyeHex, charState.expression, skinHex);
    });
    const faceMat = new THREE.MeshBasicMaterial({ map: faceTex, transparent: true });
    const faceGeo = new THREE.PlaneGeometry(headR * 1.4, headR * 1.4);
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.set(0, headY - 0.02, headR + 0.005);
    group.add(face);

    // ═══════════ HAIR (2D texture on a shaped plane behind/on head) ═══════════
    const hairCanvas = canvasTex(256, 320, (ctx, w, h) => {
        drawHairTexture(ctx, w, h, charState.hairStyle, hairHex);
    });
    const hairMat = new THREE.MeshBasicMaterial({ map: hairCanvas, transparent: true, side: THREE.DoubleSide });
    const hairGeo = new THREE.PlaneGeometry(headR * 2.4, headR * 3.0);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, headY + 0.08, -0.01);
    hairMesh.renderOrder = 1;
    group.add(hairMesh);

    // ═══════════ NECK ═══════════
    const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.1, 0.12, 10),
        new THREE.MeshStandardMaterial({ color: skinCol, roughness: 0.5 })
    );
    neck.position.y = 1.59;
    group.add(neck);

    // ═══════════ TORSO (cylinder with clothing texture) ═══════════
    const torsoH = 0.55;
    const torsoTex = canvasTex(256, 256, (ctx, w, h) => {
        drawTopTexture(ctx, w, h, charState.top, topHex, skinHex);
    });
    const torsoMat = new THREE.MeshStandardMaterial({
        map: torsoTex, roughness: 0.5,
    });
    const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.23, 0.2, torsoH, 12),
        torsoMat
    );
    torso.position.y = 1.27;
    group.add(torso);

    // ═══════════ ARMS (simple skin cylinders) ═══════════
    const armMat = new THREE.MeshStandardMaterial({ color: skinCol, roughness: 0.5 });
    for (const side of [-1, 1]) {
        const arm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.045, 0.5, 8),
            armMat
        );
        arm.position.set(side * 0.28, 1.2, 0);
        arm.rotation.z = side * 0.1;
        group.add(arm);

        // Hand
        const hand = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 8, 8),
            armMat
        );
        hand.position.set(side * 0.3, 0.93, 0);
        group.add(hand);
    }

    // ═══════════ HIPS / BOTTOM ═══════════
    const bottomTex = canvasTex(256, 256, (ctx, w, h) => {
        drawBottomTexture(ctx, w, h, charState.bottom, botHex);
    });
    const bottomMat = new THREE.MeshStandardMaterial({
        map: bottomTex, roughness: 0.5,
    });
    const hips = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.18, 0.25, 10),
        bottomMat
    );
    hips.position.y = 0.92;
    group.add(hips);

    // ═══════════ LEGS ═══════════
    const legMat = new THREE.MeshStandardMaterial({ color: skinCol, roughness: 0.5 });
    for (const side of [-1, 1]) {
        const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.07, 0.06, 0.55, 8),
            legMat
        );
        leg.position.set(side * 0.1, 0.5, 0);
        group.add(leg);
    }

    // ═══════════ SHOES ═══════════
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4 });
    for (const side of [-1, 1]) {
        const shoe = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.06, 0.15),
            shoeMat
        );
        shoe.geometry.translate(0, 0, 0.01);
        shoe.position.set(side * 0.1, 0.2, 0);
        group.add(shoe);
    }

    group.position.y = -1.0;
    return group;
}

/* ═══════════════════════════════════════════
   UTIL: Canvas → Three.js Texture
   ═══════════════════════════════════════════ */

function canvasTex(w, h, drawFn) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    drawFn(ctx, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
}

function getC(list, id, fallback) {
    const item = list.find(t => t.id === id);
    return item ? item.color : fallback;
}
