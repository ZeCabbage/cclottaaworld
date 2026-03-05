//! Procedural terrain generator using noise.
//! Generates a chunk of voxels based on world-space coordinates.

use crate::world::chunk::{Chunk, CHUNK_SIZE};
use crate::utils::noise;

/// Generate a flat array of block IDs for the chunk at (cx, cz).
pub fn generate(cx: i32, cz: i32) -> Vec<u8> {
    let mut chunk = Chunk::new(cx, cz);

    let world_x_offset = cx as f64 * CHUNK_SIZE as f64;
    let world_z_offset = cz as f64 * CHUNK_SIZE as f64;

    for x in 0..CHUNK_SIZE {
        for z in 0..CHUNK_SIZE {
            let wx = world_x_offset + x as f64;
            let wz = world_z_offset + z as f64;

            // Multi-octave height calculation
            let base_height = noise::sample_2d(wx * 0.02, wz * 0.02) * 8.0 + 4.0;
            let detail = noise::sample_2d(wx * 0.1, wz * 0.1) * 2.0;
            let height = (base_height + detail).max(1.0).min(CHUNK_SIZE as f64 - 1.0) as usize;

            for y in 0..CHUNK_SIZE {
                let block_id = if y == 0 {
                    8 // Asphalt (bedrock layer)
                } else if y < height.saturating_sub(2) {
                    1 // Stone
                } else if y < height {
                    2 // Dirt
                } else if y == height {
                    3 // Grass
                } else {
                    0 // Air
                };

                chunk.set(x, y, z, block_id);
            }
        }
    }

    chunk.blocks.to_vec()
}
