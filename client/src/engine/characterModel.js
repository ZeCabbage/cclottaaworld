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

    // ══ PROPORTIONS (Y2K Stylized anime) ══
    const shoeH = 0.3;
    const legH = 1.1;
    const hipH = 0.2;
    const torsoH = 0.28;
    const neckH = 0.1;
    const headR = 0.24;

    // Y Offsets
    const yShoe = shoeH / 2;
    const yLeg = shoeH + legH / 2;
    const yHip = shoeH + legH + hipH / 2;
    const yTorso = shoeH + legH + hipH + torsoH / 2;
    const yNeck = shoeH + legH + hipH + torsoH + neckH / 2;
    const yHead = shoeH + legH + hipH + torsoH + neckH + headR * 0.9;

    // ═══════════ HEAD & FACE ═══════════
    const headGeo = new THREE.SphereGeometry(headR, 24, 24);
    const headMat = new THREE.MeshStandardMaterial({
        color: skinCol, roughness: 0.6, metalness: 0.05,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = yHead;
    group.add(head);

    const faceTex = canvasTex(256, 256, (ctx, w, h) => {
        drawFaceTexture(ctx, w, h, charState.eyeType, eyeHex, charState.expression, skinHex);
    });
    const faceMat = new THREE.MeshBasicMaterial({ map: faceTex, transparent: true, depthWrite: false });
    const faceGeo = new THREE.PlaneGeometry(headR * 1.5, headR * 1.5);
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.set(0, yHead - 0.02, headR + 0.005);
    // Slight curve to face if we used curved geo, but plane works for now
    group.add(face);

    // ═══════════ HAIR (Curved 2D Plane acting as a shell) ═══════════
    const hairCanvas = canvasTex(256, 320, (ctx, w, h) => {
        drawHairTexture(ctx, w, h, charState.hairStyle, hairHex);
    });
    const hairMat = new THREE.MeshBasicMaterial({ map: hairCanvas, transparent: true, side: THREE.DoubleSide });
    // Use an open cylinder slice to wrap the hair around the back/sides of the head
    const hairGeo = new THREE.CylinderGeometry(headR * 1.25, headR * 1.35, headR * 3.5, 16, 1, true, -Math.PI * 0.55, Math.PI * 1.1);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, yHead - headR * 0.5, 0);
    // Rotate to face forward
    hairMesh.rotation.y = Math.PI;
    hairMesh.renderOrder = 1;
    group.add(hairMesh);

    // ═══════════ NECK ═══════════
    const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.045, neckH, 10),
        new THREE.MeshStandardMaterial({ color: skinCol, roughness: 0.6 })
    );
    neck.position.y = yNeck;
    group.add(neck);

    // ═══════════ TORSO ═══════════
    const torsoTex = canvasTex(256, 256, (ctx, w, h) => {
        drawTopTexture(ctx, w, h, charState.top, topHex, skinHex);
    });
    const torsoMat = new THREE.MeshStandardMaterial({
        map: torsoTex, roughness: 0.6,
    });
    const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.09, torsoH, 12),
        torsoMat
    );
    torso.position.y = yTorso;
    group.add(torso);

    // ═══════════ ARMS ═══════════
    const armMat = new THREE.MeshStandardMaterial({ color: skinCol, roughness: 0.6 });
    const armH = 0.65;
    for (const side of [-1, 1]) {
        const arm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.025, armH, 8),
            armMat
        );
        // Anchor near shoulders
        arm.position.set(side * 0.16, yTorso + torsoH * 0.4 - armH / 2, 0);
        arm.rotation.z = side * 0.12;
        group.add(arm);

        // Hand
        const hand = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 8, 8),
            armMat
        );
        hand.position.set(side * 0.2, yTorso + torsoH * 0.4 - armH - 0.02, 0);
        group.add(hand);
    }

    // ═══════════ HIPS / BOTTOM ═══════════
    const bottomTex = canvasTex(256, 256, (ctx, w, h) => {
        drawBottomTexture(ctx, w, h, charState.bottom, botHex);
    });
    const bottomMat = new THREE.MeshStandardMaterial({
        map: bottomTex, roughness: 0.6,
    });
    // Slight flare for skirt-like bottoms
    const isSkirt = ['skirt', 'microSkirt', 'longSkirt', 'culottes'].includes(charState.bottom);
    const hips = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, isSkirt ? 0.15 : 0.11, hipH, 12),
        bottomMat
    );
    hips.position.y = yHip;
    group.add(hips);

    // ═══════════ LEGS ═══════════
    const legMat = new THREE.MeshStandardMaterial({ color: skinCol, roughness: 0.6 });
    for (const side of [-1, 1]) {
        const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.045, 0.035, legH, 10),
            legMat
        );
        leg.position.set(side * 0.06, yLeg, 0);
        group.add(leg);
    }

    // ═══════════ SHOES (Chunky Y2K Boots) ═══════════
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.4 });
    const shoeDetailMat = new THREE.MeshStandardMaterial({ color: 0xFFDD88, roughness: 0.5 }); // Accents

    for (const side of [-1, 1]) {
        const shoeGroup = new THREE.Group();
        shoeGroup.position.set(side * 0.06, yShoe, 0);

        // Main boot
        const boot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.09, 0.11, shoeH, 12),
            shoeMat
        );
        shoeGroup.add(boot);

        // Sole
        const sole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12),
            shoeDetailMat
        );
        sole.position.y = -shoeH / 2 + 0.04;
        shoeGroup.add(sole);

        // Toe box
        const toe = new THREE.Mesh(
            new THREE.SphereGeometry(0.11, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2),
            shoeMat
        );
        toe.position.set(0, -shoeH / 2 + 0.08, 0.05);
        shoeGroup.add(toe);

        // Chunky cuffs around ankle
        const cuff = new THREE.Mesh(
            new THREE.TorusGeometry(0.09, 0.02, 8, 12),
            shoeMat
        );
        cuff.position.y = shoeH / 2 - 0.02;
        cuff.rotation.x = Math.PI / 2;
        shoeGroup.add(cuff);

        group.add(shoeGroup);
    }

    // Offset whole group to sit on pedestal appropriately
    group.position.y = -1.1;
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
