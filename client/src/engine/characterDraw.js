/* ============================================
   2D Texture Generators — Cel Shaded Anime
   Draws highly stylized 512x512 face texture.
   Hair and clothing are now pure 3D geometry.
   ============================================ */

/* ═══════════════════════════════════════════
   FACE TEXTURE
   Drawn onto the front of the head sphere.
   ═══════════════════════════════════════════ */

export function drawFaceTexture(ctx, w, h, eyeType, eyeColor, expression, skinColor) {
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    // Lower eyes slightly for cute anime proportions
    const eyeY = h * 0.45;
    const eyeGap = w * 0.16;

    // Eyes
    for (const side of [-1, 1]) {
        drawCelEye(ctx, cx + side * eyeGap, eyeY, eyeColor, side);
    }

    // Blush
    if (['smile', 'excited'].includes(expression)) {
        ctx.fillStyle = 'rgba(255, 150, 150, 0.35)';
        for (const side of [-1, 1]) {
            ctx.beginPath();
            ctx.ellipse(cx + side * eyeGap * 1.3, eyeY + 25, 24, 15, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Eyebrows
    ctx.strokeStyle = '#1a0a2e';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (const side of [-1, 1]) {
        const bx = cx + side * eyeGap;
        ctx.beginPath();
        ctx.moveTo(bx - 20, eyeY - 45);
        ctx.quadraticCurveTo(bx, eyeY - 55, bx + 20, eyeY - 45);
        ctx.stroke();
    }

    // Nose
    ctx.fillStyle = 'rgba(200, 120, 100, 0.5)';
    ctx.beginPath();
    ctx.ellipse(cx, h * 0.56, 4, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    drawCelMouth(ctx, cx, h * 0.65, expression);
}

function drawCelEye(ctx, x, y, colorStr, side) {
    ctx.save();
    ctx.translate(x, y);

    const ew = 30;
    const eh = 40;

    // 1. White sclera
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, 0, ew, eh, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Large colored iris (60% of eye height)
    const iw = ew * 0.85;
    const ih = eh * 0.6;
    const colorSplit = hexToRgb(colorStr);
    const darkColorObj = darkenRgb(colorSplit, 60);
    const c1 = `rgba(${colorSplit.r},${colorSplit.g},${colorSplit.b},1)`;
    const c2 = `rgba(${darkColorObj.r},${darkColorObj.g},${darkColorObj.b},1)`;

    const grad = ctx.createRadialGradient(0, 5, 0, 0, 5, iw);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);

    ctx.fillStyle = grad;
    // Clip to sclera so iris doesn't spill out
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 0, ew, eh, 0, 0, Math.PI * 2);
    ctx.clip();

    ctx.beginPath();
    ctx.ellipse(0, eh * 0.2, iw, ih, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Black pupil (25% of iris)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(0, eh * 0.25, iw * 0.4, ih * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Hard white highlight (upper right)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(iw * 0.35, -ih * 0.1, iw * 0.3, ih * 0.35, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // 5. Smaller sparkle (lower left)
    ctx.beginPath();
    ctx.ellipse(-iw * 0.35, eh * 0.35, iw * 0.1, ih * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // end clip

    // 6. Upper eyelid line
    ctx.strokeStyle = '#1a0a2e';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-ew * 1.1, -eh * 0.5);
    ctx.quadraticCurveTo(0, -eh * 1.1, ew * 1.1, -eh * 0.5);
    ctx.stroke();

    // 7. Eyelashes (outer corner)
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(side * ew * 0.9, -eh * 0.6);
    ctx.lineTo(side * ew * 1.4, -eh * 0.8);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(side * ew * 1.0, -eh * 0.3);
    ctx.lineTo(side * ew * 1.4, -eh * 0.4);
    ctx.stroke();

    ctx.restore();
}

function drawCelMouth(ctx, x, y, expression) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#1a0a2e';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    switch (expression) {
        case 'smile':
        case 'excited':
            ctx.beginPath();
            ctx.arc(0, -5, 12, 0.2, Math.PI - 0.2);
            ctx.stroke();
            break;
        case 'smirk':
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.quadraticCurveTo(4, 5, 10, -4);
            ctx.stroke();
            break;
        case 'pout':
            ctx.beginPath();
            ctx.moveTo(-6, 0);
            ctx.quadraticCurveTo(0, -4, 6, 0);
            ctx.stroke();
            break;
        case 'serious':
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(10, 0);
            ctx.stroke();
            break;
        default: // neutral
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.quadraticCurveTo(0, 3, 8, 0);
            ctx.stroke();
    }
    ctx.restore();
}

/* ═══════════════════════════════════════════
   UTIL
   ═══════════════════════════════════════════ */

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

function darkenRgb(rgb, amount) {
    return {
        r: Math.max(0, rgb.r - amount),
        g: Math.max(0, rgb.g - amount),
        b: Math.max(0, rgb.b - amount),
    };
}
