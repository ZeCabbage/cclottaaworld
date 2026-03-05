/* Asset generation routes */

import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { buildingGen } from '../generators/buildingGen.js';
import { characterGen } from '../generators/characterGen.js';
import { itemGen } from '../generators/itemGen.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../../output');

export const assetRoutes = Router();

// Generator map
const generators = {
    building: buildingGen,
    character: characterGen,
    item: itemGen,
};

/**
 * GET /api/assets/:type/:id
 * Returns a .glb file for the requested asset.
 * If not cached, generates it on the fly.
 */
assetRoutes.get('/:type/:id', async (req, res) => {
    const { type, id } = req.params;

    const generator = generators[type];
    if (!generator) {
        return res.status(400).json({ error: `Unknown asset type: ${type}` });
    }

    const filename = `${type}_${id}.glb`;
    const filepath = path.join(OUTPUT_DIR, filename);

    // Check cache
    if (fs.existsSync(filepath)) {
        res.setHeader('Content-Type', 'model/gltf-binary');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.sendFile(filepath);
    }

    // Generate asset
    try {
        console.log(`[Assets] Generating ${type}/${id}...`);
        const glbBuffer = await generator.generate(id, req.query);

        // Ensure output dir exists
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });

        // Write to cache
        fs.writeFileSync(filepath, Buffer.from(glbBuffer));

        res.setHeader('Content-Type', 'model/gltf-binary');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(Buffer.from(glbBuffer));
        console.log(`[Assets] Generated and cached: ${filename}`);
    } catch (error) {
        console.error(`[Assets] Generation failed for ${type}/${id}:`, error);
        res.status(500).json({ error: 'Asset generation failed', details: error.message });
    }
});

/**
 * GET /api/assets/:type
 * List available assets of a type.
 */
assetRoutes.get('/:type', (req, res) => {
    const { type } = req.params;

    if (!generators[type]) {
        return res.status(400).json({ error: `Unknown asset type: ${type}` });
    }

    // List cached assets
    const files = fs.existsSync(OUTPUT_DIR)
        ? fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith(`${type}_`) && f.endsWith('.glb'))
        : [];

    res.json({
        type,
        cached: files.map(f => f.replace(`${type}_`, '').replace('.glb', '')),
        count: files.length,
    });
});
