/* ============================================
   Creature Renderer — Procedural SVG Characters
   Chao-inspired digital pets with evolution
   ============================================ */

const CreatureRenderer = {

    /* --- Species Visual Definitions --- */
    speciesData: {
        flamipuff: {
            bodyShape: 'round',
            bodyColor: { h: 10, s: 85, l: 58 },      // Warm orange-red
            accentColor: { h: 35, s: 95, l: 60 },     // Golden flame
            eyeStyle: 'round',
            earType: 'flame',
            tailType: 'flame',
            wingType: 'none',
            pattern: 'glow',
            auraColor: 'rgba(255,120,50,0.25)',
        },
        drizzli: {
            bodyShape: 'teardrop',
            bodyColor: { h: 195, s: 75, l: 55 },      // Ocean blue
            accentColor: { h: 180, s: 65, l: 70 },    // Aqua
            eyeStyle: 'wide',
            earType: 'drop',
            tailType: 'fin',
            wingType: 'none',
            pattern: 'sheen',
            auraColor: 'rgba(50,180,255,0.2)',
        },
        sproutchi: {
            bodyShape: 'oval',
            bodyColor: { h: 120, s: 55, l: 52 },      // Leafy green
            accentColor: { h: 90, s: 70, l: 60 },     // Lime
            eyeStyle: 'gentle',
            earType: 'leaf',
            tailType: 'vine',
            wingType: 'none',
            pattern: 'spots',
            auraColor: 'rgba(100,200,80,0.2)',
        },
        zappiko: {
            bodyShape: 'spiky',
            bodyColor: { h: 50, s: 90, l: 55 },       // Electric yellow
            accentColor: { h: 40, s: 100, l: 50 },    // Gold
            eyeStyle: 'sharp',
            earType: 'bolt',
            tailType: 'bolt',
            wingType: 'none',
            pattern: 'crackle',
            auraColor: 'rgba(255,220,50,0.3)',
        },
        lunette: {
            bodyShape: 'crescent',
            bodyColor: { h: 270, s: 55, l: 40 },      // Deep purple
            accentColor: { h: 250, s: 70, l: 65 },    // Lavender
            eyeStyle: 'cat',
            earType: 'bat',
            tailType: 'pointed',
            wingType: 'bat',
            pattern: 'starry',
            auraColor: 'rgba(150,80,255,0.2)',
        },
        cosmogo: {
            bodyShape: 'star',
            bodyColor: { h: 320, s: 65, l: 62 },      // Pink-magenta
            accentColor: { h: 290, s: 80, l: 75 },    // Lavender pink
            eyeStyle: 'sparkle',
            earType: 'antenna',
            tailType: 'comet',
            wingType: 'fairy',
            pattern: 'iridescent',
            auraColor: 'rgba(255,105,180,0.25)',
        },
    },

    /* ========================================
       MAIN RENDER FUNCTION
       Returns an SVG string of the creature
       ======================================== */
    render(pet, size = 200, options = {}) {
        if (!pet) return '<div class="creature-placeholder">?</div>';
        const species = this.speciesData[pet.species];
        if (!species) return '<div class="creature-placeholder">?</div>';

        const stage = pet.evolutionStage || 'baby';
        const scale = { egg: 0.5, baby: 0.65, child: 0.85, adult: 1.0 }[stage] || 0.8;
        const bodySize = size * scale;
        const alignment = pet.alignment || 0;
        const dominantStat = this.getDominantStat(pet);

        // Adjust colors based on alignment
        const bodyHSL = this.adjustColorForAlignment(species.bodyColor, alignment);
        const accentHSL = this.adjustColorForAlignment(species.accentColor, alignment);
        const bodyFill = `hsl(${bodyHSL.h}, ${bodyHSL.s}%, ${bodyHSL.l}%)`;
        const accentFill = `hsl(${accentHSL.h}, ${accentHSL.s}%, ${accentHSL.l}%)`;
        const highlightFill = `hsl(${bodyHSL.h}, ${bodyHSL.s - 10}%, ${Math.min(95, bodyHSL.l + 25)}%)`;
        const shadowFill = `hsl(${bodyHSL.h}, ${bodyHSL.s}%, ${Math.max(15, bodyHSL.l - 20)}%)`;

        // Aura glow based on dominant stat
        const auraColor = this.getStatAuraColor(dominantStat);

        const svgId = `creature-${pet.name}-${Date.now()}`;

        if (stage === 'egg') {
            return this.renderEgg(svgId, size, bodyFill, accentFill);
        }

        let svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="creature-svg creature-${stage}" id="${svgId}" xmlns="http://www.w3.org/2000/svg">`;

        // Defs — gradients and filters
        svg += `<defs>
      <radialGradient id="bodyGrad-${svgId}" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stop-color="${highlightFill}"/>
        <stop offset="70%" stop-color="${bodyFill}"/>
        <stop offset="100%" stop-color="${shadowFill}"/>
      </radialGradient>
      <radialGradient id="auraGrad-${svgId}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${auraColor}" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="${auraColor}" stop-opacity="0"/>
      </radialGradient>
      <filter id="glow-${svgId}">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="softShadow-${svgId}">
        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgba(0,0,0,0.25)"/>
      </filter>
    </defs>`;

        const cx = size / 2;
        const cy = size / 2 + 8;

        // Aura glow behind creature
        svg += `<ellipse cx="${cx}" cy="${cy}" rx="${bodySize * 0.55}" ry="${bodySize * 0.55}" fill="url(#auraGrad-${svgId})" class="creature-aura"/>`;

        // Ground shadow
        svg += `<ellipse cx="${cx}" cy="${cy + bodySize * 0.38}" rx="${bodySize * 0.3}" ry="${bodySize * 0.07}" fill="rgba(0,0,0,0.15)"/>`;

        // Body group — everything moves together for animation
        svg += `<g class="creature-body-group" filter="url(#softShadow-${svgId})">`;

        // Tail (behind body)
        svg += this.renderTail(species.tailType, cx, cy, bodySize, accentFill, stage, dominantStat);

        // Wings (behind body)
        if (stage !== 'baby' || species.wingType !== 'none') {
            svg += this.renderWings(species.wingType, cx, cy, bodySize, accentFill, stage, dominantStat);
        }

        // Body
        svg += this.renderBody(species.bodyShape, cx, cy, bodySize, svgId, stage);

        // Pattern overlay
        svg += this.renderPattern(species.pattern, cx, cy, bodySize, accentFill, stage);

        // Ears / head features
        svg += this.renderEars(species.earType, cx, cy, bodySize, bodyFill, accentFill, stage);

        // Eyes
        svg += this.renderEyes(species.eyeStyle, cx, cy, bodySize, stage);

        // Mouth
        svg += this.renderMouth(cx, cy, bodySize, pet.mood || 'happy', stage);

        // Feet
        svg += this.renderFeet(cx, cy, bodySize, shadowFill, stage);

        // Equipped items (rendered ON the creature)
        if (pet.equippedItems && pet.equippedItems.length > 0) {
            svg += this.renderEquippedItems(pet.equippedItems, cx, cy, bodySize, stage);
        }

        svg += `</g>`; // end body group

        // Evolution indicator
        if (options.showEvolution && pet.statExp !== undefined) {
            svg += this.renderEvolutionIndicator(cx, size, pet);
        }

        svg += `</svg>`;
        return svg;
    },

    /* --- Egg --- */
    renderEgg(svgId, size, bodyFill, accentFill) {
        const cx = size / 2, cy = size / 2;
        return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="creature-svg creature-egg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="eggGrad-${svgId}" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="50%" stop-color="#F8F0E8"/>
          <stop offset="100%" stop-color="#E8D8C8"/>
        </radialGradient>
      </defs>
      <ellipse cx="${cx}" cy="${cy + 10}" rx="${size * 0.2}" ry="${size * 0.05}" fill="rgba(0,0,0,0.1)"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${size * 0.18}" ry="${size * 0.25}" fill="url(#eggGrad-${svgId})" stroke="${accentFill}" stroke-width="2" class="creature-egg-shape"/>
      <path d="M ${cx - size * 0.1} ${cy - size * 0.03} Q ${cx} ${cy - size * 0.18} ${cx + size * 0.1} ${cy - size * 0.03}" fill="none" stroke="${bodyFill}" stroke-width="3" stroke-dasharray="4,4" opacity="0.6"/>
      <ellipse cx="${cx - size * 0.06}" cy="${cy - size * 0.08}" rx="${size * 0.03}" ry="${size * 0.04}" fill="${bodyFill}" opacity="0.3"/>
      <ellipse cx="${cx + size * 0.05}" cy="${cy + size * 0.05}" rx="${size * 0.025}" ry="${size * 0.035}" fill="${accentFill}" opacity="0.3"/>
    </svg>`;
    },

    /* --- Body Shapes --- */
    renderBody(shape, cx, cy, s, svgId, stage) {
        const r = s * 0.32;
        const stageScale = stage === 'baby' ? 0.85 : stage === 'child' ? 0.95 : 1;
        const sr = r * stageScale;

        switch (shape) {
            case 'round':
                return `<ellipse cx="${cx}" cy="${cy}" rx="${sr}" ry="${sr * 0.95}" fill="url(#bodyGrad-${svgId})"/>`;
            case 'teardrop':
                return `<path d="M ${cx} ${cy - sr} Q ${cx + sr * 1.1} ${cy - sr * 0.3} ${cx + sr * 0.8} ${cy + sr * 0.5} Q ${cx + sr * 0.3} ${cy + sr} ${cx} ${cy + sr * 0.9} Q ${cx - sr * 0.3} ${cy + sr} ${cx - sr * 0.8} ${cy + sr * 0.5} Q ${cx - sr * 1.1} ${cy - sr * 0.3} ${cx} ${cy - sr}" fill="url(#bodyGrad-${svgId})"/>`;
            case 'oval':
                return `<ellipse cx="${cx}" cy="${cy}" rx="${sr * 0.85}" ry="${sr}" fill="url(#bodyGrad-${svgId})"/>`;
            case 'spiky':
                const pts = [];
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
                    const rad = i % 2 === 0 ? sr * 1.05 : sr * 0.85;
                    pts.push(`${cx + Math.cos(angle) * rad},${cy + Math.sin(angle) * rad}`);
                }
                return `<polygon points="${pts.join(' ')}" fill="url(#bodyGrad-${svgId})" stroke-linejoin="round"/>`;
            case 'crescent':
                return `<ellipse cx="${cx}" cy="${cy}" rx="${sr * 0.9}" ry="${sr}" fill="url(#bodyGrad-${svgId})"/>
                <ellipse cx="${cx + sr * 0.2}" cy="${cy - sr * 0.15}" rx="${sr * 0.45}" ry="${sr * 0.55}" fill="url(#bodyGrad-${svgId})" opacity="0.3"/>`;
            case 'star':
                const starPts = [];
                for (let i = 0; i < 10; i++) {
                    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
                    const rad = i % 2 === 0 ? sr * 1.0 : sr * 0.7;
                    starPts.push(`${cx + Math.cos(angle) * rad},${cy + Math.sin(angle) * rad}`);
                }
                return `<polygon points="${starPts.join(' ')}" fill="url(#bodyGrad-${svgId})" stroke-linejoin="round"/>`;
            default:
                return `<ellipse cx="${cx}" cy="${cy}" rx="${sr}" ry="${sr}" fill="url(#bodyGrad-${svgId})"/>`;
        }
    },

    /* --- Eyes --- */
    renderEyes(style, cx, cy, s, stage) {
        const r = s * 0.32;
        const eyeY = cy - r * 0.15;
        const eyeSpacing = r * 0.35;
        const eyeSize = stage === 'baby' ? r * 0.22 : stage === 'child' ? r * 0.2 : r * 0.18;
        const pupilSize = eyeSize * 0.5;

        let svg = '';

        // Eye whites
        const leftX = cx - eyeSpacing;
        const rightX = cx + eyeSpacing;

        switch (style) {
            case 'round':
                svg += `<ellipse cx="${leftX}" cy="${eyeY}" rx="${eyeSize}" ry="${eyeSize}" fill="white" stroke="#333" stroke-width="1"/>`;
                svg += `<ellipse cx="${rightX}" cy="${eyeY}" rx="${eyeSize}" ry="${eyeSize}" fill="white" stroke="#333" stroke-width="1"/>`;
                svg += `<circle cx="${leftX + 1}" cy="${eyeY}" r="${pupilSize}" fill="#222"/>`;
                svg += `<circle cx="${rightX + 1}" cy="${eyeY}" r="${pupilSize}" fill="#222"/>`;
                svg += `<circle cx="${leftX + 2}" cy="${eyeY - 2}" r="${pupilSize * 0.35}" fill="white"/>`;
                svg += `<circle cx="${rightX + 2}" cy="${eyeY - 2}" r="${pupilSize * 0.35}" fill="white"/>`;
                break;
            case 'wide':
                svg += `<ellipse cx="${leftX}" cy="${eyeY}" rx="${eyeSize * 1.2}" ry="${eyeSize}" fill="white" stroke="#333" stroke-width="1"/>`;
                svg += `<ellipse cx="${rightX}" cy="${eyeY}" rx="${eyeSize * 1.2}" ry="${eyeSize}" fill="white" stroke="#333" stroke-width="1"/>`;
                svg += `<circle cx="${leftX}" cy="${eyeY + 1}" r="${pupilSize}" fill="#1a5276"/>`;
                svg += `<circle cx="${rightX}" cy="${eyeY + 1}" r="${pupilSize}" fill="#1a5276"/>`;
                svg += `<circle cx="${leftX + 1.5}" cy="${eyeY - 1.5}" r="${pupilSize * 0.3}" fill="white"/>`;
                svg += `<circle cx="${rightX + 1.5}" cy="${eyeY - 1.5}" r="${pupilSize * 0.3}" fill="white"/>`;
                break;
            case 'gentle':
                svg += `<ellipse cx="${leftX}" cy="${eyeY}" rx="${eyeSize}" ry="${eyeSize * 0.85}" fill="white" stroke="#333" stroke-width="1"/>`;
                svg += `<ellipse cx="${rightX}" cy="${eyeY}" rx="${eyeSize}" ry="${eyeSize * 0.85}" fill="white" stroke="#333" stroke-width="1"/>`;
                svg += `<circle cx="${leftX}" cy="${eyeY + 1}" r="${pupilSize * 0.9}" fill="#2e7d32"/>`;
                svg += `<circle cx="${rightX}" cy="${eyeY + 1}" r="${pupilSize * 0.9}" fill="#2e7d32"/>`;
                svg += `<circle cx="${leftX + 1}" cy="${eyeY - 1}" r="${pupilSize * 0.3}" fill="white"/>`;
                svg += `<circle cx="${rightX + 1}" cy="${eyeY - 1}" r="${pupilSize * 0.3}" fill="white"/>`;
                // Gentle curve above eyes
                svg += `<path d="M ${leftX - eyeSize} ${eyeY - eyeSize * 1.1} Q ${leftX} ${eyeY - eyeSize * 1.5} ${leftX + eyeSize} ${eyeY - eyeSize * 1.1}" fill="none" stroke="#555" stroke-width="1" opacity="0.5"/>`;
                svg += `<path d="M ${rightX - eyeSize} ${eyeY - eyeSize * 1.1} Q ${rightX} ${eyeY - eyeSize * 1.5} ${rightX + eyeSize} ${eyeY - eyeSize * 1.1}" fill="none" stroke="#555" stroke-width="1" opacity="0.5"/>`;
                break;
            case 'sharp':
                svg += `<path d="M ${leftX - eyeSize} ${eyeY} L ${leftX} ${eyeY - eyeSize * 0.8} L ${leftX + eyeSize} ${eyeY} L ${leftX} ${eyeY + eyeSize * 0.6} Z" fill="white" stroke="#333" stroke-width="1"/>`;
                svg += `<path d="M ${rightX - eyeSize} ${eyeY} L ${rightX} ${eyeY - eyeSize * 0.8} L ${rightX + eyeSize} ${eyeY} L ${rightX} ${eyeY + eyeSize * 0.6} Z" fill="white" stroke="#333" stroke-width="1"/>`;
                svg += `<circle cx="${leftX}" cy="${eyeY}" r="${pupilSize * 0.8}" fill="#8B6914"/>`;
                svg += `<circle cx="${rightX}" cy="${eyeY}" r="${pupilSize * 0.8}" fill="#8B6914"/>`;
                svg += `<circle cx="${leftX + 1}" cy="${eyeY - 1}" r="${pupilSize * 0.25}" fill="white"/>`;
                svg += `<circle cx="${rightX + 1}" cy="${eyeY - 1}" r="${pupilSize * 0.25}" fill="white"/>`;
                break;
            case 'cat':
                svg += `<ellipse cx="${leftX}" cy="${eyeY}" rx="${eyeSize}" ry="${eyeSize * 0.75}" fill="white" stroke="#333" stroke-width="1"/>`;
                svg += `<ellipse cx="${rightX}" cy="${eyeY}" rx="${eyeSize}" ry="${eyeSize * 0.75}" fill="white" stroke="#333" stroke-width="1"/>`;
                // Slit pupils
                svg += `<ellipse cx="${leftX}" cy="${eyeY}" rx="${pupilSize * 0.3}" ry="${pupilSize}" fill="#4a0080"/>`;
                svg += `<ellipse cx="${rightX}" cy="${eyeY}" rx="${pupilSize * 0.3}" ry="${pupilSize}" fill="#4a0080"/>`;
                svg += `<circle cx="${leftX + 1}" cy="${eyeY - 2}" r="${pupilSize * 0.2}" fill="white"/>`;
                svg += `<circle cx="${rightX + 1}" cy="${eyeY - 2}" r="${pupilSize * 0.2}" fill="white"/>`;
                break;
            case 'sparkle':
                svg += `<ellipse cx="${leftX}" cy="${eyeY}" rx="${eyeSize * 1.1}" ry="${eyeSize}" fill="white" stroke="#333" stroke-width="1"/>`;
                svg += `<ellipse cx="${rightX}" cy="${eyeY}" rx="${eyeSize * 1.1}" ry="${eyeSize}" fill="white" stroke="#333" stroke-width="1"/>`;
                svg += `<circle cx="${leftX}" cy="${eyeY}" r="${pupilSize}" fill="#c2185b"/>`;
                svg += `<circle cx="${rightX}" cy="${eyeY}" r="${pupilSize}" fill="#c2185b"/>`;
                // Star sparkle highlights
                svg += `<polygon points="${leftX + 2},${eyeY - 4} ${leftX + 3},${eyeY - 2} ${leftX + 5},${eyeY - 3} ${leftX + 3},${eyeY - 1}" fill="white"/>`;
                svg += `<polygon points="${rightX + 2},${eyeY - 4} ${rightX + 3},${eyeY - 2} ${rightX + 5},${eyeY - 3} ${rightX + 3},${eyeY - 1}" fill="white"/>`;
                svg += `<circle cx="${leftX - 1}" cy="${eyeY + 2}" r="${pupilSize * 0.2}" fill="white" opacity="0.6"/>`;
                svg += `<circle cx="${rightX - 1}" cy="${eyeY + 2}" r="${pupilSize * 0.2}" fill="white" opacity="0.6"/>`;
                break;
        }

        return svg;
    },

    /* --- Mouth --- */
    renderMouth(cx, cy, s, mood, stage) {
        const r = s * 0.32;
        const my = cy + r * 0.25;
        const mw = r * 0.2;
        switch (mood) {
            case 'happy':
                return `<path d="M ${cx - mw} ${my} Q ${cx} ${my + mw * 0.8} ${cx + mw} ${my}" fill="none" stroke="#555" stroke-width="1.5" stroke-linecap="round"/>`;
            case 'sad':
                return `<path d="M ${cx - mw} ${my + mw * 0.3} Q ${cx} ${my - mw * 0.3} ${cx + mw} ${my + mw * 0.3}" fill="none" stroke="#555" stroke-width="1.5" stroke-linecap="round"/>`;
            case 'hungry':
                return `<ellipse cx="${cx}" cy="${my + 2}" rx="${mw * 0.5}" ry="${mw * 0.4}" fill="#555"/>`;
            case 'tired':
                return `<path d="M ${cx - mw * 0.6} ${my + 2} L ${cx + mw * 0.6} ${my + 2}" stroke="#555" stroke-width="1.5" stroke-linecap="round"/>`;
            default:
                return `<path d="M ${cx - mw * 0.8} ${my} Q ${cx} ${my + mw * 0.5} ${cx + mw * 0.8} ${my}" fill="none" stroke="#555" stroke-width="1.5" stroke-linecap="round"/>`;
        }
    },

    /* --- Ears / Head Features --- */
    renderEars(type, cx, cy, s, bodyFill, accentFill, stage) {
        const r = s * 0.32;
        const top = cy - r;
        let svg = '';
        switch (type) {
            case 'flame':
                svg += `<path d="M ${cx - r * 0.15} ${top - 2} Q ${cx - r * 0.25} ${top - r * 0.5} ${cx - r * 0.05} ${top - r * 0.35} Q ${cx} ${top - r * 0.6} ${cx + r * 0.1} ${top - r * 0.3} Q ${cx + r * 0.2} ${top - r * 0.55} ${cx + r * 0.15} ${top - 2}" fill="${accentFill}" opacity="0.9"/>`;
                break;
            case 'drop':
                svg += `<ellipse cx="${cx - r * 0.45}" cy="${top + r * 0.15}" rx="${r * 0.12}" ry="${r * 0.22}" fill="${bodyFill}" stroke="${accentFill}" stroke-width="1" transform="rotate(-20, ${cx - r * 0.45}, ${top + r * 0.15})"/>`;
                svg += `<ellipse cx="${cx + r * 0.45}" cy="${top + r * 0.15}" rx="${r * 0.12}" ry="${r * 0.22}" fill="${bodyFill}" stroke="${accentFill}" stroke-width="1" transform="rotate(20, ${cx + r * 0.45}, ${top + r * 0.15})"/>`;
                break;
            case 'leaf':
                svg += `<path d="M ${cx} ${top - 2} Q ${cx + r * 0.15} ${top - r * 0.5} ${cx + r * 0.05} ${top - r * 0.35}" fill="${accentFill}" stroke="#228B22" stroke-width="1"/>`;
                svg += `<line x1="${cx}" y1="${top - 2}" x2="${cx + r * 0.08}" y2="${top - r * 0.4}" stroke="#228B22" stroke-width="0.8"/>`;
                if (stage === 'adult') {
                    svg += `<path d="M ${cx - r * 0.1} ${top} Q ${cx - r * 0.25} ${top - r * 0.35} ${cx - r * 0.12} ${top - r * 0.25}" fill="${accentFill}" stroke="#228B22" stroke-width="0.8"/>`;
                }
                break;
            case 'bolt':
                svg += `<path d="M ${cx - r * 0.2} ${top - r * 0.1} L ${cx - r * 0.1} ${top - r * 0.45} L ${cx + r * 0.05} ${top - r * 0.2} L ${cx + r * 0.15} ${top - r * 0.55}" fill="none" stroke="${accentFill}" stroke-width="3" stroke-linecap="round"/>`;
                if (stage === 'adult') {
                    svg += `<path d="M ${cx + r * 0.1} ${top - r * 0.1} L ${cx + r * 0.2} ${top - r * 0.35} L ${cx + r * 0.28} ${top - r * 0.15}" fill="none" stroke="${accentFill}" stroke-width="2" stroke-linecap="round"/>`;
                }
                break;
            case 'bat':
                const wingSpan = stage === 'adult' ? 0.5 : 0.35;
                svg += `<path d="M ${cx - r * 0.3} ${top + r * 0.1} L ${cx - r * wingSpan} ${top - r * 0.3} L ${cx - r * 0.25} ${top - r * 0.1} L ${cx - r * 0.35} ${top - r * 0.35} L ${cx - r * 0.15} ${top}" fill="${bodyFill}" stroke="#333" stroke-width="0.8"/>`;
                svg += `<path d="M ${cx + r * 0.3} ${top + r * 0.1} L ${cx + r * wingSpan} ${top - r * 0.3} L ${cx + r * 0.25} ${top - r * 0.1} L ${cx + r * 0.35} ${top - r * 0.35} L ${cx + r * 0.15} ${top}" fill="${bodyFill}" stroke="#333" stroke-width="0.8"/>`;
                break;
            case 'antenna':
                svg += `<line x1="${cx - r * 0.1}" y1="${top}" x2="${cx - r * 0.2}" y2="${top - r * 0.4}" stroke="${accentFill}" stroke-width="2" stroke-linecap="round"/>`;
                svg += `<circle cx="${cx - r * 0.2}" cy="${top - r * 0.42}" r="${r * 0.06}" fill="${accentFill}" class="creature-antenna-glow"/>`;
                svg += `<line x1="${cx + r * 0.1}" y1="${top}" x2="${cx + r * 0.2}" y2="${top - r * 0.4}" stroke="${accentFill}" stroke-width="2" stroke-linecap="round"/>`;
                svg += `<circle cx="${cx + r * 0.2}" cy="${top - r * 0.42}" r="${r * 0.06}" fill="${accentFill}" class="creature-antenna-glow"/>`;
                break;
        }
        return svg;
    },

    /* --- Tails --- */
    renderTail(type, cx, cy, s, accentFill, stage, dominantStat) {
        const r = s * 0.32;
        const tailLen = stage === 'adult' ? 1.2 : stage === 'child' ? 1.0 : 0.7;
        let svg = '';
        switch (type) {
            case 'flame':
                svg += `<path d="M ${cx + r * 0.6} ${cy + r * 0.2} Q ${cx + r * (0.7 * tailLen)} ${cy + r * 0.4} ${cx + r * (0.9 * tailLen)} ${cy + r * 0.1} Q ${cx + r * (1.0 * tailLen)} ${cy - r * 0.1} ${cx + r * (0.85 * tailLen)} ${cy - r * 0.15}" fill="${accentFill}" opacity="0.85"/>`;
                break;
            case 'fin':
                svg += `<path d="M ${cx + r * 0.5} ${cy + r * 0.3} Q ${cx + r * (0.8 * tailLen)} ${cy + r * 0.5} ${cx + r * (0.75 * tailLen)} ${cy + r * 0.1}" fill="${accentFill}" opacity="0.7" stroke="${accentFill}" stroke-width="1"/>`;
                break;
            case 'vine':
                svg += `<path d="M ${cx + r * 0.5} ${cy + r * 0.35} Q ${cx + r * 0.7} ${cy + r * 0.6} ${cx + r * (0.6 * tailLen)} ${cy + r * 0.7}" fill="none" stroke="${accentFill}" stroke-width="3" stroke-linecap="round"/>`;
                if (stage !== 'baby') {
                    svg += `<circle cx="${cx + r * (0.6 * tailLen)}" cy="${cy + r * 0.72}" r="${r * 0.05}" fill="${accentFill}"/>`;
                }
                break;
            case 'bolt':
                svg += `<path d="M ${cx + r * 0.5} ${cy + r * 0.2} L ${cx + r * (0.7 * tailLen)} ${cy + r * 0.3} L ${cx + r * (0.6 * tailLen)} ${cy + r * 0.15} L ${cx + r * (0.85 * tailLen)} ${cy + r * 0.2}" fill="none" stroke="${accentFill}" stroke-width="2.5" stroke-linecap="round"/>`;
                break;
            case 'pointed':
                svg += `<path d="M ${cx + r * 0.5} ${cy + r * 0.3} Q ${cx + r * (0.8 * tailLen)} ${cy + r * 0.4} ${cx + r * (0.9 * tailLen)} ${cy + r * 0.05}" fill="${accentFill}" opacity="0.8"/>`;
                break;
            case 'comet':
                svg += `<path d="M ${cx + r * 0.5} ${cy + r * 0.2} Q ${cx + r * 0.7} ${cy + r * 0.35} ${cx + r * (0.9 * tailLen)} ${cy + r * 0.15}" fill="none" stroke="${accentFill}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>`;
                svg += `<circle cx="${cx + r * (0.9 * tailLen)}" cy="${cy + r * 0.15}" r="${r * 0.04}" fill="${accentFill}" class="creature-antenna-glow"/>`;
                break;
        }
        return svg;
    },

    /* --- Wings --- */
    renderWings(type, cx, cy, s, accentFill, stage, dominantStat) {
        if (type === 'none' && dominantStat !== 'fly') return '';
        const r = s * 0.32;
        const wingScale = stage === 'adult' ? 1.3 : stage === 'child' ? 1.0 : 0.6;
        const wt = (type === 'none' && dominantStat === 'fly') ? 'fairy' : type;
        let svg = '';

        switch (wt) {
            case 'bat':
                svg += `<path d="M ${cx - r * 0.5} ${cy - r * 0.1} Q ${cx - r * (0.9 * wingScale)} ${cy - r * 0.6} ${cx - r * (0.7 * wingScale)} ${cy + r * 0.1}" fill="${accentFill}" opacity="0.4" stroke="${accentFill}" stroke-width="0.5"/>`;
                svg += `<path d="M ${cx + r * 0.5} ${cy - r * 0.1} Q ${cx + r * (0.9 * wingScale)} ${cy - r * 0.6} ${cx + r * (0.7 * wingScale)} ${cy + r * 0.1}" fill="${accentFill}" opacity="0.4" stroke="${accentFill}" stroke-width="0.5"/>`;
                break;
            case 'fairy':
                svg += `<ellipse cx="${cx - r * (0.55 * wingScale)}" cy="${cy - r * 0.15}" rx="${r * (0.25 * wingScale)}" ry="${r * (0.4 * wingScale)}" fill="${accentFill}" opacity="0.25" stroke="${accentFill}" stroke-width="0.5" transform="rotate(-15, ${cx - r * 0.55}, ${cy - r * 0.15})"/>`;
                svg += `<ellipse cx="${cx + r * (0.55 * wingScale)}" cy="${cy - r * 0.15}" rx="${r * (0.25 * wingScale)}" ry="${r * (0.4 * wingScale)}" fill="${accentFill}" opacity="0.25" stroke="${accentFill}" stroke-width="0.5" transform="rotate(15, ${cx + r * 0.55}, ${cy - r * 0.15})"/>`;
                break;
        }
        return svg;
    },

    /* --- Feet --- */
    renderFeet(cx, cy, s, shadowFill, stage) {
        const r = s * 0.32;
        const bottom = cy + r * 0.85;
        const footW = r * 0.2;
        return `
      <ellipse cx="${cx - r * 0.2}" cy="${bottom}" rx="${footW}" ry="${footW * 0.45}" fill="${shadowFill}" opacity="0.7"/>
      <ellipse cx="${cx + r * 0.2}" cy="${bottom}" rx="${footW}" ry="${footW * 0.45}" fill="${shadowFill}" opacity="0.7"/>
    `;
    },

    /* --- Patterns --- */
    renderPattern(pattern, cx, cy, s, accentFill, stage) {
        const r = s * 0.32;
        let svg = '';
        switch (pattern) {
            case 'glow':
                svg += `<ellipse cx="${cx - r * 0.1}" cy="${cy + r * 0.1}" rx="${r * 0.25}" ry="${r * 0.2}" fill="${accentFill}" opacity="0.15"/>`;
                break;
            case 'sheen':
                svg += `<ellipse cx="${cx - r * 0.15}" cy="${cy - r * 0.2}" rx="${r * 0.3}" ry="${r * 0.15}" fill="white" opacity="0.12" transform="rotate(-20, ${cx}, ${cy})"/>`;
                break;
            case 'spots':
                svg += `<circle cx="${cx - r * 0.15}" cy="${cy + r * 0.15}" r="${r * 0.06}" fill="${accentFill}" opacity="0.25"/>`;
                svg += `<circle cx="${cx + r * 0.1}" cy="${cy - r * 0.1}" r="${r * 0.05}" fill="${accentFill}" opacity="0.2"/>`;
                svg += `<circle cx="${cx + r * 0.2}" cy="${cy + r * 0.25}" r="${r * 0.04}" fill="${accentFill}" opacity="0.2"/>`;
                break;
            case 'crackle':
                svg += `<path d="M ${cx - r * 0.1} ${cy - r * 0.2} L ${cx} ${cy} L ${cx + r * 0.15} ${cy - r * 0.15}" fill="none" stroke="${accentFill}" stroke-width="1" opacity="0.2"/>`;
                break;
            case 'starry':
                if (stage !== 'baby') {
                    const starPositions = [[-0.15, -0.2], [0.12, 0.15], [-0.2, 0.1]];
                    starPositions.forEach(([dx, dy]) => {
                        svg += `<circle cx="${cx + r * dx}" cy="${cy + r * dy}" r="${r * 0.025}" fill="white" opacity="0.4" class="creature-antenna-glow"/>`;
                    });
                }
                break;
            case 'iridescent':
                svg += `<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.6}" ry="${r * 0.5}" fill="url(#bodyGrad-${cx})" opacity="0.08"/>`;
                break;
        }
        return svg;
    },

    /* --- Equipped Items Rendered ON Creature --- */
    renderEquippedItems(equippedItems, cx, cy, s, stage) {
        const r = s * 0.32;
        let svg = '';
        equippedItems.forEach(itemId => {
            const itemDef = InventoryManager.getItemDef(itemId);
            if (!itemDef || !itemDef.renderData) return;
            const rd = itemDef.renderData;

            switch (rd.slot) {
                case 'head':
                    svg += this.renderHeadItem(rd, cx, cy - r * 1.02, r, stage);
                    break;
                case 'face':
                    svg += this.renderFaceItem(rd, cx, cy - r * 0.15, r, stage);
                    break;
                case 'neck':
                    svg += this.renderNeckItem(rd, cx, cy + r * 0.35, r, stage);
                    break;
                case 'back':
                    svg += this.renderBackItem(rd, cx, cy, r, stage);
                    break;
            }
        });
        return svg;
    },

    renderHeadItem(rd, cx, ty, r, stage) {
        const color = rd.color || '#FF69B4';
        const accent = rd.accent || '#FFD700';
        switch (rd.type) {
            case 'bow':
                return `<g transform="translate(${cx}, ${ty})">
          <path d="M -${r * 0.2} 0 Q -${r * 0.12} -${r * 0.15} 0 0 Q ${r * 0.12} -${r * 0.15} ${r * 0.2} 0" fill="${color}" stroke="${accent}" stroke-width="1"/>
          <circle cx="0" cy="0" r="${r * 0.04}" fill="${accent}"/>
        </g>`;
            case 'crown':
                return `<g transform="translate(${cx}, ${ty})">
          <path d="M -${r * 0.22} ${r * 0.05} L -${r * 0.18} -${r * 0.12} L -${r * 0.08} 0 L 0 -${r * 0.18} L ${r * 0.08} 0 L ${r * 0.18} -${r * 0.12} L ${r * 0.22} ${r * 0.05} Z" fill="${color}" stroke="${accent}" stroke-width="1"/>
          <circle cx="0" cy="-${r * 0.12}" r="${r * 0.025}" fill="${accent}"/>
        </g>`;
            case 'flower':
                return `<g transform="translate(${cx}, ${ty})">
          ${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-${r * 0.06}" rx="${r * 0.04}" ry="${r * 0.08}" fill="${color}" transform="rotate(${a})" opacity="0.85"/>`).join('')}
          <circle cx="0" cy="0" r="${r * 0.04}" fill="${accent}"/>
        </g>`;
            case 'tophat':
                return `<g transform="translate(${cx}, ${ty})">
          <rect x="-${r * 0.12}" y="-${r * 0.22}" width="${r * 0.24}" height="${r * 0.2}" rx="2" fill="${color}" stroke="${accent}" stroke-width="1"/>
          <rect x="-${r * 0.18}" y="-${r * 0.04}" width="${r * 0.36}" height="${r * 0.05}" rx="2" fill="${color}" stroke="${accent}" stroke-width="1"/>
        </g>`;
            default:
                return '';
        }
    },

    renderFaceItem(rd, cx, ey, r, stage) {
        const color = rd.color || '#333';
        switch (rd.type) {
            case 'glasses_round':
                return `<g>
          <circle cx="${cx - r * 0.35}" cy="${ey}" r="${r * 0.14}" fill="none" stroke="${color}" stroke-width="2"/>
          <circle cx="${cx + r * 0.35}" cy="${ey}" r="${r * 0.14}" fill="none" stroke="${color}" stroke-width="2"/>
          <line x1="${cx - r * 0.21}" y1="${ey}" x2="${cx + r * 0.21}" y2="${ey}" stroke="${color}" stroke-width="1.5"/>
        </g>`;
            case 'glasses_star':
                return `<g>
          ${this.miniStar(cx - r * 0.35, ey, r * 0.14, color)}
          ${this.miniStar(cx + r * 0.35, ey, r * 0.14, color)}
          <line x1="${cx - r * 0.21}" y1="${ey}" x2="${cx + r * 0.21}" y2="${ey}" stroke="${color}" stroke-width="1.5"/>
        </g>`;
            default:
                return '';
        }
    },

    renderNeckItem(rd, cx, ny, r, stage) {
        const color = rd.color || '#FF0000';
        switch (rd.type) {
            case 'scarf':
                return `<path d="M ${cx - r * 0.35} ${ny} Q ${cx} ${ny + r * 0.12} ${cx + r * 0.35} ${ny}" fill="none" stroke="${color}" stroke-width="${r * 0.08}" stroke-linecap="round" opacity="0.8"/>`;
            case 'pendant':
                return `<g>
          <path d="M ${cx - r * 0.15} ${ny - r * 0.05} Q ${cx} ${ny + r * 0.08} ${cx + r * 0.15} ${ny - r * 0.05}" fill="none" stroke="${color}" stroke-width="1"/>
          <circle cx="${cx}" cy="${ny + r * 0.1}" r="${r * 0.04}" fill="${rd.accent || '#FFD700'}"/>
        </g>`;
            default:
                return '';
        }
    },

    renderBackItem(rd, cx, cy, r, stage) {
        const color = rd.color || '#FFFFFF';
        switch (rd.type) {
            case 'cape':
                return `<path d="M ${cx - r * 0.3} ${cy - r * 0.3} Q ${cx - r * 0.5} ${cy + r * 0.3} ${cx - r * 0.35} ${cy + r * 0.7} L ${cx + r * 0.35} ${cy + r * 0.7} Q ${cx + r * 0.5} ${cy + r * 0.3} ${cx + r * 0.3} ${cy - r * 0.3}" fill="${color}" opacity="0.5"/>`;
            case 'angel_wings':
                return `<g opacity="0.6">
          <ellipse cx="${cx - r * 0.65}" cy="${cy - r * 0.1}" rx="${r * 0.3}" ry="${r * 0.5}" fill="${color}" transform="rotate(-15, ${cx - r * 0.65}, ${cy - r * 0.1})"/>
          <ellipse cx="${cx + r * 0.65}" cy="${cy - r * 0.1}" rx="${r * 0.3}" ry="${r * 0.5}" fill="${color}" transform="rotate(15, ${cx + r * 0.65}, ${cy - r * 0.1})"/>
        </g>`;
            default:
                return '';
        }
    },

    miniStar(cx, cy, r, color) {
        const pts = [];
        for (let i = 0; i < 10; i++) {
            const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
            const rad = i % 2 === 0 ? r : r * 0.5;
            pts.push(`${cx + Math.cos(a) * rad},${cy + Math.sin(a) * rad}`);
        }
        return `<polygon points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
    },

    /* --- Evolution Progress Indicator --- */
    renderEvolutionIndicator(cx, size, pet) {
        const thresholds = { baby: 50, child: 200 };
        const current = pet.statExp || 0;
        const stage = pet.evolutionStage || 'baby';
        if (stage === 'adult') return '';
        const target = thresholds[stage] || 200;
        const pct = Math.min(1, current / target);
        const barW = size * 0.6;
        const barH = 6;
        const barX = cx - barW / 2;
        const barY = size - 18;
        return `
      <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="3" fill="rgba(0,0,0,0.2)"/>
      <rect x="${barX}" y="${barY}" width="${barW * pct}" height="${barH}" rx="3" fill="#FFD700"/>
      <text x="${cx}" y="${barY - 3}" text-anchor="middle" font-size="7" fill="#999" font-family="'Press Start 2P', monospace">${Math.round(pct * 100)}% → ${stage === 'baby' ? 'Child' : 'Adult'}</text>
    `;
    },

    /* --- Helper: Dominant stat --- */
    getDominantStat(pet) {
        if (!pet || !pet.stats) return 'normal';
        const s = pet.stats;
        const max = Math.max(s.swim, s.fly, s.run, s.power);
        if (max < 10) return 'normal';
        if (s.swim === max) return 'swim';
        if (s.fly === max) return 'fly';
        if (s.run === max) return 'run';
        if (s.power === max) return 'power';
        return 'normal';
    },

    /* --- Helper: Adjust color for alignment --- */
    adjustColorForAlignment(baseHSL, alignment) {
        // alignment: -100 (dark) to +100 (hero)
        const a = alignment / 100;
        return {
            h: baseHSL.h + a * 10,
            s: baseHSL.s + a * 5,
            l: baseHSL.l + a * 15, // Hero = brighter, Dark = darker
        };
    },

    /* --- Helper: Stat aura color --- */
    getStatAuraColor(stat) {
        const colors = {
            swim: 'rgba(255,220,50,0.3)',    // Yellow
            fly: 'rgba(180,50,255,0.3)',      // Purple
            run: 'rgba(50,200,50,0.3)',       // Green
            power: 'rgba(255,50,50,0.3)',     // Red
            normal: 'rgba(200,200,200,0.15)', // Gray
        };
        return colors[stat] || colors.normal;
    },

    /* --- Render stat radar chart (pentagon) --- */
    renderRadarChart(pet, size = 160) {
        if (!pet || !pet.stats) return '';
        const s = pet.stats;
        const cx = size / 2, cy = size / 2;
        const maxVal = 200; // Reasonable visual max
        const labels = ['Swim', 'Fly', 'Run', 'Power', 'Stamina'];
        const values = [s.swim, s.fly, s.run, s.power, s.stamina];
        const colors = ['#FFD700', '#9B30FF', '#32CD32', '#FF4444', '#00BFFF'];
        const r = size * 0.38;

        let svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;

        // Background pentagons
        for (let ring = 5; ring >= 1; ring--) {
            const ringR = r * (ring / 5);
            const pts = labels.map((_, i) => {
                const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
                return `${cx + Math.cos(a) * ringR},${cy + Math.sin(a) * ringR}`;
            }).join(' ');
            svg += `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>`;
        }

        // Axis lines
        labels.forEach((_, i) => {
            const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
            svg += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a) * r}" y2="${cy + Math.sin(a) * r}" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>`;
        });

        // Stat polygon
        const statPts = values.map((v, i) => {
            const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const vr = r * Math.min(1, v / maxVal);
            return `${cx + Math.cos(a) * vr},${cy + Math.sin(a) * vr}`;
        }).join(' ');
        svg += `<polygon points="${statPts}" fill="rgba(255,105,180,0.3)" stroke="#FF69B4" stroke-width="2"/>`;

        // Stat dots + labels
        values.forEach((v, i) => {
            const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const vr = r * Math.min(1, v / maxVal);
            const dx = cx + Math.cos(a) * vr;
            const dy = cy + Math.sin(a) * vr;
            svg += `<circle cx="${dx}" cy="${dy}" r="3" fill="${colors[i]}"/>`;

            // Label
            const lx = cx + Math.cos(a) * (r + 14);
            const ly = cy + Math.sin(a) * (r + 14);
            svg += `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="8" fill="${colors[i]}" font-family="'Press Start 2P', monospace">${labels[i]}</text>`;
            svg += `<text x="${lx}" y="${ly + 10}" text-anchor="middle" font-size="7" fill="rgba(255,255,255,0.6)" font-family="monospace">${v}</text>`;
        });

        svg += `</svg>`;
        return svg;
    }
};
