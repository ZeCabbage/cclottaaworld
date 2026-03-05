/* ============================================
   Voxel Characters — Low-Poly Anime Character Builder
   Hinata / Y2K inspired · Big eyes · Chunky shoes
   Flowing hair · Anime proportions
   ============================================ */

const VoxelCreatures = {

    /* ---- Build an anime-style humanoid from appearance data ---- */
    build(character, options = {}) {
        if (!character) return new THREE.Group();

        const skinHex = GameState.getSkinHex(character.skinTone);
        const hairHex = GameState.getHairHex(character.hairColor);
        const eyeHex = GameState.getEyeHex(character.eyeColor);
        const outfit = GameState.getOutfit(character.outfit);
        const hairStyle = character.hairStyle || 'short';
        const shoeStyle = character.shoeStyle || 'platform';
        const bottomType = character.bottomType || 'pants';
        const lashStyle = character.lashStyle || 'natural';
        const expression = character.expression || 'neutral';
        const hasBlush = character.blush || false;

        const scale = options.scale || 1;
        const group = new THREE.Group();

        const skinColor = new THREE.Color(skinHex);
        const hairColor = new THREE.Color(hairHex);
        const eyeColor = new THREE.Color(eyeHex);
        const torsoColor = new THREE.Color(outfit.torsoColor);
        const legColor = new THREE.Color(outfit.legColor);
        const accentColor = new THREE.Color(outfit.accentColor || outfit.torsoColor);

        const mat = (color, opts) => new THREE.MeshStandardMaterial({
            color, roughness: 0.65, metalness: 0.05, flatShading: true, ...opts
        });

        // =============================================
        //  ANIME PROPORTIONS (Hinata / Y2K style)
        //  Total height ~5.5 units
        //  Head: 1.4 units (big but not chibi-huge)
        //  Torso: 1.2 units (slim, short)
        //  Legs: 2.0 units (LONG — signature anime look)
        //  Shoes: 0.7 units (chunky platform boots)
        // =============================================

        // --- HEAD (smaller, anime-shaped) ---
        const headGeo = new THREE.SphereGeometry(0.55, 8, 7);
        const head = new THREE.Mesh(headGeo, mat(skinColor));
        head.position.y = 4.55;
        head.scale.set(1.0, 0.95, 0.85); // slightly flattened front-to-back
        group.add(head);

        // --- ANIME EYES ---
        this._buildAnimeEyes(group, eyeColor, lashStyle, expression);

        // --- MOUTH ---
        const mouthMat = new THREE.MeshBasicMaterial({ color: 0x994444 });
        const mouthW = expression === 'happy' ? 0.15 : expression === 'sleepy' ? 0.08 : 0.12;
        const mouth = new THREE.Mesh(new THREE.PlaneGeometry(mouthW, 0.03), mouthMat);
        mouth.position.set(0, 4.22, 0.48);
        group.add(mouth);

        // --- NOSE (subtle bump) ---
        const noseMat = mat(skinColor.clone().multiplyScalar(0.9));
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.035, 4, 3), noseMat);
        nose.position.set(0, 4.31, 0.5);
        group.add(nose);

        // --- CHEEK BLUSH (conditional) ---
        if (hasBlush) {
            const blushMat = new THREE.MeshBasicMaterial({ color: 0xFF9999, transparent: true, opacity: 0.22 });
            [-0.3, 0.3].forEach(x => {
                const blush = new THREE.Mesh(new THREE.CircleGeometry(0.08, 6), blushMat);
                blush.position.set(x, 4.25, 0.45);
                blush.lookAt(blush.position.clone().add(new THREE.Vector3(x > 0 ? 0.3 : -0.3, 0, 1)));
                group.add(blush);
            });
        }

        // --- HAIR ---
        this.buildHair(group, hairStyle, hairColor, mat);

        // --- NECK ---
        const neckGeo = new THREE.CylinderGeometry(0.13, 0.16, 0.25, 6);
        const neck = new THREE.Mesh(neckGeo, mat(skinColor));
        neck.position.y = 3.85;
        group.add(neck);

        // --- TORSO (slim, layered clothing look) ---
        // Under-layer (shirt)
        const shirtGeo = new THREE.BoxGeometry(0.85, 1.0, 0.5);
        const shirt = new THREE.Mesh(shirtGeo, mat(accentColor));
        shirt.position.y = 3.2;
        group.add(shirt);

        // Over-layer (jacket / top — slightly bigger)
        const jacketGeo = new THREE.BoxGeometry(0.95, 0.85, 0.55);
        const jacket = new THREE.Mesh(jacketGeo, mat(torsoColor));
        jacket.position.y = 3.25;
        group.add(jacket);

        // Collar detail
        const collarGeo = new THREE.BoxGeometry(0.6, 0.12, 0.35);
        const collar = new THREE.Mesh(collarGeo, mat(torsoColor.clone().multiplyScalar(0.85)));
        collar.position.set(0, 3.7, 0.1);
        group.add(collar);

        // --- ARMS (slim, with sleeves) ---
        [-0.6, 0.6].forEach(x => {
            // Sleeve (jacket color)
            const sleeveGeo = new THREE.BoxGeometry(0.22, 0.55, 0.22);
            const sleeve = new THREE.Mesh(sleeveGeo, mat(torsoColor));
            sleeve.position.set(x, 3.3, 0);
            group.add(sleeve);

            // Forearm (skin)
            const forearmGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.4, 5);
            const forearm = new THREE.Mesh(forearmGeo, mat(skinColor));
            forearm.position.set(x, 2.85, 0);
            group.add(forearm);

            // Hand (round)
            const handGeo = new THREE.SphereGeometry(0.1, 5, 4);
            const hand = new THREE.Mesh(handGeo, mat(skinColor));
            hand.position.set(x, 2.6, 0);
            group.add(hand);
        });

        // --- BELT / WAIST DETAIL ---
        const beltGeo = new THREE.BoxGeometry(0.9, 0.1, 0.52);
        const beltMat = mat(new THREE.Color(0x443322), { metalness: 0.3 });
        const belt = new THREE.Mesh(beltGeo, beltMat);
        belt.position.y = 2.7;
        group.add(belt);
        // Belt buckle
        const buckle = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.08, 0.06),
            mat(new THREE.Color(0xCCAA44), { metalness: 0.6 })
        );
        buckle.position.set(0, 2.7, 0.28);
        group.add(buckle);

        // --- LEGS (varied by bottomType) ---
        const stockingColor = outfit.stockingColor ? new THREE.Color(outfit.stockingColor) : null;
        this._buildLegs(group, bottomType, legColor, skinColor, stockingColor, mat);

        // --- SHOES (CHUNKY PLATFORM BOOTS — the key element) ---
        this._buildShoes(group, shoeStyle, accentColor);

        // --- EQUIPPED ITEMS ---
        const items = options.equippedItems || character.equippedItems || [];
        if (items.length > 0) {
            this.buildEquipment(group, items);
        }

        group.scale.set(scale, scale, scale);
        group.userData.isCharacter = true;
        return group;
    },

    /* ---- Anime Eyes with Lash & Expression variants ---- */
    _buildAnimeEyes(group, eyeColor, lashStyle = 'natural', expression = 'neutral') {
        // Adjust eye shape based on expression
        let eyeScaleY = 0.8;
        let eyeOffsetY = 0;
        if (expression === 'happy') { eyeScaleY = 0.5; eyeOffsetY = 0.02; }
        else if (expression === 'fierce') { eyeScaleY = 0.65; eyeOffsetY = -0.01; }
        else if (expression === 'sleepy') { eyeScaleY = 0.45; eyeOffsetY = -0.02; }

        [-0.18, 0.18].forEach((x, idx) => {
            // Eye white (oval)
            const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const whiteGeo = new THREE.SphereGeometry(0.16, 7, 6);
            const eyeWhite = new THREE.Mesh(whiteGeo, whiteMat);
            eyeWhite.position.set(x, 4.42 + eyeOffsetY, 0.42);
            eyeWhite.scale.set(0.65, eyeScaleY, 0.25);
            group.add(eyeWhite);

            // Iris (colored)
            const irisMat = new THREE.MeshBasicMaterial({ color: eyeColor });
            const irisGeo = new THREE.SphereGeometry(0.11, 6, 5);
            const iris = new THREE.Mesh(irisGeo, irisMat);
            iris.position.set(x, 4.4 + eyeOffsetY, 0.47);
            iris.scale.set(0.7, eyeScaleY, 0.3);
            group.add(iris);

            // Pupil (dark center)
            const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111122 });
            const pupilGeo = new THREE.SphereGeometry(0.06, 5, 4);
            const pupil = new THREE.Mesh(pupilGeo, pupilMat);
            pupil.position.set(x, 4.39 + eyeOffsetY, 0.5);
            pupil.scale.set(0.7, eyeScaleY, 0.3);
            group.add(pupil);

            // Main sparkle
            const sparkleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const sparkle1 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 4, 3), sparkleMat);
            sparkle1.position.set(x + 0.04, 4.45 + eyeOffsetY, 0.52);
            group.add(sparkle1);

            // Secondary sparkle
            const sparkle2 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 3, 3), sparkleMat);
            sparkle2.position.set(x - 0.03, 4.37 + eyeOffsetY, 0.52);
            group.add(sparkle2);

            // Eyelash / lid line — varies by lash style
            let lidColor = 0x332233;
            let lidH = 0.02;
            let lidW = 0.13;
            let lidExtend = 0;
            if (lashStyle === 'long') { lidH = 0.025; lidW = 0.16; lidExtend = 0.04; }
            else if (lashStyle === 'dark') { lidColor = 0x111111; lidH = 0.03; lidW = 0.15; }
            else if (lashStyle === 'brown') { lidColor = 0x5C3317; lidH = 0.025; lidW = 0.14; }

            const lidMat = new THREE.MeshBasicMaterial({ color: lidColor });
            const lid = new THREE.Mesh(new THREE.BoxGeometry(lidW, lidH, 0.04), lidMat);
            lid.position.set(x, 4.48 + eyeOffsetY, 0.47);
            group.add(lid);

            // Extended lash tips for 'long' style
            if (lashStyle === 'long') {
                const lashTip = new THREE.Mesh(
                    new THREE.BoxGeometry(0.02, 0.04, 0.03),
                    lidMat
                );
                lashTip.position.set(x + (idx === 0 ? -0.08 : 0.08), 4.5 + eyeOffsetY, 0.47);
                lashTip.rotation.z = idx === 0 ? 0.3 : -0.3;
                group.add(lashTip);
            }
        });
    },

    /* ---- Chunky Platform Shoes ---- */
    _buildShoes(group, style, accentColor) {
        const bootColor = new THREE.Color(0xeeeeee);
        const soleColor = new THREE.Color(0x444444);
        const accentCol = accentColor || new THREE.Color(0xFF69B4);

        const mat = (color, opts) => new THREE.MeshStandardMaterial({
            color, roughness: 0.6, metalness: 0.1, flatShading: true, ...opts
        });

        [-0.18, 0.18].forEach(x => {
            switch (style) {
                case 'platform':
                default: {
                    // Thick platform sole (the chunky signature)
                    const soleGeo = new THREE.BoxGeometry(0.32, 0.35, 0.45);
                    const sole = new THREE.Mesh(soleGeo, mat(soleColor));
                    sole.position.set(x, 0.18, 0.04);
                    group.add(sole);

                    // Boot upper
                    const bootGeo = new THREE.BoxGeometry(0.26, 0.45, 0.32);
                    const boot = new THREE.Mesh(bootGeo, mat(bootColor));
                    boot.position.set(x, 0.6, 0);
                    group.add(boot);

                    // Color accent band
                    const bandGeo = new THREE.BoxGeometry(0.28, 0.08, 0.34);
                    const band = new THREE.Mesh(bandGeo, mat(accentCol));
                    band.position.set(x, 0.5, 0);
                    group.add(band);

                    // Toe cap
                    const toeGeo = new THREE.BoxGeometry(0.24, 0.18, 0.12);
                    const toe = new THREE.Mesh(toeGeo, mat(bootColor.clone().multiplyScalar(0.9)));
                    toe.position.set(x, 0.28, 0.2);
                    group.add(toe);
                    break;
                }
                case 'sneakers': {
                    const soleMat = mat(new THREE.Color(0xdddddd));
                    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.4), soleMat);
                    sole.position.set(x, 0.1, 0.03);
                    group.add(sole);

                    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.3, 0.3), mat(accentCol));
                    upper.position.set(x, 0.35, 0);
                    group.add(upper);

                    // Stripe
                    const stripe = new THREE.Mesh(
                        new THREE.BoxGeometry(0.02, 0.2, 0.32),
                        mat(new THREE.Color(0xffffff))
                    );
                    stripe.position.set(x + (x > 0 ? 0.13 : -0.13), 0.3, 0);
                    group.add(stripe);
                    break;
                }
                case 'chunky_sandals': {
                    // Thick sole
                    const sole = new THREE.Mesh(
                        new THREE.BoxGeometry(0.3, 0.3, 0.42),
                        mat(new THREE.Color(0x8B6914))
                    );
                    sole.position.set(x, 0.15, 0.03);
                    group.add(sole);

                    // Strap
                    const strap = new THREE.Mesh(
                        new THREE.BoxGeometry(0.28, 0.06, 0.08),
                        mat(accentCol)
                    );
                    strap.position.set(x, 0.35, 0.1);
                    group.add(strap);
                    const strap2 = new THREE.Mesh(
                        new THREE.BoxGeometry(0.28, 0.06, 0.08),
                        mat(accentCol)
                    );
                    strap2.position.set(x, 0.35, -0.1);
                    group.add(strap2);
                    break;
                }
            }
        });
    },

    /* ---- Build legs based on bottom type ---- */
    _buildLegs(group, bottomType, legColor, skinColor, stockingColor, mat) {
        const lowerColor = stockingColor || skinColor;

        switch (bottomType) {
            case 'long_skirt': {
                // Long skirt (covers both legs as a cylinder)
                const skirt = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.32, 0.42, 1.5, 8),
                    mat(legColor)
                );
                skirt.position.y = 1.95;
                group.add(skirt);
                // Ankles peeking
                [-0.15, 0.15].forEach(x => {
                    const ankle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.3, 5), mat(lowerColor));
                    ankle.position.set(x, 1.0, 0);
                    group.add(ankle);
                });
                break;
            }
            case 'mini_skirt': {
                // Short flared skirt
                const skirt = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.28, 0.4, 0.5, 8),
                    mat(legColor)
                );
                skirt.position.y = 2.4;
                group.add(skirt);
                // Exposed legs
                [-0.18, 0.18].forEach(x => {
                    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.5, 0.24), mat(lowerColor));
                    leg.position.set(x, 1.4, 0);
                    group.add(leg);
                });
                break;
            }
            case 'mini_shorts': {
                // Very short shorts
                [-0.18, 0.18].forEach(x => {
                    const short = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.35, 0.3), mat(legColor));
                    short.position.set(x, 2.45, 0);
                    group.add(short);
                    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.3, 0.24), mat(lowerColor));
                    leg.position.set(x, 1.5, 0);
                    group.add(leg);
                });
                break;
            }
            case 'jorts': {
                // Mid-thigh denim-look shorts
                [-0.18, 0.18].forEach(x => {
                    const jort = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.6, 0.3), mat(legColor));
                    jort.position.set(x, 2.32, 0);
                    group.add(jort);
                    // Frayed edge
                    const fray = new THREE.Mesh(
                        new THREE.BoxGeometry(0.29, 0.04, 0.31),
                        mat(legColor.clone().multiplyScalar(1.2), { roughness: 1 })
                    );
                    fray.position.set(x, 2.0, 0);
                    group.add(fray);
                    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.1, 0.24), mat(lowerColor));
                    leg.position.set(x, 1.35, 0);
                    group.add(leg);
                });
                break;
            }
            case 'culottes': {
                // Wide-leg cropped pants
                [-0.18, 0.18].forEach(x => {
                    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.9, 0.32), mat(legColor));
                    upper.position.set(x, 2.15, 0);
                    group.add(upper);
                    // Wide flare
                    const wide = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.5, 0.35), mat(legColor));
                    wide.position.set(x, 1.5, 0);
                    group.add(wide);
                    // Exposed ankle
                    const ankle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.35, 5), mat(lowerColor));
                    ankle.position.set(x, 1.1, 0);
                    group.add(ankle);
                });
                break;
            }
            case 'overalls': {
                // Full-length legs with bib straps
                [-0.18, 0.18].forEach(x => {
                    const upperLeg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 0.28), mat(legColor));
                    upperLeg.position.set(x, 2.1, 0);
                    group.add(upperLeg);
                    const lowerLeg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.8, 0.26), mat(legColor));
                    lowerLeg.position.set(x, 1.25, 0);
                    group.add(lowerLeg);
                });
                // Bib (front panel on torso)
                const bib = new THREE.Mesh(
                    new THREE.PlaneGeometry(0.5, 0.6),
                    mat(legColor)
                );
                bib.position.set(0, 3.3, 0.28);
                group.add(bib);
                // Straps
                const strapMat = mat(legColor.clone().multiplyScalar(0.85));
                [-0.2, 0.2].forEach(x => {
                    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 0.04), strapMat);
                    strap.position.set(x, 3.5, 0.15);
                    group.add(strap);
                });
                break;
            }
            case 'pants':
            default: {
                // Standard full-length pants
                [-0.18, 0.18].forEach(x => {
                    const upperLeg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 0.28), mat(legColor));
                    upperLeg.position.set(x, 2.1, 0);
                    group.add(upperLeg);
                    const lowerLeg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.8, 0.24), mat(lowerColor));
                    lowerLeg.position.set(x, 1.25, 0);
                    group.add(lowerLeg);
                });
                break;
            }
        }
    },

    /* ---- Build 3D equipment meshes ---- */
    buildEquipment(group, equippedItems) {
        if (!equippedItems || !equippedItems.length) return;

        equippedItems.forEach(itemId => {
            const def = typeof InventoryManager !== 'undefined' ? InventoryManager.getItemDef(itemId) : null;
            if (!def || !def.renderData) return;
            const rd = def.renderData;
            const color = rd.color || '#FF69B4';
            const accent = rd.accent || '#FFD700';

            switch (rd.slot) {
                case 'head': this._buildHeadItem(group, rd.type, color, accent); break;
                case 'face': this._buildFaceItem(group, rd.type, color); break;
                case 'neck': this._buildNeckItem(group, rd.type, color, accent); break;
                case 'back': this._buildBackItem(group, rd.type, color); break;
            }
        });
    },

    _buildHeadItem(group, type, color, accent) {
        const mat = (c, opts) => new THREE.MeshStandardMaterial({
            color: new THREE.Color(c), roughness: 0.3, metalness: 0.4, flatShading: true, ...opts
        });

        switch (type) {
            case 'crown': {
                const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), mat(accent, { metalness: 0.6 }));
                base.position.y = 5.4;
                base.userData.isEquipment = true;
                group.add(base);
                [[-0.25, 0], [0, 0.1], [0.25, 0], [0, -0.25]].forEach(([px, pz]) => {
                    const pt = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.1), mat(accent, { metalness: 0.6 }));
                    pt.position.set(px, 5.55, pz);
                    pt.userData.isEquipment = true;
                    group.add(pt);
                });
                break;
            }
            case 'tophat': {
                const brim = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.9), mat(color));
                brim.position.y = 5.3;
                brim.userData.isEquipment = true;
                group.add(brim);
                const top = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.5), mat(color));
                top.position.y = 5.55;
                top.userData.isEquipment = true;
                group.add(top);
                break;
            }
            case 'bow': {
                const bowMat = mat(color, { emissive: new THREE.Color(color), emissiveIntensity: 0.15 });
                const center = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), bowMat);
                center.position.set(0.4, 5.1, 0.2);
                center.userData.isEquipment = true;
                group.add(center);
                [-0.12, 0.12].forEach(dx => {
                    const loop = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.08), bowMat);
                    loop.position.set(0.4 + dx, 5.15, 0.2);
                    loop.userData.isEquipment = true;
                    group.add(loop);
                });
                break;
            }
            case 'flower': {
                const petalMat = mat(color, { emissive: new THREE.Color(color), emissiveIntensity: 0.2 });
                for (let i = 0; i < 5; i++) {
                    const angle = (i / 5) * Math.PI * 2;
                    const petal = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), petalMat);
                    petal.position.set(
                        Math.cos(angle) * 0.15 + 0.5,
                        5.2,
                        Math.sin(angle) * 0.15
                    );
                    petal.userData.isEquipment = true;
                    group.add(petal);
                }
                break;
            }
            case 'goggles': {
                // Goggles sitting on top of head (like the Blender reference)
                const strapMat = mat(color);
                const strap = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.1, 0.1), strapMat);
                strap.position.set(0, 5.15, 0.2);
                strap.userData.isEquipment = true;
                group.add(strap);
                [-0.24, 0.24].forEach(px => {
                    const lens = new THREE.Mesh(
                        new THREE.SphereGeometry(0.12, 6, 5),
                        new THREE.MeshStandardMaterial({
                            color: 0x88bbff, transparent: true, opacity: 0.4,
                            metalness: 0.8, roughness: 0.1
                        })
                    );
                    lens.position.set(px, 5.15, 0.3);
                    lens.scale.set(1, 1, 0.5);
                    lens.userData.isEquipment = true;
                    group.add(lens);
                    const rim = new THREE.Mesh(
                        new THREE.BoxGeometry(0.28, 0.18, 0.05),
                        strapMat
                    );
                    rim.position.set(px, 5.15, 0.32);
                    rim.userData.isEquipment = true;
                    group.add(rim);
                });
                break;
            }
        }
    },

    _buildFaceItem(group, type, color) {
        const frameMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color), roughness: 0.3, metalness: 0.5, flatShading: true
        });
        const lensMat = new THREE.MeshStandardMaterial({
            color: 0x88aacc, transparent: true, opacity: 0.3, roughness: 0.1, metalness: 0.8
        });

        switch (type) {
            case 'glasses_round': {
                [-0.24, 0.24].forEach(px => {
                    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.04), frameMat);
                    frame.position.set(px, 4.52, 0.72);
                    frame.userData.isEquipment = true;
                    group.add(frame);
                    const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.12), lensMat);
                    lens.position.set(px, 4.52, 0.73);
                    lens.userData.isEquipment = true;
                    group.add(lens);
                });
                const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.03), frameMat);
                bridge.position.set(0, 4.55, 0.72);
                bridge.userData.isEquipment = true;
                group.add(bridge);
                break;
            }
            case 'glasses_star': {
                const starMat = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(color),
                    emissive: new THREE.Color(color),
                    emissiveIntensity: 0.3,
                    flatShading: true
                });
                [-0.24, 0.24].forEach(px => {
                    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.04), starMat);
                    frame.position.set(px, 4.52, 0.72);
                    frame.rotation.z = Math.PI / 4;
                    frame.userData.isEquipment = true;
                    group.add(frame);
                });
                break;
            }
        }
    },

    _buildNeckItem(group, type, color, accent) {
        switch (type) {
            case 'scarf': {
                const scarfMat = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(color), roughness: 0.9, flatShading: true
                });
                const wrap = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.5), scarfMat);
                wrap.position.set(0, 3.72, 0);
                wrap.userData.isEquipment = true;
                group.add(wrap);
                const tail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.08), scarfMat);
                tail.position.set(0.2, 3.45, 0.28);
                tail.rotation.z = -0.2;
                tail.userData.isEquipment = true;
                group.add(tail);
                break;
            }
            case 'pendant': {
                const chainMat = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(accent || '#FFD700'),
                    emissive: new THREE.Color(accent || '#FFD700'),
                    emissiveIntensity: 0.3,
                    metalness: 0.7, flatShading: true
                });
                const chain = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.03, 0.03), chainMat);
                chain.position.set(0, 3.72, 0.28);
                chain.userData.isEquipment = true;
                group.add(chain);
                const gem = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.05), chainMat);
                gem.position.set(0, 3.55, 0.3);
                gem.rotation.z = Math.PI / 4;
                gem.userData.isEquipment = true;
                group.add(gem);
                break;
            }
            case 'beads': {
                // Colorful beads necklace (like the Hinata reference)
                const colors = [0xFF6B9D, 0x4FC3F7, 0xFFEB3B, 0x66BB6A, 0xCE93D8];
                for (let i = 0; i < 5; i++) {
                    const bead = new THREE.Mesh(
                        new THREE.SphereGeometry(0.06, 5, 4),
                        new THREE.MeshStandardMaterial({ color: colors[i], flatShading: true })
                    );
                    const angle = -0.5 + (i / 4) * 1.0;
                    bead.position.set(Math.sin(angle) * 0.3, 3.6, 0.28 + Math.cos(angle) * 0.04);
                    bead.userData.isEquipment = true;
                    group.add(bead);
                }
                break;
            }
        }
    },

    _buildBackItem(group, type, color) {
        switch (type) {
            case 'cape': {
                const capeMat = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(color),
                    emissive: new THREE.Color(color),
                    emissiveIntensity: 0.1,
                    roughness: 0.7, side: THREE.DoubleSide, flatShading: true
                });
                const cape = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.6, 0.05), capeMat);
                cape.position.set(0, 2.8, -0.32);
                cape.userData.isEquipment = true;
                group.add(cape);
                break;
            }
            case 'angel_wings': {
                const wingMat = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    emissive: 0xaaddff,
                    emissiveIntensity: 0.3,
                    transparent: true, opacity: 0.85, flatShading: true
                });
                [-1, 1].forEach(side => {
                    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.85, 0.05), wingMat);
                    wing.position.set(side * 0.6, 3.5, -0.3);
                    wing.rotation.y = side * 0.3;
                    wing.userData.isEquipment = true;
                    group.add(wing);
                    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.5, 0.04), wingMat);
                    tip.position.set(side * 0.85, 3.8, -0.35);
                    tip.rotation.y = side * 0.5;
                    tip.rotation.z = side * -0.2;
                    tip.userData.isEquipment = true;
                    group.add(tip);
                });
                break;
            }
            case 'backpack': {
                const bpMat = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(color), roughness: 0.8, flatShading: true
                });
                const pack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.25), bpMat);
                pack.position.set(0, 3.2, -0.4);
                pack.userData.isEquipment = true;
                group.add(pack);
                // Straps
                [-0.15, 0.15].forEach(sx => {
                    const strap = new THREE.Mesh(
                        new THREE.BoxGeometry(0.06, 0.8, 0.03),
                        new THREE.MeshStandardMaterial({ color: 0x443322, flatShading: true })
                    );
                    strap.position.set(sx, 3.3, -0.25);
                    strap.userData.isEquipment = true;
                    group.add(strap);
                });
                break;
            }
        }
    },

    /* ---- Remove and rebuild equipment ---- */
    refreshEquipment(group, equippedItems) {
        if (!group) return;
        const toRemove = [];
        group.traverse(child => {
            if (child.userData && child.userData.isEquipment) toRemove.push(child);
        });
        toRemove.forEach(mesh => {
            group.remove(mesh);
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
                if (Array.isArray(mesh.material)) mesh.material.forEach(m => m.dispose());
                else mesh.material.dispose();
            }
        });
        this.buildEquipment(group, equippedItems);
    },

    /* ---- Hair Styles (anime-proportioned, on larger head) ---- */
    buildHair(group, style, hairColor, matFn) {
        const hMat = matFn(hairColor);
        const darkHair = matFn(hairColor.clone().multiplyScalar(0.7));

        // Head center ~4.65, top ~5.35
        switch (style) {
            case 'short': {
                // Top dome
                const top = new THREE.Mesh(new THREE.SphereGeometry(0.78, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.45), hMat);
                top.position.set(0, 4.55, 0);
                group.add(top);
                // Side tufts
                [-0.55, 0.55].forEach(x => {
                    const side = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.35, 0.4), hMat);
                    side.position.set(x, 4.55, -0.05);
                    group.add(side);
                });
                // Bangs (front fringe — signature anime element)
                const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.1), hMat);
                bangs.position.set(0, 5.0, 0.55);
                group.add(bangs);
                break;
            }
            case 'long': {
                // Top dome
                const top = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.45), hMat);
                top.position.set(0, 4.55, 0);
                group.add(top);
                // Long flowing side panels (past shoulders)
                [-0.5, 0.5].forEach(x => {
                    const side = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.6, 0.35), hMat);
                    side.position.set(x, 3.9, -0.1);
                    group.add(side);
                });
                // Back flow
                const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.8, 0.15), hMat);
                back.position.set(0, 3.8, -0.5);
                group.add(back);
                // Bangs
                const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.15, 0.12), hMat);
                bangs.position.set(0, 5.0, 0.55);
                group.add(bangs);
                // Side bangs (swept)
                const sideBang = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.1), hMat);
                sideBang.position.set(-0.4, 4.85, 0.5);
                sideBang.rotation.z = 0.15;
                group.add(sideBang);
                break;
            }
            case 'spiky': {
                // Spikes pointing up and out
                const spikes = [
                    [0, 5.3, 0, 0.25, 0.5, 0.25],
                    [-0.3, 5.2, 0.1, 0.2, 0.4, 0.2],
                    [0.3, 5.25, -0.1, 0.2, 0.45, 0.2],
                    [0, 5.1, -0.3, 0.18, 0.35, 0.18],
                    [-0.2, 5.15, -0.2, 0.16, 0.3, 0.16],
                    [0.25, 5.1, 0.15, 0.16, 0.3, 0.16],
                ];
                spikes.forEach(([x, y, z, w, h, d]) => {
                    const spike = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), hMat);
                    spike.position.set(x, y, z);
                    spike.rotation.z = (Math.random() - 0.5) * 0.3;
                    group.add(spike);
                });
                break;
            }
            case 'curly': {
                const top = new THREE.Mesh(new THREE.SphereGeometry(0.85, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.5), hMat);
                top.position.set(0, 4.55, 0);
                group.add(top);
                for (let i = 0; i < 12; i++) {
                    const sz = 0.12 + Math.random() * 0.08;
                    const curl = new THREE.Mesh(new THREE.SphereGeometry(sz, 4, 3), hMat);
                    const angle = (i / 12) * Math.PI * 2;
                    curl.position.set(
                        Math.cos(angle) * 0.6,
                        4.4 + Math.random() * 0.5,
                        Math.sin(angle) * 0.55
                    );
                    group.add(curl);
                }
                break;
            }
            case 'ponytail': {
                const top = new THREE.Mesh(new THREE.SphereGeometry(0.78, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.45), hMat);
                top.position.set(0, 4.55, 0);
                group.add(top);
                // Long ponytail
                const tail = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 0.18), hMat);
                tail.position.set(0, 3.9, -0.6);
                group.add(tail);
                // Hair tie
                const tie = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.2),
                    new THREE.MeshBasicMaterial({ color: 0xCC3333 }));
                tie.position.set(0, 4.5, -0.55);
                group.add(tie);
                // Bangs
                const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.1), hMat);
                bangs.position.set(0, 5.0, 0.55);
                group.add(bangs);
                break;
            }
            case 'bob': {
                const top = new THREE.Mesh(new THREE.SphereGeometry(0.82, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.5), hMat);
                top.position.set(0, 4.55, 0);
                group.add(top);
                [-0.48, 0.48].forEach(x => {
                    const side = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.55, 0.45), hMat);
                    side.position.set(x, 4.3, -0.03);
                    group.add(side);
                });
                const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.12), hMat);
                back.position.set(0, 4.25, -0.45);
                group.add(back);
                const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.14, 0.12), hMat);
                bangs.position.set(0, 5.0, 0.55);
                group.add(bangs);
                break;
            }
            case 'twintails': {
                const top = new THREE.Mesh(new THREE.SphereGeometry(0.78, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.45), hMat);
                top.position.set(0, 4.55, 0);
                group.add(top);
                [-0.55, 0.55].forEach(x => {
                    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.4, 0.16), hMat);
                    tail.position.set(x, 3.8, -0.25);
                    group.add(tail);
                    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.18),
                        new THREE.MeshBasicMaterial({ color: 0xFF69B4 }));
                    tie.position.set(x, 4.5, -0.25);
                    group.add(tie);
                });
                const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.14, 0.12), hMat);
                bangs.position.set(0, 5.0, 0.55);
                group.add(bangs);
                break;
            }
            case 'mohawk': {
                for (let i = 0; i < 6; i++) {
                    const sz = 0.22 - i * 0.015;
                    const block = new THREE.Mesh(new THREE.BoxGeometry(0.18, sz + 0.15, sz), hMat);
                    block.position.set(0, 5.1 + i * 0.06, -0.12 + i * -0.12);
                    group.add(block);
                }
                [-0.45, 0.45].forEach(x => {
                    const shaved = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.4), darkHair);
                    shaved.position.set(x, 4.75, -0.05);
                    group.add(shaved);
                });
                break;
            }
            case 'sidetail': {
                const top = new THREE.Mesh(new THREE.SphereGeometry(0.78, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.45), hMat);
                top.position.set(0, 4.55, 0);
                group.add(top);
                const tail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.1, 0.15), hMat);
                tail.position.set(0.6, 4.0, -0.15);
                tail.rotation.z = -0.15;
                group.add(tail);
                const tie = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.07, 0.18),
                    new THREE.MeshBasicMaterial({ color: 0x4488FF }));
                tie.position.set(0.55, 4.5, -0.15);
                group.add(tie);
                // Swept bangs
                const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.12, 0.1), hMat);
                bangs.position.set(-0.12, 5.05, 0.55);
                bangs.rotation.z = 0.15;
                group.add(bangs);
                break;
            }
            case 'messy': {
                const tufts = [
                    [0, 5.25, 0.15, 0.22, 0.3, 0.18, 0.1],
                    [-0.3, 5.15, 0.1, 0.18, 0.28, 0.15, -0.15],
                    [0.35, 5.2, -0.08, 0.18, 0.3, 0.15, 0.2],
                    [-0.12, 5.15, -0.3, 0.2, 0.25, 0.18, -0.1],
                    [0.18, 5.25, 0.25, 0.16, 0.22, 0.12, 0.05],
                    [-0.4, 5.0, -0.15, 0.15, 0.32, 0.15, 0.12],
                    [0.45, 5.05, 0.08, 0.13, 0.28, 0.13, -0.08],
                ];
                tufts.forEach(([x, y, z, w, h, d, rz]) => {
                    const tuft = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), hMat);
                    tuft.position.set(x, y, z);
                    tuft.rotation.z = rz;
                    group.add(tuft);
                });
                break;
            }
            case 'flowing': {
                // Long flowing anime hair like Hinata reference
                const top = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.45), hMat);
                top.position.set(0, 4.55, 0);
                group.add(top);
                // Long dramatic side pieces
                [-0.5, 0.5].forEach(x => {
                    const side = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.2, 0.3), hMat);
                    side.position.set(x, 3.5, -0.05);
                    group.add(side);
                    // Wispy ends
                    const end = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.4, 0.2), hMat);
                    end.position.set(x + (x > 0 ? 0.1 : -0.1), 2.3, 0);
                    end.rotation.z = x > 0 ? -0.2 : 0.2;
                    group.add(end);
                });
                // Long back section
                const back = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.5, 0.15), hMat);
                back.position.set(0, 3.3, -0.5);
                group.add(back);
                // Dramatic bangs with parting
                const bangL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.12), hMat);
                bangL.position.set(-0.18, 4.95, 0.55);
                bangL.rotation.z = 0.1;
                group.add(bangL);
                const bangR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.12), hMat);
                bangR.position.set(0.18, 4.95, 0.55);
                bangR.rotation.z = -0.1;
                group.add(bangR);
                // Streak highlight
                const streakMat = matFn(hairColor.clone().lerp(new THREE.Color(0xffffff), 0.4));
                const streak = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.5, 0.1), streakMat);
                streak.position.set(-0.35, 3.8, 0.1);
                group.add(streak);
                break;
            }
            case 'bald':
            default:
                break;
        }
    },

    /* ---- Idle animation ---- */
    animateCreature(group, elapsed) {
        if (!group) return;
        group.position.y = (group.userData.baseY || group.position.y) + Math.sin(elapsed * 1.5) * 0.04;
        if (!group.userData.baseY) group.userData.baseY = group.position.y;
    },

    /* ---- Click bounce ---- */
    playBounce(group) {
        if (!group) return;
        const startY = group.position.y;
        let t = 0;
        const bounce = () => {
            t += 0.06;
            group.position.y = startY + Math.sin(t * Math.PI) * 0.5 * Math.max(0, 1 - t);
            if (t < 1) requestAnimationFrame(bounce);
            else group.position.y = startY;
        };
        bounce();
    },

    /* ---- Mount character into a preview scene ---- */
    mountPreview(containerId, character, options = {}) {
        const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
        if (!container || typeof VoxelEngine === 'undefined') return null;

        const entry = VoxelEngine.createScene(container, {
            height: options.height || 250,
            fov: 35,
            cameraPosition: { x: 0, y: 3.5, z: 8 },
            lookAt: { x: 0, y: 2.8, z: 0 },
            bgColor: options.bgColor || 0xE8F0F8,
        });
        if (!entry) return null;

        entry.scene.background = new THREE.Color(options.bgColor || 0xE8F0F8);

        // Warm lighting
        const ambient = new THREE.AmbientLight(0x666688, 0.7);
        entry.scene.add(ambient);
        const key = new THREE.DirectionalLight(0xFFF5E1, 0.9);
        key.position.set(3, 8, 5);
        entry.scene.add(key);
        const fill = new THREE.PointLight(0x88AACC, 0.3, 15);
        fill.position.set(-3, 2, 4);
        entry.scene.add(fill);

        // Ground pad (warm)
        const padGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 8);
        const padMat = new THREE.MeshStandardMaterial({ color: 0xD4C4A8, roughness: 0.5 });
        const pad = new THREE.Mesh(padGeo, padMat);
        pad.position.y = 0;
        entry.scene.add(pad);

        // Build character
        const charModel = this.build(character, { scale: 0.7 });
        charModel.position.y = 0.1;
        entry.scene.add(charModel);

        // Orbit controls
        if (options.orbit !== false) {
            VoxelEngine.addOrbitControls(entry.id, {
                target: { x: 0, y: 2.8, z: 0 },
                minDistance: 4,
                maxDistance: 12,
                enablePan: false,
            });
        }

        VoxelEngine.onAnimate(entry.id, (delta, elapsed) => {
            this.animateCreature(charModel, elapsed);
            if (!options.orbit) charModel.rotation.y = elapsed * 0.5;
        });
        VoxelEngine.startLoop(entry.id);

        return { entry, creature: charModel };
    },

    /* ---- Mini preview ---- */
    mountMiniPreview(container, character, options = {}) {
        if (!container || typeof VoxelEngine === 'undefined') return null;

        const entry = VoxelEngine.createScene(container, {
            height: options.height || 100,
            fov: 30,
            cameraPosition: { x: 0, y: 3.0, z: 7 },
            lookAt: { x: 0, y: 2.5, z: 0 },
            bgColor: options.bgColor || 0xE8F0F8,
        });
        if (!entry) return null;

        entry.scene.background = new THREE.Color(options.bgColor || 0xE8F0F8);

        const ambient = new THREE.AmbientLight(0x777799, 0.5);
        entry.scene.add(ambient);
        const key = new THREE.DirectionalLight(0xFFF5E1, 0.6);
        key.position.set(2, 5, 3);
        entry.scene.add(key);

        const charModel = this.build(character, { scale: 0.45 });
        charModel.position.y = 0;
        entry.scene.add(charModel);

        VoxelEngine.onAnimate(entry.id, (delta, elapsed) => {
            charModel.rotation.y = elapsed * 0.8;
            this.animateCreature(charModel, elapsed);
        });
        VoxelEngine.startLoop(entry.id);

        return { entry, creature: charModel };
    },
};
