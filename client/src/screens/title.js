/* Screen: Title — Aespacecore + Chrome Y2K Landing */
import { screenRegistry } from '../engine/screenRegistry.js';
import { gameState } from '../state/gameState.js';
import { saveManager } from '../state/saveManager.js';
import * as THREE from 'three';

/* ---- Three.js Chrome Spheres Background ---- */
let bgScene, bgCamera, bgRenderer, bgSpheres, bgAnimId;

function initChromeSpheres(container) {
  const canvas = document.createElement('canvas');
  canvas.id = 'title-bg-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;';
  container.appendChild(canvas);

  bgScene = new THREE.Scene();
  bgScene.fog = new THREE.FogExp2(0x1E1040, 0.012);

  bgCamera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 200);
  bgCamera.position.set(0, 0, 30);

  bgRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  bgRenderer.setSize(container.offsetWidth, container.offsetHeight);
  bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  bgRenderer.setClearColor(0x000000, 0);

  // Lighting — bright chrome reflections
  const ambientLight = new THREE.AmbientLight(0xC4B5FD, 0.6);
  bgScene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0xFDA4AF, 1.5, 80);
  pointLight1.position.set(12, 10, 15);
  bgScene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x67E8F9, 1.3, 80);
  pointLight2.position.set(-12, -8, 12);
  bgScene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0xFFFFFF, 0.8, 60);
  pointLight3.position.set(0, 15, 20);
  bgScene.add(pointLight3);

  const pointLight4 = new THREE.PointLight(0xF9A8D4, 0.6, 50);
  pointLight4.position.set(-8, -4, 8);
  bgScene.add(pointLight4);

  // Env map for mirror-like chrome reflections
  const envMap = createGradientEnvMap();
  bgSpheres = [];

  const sphereConfigs = [
    { r: 4.0, x: -9, y: 5, z: -6, speed: 0.25, phase: 0 },
    { r: 2.5, x: 11, y: -4, z: -8, speed: 0.4, phase: 1.5 },
    { r: 1.8, x: -6, y: -7, z: -3, speed: 0.6, phase: 3 },
    { r: 5.0, x: 7, y: 7, z: -14, speed: 0.15, phase: 0.8 },
    { r: 1.2, x: -13, y: 1, z: -5, speed: 0.8, phase: 2.2 },
    { r: 3.0, x: 1, y: -9, z: -10, speed: 0.35, phase: 4 },
    { r: 1.5, x: 15, y: 4, z: -4, speed: 0.55, phase: 1 },
    { r: 0.9, x: -4, y: 9, z: -7, speed: 0.9, phase: 5 },
    { r: 2.0, x: -15, y: -5, z: -9, speed: 0.45, phase: 2.8 },
    { r: 1.0, x: 5, y: -12, z: -6, speed: 0.7, phase: 3.5 },
  ];

  for (const cfg of sphereConfigs) {
    const geo = new THREE.SphereGeometry(cfg.r, 48, 48);
    const mat = new THREE.MeshStandardMaterial({
      metalness: 1.0,
      roughness: 0.02,
      envMap,
      envMapIntensity: 2.0,
      color: 0xF0E8FF,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(cfg.x, cfg.y, cfg.z);
    mesh.userData = { originY: cfg.y, speed: cfg.speed, phase: cfg.phase, originX: cfg.x };
    bgScene.add(mesh);
    bgSpheres.push(mesh);
  }

  // Animate
  function animate() {
    bgAnimId = requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    for (const sphere of bgSpheres) {
      const d = sphere.userData;
      sphere.position.y = d.originY + Math.sin(t * d.speed + d.phase) * 2.0;
      sphere.position.x = d.originX + Math.sin(t * d.speed * 0.4 + d.phase + 1) * 1.2;
      sphere.rotation.y = t * 0.15;
      sphere.rotation.x = t * 0.05;
    }

    // Slow camera drift
    bgCamera.position.x = Math.sin(t * 0.06) * 3;
    bgCamera.position.y = Math.cos(t * 0.04) * 1.5;
    bgCamera.lookAt(0, 0, -5);

    // Animate lights for iridescent color shifts
    pointLight1.color.setHSL((t * 0.02) % 1, 0.7, 0.7);
    pointLight2.color.setHSL(((t * 0.02) + 0.33) % 1, 0.7, 0.65);

    bgRenderer.render(bgScene, bgCamera);
  }
  animate();

  // Handle resize
  const onResize = () => {
    if (!container.offsetWidth) return;
    bgCamera.aspect = container.offsetWidth / container.offsetHeight;
    bgCamera.updateProjectionMatrix();
    bgRenderer.setSize(container.offsetWidth, container.offsetHeight);
  };
  window.addEventListener('resize', onResize);
  container._resizeHandler = onResize;
}

function createGradientEnvMap() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Richer iridescent gradient for chrome reflections
  const grad1 = ctx.createLinearGradient(0, 0, size, size);
  grad1.addColorStop(0, '#E8D0FF');
  grad1.addColorStop(0.15, '#FFC0CB');
  grad1.addColorStop(0.3, '#80F0FF');
  grad1.addColorStop(0.45, '#FFB6E0');
  grad1.addColorStop(0.6, '#B0FFD8');
  grad1.addColorStop(0.75, '#C0B0FF');
  grad1.addColorStop(0.9, '#FFE0F0');
  grad1.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = grad1;
  ctx.fillRect(0, 0, size, size);

  // Add a highlight band for that mirror-like hot spot
  const grad2 = ctx.createRadialGradient(size * 0.3, size * 0.3, 0, size * 0.3, size * 0.3, size * 0.5);
  grad2.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  grad2.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  grad2.addColorStop(1, 'transparent');
  ctx.fillStyle = grad2;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return texture;
}

