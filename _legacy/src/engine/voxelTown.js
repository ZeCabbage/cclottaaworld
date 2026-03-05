/* ============================================
   Voxel Town — Urban Grunge City Hub
   Dark aesthetic · Neon accents · Street vibes
   Each building unique & spaced for readability
   ============================================ */

const VoxelTown = {

    entry: null,
    creatureGroup: null,
    clickableBuildings: [],
    buildingMap: new Map(),
    _clouds: null,
    _floatObjects: [],
    _neonSigns: [],

    /* ---- Mount the city ---- */
    mount(container) {
        this.cleanup();

        const canvasDiv = document.createElement('div');
        canvasDiv.id = 'voxel-town-canvas';
        canvasDiv.style.cssText = 'width: 100%; height: 460px; position: relative;';
        container.appendChild(canvasDiv);

        this.entry = VoxelEngine.createScene(canvasDiv, {
            height: 460,
            fov: 38,
            // Wider isometric — shows all buildings clearly
            cameraPosition: { x: 32, y: 28, z: 32 },
            lookAt: { x: 0, y: 0, z: 0 },
            fog: false,
        });
        if (!this.entry) return;

        const scene = this.entry.scene;

        // Lighting
        this.clearLights(scene);
        this.addLighting(scene);

        // Dark city fog
        scene.fog = new THREE.FogExp2(0x1a1a2e, 0.012);
        scene.background = new THREE.Color(0x0d0d1a);

        // Build city
        this.buildGround(scene);
        this.buildStreets(scene);
        this.buildShopBuildings(scene);
        this.buildBackgroundTowers(scene);
        this.buildBillboard(scene);
        this.buildMountains(scene);
        this.buildClouds(scene);
        this.buildAmbientDetails(scene);
        this.addCharacterToTown(scene);

        // Orbit controls
        VoxelEngine.addOrbitControls(this.entry.id, {
            target: { x: 0, y: 1, z: 0 },
            minDistance: 20,
            maxDistance: 55,
            maxPolarAngle: Math.PI / 2.4,
            minPolarAngle: 0.3,
            enablePan: true,
        });

        // Click handler
        this.entry.renderer.domElement.addEventListener('click', (e) => this.onClickTown(e));
        this.entry.renderer.domElement.style.cursor = 'crosshair';

        // Animation
        VoxelEngine.onAnimate(this.entry.id, (delta, elapsed) => {
            this.animate(elapsed, delta);
        });
        VoxelEngine.startLoop(this.entry.id);
    },

    clearLights(scene) {
        const toRemove = [];
        scene.traverse(obj => { if (obj.isLight) toRemove.push(obj); });
        toRemove.forEach(l => scene.remove(l));
    },

    addLighting(scene) {
        // Cool dark ambient
        const ambient = new THREE.AmbientLight(0x4a4a6e, 0.8);
        scene.add(ambient);
        const dir = new THREE.DirectionalLight(0x667788, 0.7);
        dir.position.set(-10, 25, 10);
        scene.add(dir);
        const hemi = new THREE.HemisphereLight(0x445566, 0x1a1a0a, 0.3);
        scene.add(hemi);
    },

    /* ---- Ground ---- */
    buildGround(scene) {
        // Dark concrete
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(80, 80),
            new THREE.MeshStandardMaterial({ color: 0x1a1a1f, roughness: 0.3, metalness: 0.3 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.05;
        scene.add(ground);
    },

    /* ---- Streets — winding cobblestone paths ---- */
    buildStreets(scene) {
        const pathMat = new THREE.MeshStandardMaterial({ color: 0x1a1a20, roughness: 0.6, metalness: 0.2 });
        const edgeMat = new THREE.MeshStandardMaterial({ color: 0x222228, roughness: 0.7 });

        // Organic winding paths connecting buildings (series of overlapping rectangles with slight rotations)
        const pathSegments = [
            // Center hub
            { x: 0, z: 0, w: 6, d: 6, rot: 0.1 },
            // Path to Home (NW)
            { x: -2, z: -4, w: 3, d: 5, rot: -0.15 },
            { x: -4, z: -8, w: 3, d: 6, rot: 0.1 },
            { x: -2, z: -12, w: 3, d: 5, rot: -0.05 },
            // Path to Supply (W)
            { x: -5, z: -2, w: 5, d: 3, rot: 0.12 },
            { x: -9, z: -4, w: 5, d: 3, rot: -0.08 },
            { x: -13, z: -5, w: 4, d: 3, rot: 0.05 },
            // Path to Work (SW)
            { x: -5, z: 3, w: 5, d: 3, rot: -0.1 },
            { x: -10, z: 5, w: 5, d: 3, rot: 0.15 },
            { x: -14, z: 6, w: 4, d: 3, rot: -0.05 },
            // Path to Fashion (NE)
            { x: 4, z: -3, w: 5, d: 3, rot: 0.08 },
            { x: 8, z: -5, w: 5, d: 3, rot: -0.12 },
            { x: 12, z: -6, w: 4, d: 3, rot: 0.06 },
            // Path to Vinyl (E-center)
            { x: -3, z: 1, w: 4, d: 3, rot: -0.08 },
            { x: -6, z: 0, w: 4, d: 3, rot: 0.1 },
            // Path to Arcade (S-center)
            { x: -1, z: 5, w: 3, d: 5, rot: 0.1 },
            { x: -3, z: 9, w: 3, d: 5, rot: -0.08 },
            // Path to Café (SE)
            { x: 3, z: 3, w: 4, d: 3, rot: -0.12 },
            { x: 6, z: 4, w: 4, d: 3, rot: 0.08 },
            // Path to Gym (E)
            { x: 6, z: 2, w: 5, d: 3, rot: 0.1 },
            { x: 10, z: 3, w: 5, d: 3, rot: -0.06 },
            { x: 14, z: 2, w: 4, d: 3, rot: 0.05 },
            // Path to Psychiatrist (far S)
            { x: 2, z: 8, w: 3, d: 5, rot: 0.12 },
            { x: 4, z: 12, w: 3, d: 5, rot: -0.1 },
        ];

        pathSegments.forEach(seg => {
            const path = new THREE.Mesh(new THREE.PlaneGeometry(seg.w, seg.d), pathMat);
            path.rotation.x = -Math.PI / 2;
            path.rotation.z = seg.rot;
            path.position.set(seg.x, 0.02, seg.z);
            scene.add(path);
            // Cobblestone edge
            const edge = new THREE.Mesh(new THREE.PlaneGeometry(seg.w + 0.4, seg.d + 0.4), edgeMat);
            edge.rotation.x = -Math.PI / 2;
            edge.rotation.z = seg.rot;
            edge.position.set(seg.x, 0.015, seg.z);
            scene.add(edge);
        });

        // Scattered puddles
        const puddleMat = new THREE.MeshStandardMaterial({ color: 0x1a2233, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.4 });
        [[-2, 1], [5, -2], [-8, 3], [1, 7], [-11, -3]].forEach(([x, z]) => {
            const puddle = new THREE.Mesh(new THREE.CircleGeometry(0.6 + Math.random() * 0.4, 8), puddleMat);
            puddle.rotation.x = -Math.PI / 2;
            puddle.position.set(x, 0.025, z);
            scene.add(puddle);
        });

        // Scattered street lamps along paths
        [[-3, -6], [3, 2], [-7, -1], [1, 6], [-10, 4], [8, -3], [5, 6], [-4, 10], [12, 1]].forEach(([x, z]) => {
            const pole = new THREE.Mesh(
                new THREE.CylinderGeometry(0.05, 0.05, 4, 4),
                new THREE.MeshStandardMaterial({ color: 0x333340, metalness: 0.8 })
            );
            pole.position.set(x, 2, z);
            scene.add(pole);
            const lamp = new THREE.Mesh(
                new THREE.SphereGeometry(0.15, 4, 4),
                new THREE.MeshBasicMaterial({ color: 0xaa8844 })
            );
            lamp.position.set(x, 4.1, z);
            scene.add(lamp);
        });
    },

    /* ==== SHOP BUILDINGS — organic whimsical layout ==== */
    buildShopBuildings(scene) {
        this.clickableBuildings = [];
        this.buildingMap = new Map();

        /*  LAYOUT (organic, meandering):
         *
         *                        HOME(-3,-14)
         *          VINYL(-8, 0)            FASHION(12,-7)
         *   WORK(-15, 6)     GARDEN(0, 4)        
         *          ARCADE(-4, 10)    CAFÉ(7, 5)
         *                               GYM(15, 2)
         *                    PSYCH(5, 14)
         */
        this.buildFashionStudio(scene);
        this.buildArcade(scene);
        this.buildGym(scene);
        this.buildHome(scene);
        this.buildFortuneTeller(scene);
        this.buildVinylStore(scene);
        this.buildWorkBuilding(scene);
        this.buildCafe(scene);
        this.buildGarden(scene);
    },


    /* --- FASHION STUDIO — Dark glass tower with magenta neon --- */
    buildFashionStudio(scene) {
        const group = new THREE.Group();
        group.userData.screenId = 'shopFashion';

        // Dark sleek tower
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(4.5, 8, 4.5),
            new THREE.MeshStandardMaterial({ color: 0x1a1a28, roughness: 0.3, metalness: 0.5, flatShading: true })
        );
        body.position.y = 4;
        group.add(body);

        // Dark glass facade
        const glass = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 7),
            new THREE.MeshStandardMaterial({ color: 0x223344, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.4 })
        );
        glass.position.set(0, 4, 2.27);
        group.add(glass);

        // Magenta awning
        const awning = new THREE.Mesh(
            new THREE.BoxGeometry(5.5, 0.15, 1.5),
            new THREE.MeshStandardMaterial({ color: 0x880066, roughness: 0.7 })
        );
        awning.position.set(0, 2, 3);
        group.add(awning);

        // Dark penthouse
        const penthouse = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 2, 2.5),
            new THREE.MeshStandardMaterial({ color: 0x222233, flatShading: true })
        );
        penthouse.position.y = 9;
        group.add(penthouse);

        // Display window (pink glow)
        const display = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 1.5),
            new THREE.MeshBasicMaterial({ color: 0xffccdd, transparent: true, opacity: 0.25 })
        );
        display.position.set(0, 1.2, 2.28);
        group.add(display);

        // Magenta neon sign
        this.addShopSign(group, 'FASHION', 0xff00ff, 0, 8.5, 2.5, 4);
        this.addGroundLabel(scene, 12, -7, 0xff00ff, 'FASHION');
        this.addWindowGrid(group, 2, 4, 4.5, 8, 4.5, 0x334455);

        group.position.set(12, 0, -7);
        group.rotation.y = -0.1;
        scene.add(group);
        this.registerClickable(group, 'shopFashion');
    },

    /* --- ARCADE — Dark brutalist with cyan neon --- */
    buildArcade(scene) {
        const group = new THREE.Group();
        group.userData.screenId = 'shopArcade';

        // Dark chunky block
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(6, 5, 5),
            new THREE.MeshStandardMaterial({ color: 0x1a1825, roughness: 0.85, flatShading: true })
        );
        body.position.y = 2.5;
        group.add(body);

        // Dark upper
        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(5, 2.5, 4),
            new THREE.MeshStandardMaterial({ color: 0x181822, roughness: 0.85, flatShading: true })
        );
        upper.position.y = 6.25;
        group.add(upper);

        // Cyan neon trim
        const neonTrim = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
        const t1 = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.1, 0.1), neonTrim);
        t1.position.set(0, 0.1, 2.55);
        group.add(t1);
        const t2 = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.1, 0.1), neonTrim.clone());
        t2.position.set(0, 5.05, 2.55);
        group.add(t2);

        // Dark entrance
        const door = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2.5),
            new THREE.MeshBasicMaterial({ color: 0x050510, transparent: true, opacity: 0.9 })
        );
        door.position.set(0, 1.25, 2.52);
        group.add(door);

        // Neon arcade windows
        const arcColors = [0x00ffff, 0xff00ff, 0xffff00, 0xff4400, 0x44ff44];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const w = new THREE.Mesh(
                    new THREE.PlaneGeometry(0.7, 0.7),
                    new THREE.MeshBasicMaterial({ color: arcColors[(row + col) % arcColors.length], transparent: true, opacity: 0.35 + Math.random() * 0.3 })
                );
                w.position.set(-1.2 + col * 1.2, 2.5 + row * 1.3, 2.53);
                group.add(w);
            }
        }

        // Cyan neon sign
        this.addShopSign(group, 'ARCADE', 0x00ffff, 0, 8, 2.55, 4.5);
        this.addGroundLabel(scene, -4, 10, 0x00ffff, 'ARCADE');

        group.position.set(-4, 0, 10);
        group.rotation.y = 0.2;
        scene.add(group);
        this.registerClickable(group, 'shopArcade');
    },

    /* --- CITY GYM — Dark industrial with red neon --- */
    buildGym(scene) {
        const group = new THREE.Group();
        group.userData.screenId = 'shopPark';

        // Dark concrete gym
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(6, 4, 5),
            new THREE.MeshStandardMaterial({ color: 0x2a2225, roughness: 0.9, flatShading: true })
        );
        body.position.y = 2;
        group.add(body);

        // Flat roof with railing
        const roofRail = new THREE.Mesh(
            new THREE.BoxGeometry(6.4, 0.3, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x553333, metalness: 0.6 })
        );
        roofRail.position.set(0, 4.15, 2.5);
        group.add(roofRail);

        // Iron gate
        const gateMat = new THREE.MeshStandardMaterial({ color: 0x5a3333, roughness: 0.7, metalness: 0.5, flatShading: true });
        const gateL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4, 4), gateMat);
        gateL.position.set(-1.5, 2, 2.8);
        group.add(gateL);
        const gateR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4, 4), gateMat);
        gateR.position.set(1.5, 2, 2.8);
        group.add(gateR);
        const gateTop = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.2, 0.2), gateMat);
        gateTop.position.set(0, 4.1, 2.8);
        group.add(gateTop);

        // Dumbbell props
        const dumbMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7, roughness: 0.3 });
        [-1.8, 1.8].forEach(x => {
            const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 6), dumbMat);
            bar.rotation.z = Math.PI / 2;
            bar.position.set(x, 0.3, 3.5);
            group.add(bar);
            [-0.5, 0.5].forEach(off => {
                const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 8), dumbMat);
                plate.rotation.z = Math.PI / 2;
                plate.position.set(x + off, 0.3, 3.5);
                group.add(plate);
            });
        });

        // Red neon sign
        this.addShopSign(group, 'CITY GYM', 0xff3333, 0, 4.8, 2.8, 4.5);
        this.addGroundLabel(scene, 15, 2, 0xff3333, 'GYM');
        this.addWindowGrid(group, 3, 1, 6, 4, 5, 0x442222);

        group.position.set(15, 0, 2);
        group.rotation.y = -0.15;
        scene.add(group);
        this.registerClickable(group, 'shopPark');
    },

    /* --- PSYCHIATRIST — Clinical brutalist building with teal neon --- */
    buildFortuneTeller(scene) {
        const group = new THREE.Group();
        group.userData.screenId = 'shopFortune';

        // Clinical building
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(4, 6, 4),
            new THREE.MeshStandardMaterial({ color: 0x1a2828, roughness: 0.8, flatShading: true })
        );
        body.position.y = 3;
        group.add(body);

        // Flat clinical roof
        const roof = new THREE.Mesh(
            new THREE.BoxGeometry(4.5, 0.3, 4.5),
            new THREE.MeshStandardMaterial({ color: 0x223838, roughness: 0.7, metalness: 0.2 })
        );
        roof.position.y = 6.2;
        group.add(roof);

        // Cross symbol on roof (medical)
        const crossMat = new THREE.MeshBasicMaterial({ color: 0x00cccc, transparent: true, opacity: 0.8 });
        const crossH = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.4), crossMat);
        crossH.position.y = 6.5;
        group.add(crossH);
        const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 1.5), crossMat);
        crossV.position.y = 6.5;
        group.add(crossV);

        // Clinical door
        const door = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 2.8, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x0a1818, roughness: 0.9 })
        );
        door.position.set(0, 1.4, 2.05);
        group.add(door);

        // Door handle
        const handle = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.3, 0.08),
            new THREE.MeshStandardMaterial({ color: 0x778888, metalness: 0.8 })
        );
        handle.position.set(0.5, 1.4, 2.1);
        group.add(handle);

        // Clinical windows (teal glow)
        const winMat = new THREE.MeshBasicMaterial({ color: 0x44aaaa, transparent: true, opacity: 0.3 });
        [[-1, 4, 2.01], [1, 4, 2.01], [0, 5, 2.01]].forEach(([x, y, z]) => {
            const w = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1), winMat);
            w.position.set(x, y, z);
            group.add(w);
        });

        // Purple neon sign
        this.addShopSign(group, 'DR. MIND', 0x00cccc, 0, 6.5, 2, 5);
        this.addGroundLabel(scene, 5, 14, 0x00cccc, 'PSYCH');

        group.position.set(5, 0, 14);
        group.rotation.y = 0.1;
        scene.add(group);
        this.registerClickable(group, 'shopFortune');
    },

    /* --- HOME — Dark apartment tower with amber neon --- */
    buildHome(scene) {
        const group = new THREE.Group();
        group.userData.screenId = 'apartment';

        // Dark residential tower
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(4, 9, 4),
            new THREE.MeshStandardMaterial({ color: 0x28242a, roughness: 0.85, flatShading: true })
        );
        body.position.y = 4.5;
        group.add(body);

        // Dark balcony ledges
        for (let y = 2; y <= 7; y += 2.5) {
            const ledge = new THREE.Mesh(
                new THREE.BoxGeometry(4.4, 0.12, 0.6),
                new THREE.MeshStandardMaterial({ color: 0x3a3a40, roughness: 0.9 })
            );
            ledge.position.set(0, y, 2.3);
            group.add(ledge);

            const railing = new THREE.Mesh(
                new THREE.BoxGeometry(4.2, 0.4, 0.05),
                new THREE.MeshStandardMaterial({ color: 0x444448, metalness: 0.6, roughness: 0.5 })
            );
            railing.position.set(0, y + 0.25, 2.55);
            group.add(railing);
        }

        // Warm lit windows
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 3; col++) {
                if (Math.random() > 0.7) continue;
                const w = new THREE.Mesh(
                    new THREE.PlaneGeometry(0.6, 0.8),
                    new THREE.MeshBasicMaterial({ color: 0xffcc66, transparent: true, opacity: 0.5 + Math.random() * 0.3 })
                );
                w.position.set(-1 + col * 1, 1.2 + row * 1.5, 2.02);
                group.add(w);
            }
        }

        // Dark entrance canopy
        const canopy = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.12, 1),
            new THREE.MeshStandardMaterial({ color: 0x3a3a40 })
        );
        canopy.position.set(0, 1.8, 2.5);
        group.add(canopy);

        // Water tank
        const tank = new THREE.Mesh(
            new THREE.CylinderGeometry(0.6, 0.6, 1.5, 8),
            new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.4 })
        );
        tank.position.set(1, 10, -0.5);
        group.add(tank);

        // Amber neon
        this.addShopSign(group, 'MY PLACE', 0xffaa00, 0, 9.8, 2.2, 4);
        this.addGroundLabel(scene, -3, -14, 0xffaa00, 'HOME');

        group.position.set(-3, 0, -14);
        group.rotation.y = -0.12;
        scene.add(group);
        this.registerClickable(group, 'apartment');
    },

    /* --- VINYL STORE — Retro record shop with warm amber neon --- */
    buildVinylStore(scene) {
        const group = new THREE.Group();
        group.userData.screenId = 'shopVinyl';

        // Cozy shop body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(5, 4, 4),
            new THREE.MeshStandardMaterial({ color: 0x2a1a08, roughness: 0.8, flatShading: true })
        );
        body.position.y = 2;
        group.add(body);

        // Awning
        const awning = new THREE.Mesh(
            new THREE.BoxGeometry(5.5, 0.15, 1.5),
            new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.7 })
        );
        awning.position.set(0, 4.1, 2.5);
        awning.rotation.x = 0.1;
        group.add(awning);

        // Record disc on roof (decorative)
        const disc = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 1.2, 0.1, 16),
            new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.8 })
        );
        disc.position.set(0, 4.5, 0);
        disc.rotation.x = -0.3;
        group.add(disc);
        // Record label
        const label = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.35, 0.12, 16),
            new THREE.MeshStandardMaterial({ color: 0xff8800, roughness: 0.5 })
        );
        label.position.set(0, 4.55, 0);
        label.rotation.x = -0.3;
        group.add(label);

        // Door
        const door = new THREE.Mesh(
            new THREE.BoxGeometry(1, 2.5, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x1a0d00, roughness: 0.9 })
        );
        door.position.set(0, 1.25, 2.05);
        group.add(door);

        // Window
        const windowMat = new THREE.MeshBasicMaterial({ color: 0xffcc66, transparent: true, opacity: 0.3 });
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0.1), windowMat);
        win.position.set(1.8, 2.5, 2.05);
        group.add(win);

        this.addShopSign(group, 'VINYL', 0xffaa44, 0, 4.3, 2.5, 3.5);
        this.addGroundLabel(scene, -8, 0, 0xffaa44, 'VINYL');

        group.position.set(-8, 0, 0);
        group.rotation.y = -0.08;
        scene.add(group);
        this.registerClickable(group, 'shopVinyl');
    },

    /* --- WORK BUILDING — Massive brutalist concrete block --- */
    buildWorkBuilding(scene) {
        const group = new THREE.Group();
        group.userData.screenId = 'shopWork';

        // Massive brutalist body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(7, 10, 6),
            new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.9, flatShading: true })
        );
        body.position.y = 5;
        group.add(body);

        // Concrete panels (brutalist texture)
        [-3, 0, 3].forEach(x => {
            const panel = new THREE.Mesh(
                new THREE.BoxGeometry(2, 9.5, 0.1),
                new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.95 })
            );
            panel.position.set(x * 0.7, 5, 3.05);
            group.add(panel);
        });

        // Tiny oppressive windows (sparse, uniform)
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                const win = new THREE.Mesh(
                    new THREE.BoxGeometry(0.6, 0.4, 0.1),
                    new THREE.MeshBasicMaterial({ color: 0xccddaa, transparent: true, opacity: 0.2 })
                );
                win.position.set(-1.5 + col * 1.5, 3 + row * 2, 3.06);
                group.add(win);
            }
        }

        // Harsh fluorescent strip at entrance
        const fluor = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.05, 0.1),
            new THREE.MeshBasicMaterial({ color: 0xeeeedd })
        );
        fluor.position.set(0, 2.5, 3.07);
        group.add(fluor);

        // Heavy door
        const door = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 2.5, 0.12),
            new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, metalness: 0.3 })
        );
        door.position.set(0, 1.25, 3.06);
        group.add(door);

        this.addShopSign(group, 'GRINDSTONE & CO', 0x999999, 0, 9.8, 3.1, 6);
        this.addGroundLabel(scene, -15, 6, 0x999999, 'WORK');

        group.position.set(-15, 0, 6);
        group.rotation.y = 0.08;
        scene.add(group);
        this.registerClickable(group, 'shopWork');
    },

    /* --- CAFÉ — Cozy warm building with yellow/orange neon --- */
    buildCafe(scene) {
        const group = new THREE.Group();
        group.userData.screenId = 'shopCafe';

        // Cozy cafe body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(5, 3.5, 4.5),
            new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.8, flatShading: true })
        );
        body.position.y = 1.75;
        group.add(body);

        // Sloped roof
        const roof = new THREE.Mesh(
            new THREE.BoxGeometry(5.5, 0.2, 5),
            new THREE.MeshStandardMaterial({ color: 0x3a2a18, roughness: 0.8 })
        );
        roof.position.set(0, 3.7, 0);
        roof.rotation.x = -0.05;
        group.add(roof);

        // Warm glowing window
        const windowMat = new THREE.MeshBasicMaterial({ color: 0xffcc44, transparent: true, opacity: 0.35 });
        const bigWin = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 0.1), windowMat);
        bigWin.position.set(1, 2.2, 2.26);
        group.add(bigWin);

        // Door
        const door = new THREE.Mesh(
            new THREE.BoxGeometry(1, 2.5, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x1a0d06, roughness: 0.9 })
        );
        door.position.set(-1.3, 1.25, 2.26);
        group.add(door);

        // Outdoor bench
        const benchMat = new THREE.MeshStandardMaterial({ color: 0x4a3520, roughness: 0.8 });
        const bench = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 0.5), benchMat);
        bench.position.set(0, 0.5, 3.5);
        group.add(bench);
        [-0.8, 0.8].forEach(x => {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), benchMat);
            leg.position.set(x, 0.25, 3.5);
            group.add(leg);
        });

        // Smoke/steam from chimney (decorative box)
        const chimney = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 1.5, 0.5),
            new THREE.MeshStandardMaterial({ color: 0x553322, roughness: 0.9 })
        );
        chimney.position.set(1.5, 4.3, -1);
        group.add(chimney);

        this.addShopSign(group, 'THE CORNER', 0xffcc66, 0, 3.5, 2.8, 4);
        this.addGroundLabel(scene, 7, 5, 0xffcc66, 'CAFÉ');

        group.position.set(7, 0, 5);
        group.rotation.y = -0.18;
        scene.add(group);
        this.registerClickable(group, 'shopCafe');
    },

    /* --- NIGHT GARDEN — Dark moonlit park with bench and dead tree --- */
    buildGarden(scene) {
        const group = new THREE.Group();
        group.userData.screenId = 'shopGarden';

        // Park ground (dark grass patch)
        const ground = new THREE.Mesh(
            new THREE.CircleGeometry(5, 16),
            new THREE.MeshStandardMaterial({ color: 0x1a2a15, roughness: 0.9 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0.02;
        group.add(ground);

        // Dead tree
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.3, 4, 5),
            new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.9 })
        );
        trunk.position.set(-1.5, 2, -1);
        group.add(trunk);
        // Branches
        [[-0.8, 3.5, -0.5, 0.4], [0.3, 3.2, -1.2, -0.3], [-2, 3.8, -0.8, 0.6]].forEach(([x, y, z, rot]) => {
            const branch = new THREE.Mesh(
                new THREE.CylinderGeometry(0.03, 0.08, 1.5, 4),
                new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.9 })
            );
            branch.position.set(x, y, z);
            branch.rotation.z = rot;
            group.add(branch);
        });

        // Bench
        const benchMat = new THREE.MeshStandardMaterial({ color: 0x3a2a18, roughness: 0.8 });
        const benchSeat = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 0.6), benchMat);
        benchSeat.position.set(1, 0.55, 0.5);
        group.add(benchSeat);
        const benchBack = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 0.08), benchMat);
        benchBack.position.set(1, 0.9, 0.2);
        group.add(benchBack);
        [-0.1, 2.1].forEach(x => {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.08), benchMat);
            leg.position.set(x, 0.28, 0.5);
            group.add(leg);
        });

        // Glowing fireflies (small emissive spheres)
        [[-2, 1.5, 1], [1, 2.5, -2], [3, 1, 0.5], [-1, 3, -0.5], [2, 2, 1.5]].forEach(([x, y, z]) => {
            const fly = new THREE.Mesh(
                new THREE.SphereGeometry(0.06, 4, 4),
                new THREE.MeshBasicMaterial({ color: 0x88ffaa })
            );
            fly.position.set(x, y, z);
            group.add(fly);
            this._floatObjects.push({ mesh: fly, baseY: y, amp: 0.3, speed: 0.5 + Math.random() * 0.5 });
        });

        // Moon-glow light
        const moonLight = new THREE.PointLight(0x6688aa, 0.6, 12);
        moonLight.position.set(0, 6, 0);
        group.add(moonLight);

        this.addShopSign(group, 'NIGHT GARDEN', 0x66cc88, 0, 1.5, 2.5, 3.5);
        this.addGroundLabel(scene, 0, 4, 0x66cc88, 'GARDEN');

        group.position.set(0, 0, 4);
        scene.add(group);
        this.registerClickable(group, 'shopGarden');
    },

    /* ---- Clickable registration ---- */
    registerClickable(group, screenId) {
        this.clickableBuildings.push(group);
        group.traverse(child => {
            if (child.isMesh) this.buildingMap.set(child, screenId);
        });
    },

    /* ---- Shop sign (canvas sprite) ---- */
    addShopSign(group, text, color, x, y, z, width) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        const hex = '#' + color.toString(16).padStart(6, '0');
        ctx.shadowColor = hex;
        ctx.shadowBlur = 20;
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = hex;
        ctx.fillText(text, 256, 46);
        ctx.fillText(text, 256, 46);
        ctx.fillText(text, 256, 46);

        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.95 });
        const sprite = new THREE.Sprite(mat);
        sprite.position.set(x, y, z);
        sprite.scale.set(width || 4, 0.8, 1);
        sprite.userData.neonSign = true;
        sprite.userData.baseOpacity = 0.95;
        group.add(sprite);
        this._neonSigns.push(sprite);
    },

    /* ---- Ground label (text on ground for clarity) ---- */
    addGroundLabel(scene, x, z, color, text) {
        const ringGeo = new THREE.RingGeometry(1.5, 2, 8);
        const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(x, 0.02, z);
        scene.add(ring);
        this._floatObjects.push({ mesh: ring, type: 'marker' });

        // Text label on ground (canvas texture on flat plane)
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const hex = '#' + color.toString(16).padStart(6, '0');
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, 256, 64);
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = hex;
        ctx.shadowColor = hex;
        ctx.shadowBlur = 10;
        ctx.fillText(text, 128, 42);
        ctx.fillText(text, 128, 42);
        ctx.shadowBlur = 10;
        ctx.fillText(text, 128, 42);
        ctx.fillText(text, 128, 42);

        const tex = new THREE.CanvasTexture(canvas);
        const labelMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
        const label = new THREE.Mesh(new THREE.PlaneGeometry(4, 1), labelMat);
        label.rotation.x = -Math.PI / 2;
        label.position.set(x, 0.04, z + 3.5);
        scene.add(label);
    },

    /* ---- Window grid helper ---- */
    addWindowGrid(group, cols, rows, bw, bh, bd, baseColor) {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (Math.random() > 0.55) continue;
                const warmth = Math.random();
                let wColor = baseColor;
                if (warmth > 0.8) wColor = 0xffcc66;
                else if (warmth > 0.6) wColor = 0x88aacc;

                const w = new THREE.Mesh(
                    new THREE.PlaneGeometry(0.5, 0.7),
                    new THREE.MeshBasicMaterial({ color: wColor, transparent: true, opacity: 0.4 + Math.random() * 0.3 })
                );
                const xOff = -bw / 2 + 0.8 + col * ((bw - 1.2) / Math.max(cols - 1, 1));
                w.position.set(xOff, 1 + row * (bh * 0.8 / rows), bd / 2 + 0.02);
                group.add(w);
            }
        }
    },

    /* ---- Background towers (dark silhouettes) ---- */
    buildBackgroundTowers(scene) {
        const bgDefs = [
            { x: -20, z: -18, w: 4, h: 24, d: 4, color: 0x14141e },
            { x: 20, z: -16, w: 3, h: 20, d: 5, color: 0x16162a },
            { x: -20, z: 14, w: 3, h: 16, d: 3, color: 0x111120 },
            { x: 20, z: 14, w: 4, h: 14, d: 3, color: 0x151528 },
            { x: 0, z: -24, w: 5, h: 28, d: 3, color: 0x0f0f1a },
            { x: -10, z: -22, w: 3, h: 18, d: 3, color: 0x121222 },
            { x: 10, z: -22, w: 3, h: 15, d: 4, color: 0x101020 },
        ];

        bgDefs.forEach(b => {
            const body = new THREE.Mesh(
                new THREE.BoxGeometry(b.w, b.h, b.d),
                new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.9, flatShading: true })
            );
            body.position.set(b.x, b.h / 2, b.z);
            scene.add(body);

            if (b.h > 10) {
                const winMat = new THREE.MeshBasicMaterial({ color: 0x223344, transparent: true, opacity: 0.2 });
                const winStrip = new THREE.Mesh(new THREE.PlaneGeometry(b.w * 0.6, b.h * 0.7), winMat);
                winStrip.position.set(b.x, b.h * 0.5, b.z + b.d / 2 + 0.02);
                scene.add(winStrip);
            }

            // Antennas on tall buildings
            if (b.h > 16) {
                const ant = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.04, 0.04, 3, 4),
                    new THREE.MeshStandardMaterial({ color: 0x333344, metalness: 0.8 })
                );
                ant.position.set(b.x, b.h + 1.5, b.z);
                scene.add(ant);

                const blinker = new THREE.Mesh(
                    new THREE.SphereGeometry(0.1, 4, 4),
                    new THREE.MeshBasicMaterial({ color: 0xff0000 })
                );
                blinker.position.set(b.x, b.h + 3, b.z);
                blinker.userData.blink = true;
                scene.add(blinker);
            }
        });
    },

    /* ---- Billboard ---- */
    buildBillboard(scene) {
        const bbCanvas = document.createElement('canvas');
        bbCanvas.width = 512;
        bbCanvas.height = 256;
        const bbCtx = bbCanvas.getContext('2d');
        const grad = bbCtx.createLinearGradient(0, 0, 512, 256);
        grad.addColorStop(0, '#0a0a2e');
        grad.addColorStop(0.3, '#1a0a3e');
        grad.addColorStop(0.6, '#0a2a3e');
        grad.addColorStop(1, '#0a0a1e');
        bbCtx.fillStyle = grad;
        bbCtx.fillRect(0, 0, 512, 256);
        for (let y = 0; y < 256; y += 3) {
            bbCtx.fillStyle = `rgba(0,0,0,${0.15 + Math.random() * 0.1})`;
            bbCtx.fillRect(0, y, 512, 1);
        }
        bbCtx.shadowColor = '#ff0066';
        bbCtx.shadowBlur = 8;
        bbCtx.font = 'bold 36px monospace';
        bbCtx.fillStyle = '#ff0066';
        bbCtx.fillText('ccllottaaWorld', 60, 100);
        bbCtx.shadowColor = '#00ffaa';
        bbCtx.font = 'bold 20px monospace';
        bbCtx.fillStyle = '#00ffaa';
        bbCtx.fillText('YOUR WORLD AWAITS', 70, 160);

        const bbTex = new THREE.CanvasTexture(bbCanvas);
        const bb = new THREE.Mesh(
            new THREE.PlaneGeometry(5, 3),
            new THREE.MeshBasicMaterial({ map: bbTex, transparent: true, opacity: 0.9 })
        );
        bb.position.set(0, 22, -23);
        scene.add(bb);

        // Street neon signs
        const signDefs = [
            { x: -4, z: -3, h: 4.5, color: 0xff0066, text: '24HR' },
            { x: 4, z: 5, h: 4, color: 0x00aaff, text: 'OPEN' },
        ];
        signDefs.forEach(n => {
            const pole = new THREE.Mesh(
                new THREE.CylinderGeometry(0.04, 0.04, n.h, 4),
                new THREE.MeshStandardMaterial({ color: 0x333340, metalness: 0.9 })
            );
            pole.position.set(n.x, n.h / 2, n.z);
            scene.add(pole);

            const sc = document.createElement('canvas');
            sc.width = 128; sc.height = 48;
            const sctx = sc.getContext('2d');
            const hex = '#' + n.color.toString(16).padStart(6, '0');
            sctx.shadowColor = hex;
            sctx.shadowBlur = 12;
            sctx.font = 'bold 28px monospace';
            sctx.textAlign = 'center';
            sctx.fillStyle = hex;
            sctx.fillText(n.text, 64, 34);
            sctx.fillText(n.text, 64, 34);

            const stex = new THREE.CanvasTexture(sc);
            const smat = new THREE.SpriteMaterial({ map: stex, transparent: true });
            const sign = new THREE.Sprite(smat);
            sign.position.set(n.x, n.h + 0.3, n.z);
            sign.scale.set(1.8, 0.7, 1);
            sign.userData.neonSign = true;
            sign.userData.baseOpacity = 0.85;
            scene.add(sign);
            this._neonSigns.push(sign);
        });
    },

    /* ---- Mountains ---- */
    buildMountains(scene) {
        const mtPoints = [
            new THREE.Vector2(-35, 0),
            new THREE.Vector2(-25, 6), new THREE.Vector2(-18, 4),
            new THREE.Vector2(-12, 9), new THREE.Vector2(-5, 7),
            new THREE.Vector2(0, 12), new THREE.Vector2(5, 8),
            new THREE.Vector2(12, 10), new THREE.Vector2(18, 5),
            new THREE.Vector2(25, 7), new THREE.Vector2(35, 0),
        ];
        const mtShape = new THREE.Shape(mtPoints);
        const mtGeo = new THREE.ExtrudeGeometry(mtShape, { depth: 1, bevelEnabled: false });
        const mountains = new THREE.Mesh(mtGeo, new THREE.MeshBasicMaterial({ color: 0x0a0a15, transparent: true, opacity: 0.6 }));
        mountains.position.set(0, 0, -35);
        scene.add(mountains);

        [{ x: -12, h: 9 }, { x: 0, h: 12 }, { x: 12, h: 10 }].forEach(peak => {
            const snow = new THREE.Mesh(
                new THREE.ConeGeometry(1.5, 2, 4),
                new THREE.MeshBasicMaterial({ color: 0x334455, transparent: true, opacity: 0.3 })
            );
            snow.position.set(peak.x, peak.h, -35);
            scene.add(snow);
        });
    },

    /* ---- Drifting Clouds (dark, ghostly) ---- */
    buildClouds(scene) {
        this._clouds = [];
        for (let i = 0; i < 5; i++) {
            const cloudGroup = new THREE.Group();
            const cloudMat = new THREE.MeshBasicMaterial({ color: 0x2a2a3e, transparent: true, opacity: 0.25 });
            const puffCount = 3 + Math.floor(Math.random() * 3);
            for (let p = 0; p < puffCount; p++) {
                const puff = new THREE.Mesh(
                    new THREE.SphereGeometry(1.5 + Math.random() * 1.5, 6, 5),
                    cloudMat
                );
                puff.position.set(
                    (Math.random() - 0.5) * 3,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 1.5
                );
                puff.scale.y = 0.5;
                cloudGroup.add(puff);
            }
            cloudGroup.position.set(
                (Math.random() - 0.5) * 60,
                18 + Math.random() * 8,
                (Math.random() - 0.5) * 40
            );
            cloudGroup.userData.speed = 0.2 + Math.random() * 0.3;
            scene.add(cloudGroup);
            this._clouds.push(cloudGroup);
        }
    },

    /* ---- Ambient details (dark urban props) ---- */
    buildAmbientDetails(scene) {
        this._floatObjects = this._floatObjects || [];

        // Floating icosahedron
        const ico = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.8, 0),
            new THREE.MeshBasicMaterial({ color: 0x2a1a4e, transparent: true, opacity: 0.7 })
        );
        ico.position.set(3, 14, -5);
        scene.add(ico);
        this._floatObjects.push({ mesh: ico, type: 'float' });

        // Wireframe pyramid
        const pyr = new THREE.Mesh(
            new THREE.ConeGeometry(1.2, 2, 4),
            new THREE.MeshBasicMaterial({ color: 0x440044, wireframe: true, transparent: true, opacity: 0.5 })
        );
        pyr.position.set(-5, 12, 8);
        pyr.rotation.x = Math.PI;
        scene.add(pyr);
        this._floatObjects.push({ mesh: pyr, type: 'spin' });

        // Spectral figure
        const fMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a, transparent: true, opacity: 0.5 });
        const fig = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 3, 4), fMat);
        fig.position.set(22, 1.5, -8);
        scene.add(fig);
        const fHead = new THREE.Mesh(new THREE.SphereGeometry(0.25, 4, 4), fMat);
        fHead.position.set(22, 3.2, -8);
        scene.add(fHead);
    },

    /* ---- Character on map ---- */
    addCharacterToTown(scene) {
        const character = GameState.player.character;
        if (!character) return;
        this.creatureGroup = VoxelCreatures.build(character);
        this.creatureGroup.position.set(0, 0.3, 0);
        this.creatureGroup.scale.multiplyScalar(0.35);
        scene.add(this.creatureGroup);
    },

    /* ---- Animation ---- */
    animate(elapsed, delta) {
        // Drifting clouds
        if (this._clouds) {
            this._clouds.forEach(cloud => {
                cloud.position.x += cloud.userData.speed * delta;
                if (cloud.position.x > 35) cloud.position.x = -35;
            });
        }

        // Neon sign flicker
        if (this._neonSigns) {
            this._neonSigns.forEach(sign => {
                if (Math.random() > 0.97) {
                    sign.material.opacity = 0.2 + Math.random() * 0.3;
                } else {
                    sign.material.opacity = (sign.userData.baseOpacity || 0.9) + Math.sin(elapsed * 3) * 0.08;
                }
            });
        }

        // Ambient objects
        this._floatObjects.forEach(obj => {
            if (obj.type === 'float') {
                if (obj.mesh.userData.baseY === undefined) obj.mesh.userData.baseY = obj.mesh.position.y;
                obj.mesh.position.y = obj.mesh.userData.baseY + Math.sin(elapsed * 0.5) * 1.5;
                obj.mesh.rotation.x = elapsed * 0.3;
            } else if (obj.type === 'spin') {
                obj.mesh.rotation.y = elapsed * 0.7;
            } else if (obj.type === 'marker') {
                obj.mesh.material.opacity = 0.25 + Math.sin(elapsed * 2) * 0.15;
            } else if (obj.type === 'crystal') {
                obj.mesh.material.opacity = 0.5 + Math.sin(elapsed * 2) * 0.2;
                obj.mesh.material.emissiveIntensity = 0.3 + Math.sin(elapsed * 1.5) * 0.4;
                obj.mesh.rotation.y = elapsed * 0.5;
            }
        });

        // Character wander
        if (this.creatureGroup) {
            VoxelCreatures.animateCreature(this.creatureGroup, elapsed);
            this.creatureGroup.position.x = Math.sin(elapsed * 0.12) * 2;
            this.creatureGroup.position.z = Math.cos(elapsed * 0.08) * 2;
            this.creatureGroup.rotation.y = Math.atan2(
                Math.cos(elapsed * 0.12) * 2,
                -Math.sin(elapsed * 0.08) * 2
            );
        }
    },

    /* ---- Click Detection ---- */
    onClickTown(event) {
        if (!this.entry) return;

        const allMeshes = [];
        this.clickableBuildings.forEach(b => {
            b.traverse(child => { if (child.isMesh) allMeshes.push(child); });
        });

        const hits = VoxelEngine.raycast(this.entry, event, allMeshes);
        if (hits.length > 0) {
            const screenId = this.buildingMap.get(hits[0].object);
            if (screenId) App.navigateTo(screenId);
        }

        if (this.creatureGroup) {
            const cMeshes = [];
            this.creatureGroup.traverse(child => { if (child.isMesh) cMeshes.push(child); });
            const cHits = VoxelEngine.raycast(this.entry, event, cMeshes);
            if (cHits.length > 0) {
                VoxelCreatures.playBounce(this.creatureGroup);
                if (GameState.player.character) PetEngine.interactCharacter(GameState.player.character);
            }
        }
    },

    /* ---- Cleanup ---- */
    cleanup() {
        if (this.entry) {
            VoxelEngine.dispose(this.entry.id);
            this.entry = null;
        }
        this.creatureGroup = null;
        this.clickableBuildings = [];
        this.buildingMap = new Map();
        this._rain = null;
        this._clouds = null;
        this._floatObjects = [];
        this._neonSigns = [];
    },

    /* ---- Wall helper ---- */
    makeWall(x, y, z, w, h, d, mat) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        wall.position.set(x, y, z);
        return wall;
    },
};
