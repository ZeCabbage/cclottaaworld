/* ============================================
   PS2 Cel-Shaded Anime Character Model
   Uses MeshToonMaterial with custom 3-step
   gradient map and inverted-hull outlines.
   ============================================ */

import * as THREE from 'three';
import { characterConfig } from '../data/characterConfig.js';
import { drawFaceTexture } from './characterDraw.js';

/* ═══════════════════════════════════════════
   MATERIAL & OUTLINE SYSTEM
   ═══════════════════════════════════════════ */

// Create the hard 3-step 4px gradient for the Toon Shader
let gradientTexture = null;
function getGradientTexture() {
    if (gradientTexture) return gradientTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 3;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    // Hard color stops: shadow, midtone, highlight
    ctx.fillStyle = '#666666'; ctx.fillRect(0, 0, 1, 1);
    ctx.fillStyle = '#AAAAAA'; ctx.fillRect(1, 0, 1, 1);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(2, 0, 1, 1);

    gradientTexture = new THREE.CanvasTexture(canvas);
    gradientTexture.magFilter = THREE.NearestFilter;
    gradientTexture.minFilter = THREE.NearestFilter;
    return gradientTexture;
}

// Helper to create a toon material
function createToonMat(colorStr) {
    return new THREE.MeshToonMaterial({
        color: new THREE.Color(colorStr),
        gradientMap: getGradientTexture(),
        roughness: 1.0,
        metalness: 0.0,
    });
}

// Add an inverted-hull clone for the outline effect
function addOutline(mesh, outlineColor = '#1a0a2e') {
    const cloneGeo = mesh.geometry.clone();
    const outlineMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(outlineColor),
        side: THREE.BackSide,
    });
    const clone = new THREE.Mesh(cloneGeo, outlineMat);
    clone.position.copy(mesh.position);
    clone.rotation.copy(mesh.rotation);
    // Expand uniformly
    clone.scale.set(1.035, 1.035, 1.035);

    // Copy animation/bone matrices if needed (not needed for static groups yet)

    // Attach to the same parent as the original mesh
    mesh.parent.add(clone);
    return clone;
}

/* ═══════════════════════════════════════════
   BUILD BONES / GEOMETRY
   ═══════════════════════════════════════════ */

export function buildCharacterModel(charState) {
    const group = new THREE.Group();

    // Specific PS2 pastel palette matching
    const skinHex = getC(characterConfig.skinTones, charState.skinTone, '#FFD5B0');
    const hairHex = getC(characterConfig.hairColors, charState.hairColor, '#1A1A1A');
    const topHex = getC(characterConfig.topColors, charState.topColor, '#F0F0F0');
    const botHex = getC(characterConfig.bottomColors, charState.bottomColor, '#4B6C98');
    const eyeHex = getC(characterConfig.eyeColors, charState.eyeColor, '#8B4513');

    const skinMat = createToonMat(skinHex);
    const topMat = createToonMat(topHex);
    const botMat = createToonMat(botHex);
    const shoeMat = createToonMat('#ffffff'); // Big white boots by default

    // Y-Offset calculations based on exact specs
    const shoeH = 0.22;
    const legLowerH = 0.50;
    const legUpperH = 0.52;
    const hipH = 0.14;
    const torsoH = 0.28;
    const neckH = 0.12;
    const headR = 0.28;

    let cursorY = 0;

    // ════ SHOES ════
    const shoeW = 0.18;
    const shoeD = 0.28;
    cursorY += shoeH / 2;
    for (const side of [-1, 1]) {
        const shoe = new THREE.Mesh(new THREE.BoxGeometry(shoeW, shoeH, shoeD, 2, 2, 2), shoeMat);
        shoe.position.set(side * 0.12, cursorY, 0.05);
        group.add(shoe);
        addOutline(shoe);
    }
    cursorY += shoeH / 2;

    // ════ LOWER LEGS ════
    cursorY += legLowerH / 2;
    for (const side of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, legLowerH, 8), skinMat);
        leg.position.set(side * 0.1, cursorY, 0);
        group.add(leg);
        addOutline(leg);
    }
    cursorY += legLowerH / 2;

    // ════ UPPER LEGS ════
    cursorY += legUpperH / 2;
    for (const side of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, legUpperH, 8), skinMat);
        leg.position.set(side * 0.1, cursorY, 0);
        group.add(leg);
        addOutline(leg);
    }
    cursorY += legUpperH / 2;

    // ════ HIPS ════
    cursorY += hipH / 2;
    const hips = new THREE.Mesh(new THREE.BoxGeometry(0.32, hipH, 0.20, 2, 2, 2), botMat);
    hips.position.y = cursorY;
    group.add(hips);
    addOutline(hips);
    cursorY += hipH / 2;

    // ════ TORSO ════
    cursorY += torsoH / 2;
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.35, torsoH, 0.22, 2, 2, 2), topMat);
    torso.position.y = cursorY;
    group.add(torso);
    addOutline(torso);

    // ════ ARMS ════
    const armUpperH = 0.30;
    const armLowerH = 0.28;
    const shoulderY = cursorY + torsoH * 0.3;

    for (const side of [-1, 1]) {
        // Upper Arm
        const upArm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, armUpperH, 8), skinMat);
        upArm.position.set(side * 0.24, shoulderY - armUpperH / 2, 0);
        upArm.rotation.z = side * 0.2;
        group.add(upArm);
        addOutline(upArm);

        // Lower Arm
        const loArm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, armLowerH, 8), skinMat);
        loArm.position.set(side * 0.28, shoulderY - armUpperH - armLowerH / 2 + 0.02, 0);
        loArm.rotation.z = side * 0.1;
        group.add(loArm);
        addOutline(loArm);

        // Hand
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), skinMat);
        hand.position.set(side * 0.3, shoulderY - armUpperH - armLowerH - 0.02, 0);
        group.add(hand);
        addOutline(hand);
    }
    cursorY += torsoH / 2;

    // ════ NECK ════
    cursorY += neckH / 2;
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, neckH, 8), skinMat);
    neck.position.y = cursorY;
    group.add(neck);
    addOutline(neck);
    cursorY += neckH / 2;

    // ════ HEAD ════
    cursorY += headR * 0.92; // Slightly squashed Y
    const headGroup = new THREE.Group();
    headGroup.position.y = cursorY;
    group.add(headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(headR, 16, 16), skinMat);
    head.scale.y = 0.92; // Flattened slightly on Y
    headGroup.add(head);

    // We outline the base head sphere
    const headOutline = addOutline(head);

    // ════ FACE TEXTURE (decal) ════
    const faceW = 512;
    const faceTex = new THREE.CanvasTexture(
        createCanvas(faceW, faceW, (ctx) => {
            drawFaceTexture(ctx, faceW, faceW, charState.eyeType, eyeHex, charState.expression, skinHex);
        })
    );
    // Face material is basic so it isn't shaded, ensuring clean anime eyes
    const faceMat = new THREE.MeshBasicMaterial({ map: faceTex, transparent: true, depthWrite: false });
    const facePlane = new THREE.PlaneGeometry(headR * 1.8, headR * 1.8);
    const face = new THREE.Mesh(facePlane, faceMat);
    face.position.set(0, -0.02, headR * 0.95);
    headGroup.add(face);

    // ════ 3D HAIR ════
    build3DHair(headGroup, charState.hairStyle, hairHex, headR);

    // Shift entire model down so feet touch 0 floor
    group.position.y = -1.1;

    return group;
}

