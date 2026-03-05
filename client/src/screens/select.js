/* Screen: Character Creator — 7-Step Customization with 3D Preview */
import { screenRegistry } from '../engine/screenRegistry.js';
import { gameState } from '../state/gameState.js';
import { characterConfig, createDefaultCharacter } from '../data/characterConfig.js';
import { buildCharacterModel } from '../engine/characterModel.js';
import * as THREE from 'three';

/* ---- State ---- */
let charState = createDefaultCharacter();
let currentStep = 0;
let scene, camera, renderer3d, charGroup, animId, platform;

const steps = [
  { id: 'skin', title: 'Skin Tone', icon: '🎨' },
  { id: 'hair', title: 'Hair', icon: '💇' },
  { id: 'eyes', title: 'Eyes', icon: '👁️' },
  { id: 'expression', title: 'Expression', icon: '😊' },
  { id: 'top', title: 'Top', icon: '👕' },
  { id: 'bottom', title: 'Bottom', icon: '👖' },
  { id: 'shoes', title: 'Shoes & Socks', icon: '👟' },
];

/* ---- 3D Preview ---- */
function init3DPreview(viewport) {
  scene = new THREE.Scene();

  // Aespacecore room: deep indigo with iridescent mist
  scene.background = new THREE.Color(0x150E30);
  scene.fog = new THREE.FogExp2(0x150E30, 0.04);

  camera = new THREE.PerspectiveCamera(35, viewport.offsetWidth / viewport.offsetHeight, 0.1, 100);
  camera.position.set(0, 0.6, 5.0);
  camera.lookAt(0, 0.2, 0);

  renderer3d = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer3d.setSize(viewport.offsetWidth, viewport.offsetHeight);
  renderer3d.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer3d.outputColorSpace = THREE.SRGBColorSpace;
  renderer3d.toneMapping = THREE.ACESFilmicToneMapping;
  renderer3d.toneMappingExposure = 1.3;
  viewport.appendChild(renderer3d.domElement);

  // Studio lighting — warm iridescent
  scene.add(new THREE.AmbientLight(0xC4B5FD, 0.5));

  const key = new THREE.DirectionalLight(0xFFFFFF, 1.4);
  key.position.set(3, 5, 4);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x67E8F9, 0.6);
  fill.position.set(-4, 3, 2);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xFDA4AF, 0.5);
  rim.position.set(0, 2, -4);
  scene.add(rim);

  // Iridescent point lights for room ambience
  const glowCyan = new THREE.PointLight(0x67E8F9, 0.3, 12);
  glowCyan.position.set(-3, 0, -2);
  scene.add(glowCyan);

  const glowRose = new THREE.PointLight(0xFDA4AF, 0.3, 12);
  glowRose.position.set(3, 0.5, -2);
  scene.add(glowRose);

  // Floor — reflective chrome platform
  const platGeo = new THREE.CylinderGeometry(1.4, 1.5, 0.06, 48);
  const platMat = new THREE.MeshStandardMaterial({
    color: 0x2A1854,
    roughness: 0.1,
    metalness: 0.8,
  });
  platform = new THREE.Mesh(platGeo, platMat);
  platform.position.y = -1.15;
  scene.add(platform);

  // Glowing ring around platform
  const ringGeo = new THREE.TorusGeometry(1.45, 0.012, 8, 64);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x67E8F9,
    emissive: 0x67E8F9,
    emissiveIntensity: 0.6,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = -1.12;
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  // Inner ring (rose)
  const ring2Geo = new THREE.TorusGeometry(1.0, 0.008, 8, 48);
  const ring2Mat = new THREE.MeshStandardMaterial({
    color: 0xFDA4AF,
    emissive: 0xFDA4AF,
    emissiveIntensity: 0.4,
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.position.y = -1.12;
  ring2.rotation.x = Math.PI / 2;
  scene.add(ring2);

  // Small floating chrome orbs for room deco
  const envMap = createMiniEnvMap();
  const orbConfigs = [
    { r: 0.12, x: -2.5, y: 0.5, z: -2, speed: 0.5, phase: 0 },
    { r: 0.08, x: 2.3, y: 1.0, z: -1.5, speed: 0.7, phase: 2 },
    { r: 0.15, x: -1.8, y: 1.5, z: -3, speed: 0.3, phase: 1 },
    { r: 0.1, x: 2.0, y: -0.3, z: -2.5, speed: 0.6, phase: 3 },
  ];
  const orbs = [];
  for (const cfg of orbConfigs) {
    const g = new THREE.SphereGeometry(cfg.r, 16, 16);
    const m = new THREE.MeshStandardMaterial({
      metalness: 1.0, roughness: 0.02,
      envMap, envMapIntensity: 1.5,
      color: 0xF0E8FF,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(cfg.x, cfg.y, cfg.z);
    mesh.userData = { ...cfg, originY: cfg.y };
    scene.add(mesh);
    orbs.push(mesh);
  }

  // Build character
  rebuildCharacter();

  function animate() {
    animId = requestAnimationFrame(animate);
    const t = performance.now() * 0.001;
    if (charGroup) charGroup.rotation.y += 0.008;
    // Float orbs
    for (const orb of orbs) {
      orb.position.y = orb.userData.originY + Math.sin(t * orb.userData.speed + orb.userData.phase) * 0.3;
    }
    renderer3d.render(scene, camera);
  }
  animate();

  const onResize = () => {
    if (!viewport.offsetWidth) return;
    camera.aspect = viewport.offsetWidth / viewport.offsetHeight;
    camera.updateProjectionMatrix();
    renderer3d.setSize(viewport.offsetWidth, viewport.offsetHeight);
  };
  window.addEventListener('resize', onResize);
  viewport._resizeHandler = onResize;
}

function createMiniEnvMap() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 128, 128);
  g.addColorStop(0, '#E8D0FF');
  g.addColorStop(0.3, '#80F0FF');
  g.addColorStop(0.6, '#FFB6E0');
  g.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  return tex;
}

function rebuildCharacter() {
  if (charGroup && scene) {
    scene.remove(charGroup);
    charGroup.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
  }
  charGroup = buildCharacterModel(charState);
  if (scene) scene.add(charGroup);
}

function dispose3D(viewport) {
  if (animId) cancelAnimationFrame(animId);
  if (viewport && viewport._resizeHandler) {
    window.removeEventListener('resize', viewport._resizeHandler);
  }
  if (renderer3d) {
    renderer3d.dispose();
    renderer3d.forceContextLoss();
  }
  scene = camera = renderer3d = charGroup = animId = platform = null;
}

/* ---- Step Content Renderers ---- */
function getStepHTML(stepId) {
  switch (stepId) {
    case 'skin':
      return swatchesHTML(characterConfig.skinTones, charState.skinTone, 'skinTone');
    case 'hair':
      return chipsHTML(characterConfig.hairStyles, charState.hairStyle, 'hairStyle')
        + subHeading('Hair Color')
        + swatchesHTML(characterConfig.hairColors, charState.hairColor, 'hairColor');
    case 'eyes':
      return chipsHTML(characterConfig.eyeTypes, charState.eyeType, 'eyeType')
        + subHeading('Eye Color')
        + swatchesHTML(characterConfig.eyeColors, charState.eyeColor, 'eyeColor');
    case 'expression':
      return emojiChipsHTML(characterConfig.expressions, charState.expression, 'expression');
    case 'top':
      return chipsHTML(characterConfig.tops, charState.top, 'top')
        + subHeading('Color')
        + swatchesHTML(characterConfig.topColors, charState.topColor, 'topColor');
    case 'bottom':
      return chipsHTML(characterConfig.bottoms, charState.bottom, 'bottom')
        + subHeading('Color')
        + swatchesHTML(characterConfig.bottomColors, charState.bottomColor, 'bottomColor');
    case 'shoes':
      return subHeading('Shoes')
        + chipsHTML(characterConfig.shoes, charState.shoes, 'shoes')
        + subHeading('Socks')
        + chipsHTML(characterConfig.socks, charState.socks, 'socks');
    default: return '';
  }
}

function subHeading(text) {
  return `<div style="font-family:var(--font-pixel);font-size:9px;color:var(--pastel-lavender);text-transform:uppercase;letter-spacing:1px;margin:12px 0 8px;opacity:0.7;">${text}</div>`;
}

function swatchesHTML(items, selectedId, field) {
  return `<div class="swatch-picker">${items.map(item =>
    `<div class="swatch ${item.id === selectedId ? 'active' : ''}"
          style="background:${item.color};"
          title="${item.name}"
          onclick="window._charPick('${field}','${item.id}')"></div>`
  ).join('')}</div>`;
}

function chipsHTML(items, selectedId, field) {
  return `<div class="option-row">${items.map(item =>
    `<div class="option-chip ${item.id === selectedId ? 'selected' : ''}"
          onclick="window._charPick('${field}','${item.id}')">${item.name}</div>`
  ).join('')}</div>`;
}

function emojiChipsHTML(items, selectedId, field) {
  return `<div class="option-row">${items.map(item =>
    `<div class="option-chip ${item.id === selectedId ? 'selected' : ''}"
          onclick="window._charPick('${field}','${item.id}')"
          style="font-size:18px;padding:6px 12px;"
          title="${item.name}">${item.emoji} <span style="font-size:14px;">${item.name}</span></div>`
  ).join('')}</div>`;
}

/* ---- UI Update (no full re-render) ---- */
function updateStepUI() {
  // Update step title
  const titleEl = document.getElementById('step-title');
  if (titleEl) {
    titleEl.innerHTML = `
      <div style="font-family:var(--font-pixel);font-size:10px;color:var(--pastel-lavender);text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">
        Step ${currentStep + 1} of ${steps.length}
      </div>
      <div class="chrome-text" style="font-family:var(--font-pixel);font-size:13px;">
        ${steps[currentStep].icon} ${steps[currentStep].title}
      </div>
    `;
  }

  // Update step options
  const optEl = document.getElementById('step-options');
  if (optEl) optEl.innerHTML = getStepHTML(steps[currentStep].id);

  // Update step dots
  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    if (i === currentStep) {
      dot.style.background = 'var(--pastel-cyan)';
      dot.style.boxShadow = '0 0 6px rgba(103,232,249,0.5)';
    } else if (i < currentStep) {
      dot.style.background = 'var(--pastel-lavender)';
      dot.style.boxShadow = 'none';
    } else {
      dot.style.background = 'rgba(255,255,255,0.15)';
      dot.style.boxShadow = 'none';
    }
  });

  // Update nav buttons
  const navEl = document.getElementById('step-nav-buttons');
  if (navEl) {
    navEl.innerHTML = `
      <button class="chrome-btn lavender" style="flex:1;font-size:10px;padding:10px;${currentStep === 0 ? 'opacity:0.3;pointer-events:none;' : ''}"
              onclick="window._selectPrev()">← Prev</button>
      ${currentStep < steps.length - 1 ? `
        <button class="chrome-btn cyan" style="flex:1;font-size:10px;padding:10px;"
                onclick="window._selectNext()">Next →</button>
      ` : `
        <button class="chrome-btn rose" style="flex:1;font-size:10px;padding:10px;"
                onclick="window._selectFinish()">✦ Create! ✦</button>
      `}
    `;
  }
}

