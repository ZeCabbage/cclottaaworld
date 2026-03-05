/* ============================================
   2D Character Drawing Engine — Smooth Vector Style
   Clean PS2-era vector art with rounded curves,
   no sharp corners, anime-inspired proportions.
   ============================================ */

import { characterConfig } from '../data/characterConfig.js';

const W = 400;
const H = 600;
const CX = W / 2;

/* ═══════════════════════════════════════════
   PUBLIC
   ═══════════════════════════════════════════ */

export function drawCharacter(canvas, charState) {
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    // Global smoothing defaults
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.imageSmoothingEnabled = true;

    const skin = getC(characterConfig.skinTones, charState.skinTone, '#FFDFC4');
    const hairC = getC(characterConfig.hairColors, charState.hairColor, '#1A1A1A');
    const eyeC = getC(characterConfig.eyeColors, charState.eyeColor, '#8B4513');
    const topC = getC(characterConfig.topColors, charState.topColor, '#F0F0F0');
    const botC = getC(characterConfig.bottomColors, charState.bottomColor, '#4B6C98');

    const dk = (c, n) => darken(c, n);

    ctx.save();

    // Layer order (back to front):
    drawHairBack(ctx, charState.hairStyle, hairC, dk(hairC, 20));
    drawLegs(ctx, skin, dk(skin, 15));
    drawShoes(ctx, charState.shoes);
    drawSocks(ctx, charState.socks);
    drawBottom(ctx, charState.bottom, botC, dk(botC, 20));
    drawTorso(ctx, skin, dk(skin, 15));
    drawTop(ctx, charState.top, topC, dk(topC, 20), skin);
    drawArms(ctx, skin, dk(skin, 15), charState.top, topC);
    drawHead(ctx, skin, dk(skin, 12));
    drawHairFront(ctx, charState.hairStyle, hairC, dk(hairC, 15));
    drawFace(ctx, charState.eyeType, eyeC, charState.expression);

    ctx.restore();
}

/* ═══════════════════════════════════════════
   HEAD
   ═══════════════════════════════════════════ */