/* ═══════════════════════════════════════════
   MODULAR 3D HAIR GENERATOR
   Builds spiky/angled meshes attached to head.
   ═══════════════════════════════════════════ */

function build3DHair(headGroup, style, colorHex, headR) {
    const hairMat = createToonMat(colorHex);

    // All styles get a flat "bang" box covering forehead
    const bang = new THREE.Mesh(new THREE.BoxGeometry(headR * 1.8, headR * 0.8, headR * 0.4), hairMat);
    bang.position.set(0, headR * 0.4, headR * 0.7);
    bang.rotation.x = -0.2;
    headGroup.add(bang);
    addOutline(bang);

    switch (style) {
        case 'long':
            // Two massive long wedges falling down the back
            for (const side of [-1, 1]) {
                const tail = new THREE.Mesh(new THREE.ConeGeometry(headR * 0.8, headR * 4, 8), hairMat);
                tail.position.set(side * headR * 0.6, -headR * 1.2, -headR * 0.4);
                tail.rotation.z = side * 0.1;
                tail.rotation.x = -0.1;
                headGroup.add(tail);
                addOutline(tail);
            }
            break;

        case 'ponytail':
            // Large sweeping cone sticking out back
            const pony = new THREE.Mesh(new THREE.ConeGeometry(headR * 0.6, headR * 3, 8), hairMat);
            pony.position.set(0, headR * 0.5, -headR * 1.5);
            pony.rotation.x = -1.0;
            headGroup.add(pony);
            addOutline(pony);
            // Hair tie box
            const tie = new THREE.Mesh(new THREE.BoxGeometry(headR * 0.4, headR * 0.4, headR * 0.4), createToonMat('#FF6B8A'));
            tie.position.set(0, headR * 0.5, -headR * 0.8);
            headGroup.add(tie);
            addOutline(tie);
            break;

        case 'pixie':
        case 'short':
        default:
            // Spiky side cones
            for (const side of [-1, 1]) {
                const spike = new THREE.Mesh(new THREE.ConeGeometry(headR * 0.6, headR * 1.5, 6), hairMat);
                spike.position.set(side * headR * 0.8, headR * 0.2, headR * 0.2);
                spike.rotation.z = side * -0.5;
                spike.rotation.x = -0.2;
                headGroup.add(spike);
                addOutline(spike);
            }
            // Top crown box
            const crown = new THREE.Mesh(new THREE.BoxGeometry(headR * 1.6, headR * 0.5, headR * 1.8), hairMat);
            crown.position.set(0, headR * 0.8, 0);
            headGroup.add(crown);
            addOutline(crown);
            break;

        case 'bun':
            // Large spheres on top
            const buns = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.7, 8, 8), hairMat);
            buns.position.set(0, headR * 1.1, -headR * 0.2);
            headGroup.add(buns);
            addOutline(buns);
            break;

        case 'afro':
        case 'curly':
            // Huge faceted boxy afro
            const afro = new THREE.Mesh(new THREE.BoxGeometry(headR * 3, headR * 2.5, headR * 2.5, 3, 3, 3), hairMat);
            afro.position.set(0, headR * 0.8, -headR * 0.2);
            headGroup.add(afro);
            addOutline(afro);
            break;
    }
}

/* ═══════════════════════════════════════════
   UTIL
   ═══════════════════════════════════════════ */

function getC(list, id, fallback) {
    const item = list.find(t => t.id === id);
    return item ? item.color : fallback;
}

function createCanvas(w, h, drawFn) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    drawFn(ctx);
    return c;
}