/* ---- Screen ---- */
export const selectScreen = {
  render() {
    const container = document.getElementById('screen-container');
    charState = createDefaultCharacter();
    currentStep = 0;

    // Make screen-container fill available height
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.height = '100%';

    container.innerHTML = `
      <div style="display:flex;flex-direction:column;flex:1;min-height:0;background:var(--color-bg-deep);">
        <!-- Header -->
        <div style="
          padding:10px 16px;
          display:flex;align-items:center;justify-content:space-between;
          border-bottom:1px solid var(--panel-border);
          flex-shrink:0;
        ">
          <button class="chrome-btn" style="font-size:9px;padding:6px 12px;"
                  onclick="window.__app.navigateTo('title')">← Back</button>
          <h2 class="iridescent-text" style="font-family:var(--font-pixel);font-size:11px;letter-spacing:2px;">
            CHARACTER CREATOR
          </h2>
          <div style="width:60px;"></div>
        </div>

        <!-- Main: 3D preview + options -->
        <div style="flex:1;display:flex;min-height:0;">
          <!-- 3D Preview (fills left side) -->
          <div id="char-preview" style="
            flex:1;min-width:200px;position:relative;
            border-right:1px solid var(--panel-border);
          "></div>

          <!-- Options Panel (right side, scrollable) -->
          <div style="
            width:340px;max-width:45vw;
            display:flex;flex-direction:column;
            background:var(--color-bg-surface);
          ">
            <!-- Step title -->
            <div id="step-title" style="padding:14px 16px 10px;border-bottom:1px solid var(--panel-border);flex-shrink:0;">
              <div style="font-family:var(--font-pixel);font-size:10px;color:var(--pastel-lavender);text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">
                Step ${currentStep + 1} of ${steps.length}
              </div>
              <div class="chrome-text" style="font-family:var(--font-pixel);font-size:13px;">
                ${steps[currentStep].icon} ${steps[currentStep].title}
              </div>
            </div>

            <!-- Step options (scrollable) -->
            <div id="step-options" style="flex:1;overflow-y:auto;padding:14px 16px;min-height:0;">
              ${getStepHTML(steps[currentStep].id)}
            </div>

            <!-- Navigation -->
            <div style="padding:10px 16px;border-top:1px solid var(--panel-border);flex-shrink:0;">
              <div style="display:flex;justify-content:center;gap:6px;margin-bottom:10px;">
                ${steps.map((s, i) => `
                  <div class="step-dot" style="
                    width:8px;height:8px;border-radius:50%;cursor:pointer;transition:all 0.2s;
                    background:${i === 0 ? 'var(--pastel-cyan)' : 'rgba(255,255,255,0.15)'};
                    ${i === 0 ? 'box-shadow:0 0 6px rgba(103,232,249,0.5);' : ''}
                  " onclick="window._selectNav(${i})" title="${s.title}"></div>
                `).join('')}
              </div>
              <div id="step-nav-buttons" style="display:flex;gap:8px;">
                <button class="chrome-btn lavender" style="flex:1;font-size:10px;padding:10px;opacity:0.3;pointer-events:none;"
                        onclick="window._selectPrev()">← Prev</button>
                <button class="chrome-btn cyan" style="flex:1;font-size:10px;padding:10px;"
                        onclick="window._selectNext()">Next →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Init 3D preview
    const viewport = document.getElementById('char-preview');
    if (viewport) init3DPreview(viewport);

    gameState.updateAddressBar('create');
    gameState.updateStatus('Create Your Character', '🧍');
  },

  cleanup() {
    const container = document.getElementById('screen-container');
    if (container) {
      container.style.display = '';
      container.style.flexDirection = '';
      container.style.height = '';
    }
  },

  cleanup3D() {
    const viewport = document.getElementById('char-preview');
    dispose3D(viewport);
  },
};

/* ---- Global handlers (in-place updates, no full re-render) ---- */
window._charPick = (field, value) => {
  charState[field] = value;
  rebuildCharacter();
  updateStepUI();
};

window._selectNext = () => {
  if (currentStep < steps.length - 1) {
    currentStep++;
    updateStepUI();
  }
};

window._selectPrev = () => {
  if (currentStep > 0) {
    currentStep--;
    updateStepUI();
  }
};

window._selectNav = (i) => {
  currentStep = i;
  updateStepUI();
};

window._selectFinish = () => {
  Object.assign(gameState.player, {
    skinTone: charState.skinTone,
    hairStyle: charState.hairStyle,
    hairColor: charState.hairColor,
    eyeType: charState.eyeType,
    eyeColor: charState.eyeColor,
    expression: charState.expression,
    top: charState.top,
    topColor: charState.topColor,
    bottom: charState.bottom,
    bottomColor: charState.bottomColor,
    shoes: charState.shoes,
    socks: charState.socks,
    gameStarted: true,
  });
  window.__app.navigateTo('town');
};

screenRegistry.register('select', selectScreen, {
  title: 'Character Creator',
  path: 'create',
  icon: '🧍',
  category: 'general',
});