function drawHead(ctx, skin, shadow) {
    // Ears
    ctx.fillStyle = skin;
    ctx.strokeStyle = shadow;
    ctx.lineWidth = 1.5;
    for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(CX + side * 52, 128, 7, 11, side * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    // Head — smooth ellipse
    ctx.fillStyle = skin;
    ctx.strokeStyle = shadow;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(CX, 122, 52, 58, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

/* ═══════════════════════════════════════════
   TORSO
   ═══════════════════════════════════════════ */

function drawTorso(ctx, skin, shadow) {
    // Neck — smooth rounded rect
    ctx.fillStyle = skin;
    ctx.beginPath();
    roundedRect(ctx, CX - 13, 176, 26, 30, 6);
    ctx.fill();

    // Torso body — smooth oval
    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.ellipse(CX, 275, 38, 95, 0, 0, Math.PI * 2);
    ctx.fill();
}

/* ═══════════════════════════════════════════
   LEGS — smooth tapered shapes
   ═══════════════════════════════════════════ */

function drawLegs(ctx, skin, shadow) {
    for (const side of [-1, 1]) {
        const lx = CX + side * 18;
        ctx.fillStyle = skin;
        ctx.strokeStyle = shadow;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(lx, 470, 15, 65, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}

/* ═══════════════════════════════════════════
   ARMS — smooth rounded limbs
   ═══════════════════════════════════════════ */

function drawArms(ctx, skin, shadow, topType, topColor) {
    const hasSleeves = ['sweater', 'boatNeck', 'layered'].includes(topType);
    const hasShort = ['microTee'].includes(topType);

    for (const side of [-1, 1]) {
        const sx = CX + side * 58;
        const hx = CX + side * 68;

        // Upper arm
        ctx.fillStyle = (hasSleeves || hasShort) ? topColor : skin;
        ctx.strokeStyle = shadow;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(sx, 270, 10, 50, side * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Lower arm
        ctx.fillStyle = hasSleeves ? topColor : skin;
        ctx.beginPath();
        ctx.ellipse(hx - side * 4, 368, 9, 48, side * 0.05, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Hand — circle
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.arc(hx, 412, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}

/* ═══════════════════════════════════════════
   FACE
   ═══════════════════════════════════════════ */

function drawFace(ctx, eyeType, eyeColor, expression) {
    const eyeY = 120;
    const eyeGap = 20;

    // Eyes
    for (const side of [-1, 1]) {
        drawEye(ctx, CX + side * eyeGap, eyeY, eyeType, eyeColor, side);
    }

    // Eyebrows
    ctx.strokeStyle = 'rgba(40,30,20,0.6)';
    ctx.lineWidth = 2.2;
    for (const side of [-1, 1]) {
        const bx = CX + side * eyeGap;
        ctx.beginPath();
        ctx.moveTo(bx - 10, 100);
        ctx.quadraticCurveTo(bx, 95, bx + 10, 100);
        ctx.stroke();
    }

    // Nose — subtle curve
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(CX, 130);
    ctx.quadraticCurveTo(CX - 2, 140, CX + 1, 142);
    ctx.stroke();

    // Mouth
    drawMouth(ctx, CX, 153, expression);

    // Blush
    if (['smile', 'excited'].includes(expression)) {
        ctx.fillStyle = 'rgba(255, 130, 130, 0.15)';
        for (const side of [-1, 1]) {
            ctx.beginPath();
            ctx.ellipse(CX + side * 33, 137, 12, 7, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawEye(ctx, x, y, type, color, side) {
    const shapes = {
        round: { w: 11, h: 11, lash: false },
        almond: { w: 15, h: 8, lash: true },
        catEye: { w: 16, h: 7, lash: true, tilt: side * -4 },
        doe: { w: 13, h: 15, lash: true },
        sharp: { w: 17, h: 6, lash: true, tilt: side * -3 },
        sparkle: { w: 12, h: 13, lash: true, sparkle: true },
        sleepy: { w: 14, h: 5, lash: false, tilt: side * 2 },
        fierce: { w: 15, h: 7, lash: true, tilt: side * -5 },
    };
    const s = shapes[type] || shapes.round;

    ctx.save();
    ctx.translate(x, y);
    if (s.tilt) ctx.rotate((s.tilt * Math.PI) / 180);

    // White
    ctx.fillStyle = '#FFFFF8';
    ctx.beginPath();
    ctx.ellipse(0, 0, s.w, s.h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#332244';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Iris
    const iR = Math.min(s.w, s.h) * 0.55;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 1, iR, 0, Math.PI * 2);
    ctx.fill();

    // Iris inner ring
    const dk = darken(color, 40);
    ctx.fillStyle = dk;
    ctx.beginPath();
    ctx.arc(0, 1, iR * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(0, 1, iR * 0.32, 0, Math.PI * 2);
    ctx.fill();

    // Highlight (main)
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.ellipse(-iR * 0.28, -iR * 0.3, iR * 0.26, iR * 0.2, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Highlight (small)
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(iR * 0.22, iR * 0.22, iR * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Sparkle
    if (s.sparkle) {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(-iR * 0.45, -iR * 0.5, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Upper lash
    if (s.lash) {
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(0, 0, s.w, s.h, 0, Math.PI, Math.PI * 2);
        ctx.stroke();
        // Flick
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(side * s.w * 0.8, -s.h * 0.5);
        ctx.lineTo(side * s.w * 1.1, -s.h * 0.85);
        ctx.stroke();
    }

    ctx.restore();
}

function drawMouth(ctx, x, y, expression) {
    ctx.save();
    ctx.translate(x, y);

    switch (expression) {
        case 'smile':
            ctx.strokeStyle = '#7B4A3A';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(0, -3, 9, 0.2, Math.PI - 0.2);
            ctx.stroke();
            ctx.fillStyle = '#944';
            ctx.beginPath();
            ctx.arc(0, -1, 5, 0.15, Math.PI - 0.15);
            ctx.fill();
            break;
        case 'smirk':
            ctx.strokeStyle = '#7B4A3A';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(-7, 0);
            ctx.quadraticCurveTo(2, 3, 7, -3);
            ctx.stroke();
            break;
        case 'pout':
            ctx.fillStyle = '#E88888';
            ctx.beginPath();
            ctx.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#9B5A5A';
            ctx.lineWidth = 0.8;
            ctx.stroke();
            break;
        case 'excited':
            ctx.fillStyle = '#844';
            ctx.beginPath();
            ctx.ellipse(0, 0, 6, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#E88888';
            ctx.beginPath();
            ctx.arc(0, 4, 4, 0, Math.PI);
            ctx.fill();
            break;
        case 'serious':
            ctx.strokeStyle = '#7B4A3A';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.lineTo(8, 0);
            ctx.stroke();
            break;
        default:
            ctx.strokeStyle = '#7B4A3A';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(-6, 0);
            ctx.quadraticCurveTo(0, 2, 6, 0);
            ctx.stroke();
    }
    ctx.restore();
}

/* ═══════════════════════════════════════════
   HAIR — Back (behind head)
   ═══════════════════════════════════════════ */

function drawHairBack(ctx, style, color, shadow) {
    ctx.fillStyle = color;
    ctx.strokeStyle = shadow;
    ctx.lineWidth = 1.5;

    switch (style) {
        case 'long':
            ctx.beginPath();
            ctx.moveTo(CX - 55, 95);
            ctx.quadraticCurveTo(CX - 58, 200, CX - 48, 330);
            ctx.quadraticCurveTo(CX - 35, 355, CX, 360);
            ctx.quadraticCurveTo(CX + 35, 355, CX + 48, 330);
            ctx.quadraticCurveTo(CX + 58, 200, CX + 55, 95);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        case 'curly':
            ctx.beginPath();
            ctx.ellipse(CX, 145, 72, 95, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Curl bumps
            for (let i = 0; i < 10; i++) {
                const a = -0.5 + (i / 9) * (Math.PI + 1);
                ctx.beginPath();
                ctx.arc(CX + Math.cos(a) * 68, 145 + Math.sin(a) * 85, 7 + (i % 3) * 3, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
        case 'braids':
            ctx.beginPath();
            ctx.ellipse(CX, 105, 53, 48, 0, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'ponytail':
            ctx.beginPath();
            ctx.moveTo(CX - 10, 82);
            ctx.quadraticCurveTo(CX - 15, 160, CX - 12, 270);
            ctx.quadraticCurveTo(CX, 285, CX + 12, 270);
            ctx.quadraticCurveTo(CX + 15, 160, CX + 10, 82);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        case 'bun':
            ctx.beginPath();
            ctx.arc(CX, 72, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = shadow;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(CX, 72, 16, 0, Math.PI * 2);
            ctx.stroke();
            break;
        case 'afro':
            ctx.beginPath();
            ctx.ellipse(CX, 112, 78, 84, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
    }
}

/* ═══════════════════════════════════════════
   HAIR — Front (bangs, fringe overlay)
   ═══════════════════════════════════════════ */

function drawHairFront(ctx, style, color, shadow) {
    ctx.fillStyle = color;
    ctx.strokeStyle = shadow;
    ctx.lineWidth = 1.5;

    // Hair cap (top of head) — smooth arc
    const drawCap = () => {
        ctx.beginPath();
        ctx.moveTo(CX - 53, 112);
        ctx.quadraticCurveTo(CX - 56, 75, CX - 32, 52);
        ctx.quadraticCurveTo(CX, 36, CX + 32, 52);
        ctx.quadraticCurveTo(CX + 56, 75, CX + 53, 112);
        ctx.closePath();
        ctx.fill();
    };

    switch (style) {
        case 'short':
            drawCap();
            // Subtle textured fringe
            ctx.beginPath();
            ctx.moveTo(CX - 45, 83);
            ctx.quadraticCurveTo(CX - 20, 90, CX, 86);
            ctx.quadraticCurveTo(CX + 20, 82, CX + 45, 83);
            ctx.quadraticCurveTo(CX + 54, 80, CX + 53, 90);
            ctx.lineTo(CX + 53, 82);
            ctx.quadraticCurveTo(CX, 58, CX - 53, 82);
            ctx.lineTo(CX - 53, 90);
            ctx.closePath();
            ctx.fill();
            break;

        case 'long':
            drawCap();
            // Curtain bangs
            for (const side of [-1, 1]) {
                ctx.beginPath();
                ctx.moveTo(CX + side * 2, 70);
                ctx.quadraticCurveTo(CX + side * 22, 75, CX + side * 40, 100);
                ctx.quadraticCurveTo(CX + side * 48, 112, CX + side * 53, 135);
                ctx.lineTo(CX + side * 53, 115);
                ctx.quadraticCurveTo(CX + side * 45, 88, CX + side * 28, 72);
                ctx.closePath();
                ctx.fill();
            }
            // Side hair panels
            for (const side of [-1, 1]) {
                ctx.beginPath();
                ctx.moveTo(CX + side * 51, 105);
                ctx.quadraticCurveTo(CX + side * 56, 160, CX + side * 52, 210);
                ctx.quadraticCurveTo(CX + side * 48, 215, CX + side * 45, 210);
                ctx.quadraticCurveTo(CX + side * 48, 160, CX + side * 46, 105);
                ctx.closePath();
                ctx.fill();
            }
            break;

        case 'curly':
            drawCap();
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(CX - 28 + i * 14, 80 + (i % 2) * 4, 9, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case 'braids':
            drawCap();
            // Center part
            ctx.strokeStyle = shadow;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(CX, 44);
            ctx.lineTo(CX, 82);
            ctx.stroke();
            // Braids
            ctx.fillStyle = color;
            for (const side of [-1, 1]) {
                const bx = CX + side * 46;
                for (let i = 0; i < 8; i++) {
                    const by = 132 + i * 20;
                    const sz = 7.5 - i * 0.25;
                    ctx.beginPath();
                    ctx.ellipse(bx + side * (i * 1.2), by, sz, sz * 0.7, side * 0.15, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = shadow;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
                // Gold bead
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(bx + side * 10, 296, 4.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.fillStyle = color;
            }
            break;

        case 'bun':
            drawCap();
            break;

        case 'ponytail':
            drawCap();
            // Hair tie
            ctx.fillStyle = '#FF6B8A';
            ctx.beginPath();
            ctx.ellipse(CX, 80, 9, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#D44A6A';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = color;
            break;

        case 'afro':
            // Afro top framing face
            ctx.beginPath();
            ctx.moveTo(CX - 55, 118);
            ctx.quadraticCurveTo(CX - 78, 78, CX - 65, 40);
            ctx.quadraticCurveTo(CX - 38, 12, CX, 8);
            ctx.quadraticCurveTo(CX + 38, 12, CX + 65, 40);
            ctx.quadraticCurveTo(CX + 78, 78, CX + 55, 118);
            ctx.closePath();
            ctx.fill();
            break;

        case 'pixie':
            drawCap();
            // Side-swept fringe
            ctx.beginPath();
            ctx.moveTo(CX + 28, 66);
            ctx.quadraticCurveTo(CX + 5, 72, CX - 18, 84);
            ctx.quadraticCurveTo(CX - 38, 96, CX - 52, 120);
            ctx.quadraticCurveTo(CX - 55, 128, CX - 53, 135);
            ctx.lineTo(CX - 46, 115);
            ctx.quadraticCurveTo(CX - 32, 92, CX - 8, 82);
            ctx.quadraticCurveTo(CX + 8, 76, CX + 24, 72);
            ctx.closePath();
            ctx.fill();
            // Second wisp
            ctx.beginPath();
            ctx.moveTo(CX + 20, 70);
            ctx.quadraticCurveTo(CX - 2, 78, CX - 28, 94);
            ctx.quadraticCurveTo(CX - 42, 106, CX - 48, 118);
            ctx.lineTo(CX - 40, 108);
            ctx.quadraticCurveTo(CX - 26, 92, CX - 5, 82);
            ctx.quadraticCurveTo(CX + 8, 76, CX + 18, 74);
            ctx.closePath();
            ctx.fill();
            break;
    }
}

/* ═══════════════════════════════════════════
   CLOTHING — TOPS
   ═══════════════════════════════════════════ */

function drawTop(ctx, type, color, shadow, skin) {
    ctx.fillStyle = color;
    ctx.strokeStyle = shadow;
    ctx.lineWidth = 1.5;
    const tTop = 200;

    switch (type) {
        case 'tankTop': {
            ctx.beginPath();
            ctx.moveTo(CX - 32, tTop + 5);
            ctx.quadraticCurveTo(CX - 35, 300, CX - 30, 365);
            ctx.quadraticCurveTo(CX, 375, CX + 30, 365);
            ctx.quadraticCurveTo(CX + 35, 300, CX + 32, tTop + 5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Neckline scoop
            ctx.fillStyle = skin;
            ctx.beginPath();
            ctx.moveTo(CX - 18, tTop + 5);
            ctx.quadraticCurveTo(CX, tTop + 18, CX + 18, tTop + 5);
            ctx.closePath();
            ctx.fill();
            // Straps
            ctx.fillStyle = color;
            for (const side of [-1, 1]) {
                ctx.beginPath();
                roundedRect(ctx, CX + side * 11, 190, 7, 18, 3);
                ctx.fill();
            }
            break;
        }
        case 'microTee': {
            ctx.beginPath();
            ctx.moveTo(CX - 36, tTop);
            ctx.quadraticCurveTo(CX - 38, 270, CX - 32, 315);
            ctx.quadraticCurveTo(CX, 325, CX + 32, 315);
            ctx.quadraticCurveTo(CX + 38, 270, CX + 36, tTop);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Short sleeves (rounded)
            for (const side of [-1, 1]) {
                ctx.beginPath();
                ctx.ellipse(CX + side * 48, tTop + 22, 16, 20, side * 0.15, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            // Neckline
            ctx.fillStyle = skin;
            ctx.beginPath();
            ctx.ellipse(CX, tTop + 5, 14, 7, 0, 0, Math.PI);
            ctx.fill();
            break;
        }
        case 'sweater': {
            ctx.beginPath();
            ctx.moveTo(CX - 36, tTop - 3);
            ctx.quadraticCurveTo(CX - 38, 300, CX - 34, 375);
            ctx.quadraticCurveTo(CX, 385, CX + 34, 375);
            ctx.quadraticCurveTo(CX + 38, 300, CX + 36, tTop - 3);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Collar
            ctx.strokeStyle = shadow;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.ellipse(CX, tTop, 16, 7, 0, 0, Math.PI);
            ctx.stroke();
            // Hem
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(CX - 34, 372);
            ctx.quadraticCurveTo(CX, 382, CX + 34, 372);
            ctx.stroke();
            break;
        }
        case 'boatNeck': {
            ctx.beginPath();
            ctx.moveTo(CX - 36, tTop);
            ctx.quadraticCurveTo(CX - 38, 300, CX - 32, 368);
            ctx.quadraticCurveTo(CX, 378, CX + 32, 368);
            ctx.quadraticCurveTo(CX + 38, 300, CX + 36, tTop);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Wide neckline
            ctx.fillStyle = skin;
            ctx.beginPath();
            ctx.moveTo(CX - 28, tTop);
            ctx.quadraticCurveTo(CX, tTop + 8, CX + 28, tTop);
            ctx.closePath();
            ctx.fill();
            break;
        }
        case 'layered': {
            // Under layer
            ctx.beginPath();
            ctx.moveTo(CX - 34, tTop);
            ctx.quadraticCurveTo(CX - 36, 300, CX - 32, 372);
            ctx.quadraticCurveTo(CX, 382, CX + 32, 372);
            ctx.quadraticCurveTo(CX + 36, 300, CX + 34, tTop);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Open jacket
            ctx.fillStyle = shadow;
            for (const side of [-1, 1]) {
                ctx.beginPath();
                ctx.moveTo(CX + side * 37, tTop - 3);
                ctx.quadraticCurveTo(CX + side * 38, 300, CX + side * 36, 378);
                ctx.lineTo(CX + side * 8, 378);
                ctx.quadraticCurveTo(CX + side * 6, 250, CX + side * 6, tTop + 20);
                ctx.closePath();
                ctx.fill();
            }
            break;
        }
        case 'bra': {
            for (const side of [-1, 1]) {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(CX + side * 2, tTop + 15);
                ctx.quadraticCurveTo(CX + side * 15, tTop + 8, CX + side * 26, tTop + 12);
                ctx.quadraticCurveTo(CX + side * 22, tTop + 38, CX + side * 14, tTop + 38);
                ctx.quadraticCurveTo(CX + side * 5, tTop + 35, CX + side * 2, tTop + 15);
                ctx.fill();
                ctx.stroke();
            }
            // Band
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(CX - 32, tTop + 32);
            ctx.quadraticCurveTo(CX, tTop + 38, CX + 32, tTop + 32);
            ctx.stroke();
            // Straps
            ctx.lineWidth = 1.8;
            for (const side of [-1, 1]) {
                ctx.beginPath();
                ctx.moveTo(CX + side * 14, tTop + 10);
                ctx.quadraticCurveTo(CX + side * 14, tTop - 8, CX + side * 13, 192);
                ctx.stroke();
            }
            break;
        }
        default: {
            ctx.beginPath();
            ctx.moveTo(CX - 36, tTop);
            ctx.quadraticCurveTo(CX - 38, 300, CX - 32, 358);
            ctx.quadraticCurveTo(CX, 368, CX + 32, 358);
            ctx.quadraticCurveTo(CX + 38, 300, CX + 36, tTop);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
}

/* ═══════════════════════════════════════════
   CLOTHING — BOTTOMS
   ═══════════════════════════════════════════ */

function drawBottom(ctx, type, color, shadow) {
    ctx.fillStyle = color;
    ctx.strokeStyle = shadow;
    ctx.lineWidth = 1.5;
    const waist = 365;

    switch (type) {
        case 'pants':
            for (const side of [-1, 1]) {
                const lx = CX + side * 18;
                ctx.beginPath();
                ctx.ellipse(lx, 455, 17, 75, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            // Waistband
            ctx.beginPath();
            ctx.ellipse(CX, waist + 5, 34, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;

        case 'skirt':
            ctx.beginPath();
            ctx.moveTo(CX - 30, waist);
            ctx.quadraticCurveTo(CX - 48, waist + 55, CX - 42, waist + 95);
            ctx.quadraticCurveTo(CX, waist + 105, CX + 42, waist + 95);
            ctx.quadraticCurveTo(CX + 48, waist + 55, CX + 30, waist);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;

        case 'microSkirt':
            ctx.beginPath();
            ctx.moveTo(CX - 30, waist);
            ctx.quadraticCurveTo(CX - 40, waist + 25, CX - 36, waist + 42);
            ctx.quadraticCurveTo(CX, waist + 48, CX + 36, waist + 42);
            ctx.quadraticCurveTo(CX + 40, waist + 25, CX + 30, waist);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;

        case 'miniShorts':
            ctx.beginPath();
            ctx.moveTo(CX - 30, waist);
            ctx.quadraticCurveTo(CX - 34, waist + 30, CX - 30, waist + 42);
            ctx.quadraticCurveTo(CX - 10, waist + 38, CX, waist + 28);
            ctx.quadraticCurveTo(CX + 10, waist + 38, CX + 30, waist + 42);
            ctx.quadraticCurveTo(CX + 34, waist + 30, CX + 30, waist);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;

        case 'jorts':
            ctx.beginPath();
            ctx.moveTo(CX - 30, waist);
            ctx.quadraticCurveTo(CX - 34, waist + 40, CX - 30, waist + 55);
            ctx.quadraticCurveTo(CX - 10, waist + 50, CX, waist + 38);
            ctx.quadraticCurveTo(CX + 10, waist + 50, CX + 30, waist + 55);
            ctx.quadraticCurveTo(CX + 34, waist + 40, CX + 30, waist);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;

        case 'culottes':
            ctx.beginPath();
            ctx.moveTo(CX - 30, waist);
            ctx.quadraticCurveTo(CX - 48, waist + 45, CX - 44, waist + 85);
            ctx.quadraticCurveTo(CX - 15, waist + 80, CX, waist + 48);
            ctx.quadraticCurveTo(CX + 15, waist + 80, CX + 44, waist + 85);
            ctx.quadraticCurveTo(CX + 48, waist + 45, CX + 30, waist);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;

        case 'longSkirt':
            ctx.beginPath();
            ctx.moveTo(CX - 30, waist);
            ctx.quadraticCurveTo(CX - 46, waist + 75, CX - 40, waist + 148);
            ctx.quadraticCurveTo(CX, waist + 158, CX + 40, waist + 148);
            ctx.quadraticCurveTo(CX + 46, waist + 75, CX + 30, waist);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;

        case 'overalls':
            // Shorts
            ctx.beginPath();
            ctx.moveTo(CX - 30, waist);
            ctx.quadraticCurveTo(CX - 34, waist + 35, CX - 28, waist + 50);
            ctx.quadraticCurveTo(CX - 8, waist + 45, CX, waist + 32);
            ctx.quadraticCurveTo(CX + 8, waist + 45, CX + 28, waist + 50);
            ctx.quadraticCurveTo(CX + 34, waist + 35, CX + 30, waist);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Bib
            ctx.beginPath();
            ctx.moveTo(CX - 18, waist);
            ctx.quadraticCurveTo(CX - 16, waist - 75, CX, waist - 78);
            ctx.quadraticCurveTo(CX + 16, waist - 75, CX + 18, waist);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Straps
            ctx.lineWidth = 3.5;
            ctx.strokeStyle = color;
            for (const side of [-1, 1]) {
                ctx.beginPath();
                ctx.moveTo(CX + side * 14, waist - 75);
                ctx.quadraticCurveTo(CX + side * 18, waist - 105, CX + side * 20, waist - 125);
                ctx.stroke();
            }
            break;

        default:
            ctx.beginPath();
            ctx.moveTo(CX - 30, waist);
            ctx.quadraticCurveTo(CX - 34, waist + 35, CX - 28, waist + 50);
            ctx.quadraticCurveTo(CX, waist + 55, CX + 28, waist + 50);
            ctx.quadraticCurveTo(CX + 34, waist + 35, CX + 30, waist);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
    }
}

/* ═══════════════════════════════════════════
   SHOES
   ═══════════════════════════════════════════ */

function drawShoes(ctx, type) {
    for (const side of [-1, 1]) {
        const sx = CX + side * 18;

        switch (type) {
            case 'boots':
                ctx.fillStyle = '#333';
                ctx.beginPath();
                ctx.ellipse(sx, 530, 14, 22, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(sx, 548, 16, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#222';
                ctx.lineWidth = 1;
                ctx.stroke();
                break;
            case 'sandals':
                ctx.fillStyle = '#AA8866';
                ctx.beginPath();
                ctx.ellipse(sx, 546, 14, 6, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#886644';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(sx - 8, 544);
                ctx.quadraticCurveTo(sx, 540, sx + 8, 544);
                ctx.stroke();
                break;
            case 'platforms':
                ctx.fillStyle = '#333';
                ctx.beginPath();
                ctx.ellipse(sx, 535, 15, 12, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#555';
                ctx.beginPath();
                ctx.ellipse(sx, 548, 16, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.stroke();
                break;
            case 'loafers':
                ctx.fillStyle = '#444';
                ctx.beginPath();
                ctx.ellipse(sx, 542, 13, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.stroke();
                break;
            default: // sneakers
                ctx.fillStyle = '#333';
                ctx.beginPath();
                ctx.ellipse(sx, 540, 14, 10, 0, 0, Math.PI * 2);
                ctx.fill();
                // White sole
                ctx.fillStyle = '#F5F5F5';
                ctx.beginPath();
                ctx.ellipse(sx, 548, 15, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#DDD';
                ctx.lineWidth = 0.8;
                ctx.stroke();
                break;
        }
    }
}

/* ═══════════════════════════════════════════
   SOCKS
   ═══════════════════════════════════════════ */

function drawSocks(ctx, sockType) {
    if (sockType === 'none') return;
    ctx.fillStyle = '#F4F4F4';
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;

    const heights = { ankle: 15, kneeHigh: 60, thighHigh: 110 };
    const h = heights[sockType] || 15;

    for (const side of [-1, 1]) {
        const sx = CX + side * 18;
        ctx.beginPath();
        ctx.ellipse(sx, 530 - h / 2, 15, h / 2 + 8, 0, 0, Math.PI * 2);
        ctx.fill();
        // Top band
        ctx.strokeStyle = '#CCC';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx - 14, 530 - h);
        ctx.quadraticCurveTo(sx, 528 - h, sx + 14, 530 - h);
        ctx.stroke();
    }
}

/* ═══════════════════════════════════════════
   UTIL
   ═══════════════════════════════════════════ */

function roundedRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function getC(list, id, fallback) {
    const item = list.find(t => t.id === id);
    return item ? item.color : fallback;
}

function darken(hex, amount) {
    const c = hexToRgb(hex);
    return `rgb(${Math.max(0, c.r - amount)},${Math.max(0, c.g - amount)},${Math.max(0, c.b - amount)})`;
}

function hexToRgb(hex) {
    if (hex.startsWith('rgb')) {
        const m = hex.match(/(\d+)/g);
        return m ? { r: +m[0], g: +m[1], b: +m[2] } : { r: 180, g: 180, b: 180 };
    }
    const h = hex.replace('#', '');
    return {
        r: parseInt(h.substring(0, 2), 16),
        g: parseInt(h.substring(2, 4), 16),
        b: parseInt(h.substring(4, 6), 16),
    };
}
