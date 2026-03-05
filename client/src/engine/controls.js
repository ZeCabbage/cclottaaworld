/* ============================================
   Controls — OrbitControls wrapper + input handling
   ============================================ */

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const controls = {
    /**
     * Add orbit controls to a scene entry.
     * @param {{ camera, renderer }} entry - Scene entry from sceneManager
     * @param {object} options
     * @returns {OrbitControls}
     */
    addOrbitControls(entry, options = {}) {
        const {
            enableDamping = true,
            dampingFactor = 0.08,
            enableZoom = true,
            minDistance = 10,
            maxDistance = 120,
            maxPolarAngle = Math.PI / 2.1,
            autoRotate = false,
            autoRotateSpeed = 0.3,
        } = options;

        const ctrl = new OrbitControls(entry.camera, entry.renderer.domElement);
        ctrl.enableDamping = enableDamping;
        ctrl.dampingFactor = dampingFactor;
        ctrl.enableZoom = enableZoom;
        ctrl.minDistance = minDistance;
        ctrl.maxDistance = maxDistance;
        ctrl.maxPolarAngle = maxPolarAngle;
        ctrl.autoRotate = autoRotate;
        ctrl.autoRotateSpeed = autoRotateSpeed;

        return ctrl;
    },
};
