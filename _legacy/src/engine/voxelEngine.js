/* ============================================
   Voxel Engine — Three.js Scene Manager
   Handles scene setup, animation loops, and
   shared voxel building utilities.
   OPTIMIZED for integrated GPUs (2017 MacBook)
   ============================================ */

const VoxelEngine = {

    /* Active scene references (one per mount point) */
    activeScenes: {},

    /* ---- Shared caches (reuse geometry + materials across all scenes) ---- */
    _geoCache: {},      // key: 'w_h_d' → BoxGeometry
    _matCache: {},      // key: 'color_rough_metal' → MeshStandardMaterial
    _frameBudgetMs: 33, // ~30fps cap

    getSharedGeo(w, h, d) {
        const key = `${w}_${h}_${d}`;
        if (!this._geoCache[key]) {
            this._geoCache[key] = new THREE.BoxGeometry(w, h, d);
        }
        return this._geoCache[key];
    },

    getSharedMat(color, opts = {}) {
        const r = opts.roughness !== undefined ? opts.roughness : 0.7;
        const m = opts.metalness !== undefined ? opts.metalness : 0.05;
        const flat = opts.flatShading ? 1 : 0;
        const key = `${color}_${r}_${m}_${flat}`;
        if (!this._matCache[key]) {
            this._matCache[key] = new THREE.MeshStandardMaterial({
                color: new THREE.Color(color),
                roughness: r,
                metalness: m,
                flatShading: !!opts.flatShading,
            });
        }
        return this._matCache[key];
    },

    /* ---- Scene Creation ---- */
    createScene(containerId, options = {}) {
        const container = typeof containerId === 'string'
            ? document.getElementById(containerId)
            : containerId;
        if (!container) return null;

        // Dispose existing scene for this container
        if (container._voxelId && this.activeScenes[container._voxelId]) {
            this.dispose(container._voxelId);
        }

        const id = 'voxel_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
        container._voxelId = id;

        const width = container.clientWidth || 600;
        const height = options.height || container.clientHeight || 400;

        // Renderer — OPTIMIZED: no antialias, capped pixel ratio, no shadows
        const renderer = new THREE.WebGLRenderer({
            antialias: false,         // Major perf win on integrated GPUs
            alpha: true,
            powerPreference: 'low-power',  // Prefer integrated GPU (don't fight discrete)
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(1);    // Force 1x — no retina overhead
        renderer.shadowMap.enabled = false;  // Shadows off — huge GPU savings
        renderer.outputEncoding = THREE.sRGBEncoding;
        // No tone mapping — saves a post-process pass
        renderer.setClearColor(0x000000, 0);

        const canvas = renderer.domElement;
        canvas.style.display = 'block';
        canvas.style.borderRadius = options.borderRadius || '0';
        container.appendChild(canvas);

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const fov = options.fov || 50;
        const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 500);
        const camPos = options.cameraPosition || { x: 0, y: 5, z: 10 };
        camera.position.set(camPos.x, camPos.y, camPos.z);

        const lookAt = options.lookAt || { x: 0, y: 0, z: 0 };
        camera.lookAt(lookAt.x, lookAt.y, lookAt.z);

        // Lighting
        this.addLighting(scene, options);

        // Fog (atmosphere!)
        if (options.fog !== false) {
            const fogColor = options.fogColor || 0x88bbee;
            scene.fog = new THREE.FogExp2(fogColor, options.fogDensity || 0.015);
        }

        // Clock
        const clock = new THREE.Clock();

        // Store
        const entry = {
            id, container, renderer, scene, camera, clock,
            width, height,
            animationId: null,
            animationCallbacks: [],
            disposed: false,
            controls: null,
        };
        this.activeScenes[id] = entry;

        // Resize observer
        const resizeObserver = new ResizeObserver(() => {
            if (entry.disposed) return;
            const w = container.clientWidth;
            const h = options.height || container.clientHeight || 400;
            entry.width = w;
            entry.height = h;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
        resizeObserver.observe(container);
        entry.resizeObserver = resizeObserver;

        return entry;
    },

    /* ---- Lighting setup ---- */
    addLighting(scene, options = {}) {
        // Ambient
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambient);

        // Directional (sun) — no shadows
        const sun = new THREE.DirectionalLight(0xfff4e0, 1.2);
        sun.position.set(8, 12, 6);
        scene.add(sun);

        // Hemisphere (sky/ground bounce)
        const hemi = new THREE.HemisphereLight(0x87ceeb, 0x556b2f, 0.4);
        scene.add(hemi);
    },

    /* ---- Animation Loop ---- */
    startLoop(sceneId) {
        const entry = this.activeScenes[sceneId];
        if (!entry || entry.disposed) return;

        let lastRenderTime = 0;
        const budget = this._frameBudgetMs;
        const tick = (now) => {
            if (entry.disposed) return;
            entry.animationId = requestAnimationFrame(tick);

            // Frame budget — skip render if under threshold
            if (now - lastRenderTime < budget) return;
            lastRenderTime = now;

            const delta = entry.clock.getDelta();
            const elapsed = entry.clock.getElapsedTime();

            // Run registered callbacks
            for (const cb of entry.animationCallbacks) {
                cb(delta, elapsed);
            }

            // Update controls if present
            if (entry.controls && entry.controls.update) {
                entry.controls.update();
            }

            entry.renderer.render(entry.scene, entry.camera);
        };
        requestAnimationFrame(tick);
    },

    onAnimate(sceneId, callback) {
        const entry = this.activeScenes[sceneId];
        if (entry) entry.animationCallbacks.push(callback);
    },

    /* ---- Orbit Controls ---- */
    addOrbitControls(sceneId, options = {}) {
        const entry = this.activeScenes[sceneId];
        if (!entry || typeof THREE.OrbitControls === 'undefined') return null;

        const controls = new THREE.OrbitControls(entry.camera, entry.renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enablePan = options.enablePan !== undefined ? options.enablePan : false;
        controls.minDistance = options.minDistance || 3;
        controls.maxDistance = options.maxDistance || 25;
        controls.maxPolarAngle = options.maxPolarAngle || Math.PI / 2.1;
        controls.minPolarAngle = options.minPolarAngle || 0.3;
        if (options.target) controls.target.set(options.target.x, options.target.y, options.target.z);
        controls.update();
        entry.controls = controls;
        return controls;
    },

    /* ---- Disposal ---- */
    dispose(sceneId) {
        const entry = this.activeScenes[sceneId];
        if (!entry) return;
        entry.disposed = true;

        if (entry.animationId) cancelAnimationFrame(entry.animationId);
        if (entry.resizeObserver) entry.resizeObserver.disconnect();
        if (entry.controls && entry.controls.dispose) entry.controls.dispose();

        // Dispose Three.js objects
        entry.scene.traverse(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                else obj.material.dispose();
            }
        });
        entry.renderer.dispose();

        // Remove canvas
        if (entry.renderer.domElement && entry.renderer.domElement.parentNode) {
            entry.renderer.domElement.parentNode.removeChild(entry.renderer.domElement);
        }

        delete this.activeScenes[sceneId];
    },

    disposeAll() {
        for (const id of Object.keys(this.activeScenes)) {
            this.dispose(id);
        }
    },

    /* ============================================
       VOXEL BUILDING UTILITIES
       ============================================ */

    /* Create a single voxel (cube) — uses shared geometry/material */
    createVoxel(x, y, z, color, size = 1) {
        const geo = this.getSharedGeo(size, size, size);
        const mat = this.getSharedMat(color, { roughness: 0.7, metalness: 0.05 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        return mesh;
    },

    /* Create a group of voxels from a 3D array definition
       layers[y][z][x] = color or null */
    buildFromLayers(layers, offsetX = 0, offsetY = 0, offsetZ = 0, voxelSize = 1) {
        const group = new THREE.Group();
        for (let y = 0; y < layers.length; y++) {
            for (let z = 0; z < layers[y].length; z++) {
                for (let x = 0; x < layers[y][z].length; x++) {
                    const color = layers[y][z][x];
                    if (color) {
                        const voxel = this.createVoxel(
                            offsetX + x * voxelSize,
                            offsetY + y * voxelSize,
                            offsetZ + z * voxelSize,
                            color, voxelSize
                        );
                        group.add(voxel);
                    }
                }
            }
        }
        return group;
    },

    /* Create a flat platform (ground tile) — uses shared geometry */
    createPlatform(width, depth, color, y = 0) {
        const geo = this.getSharedGeo(width, 0.3, depth);
        const mat = this.getSharedMat(color, { roughness: 0.9, metalness: 0 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = y;
        return mesh;
    },

    /* HSL helper (0-360, 0-100, 0-100) → THREE.Color */
    hslColor(h, s, l) {
        return new THREE.Color().setHSL(h / 360, s / 100, l / 100);
    },

    /* Lerp colors */
    lerpColor(c1, c2, t) {
        const a = new THREE.Color(c1);
        const b = new THREE.Color(c2);
        return a.lerp(b, t);
    },

    /* Raycasting helper */
    raycast(entry, event, objects) {
        const rect = entry.renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, entry.camera);
        return raycaster.intersectObjects(objects, true);
    },
};
