/* ============================================
   2D Texture Generators for Hybrid Character
   Draws face, hair, clothing details onto
   canvases that get mapped as 3D textures.
   ============================================ */

/* ═══════════════════════════════════════════
   FACE TEXTURE — eyes, eyebrows, nose, mouth
   Drawn onto the front of the head sphere.
   ═══════════════════════════════════════════ */

export function drawFaceTexture(ctx, w, h, eyeType, eyeColor, expression, skinColor) {
    // Fill with skin (transparent edge blends with head)
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const eyeY = h * 0.38;
    const eyeGap = w * 0.14;

    // Eyes
    for (const side of [-1, 1]) {
        drawEye(ctx, cx + side * eyeGap, eyeY, eyeType, eyeColor, side);
    }

    // Eyebrows
    ctx.strokeStyle = 'rgba(40, 30, 20, 0.55)';
    ctx.lineWidth = 2.5;
    for (const side of [-1, 1]) {
        const bx = cx + side * eyeGap;
        ctx.beginPath();
        ctx.moveTo(bx - 10, eyeY - 18);
        ctx.quadraticCurveTo(bx, eyeY - 24, bx + 10, eyeY - 18);
        ctx.stroke();
    }

    // Nose
    ctx.strokeStyle = 'rgba(0,0,0,0.07)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.48);
    ctx.quadraticCurveTo(cx - 2, h * 0.53, cx + 1, h * 0.54);
    ctx.stroke();

    // Mouth
    drawMouth(ctx, cx, h * 0.62, expression);

    // Blush
    if (['smile', 'excited'].includes(expression)) {
        ctx.fillStyle = 'rgba(255, 130, 130, 0.15)';
        for (const side of [-1, 1]) {
            ctx.beginPath();
            ctx.ellipse(cx + side * eyeGap * 1.4, eyeY + 14, 10, 6, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawEye(ctx, x, y, type, color, side) {
    const shapes = {
        round: { w: 12, h: 12, lash: false },
        almond: { w: 16, h: 9, lash: true },
        catEye: { w: 17, h: 8, lash: true, tilt: side * -4 },
        doe: { w: 14, h: 16, lash: true },
        sharp: { w: 18, h: 7, lash: true, tilt: side * -3 },
        sparkle: { w: 13, h: 14, lash: true, sparkle: true },
        sleepy: { w: 15, h: 6, lash: false, tilt: side * 2 },
        fierce: { w: 16, h: 8, lash: true, tilt: side * -5 },
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

    // Inner iris
    ctx.fillStyle = darken(color, 40);
    ctx.beginPath();
    ctx.arc(0, 1, iR * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(0, 1, iR * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Main highlight
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.ellipse(-iR * 0.28, -iR * 0.3, iR * 0.25, iR * 0.18, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Small highlight
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath();
    ctx.arc(iR * 0.2, iR * 0.2, iR * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Sparkle
    if (s.sparkle) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.arc(-iR * 0.45, -iR * 0.5, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Lash
    if (s.lash) {
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(0, 0, s.w, s.h, 0, Math.PI, Math.PI * 2);
        ctx.stroke();
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
    ctx.lineCap = 'round';

    switch (expression) {
        case 'smile':
            ctx.strokeStyle = '#7B4A3A';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(0, -3, 8, 0.2, Math.PI - 0.2);
            ctx.stroke();
            ctx.fillStyle = '#944';
            ctx.beginPath();
            ctx.arc(0, -1, 4.5, 0.15, Math.PI - 0.15);
            ctx.fill();
            break;
        case 'smirk':
            ctx.strokeStyle = '#7B4A3A';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(-6, 0);
            ctx.quadraticCurveTo(2, 3, 6, -3);
            ctx.stroke();
            break;
        case 'pout':
            ctx.fillStyle = '#E88888';
            ctx.beginPath();
            ctx.ellipse(0, 0, 5, 3.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#9B5A5A';
            ctx.lineWidth = 0.8;
            ctx.stroke();
            break;
        case 'excited':
            ctx.fillStyle = '#844';
            ctx.beginPath();
            ctx.ellipse(0, 0, 5, 7, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#E88888';
            ctx.beginPath();
            ctx.arc(0, 4, 3, 0, Math.PI);
            ctx.fill();
            break;
        case 'serious':
            ctx.strokeStyle = '#7B4A3A';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-7, 0);
            ctx.lineTo(7, 0);
            ctx.stroke();
            break;
        default:
            ctx.strokeStyle = '#7B4A3A';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(-5, 0);
            ctx.quadraticCurveTo(0, 2, 5, 0);
            ctx.stroke();
    }
    ctx.restore();
}

/* ═══════════════════════════════════════════
   HAIR TEXTURE — drawn as a 2D sprite
   mapped onto a plane behind/on top of head.
   ═══════════════════════════════════════════ */

export function drawHairTexture(ctx, w, h, style, color) {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const shadow = darken(color, 25);

    ctx.fillStyle = color;
    ctx.strokeStyle = shadow;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Head reference: centered roughly at (cx, h*0.38), radius ~h*0.22

    switch (style) {
        case 'short': {
            // Close-cropped cap on top of head
            ctx.beginPath();
            ctx.moveTo(cx - w * 0.28, h * 0.42);
            ctx.quadraticCurveTo(cx - w * 0.32, h * 0.28, cx - w * 0.2, h * 0.18);
            ctx.quadraticCurveTo(cx, h * 0.08, cx + w * 0.2, h * 0.18);
            ctx.quadraticCurveTo(cx + w * 0.32, h * 0.28, cx + w * 0.28, h * 0.42);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        }

        case 'long': {
            // Top cap
            ctx.beginPath();
            ctx.moveTo(cx - w * 0.32, h * 0.45);
            ctx.quadraticCurveTo(cx - w * 0.36, h * 0.25, cx - w * 0.2, h * 0.14);
            ctx.quadraticCurveTo(cx, h * 0.06, cx + w * 0.2, h * 0.14);
            ctx.quadraticCurveTo(cx + w * 0.36, h * 0.25, cx + w * 0.32, h * 0.45);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Flowing sides
            for (const side of [-1, 1]) {
                ctx.beginPath();
                ctx.moveTo(cx + side * w * 0.3, h * 0.38);
                ctx.quadraticCurveTo(cx + side * w * 0.34, h * 0.6, cx + side * w * 0.28, h * 0.88);
                ctx.quadraticCurveTo(cx + side * w * 0.22, h * 0.92, cx + side * w * 0.2, h * 0.88);
                ctx.quadraticCurveTo(cx + side * w * 0.24, h * 0.6, cx + side * w * 0.22, h * 0.38);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }

            // Bangs
            for (const side of [-1, 1]) {
                ctx.beginPath();
                ctx.moveTo(cx + side * 4, h * 0.2);
                ctx.quadraticCurveTo(cx + side * w * 0.14, h * 0.22, cx + side * w * 0.24, h * 0.35);
                ctx.quadraticCurveTo(cx + side * w * 0.2, h * 0.33, cx + side * w * 0.15, h * 0.28);
                ctx.closePath();
                ctx.fill();
            }
            break;
        }

        case 'curly': {
            // Big cloud of curls
            ctx.beginPath();
            ctx.ellipse(cx, h * 0.36, w * 0.38, h * 0.34, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Curl bumps
            for (let i = 0; i < 14; i++) {
                const angle = (i / 14) * Math.PI * 2;
                const r = w * 0.34;
                const bx = cx + Math.cos(angle) * r;
                const by = h * 0.36 + Math.sin(angle) * (h * 0.3);
                const sz = 6 + (i % 3) * 3;
                ctx.beginPath();
                ctx.arc(bx, by, sz, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
        }

        case 'braids': {
            // Cap
            ctx.beginPath();
            ctx.moveTo(cx - w * 0.28, h * 0.4);
            ctx.quadraticCurveTo(cx - w * 0.3, h * 0.25, cx - w * 0.18, h * 0.16);
            ctx.quadraticCurveTo(cx, h * 0.08, cx + w * 0.18, h * 0.16);
            ctx.quadraticCurveTo(cx + w * 0.3, h * 0.25, cx + w * 0.28, h * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Center part
            ctx.strokeStyle = shadow;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx, h * 0.1);
            ctx.lineTo(cx, h * 0.3);
            ctx.stroke();

            // Two braids
            ctx.fillStyle = color;
            for (const side of [-1, 1]) {
                const bx = cx + side * w * 0.25;
                for (let i = 0; i < 8; i++) {
                    const by = h * 0.42 + i * (h * 0.065);
                    const sz = 7 - i * 0.2;
                    ctx.beginPath();
                    ctx.ellipse(bx + side * i * 1.2, by, sz, sz * 0.68,
                        side * 0.15, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = shadow;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
                // Gold bead at tip
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(bx + side * 10, h * 0.92, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.fillStyle = color;
            }
            break;
        }

        case 'bun': {
            // Slicked cap
            ctx.beginPath();
            ctx.moveTo(cx - w * 0.27, h * 0.4);
            ctx.quadraticCurveTo(cx - w * 0.3, h * 0.25, cx - w * 0.18, h * 0.16);
            ctx.quadraticCurveTo(cx, h * 0.08, cx + w * 0.18, h * 0.16);
            ctx.quadraticCurveTo(cx + w * 0.3, h * 0.25, cx + w * 0.27, h * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Bun circle
            ctx.beginPath();
            ctx.arc(cx, h * 0.12, w * 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Band
            ctx.strokeStyle = shadow;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(cx, h * 0.12, w * 0.07, 0, Math.PI * 2);
            ctx.stroke();
            break;
        }

        case 'ponytail': {
            // Cap
            ctx.beginPath();
            ctx.moveTo(cx - w * 0.27, h * 0.4);
            ctx.quadraticCurveTo(cx - w * 0.3, h * 0.25, cx - w * 0.18, h * 0.16);
            ctx.quadraticCurveTo(cx, h * 0.08, cx + w * 0.18, h * 0.16);
            ctx.quadraticCurveTo(cx + w * 0.3, h * 0.25, cx + w * 0.27, h * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Hair tie
            ctx.fillStyle = '#FF6B8A';
            ctx.beginPath();
            ctx.ellipse(cx, h * 0.18, 8, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#D44A6A';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Tail flowing down
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(cx - 10, h * 0.18);
            ctx.quadraticCurveTo(cx - 14, h * 0.5, cx - 8, h * 0.85);
            ctx.quadraticCurveTo(cx, h * 0.9, cx + 8, h * 0.85);
            ctx.quadraticCurveTo(cx + 14, h * 0.5, cx + 10, h * 0.18);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = shadow;
            ctx.lineWidth = 1;
            ctx.stroke();
            break;
        }

        case 'afro': {
            // Large cloud
            ctx.beginPath();
            ctx.ellipse(cx, h * 0.35, w * 0.42, h * 0.37, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Texture
            for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2;
                const r = w * 0.38;
                ctx.beginPath();
                ctx.arc(
                    cx + Math.cos(angle) * r,
                    h * 0.35 + Math.sin(angle) * (h * 0.33),
                    5 + (i % 3) * 2, 0, Math.PI * 2
                );
                ctx.fill();
            }
            break;
        }

        case 'pixie': {
            // Tight cap
            ctx.beginPath();
            ctx.moveTo(cx - w * 0.26, h * 0.4);
            ctx.quadraticCurveTo(cx - w * 0.28, h * 0.26, cx - w * 0.16, h * 0.18);
            ctx.quadraticCurveTo(cx, h * 0.1, cx + w * 0.16, h * 0.18);
            ctx.quadraticCurveTo(cx + w * 0.28, h * 0.26, cx + w * 0.26, h * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Dramatic side fringe
            ctx.beginPath();
            ctx.moveTo(cx + w * 0.14, h * 0.18);
            ctx.quadraticCurveTo(cx, h * 0.22, cx - w * 0.16, h * 0.3);
            ctx.quadraticCurveTo(cx - w * 0.26, h * 0.36, cx - w * 0.3, h * 0.44);
            ctx.lineTo(cx - w * 0.24, h * 0.38);
            ctx.quadraticCurveTo(cx - w * 0.18, h * 0.3, cx - w * 0.05, h * 0.25);
            ctx.quadraticCurveTo(cx + w * 0.06, h * 0.22, cx + w * 0.12, h * 0.2);
            ctx.closePath();
            ctx.fill();

            // Second wisp
            ctx.beginPath();
            ctx.moveTo(cx + w * 0.1, h * 0.2);
            ctx.quadraticCurveTo(cx - w * 0.04, h * 0.25, cx - w * 0.2, h * 0.34);
            ctx.quadraticCurveTo(cx - w * 0.28, h * 0.4, cx - w * 0.28, h * 0.42);
            ctx.lineTo(cx - w * 0.22, h * 0.36);
            ctx.quadraticCurveTo(cx - w * 0.12, h * 0.28, cx + w * 0.02, h * 0.24);
            ctx.closePath();
            ctx.fill();
            break;
        }
    }
}

/* ═══════════════════════════════════════════
   CLOTHING TOP TEXTURE
   Wraps around the torso cylinder.
   ═══════════════════════════════════════════ */

export function drawTopTexture(ctx, w, h, topType, color, skinColor) {
    // Fill with clothing color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);

    const shadow = darken(color, 20);

    switch (topType) {
        case 'tankTop':
            // Skin at top (exposed shoulders)
            ctx.fillStyle = skinColor;
            ctx.fillRect(0, 0, w, h * 0.15);
            // Straps
            ctx.fillStyle = color;
            ctx.fillRect(w * 0.2, 0, w * 0.12, h * 0.2);
            ctx.fillRect(w * 0.68, 0, w * 0.12, h * 0.2);
            // Neckline scoop
            ctx.fillStyle = skinColor;
            ctx.beginPath();
            ctx.ellipse(w / 2, h * 0.08, w * 0.18, h * 0.1, 0, 0, Math.PI);
            ctx.fill();
            break;

        case 'microTee':
            // Exposed midriff (lower part is skin)
            ctx.fillStyle = skinColor;
            ctx.fillRect(0, h * 0.65, w, h * 0.35);
            // Sleeve lines
            ctx.strokeStyle = shadow;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, h * 0.25);
            ctx.lineTo(w * 0.08, h * 0.25);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(w, h * 0.25);
            ctx.lineTo(w * 0.92, h * 0.25);
            ctx.stroke();
            break;

        case 'sweater':
            // Collar
            ctx.fillStyle = shadow;
            ctx.fillRect(w * 0.3, 0, w * 0.4, h * 0.08);
            // Hem
            ctx.fillStyle = shadow;
            ctx.fillRect(0, h * 0.92, w, h * 0.08);
            // Ribbing texture
            ctx.strokeStyle = shadow;
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 12; i++) {
                const y = h * 0.1 + (i / 12) * h * 0.8;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
            break;

        case 'boatNeck':
            // Wide neckline
            ctx.fillStyle = skinColor;
            ctx.beginPath();
            ctx.ellipse(w / 2, h * 0.04, w * 0.35, h * 0.08, 0, 0, Math.PI);
            ctx.fill();
            break;

        case 'layered':
            // Jacket opening in center
            ctx.fillStyle = shadow;
            ctx.fillRect(w * 0.42, 0, w * 0.16, h);
            // Lapels
            ctx.strokeStyle = darken(color, 35);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(w * 0.42, 0);
            ctx.lineTo(w * 0.35, h * 0.3);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(w * 0.58, 0);
            ctx.lineTo(w * 0.65, h * 0.3);
            ctx.stroke();
            break;

        case 'bra':
            // Mostly skin
            ctx.fillStyle = skinColor;
            ctx.fillRect(0, 0, w, h);
            // Band
            ctx.fillStyle = color;
            ctx.fillRect(0, h * 0.3, w, h * 0.15);
            // Cups
            ctx.beginPath();
            ctx.ellipse(w * 0.35, h * 0.3, w * 0.12, h * 0.12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(w * 0.65, h * 0.3, w * 0.12, h * 0.12, 0, 0, Math.PI * 2);
            ctx.fill();
            break;

        default:
            // Plain tee
            ctx.fillStyle = skinColor;
            ctx.beginPath();
            ctx.ellipse(w / 2, h * 0.05, w * 0.12, h * 0.06, 0, 0, Math.PI);
            ctx.fill();
    }
}

/* ═══════════════════════════════════════════
   CLOTHING BOTTOM TEXTURE
   Wraps around the hip cylinder.
   ═══════════════════════════════════════════ */

export function drawBottomTexture(ctx, w, h, bottomType, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);

    const shadow = darken(color, 20);

    switch (bottomType) {
        case 'skirt':
        case 'microSkirt':
        case 'longSkirt':
            // Pleat lines
            ctx.strokeStyle = shadow;
            ctx.lineWidth = 1;
            for (let i = 0; i < 8; i++) {
                const x = (i / 8) * w;
                ctx.beginPath();
                ctx.moveTo(x, h * 0.15);
                ctx.lineTo(x + 4, h);
                ctx.stroke();
            }
            break;

        case 'jorts':
            // Frayed hem
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 20; i++) {
                const x = (i / 20) * w;
                ctx.beginPath();
                ctx.moveTo(x, h * 0.88);
                ctx.lineTo(x + 1, h);
                ctx.stroke();
            }
            // Pocket stitching
            ctx.strokeStyle = shadow;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(w * 0.2, h * 0.2, w * 0.08, 0, Math.PI);
            ctx.stroke();
            break;

        case 'overalls':
            // Belt
            ctx.fillStyle = shadow;
            ctx.fillRect(0, 0, w, h * 0.08);
            break;

        case 'culottes':
            // Center line
            ctx.strokeStyle = shadow;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(w / 2, h * 0.3);
            ctx.lineTo(w / 2, h);
            ctx.stroke();
            break;

        default:
            // Waistband
            ctx.fillStyle = shadow;
            ctx.fillRect(0, 0, w, h * 0.06);
    }
}

/* ═══════════════════════════════════════════
   UTIL
   ═══════════════════════════════════════════ */

function darken(hex, amount) {
    const c = hexToRgb(hex);
    return `rgb(${Math.max(0, c.r - amount)},${Math.max(0, c.g - amount)},${Math.max(0, c.b - amount)})`;
}

function hexToRgb(hex) {
    if (typeof hex !== 'string') return { r: 180, g: 180, b: 180 };
    if (hex.startsWith('rgb')) {
        const m = hex.match(/(\d+)/g);
        return m ? { r: +m[0], g: +m[1], b: +m[2] } : { r: 180, g: 180, b: 180 };
    }
    const h = hex.replace('#', '');
    return {
        r: parseInt(h.substring(0, 2), 16) || 0,
        g: parseInt(h.substring(2, 4), 16) || 0,
        b: parseInt(h.substring(4, 6), 16) || 0,
    };
}