function disposeChromeSpheres(container) {
  if (bgAnimId) cancelAnimationFrame(bgAnimId);
  if (container && container._resizeHandler) {
    window.removeEventListener('resize', container._resizeHandler);
  }
  if (bgRenderer) {
    bgRenderer.dispose();
    bgRenderer.forceContextLoss();
  }
  if (bgSpheres) {
    for (const s of bgSpheres) {
      s.geometry.dispose();
      s.material.dispose();
    }
  }
  bgScene = bgCamera = bgRenderer = bgSpheres = bgAnimId = null;
}

/* ---- Title Screen ---- */
export const titleScreen = {
  _bgContainer: null,

  render() {
    const container = document.getElementById('screen-container');
    const hasSave = saveManager.hasSave();

    container.innerHTML = `
      <div class="screen-enter title-screen" id="title-root" style="
        min-height: 100%;
        position: relative;
        overflow: hidden;
        background: linear-gradient(160deg, #0E0820 0%, #1E1040 30%, #2A1854 60%, #1E1040 100%);
      ">
        <!-- Iridescent glow overlays -->
        <div style="
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            radial-gradient(ellipse at 25% 15%, rgba(196,181,253,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 75% 75%, rgba(253,164,175,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 90%, rgba(103,232,249,0.10) 0%, transparent 40%),
            radial-gradient(ellipse at 60% 30%, rgba(249,168,212,0.08) 0%, transparent 35%);
        "></div>

        <!-- Content -->
        <div class="title-content" style="
          position: relative; z-index: 2;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 100%; padding: 32px 24px;
        ">
          <!-- Sparkle decorations -->
          <div style="display:inline-flex; gap:8px; margin-bottom:12px;">
            <span class="glow-orb" style="animation-delay: 0s;"></span>
            <span style="font-size:16px; color:var(--pastel-lavender); animation: sparkle-twinkle 2s ease-in-out infinite;">✦</span>
            <span class="glow-orb" style="animation-delay: 0.5s;"></span>
            <span style="font-size:12px; color:var(--pastel-cyan); animation: sparkle-twinkle 2.5s ease-in-out infinite 0.3s;">✧</span>
            <span class="glow-orb" style="animation-delay: 1s;"></span>
            <span style="font-size:16px; color:var(--pastel-rose); animation: sparkle-twinkle 2s ease-in-out infinite 0.6s;">✦</span>
            <span class="glow-orb" style="animation-delay: 1.5s;"></span>
          </div>

          <!-- Chrome Logo -->
          <h1 class="chrome-text" style="
            font-family: var(--font-pixel);
            font-size: 28px;
            line-height: 1.4;
            letter-spacing: 3px;
            margin-bottom: 6px;
          ">cclottaaWorld</h1>

          <div class="iridescent-text" style="
            font-family: var(--font-retro);
            font-size: 26px;
            margin-bottom: 20px;
          ">♡ Your World Awaits ♡</div>

          <!-- Chrome divider -->
          <div class="chrome-divider" style="width: 320px; max-width: 80vw; margin: 0 auto 20px;"></div>

          <!-- Chrome-styled marquee -->
          <div class="chrome-marquee" style="width: 440px; max-width: 90vw; margin: 0 auto 24px; border-radius: 2px;">
            <div class="marquee-inner">
              ✦ Welcome to cclottaaWorld! ✦ Create your character ✦ Explore the city ✦ Play games ✦ Shop for cool stuff ✦ Make friends ✦ Raise a creature companion ✦
            </div>
          </div>

          <!-- Chrome Glass Buttons -->
          <div style="display: flex; flex-direction: column; gap: 12px; align-items: center; margin-bottom: 24px;">
            ${hasSave ? `
              <button class="chrome-btn rose" style="min-width: 260px; font-size: 12px; padding: 14px 36px;"
                      onclick="window.__app.continueGame()">▶ Continue Game</button>
            ` : ''}
            <button class="chrome-btn cyan" style="min-width: 260px; font-size: 12px; padding: 14px 36px;"
                    onclick="window.__app.navigateTo('select')">>> Create Character</button>
            <button class="chrome-btn lavender" style="min-width: 220px; font-size: 10px; padding: 10px 24px;"
                    onclick="document.getElementById('whatIs').style.display = document.getElementById('whatIs').style.display === 'none' ? 'block' : 'none'">? What is cclottaaWorld?</button>
            ${hasSave ? `
              <button class="chrome-btn" style="font-size: 9px; padding: 6px 16px; opacity: 0.6;"
                      onclick="titleScreen.confirmReset()">[x] Reset Save</button>
            ` : ''}
          </div>

          <!-- What is cclottaaWorld? -->
          <div id="whatIs" class="chrome-panel" style="
            display: none;
            max-width: 500px; width: 90vw;
            margin: 0 auto 24px;
            text-align: left;
          ">
            <h3 class="iridescent-text" style="
              font-family: var(--font-pixel);
              font-size: 10px;
              margin-bottom: 12px;
              letter-spacing: 2px;
            ">What is cclottaaWorld?</h3>
            <p style="font-family: var(--font-retro); font-size: 18px; color: var(--color-text-primary); line-height: 1.5; margin-bottom: 10px;">
              cclottaaWorld is a virtual pet & life sim set in a neon-lit city.
              Create your character, explore shops, play arcade games, decorate your apartment,
              and raise a digital creature companion.
            </p>
            <p style="font-family: var(--font-retro); font-size: 18px; color: var(--color-text-secondary); line-height: 1.5; margin-bottom: 10px;">
              Inspired by Chao Garden, Neopets, GaiaOnline, and the early 2000s internet —
              reimagined with a modern aespacecore aesthetic and low-poly 3D graphics.
            </p>
            <p style="font-family: var(--font-retro); font-size: 16px; color: var(--color-text-muted); line-height: 1.5;">
              Built with WebAssembly, WebGPU, and a lot of love. ♡
            </p>
          </div>

          <!-- Under construction with chrome badge -->
          <div style="margin-bottom: 14px; text-align: center;">
            <span class="chrome-badge" style="color: var(--pastel-rose); border-color: rgba(253,164,175,0.3);">
              /// UNDER CONSTRUCTION ///
            </span>
          </div>

          <!-- Webring with chrome styling -->
          <div class="chrome-panel" style="
            max-width: 420px; width: 90vw;
            padding: 8px 16px;
            text-align: center;
            font-family: var(--font-system);
            font-size: 12px;
            color: var(--color-text-muted);
          ">
            ◀ <span style="color: var(--pastel-cyan); cursor: pointer;">prev</span> |
            This site is part of the <b class="iridescent-text" style="font-size: 12px;">cclottaaWorld WebRing</b> |
            <span style="color: var(--pastel-cyan); cursor: pointer;">next</span> ▶
          </div>

          <!-- Chrome hit counter -->
          <div style="margin-top: 12px; text-align: center; font-family: var(--font-system); font-size: 11px; color: var(--color-text-muted);">
            You are visitor number:
            <span class="chrome-counter">
              <span class="digit">0</span>
              <span class="digit">0</span>
              <span class="digit">4</span>
              <span class="digit">8</span>
              <span class="digit">2</span>
              <span class="digit">9</span>
            </span>
          </div>

          <!-- Best viewed -->
          <div style="margin-top: 8px; font-family: var(--font-system); font-size: 10px; color: var(--color-text-muted); text-align: center;">
            [!] Best viewed in Internet Explorer 6.0 at 800x600 resolution [!]
          </div>
        </div>
      </div>
    `;

    // Mount Three.js chrome spheres
    const root = document.getElementById('title-root');
    this._bgContainer = root;
    initChromeSpheres(root);

    // Update browser chrome
    gameState.updateAddressBar('');
    gameState.updateStatus('Welcome to cclottaaWorld!', '✦');
  },

  confirmReset() {
    if (confirm('Are you sure you want to delete your save? Your character will be gone forever!')) {
      saveManager.deleteSave();
      window.__app.navigateTo('title');
    }
  },

  cleanup() { },

  cleanup3D() {
    if (this._bgContainer) {
      disposeChromeSpheres(this._bgContainer);
      this._bgContainer = null;
    }
  },
};

window.titleScreen = titleScreen;

screenRegistry.register('title', titleScreen, {
  title: 'Title',
  path: '',
  icon: '✦',
  category: 'general',
});
