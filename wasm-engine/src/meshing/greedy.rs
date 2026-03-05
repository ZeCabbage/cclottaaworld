//! Greedy Meshing Algorithm
//!
//! Merges coplanar, same-material voxel faces into larger quads
//! to dramatically reduce the number of triangles rendered.
//!
//! Reference: https://0fps.net/2012/06/30/meshing-in-a-block-world/

use serde::Serialize;
use crate::world::block::Block;
use crate::world::chunk::CHUNK_SIZE;

/// Output mesh data returned to JavaScript.
#[derive(Serialize)]
pub struct MeshBuffers {
    /// Packed vertex data: [x, y, z, nx, ny, nz, r, g, b] per vertex
    pub vertices: Vec<f32>,
    /// Triangle indices
    pub indices: Vec<u32>,
}

/// Run greedy meshing on a flat chunk data array (4096 u8 block IDs).
pub fn mesh(chunk_data: &[u8]) -> MeshBuffers {
    let mut vertices: Vec<f32> = Vec::new();
    let mut indices: Vec<u32> = Vec::new();

    if chunk_data.len() != CHUNK_SIZE * CHUNK_SIZE * CHUNK_SIZE {
        return MeshBuffers { vertices, indices };
    }

    // Helper to index into flat chunk data
    let get_block = |x: usize, y: usize, z: usize| -> u8 {
        if x >= CHUNK_SIZE || y >= CHUNK_SIZE || z >= CHUNK_SIZE {
            return 0;
        }
        chunk_data[y * CHUNK_SIZE * CHUNK_SIZE + z * CHUNK_SIZE + x]
    };

    // Process each of 6 face directions
    // Directions: +X, -X, +Y, -Y, +Z, -Z
    let directions: [(i32, i32, i32); 6] = [
        (1, 0, 0),   // +X (right)
        (-1, 0, 0),  // -X (left)
        (0, 1, 0),   // +Y (top)
        (0, -1, 0),  // -Y (bottom)
        (0, 0, 1),   // +Z (front)
        (0, 0, -1),  // -Z (back)
    ];

    let normals: [[f32; 3]; 6] = [
        [1.0, 0.0, 0.0],
        [-1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, -1.0, 0.0],
        [0.0, 0.0, 1.0],
        [0.0, 0.0, -1.0],
    ];

    for (dir_idx, (dx, dy, dz)) in directions.iter().enumerate() {
        let normal = normals[dir_idx];

        // Determine which axis is the "sweep" axis (the direction we're facing)
        // and the two axes that form the face plane.
        // For greedy meshing, we sweep slice-by-slice along the normal direction.

        // Axes: primary = normal direction, u and v = face plane directions
        let (primary_axis, u_axis, v_axis) = match dir_idx {
            0 | 1 => (0, 2, 1), // X-facing: sweep X, face is Z×Y
            2 | 3 => (1, 0, 2), // Y-facing: sweep Y, face is X×Z
            4 | 5 => (2, 0, 1), // Z-facing: sweep Z, face is X×Y
            _ => unreachable!(),
        };

        // Sweep through slices
        for slice in 0..CHUNK_SIZE {
            // Build a 2D mask for this slice
            let mut mask = [[0u8; CHUNK_SIZE]; CHUNK_SIZE]; // 0 = no face, >0 = block_id

            for u in 0..CHUNK_SIZE {
                for v in 0..CHUNK_SIZE {
                    let mut pos = [0usize; 3];
                    pos[primary_axis] = slice;
                    pos[u_axis] = u;
                    pos[v_axis] = v;

                    let block_id = get_block(pos[0], pos[1], pos[2]);
                    if block_id == 0 {
                        continue; // Air, no face
                    }

                    // Check neighbor in the normal direction
                    let nx = pos[0] as i32 + dx;
                    let ny = pos[1] as i32 + dy;
                    let nz = pos[2] as i32 + dz;

                    let neighbor = if nx < 0 || ny < 0 || nz < 0
                        || nx >= CHUNK_SIZE as i32
                        || ny >= CHUNK_SIZE as i32
                        || nz >= CHUNK_SIZE as i32
                    {
                        0 // Outside chunk = air
                    } else {
                        get_block(nx as usize, ny as usize, nz as usize)
                    };

                    let neighbor_block = Block::from_id(neighbor);
                    if neighbor_block.is_transparent() || neighbor == 0 {
                        mask[u][v] = block_id; // Face is visible
                    }
                }
            }

            // Greedy merge: sweep the 2D mask and merge adjacent same-type faces
            let mut visited = [[false; CHUNK_SIZE]; CHUNK_SIZE];

            for u in 0..CHUNK_SIZE {
                for v in 0..CHUNK_SIZE {
                    if visited[u][v] || mask[u][v] == 0 {
                        continue;
                    }

                    let block_id = mask[u][v];

                    // Expand width (along u)
                    let mut width = 1;
                    while u + width < CHUNK_SIZE && mask[u + width][v] == block_id && !visited[u + width][v] {
                        width += 1;
                    }

                    // Expand height (along v)
                    let mut height = 1;
                    'outer: while v + height < CHUNK_SIZE {
                        for du in 0..width {
                            if mask[u + du][v + height] != block_id || visited[u + du][v + height] {
                                break 'outer;
                            }
                        }
                        height += 1;
                    }

                    // Mark as visited
                    for du in 0..width {
                        for dv in 0..height {
                            visited[u + du][v + dv] = true;
                        }
                    }

                    // Emit quad
                    let color = Block::from_id(block_id).color();
                    let base_vertex = (vertices.len() / 9) as u32;

                    // Calculate the 4 corner positions of the merged quad
                    let offset = if *dx > 0 || *dy > 0 || *dz > 0 { 1.0 } else { 0.0 };

                    let mut corners = [[0.0f32; 3]; 4];
                    for corner in &mut corners {
                        corner[primary_axis] = slice as f32 + offset;
                    }

                    // Corner 0: (u, v)
                    corners[0][u_axis] = u as f32;
                    corners[0][v_axis] = v as f32;
                    // Corner 1: (u + width, v)
                    corners[1][u_axis] = (u + width) as f32;
                    corners[1][v_axis] = v as f32;
                    // Corner 2: (u + width, v + height)
                    corners[2][u_axis] = (u + width) as f32;
                    corners[2][v_axis] = (v + height) as f32;
                    // Corner 3: (u, v + height)
                    corners[3][u_axis] = u as f32;
                    corners[3][v_axis] = (v + height) as f32;

                    // Push 4 vertices (each: x, y, z, nx, ny, nz, r, g, b)
                    for corner in &corners {
                        vertices.extend_from_slice(corner);
                        vertices.extend_from_slice(&normal);
                        vertices.extend_from_slice(&color);
                    }

                    // Push 2 triangles (6 indices) — correct winding for face direction
                    if dir_idx % 2 == 0 {
                        // Positive direction
                        indices.extend_from_slice(&[
                            base_vertex, base_vertex + 1, base_vertex + 2,
                            base_vertex, base_vertex + 2, base_vertex + 3,
                        ]);
                    } else {
                        // Negative direction (flipped winding)
                        indices.extend_from_slice(&[
                            base_vertex, base_vertex + 2, base_vertex + 1,
                            base_vertex, base_vertex + 3, base_vertex + 2,
                        ]);
                    }
                }
            }
        }
    }

    MeshBuffers { vertices, indices }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_chunk_produces_no_mesh() {
        let data = vec![0u8; CHUNK_SIZE * CHUNK_SIZE * CHUNK_SIZE];
        let mesh = mesh(&data);
        assert!(mesh.vertices.is_empty());
        assert!(mesh.indices.is_empty());
    }

    #[test]
    fn test_single_block_produces_faces() {
        let mut data = vec![0u8; CHUNK_SIZE * CHUNK_SIZE * CHUNK_SIZE];
        // Place one stone block at (0, 0, 0)
        data[0] = 1;
        let result = mesh(&data);
        // A single exposed block should have faces
        assert!(!result.vertices.is_empty());
        assert!(!result.indices.is_empty());
    }

    #[test]
    fn test_full_layer_merges() {
        let mut data = vec![0u8; CHUNK_SIZE * CHUNK_SIZE * CHUNK_SIZE];
        // Fill bottom layer (y=0) with stone
        for z in 0..CHUNK_SIZE {
            for x in 0..CHUNK_SIZE {
                data[0 * CHUNK_SIZE * CHUNK_SIZE + z * CHUNK_SIZE + x] = 1;
            }
        }
        let result = mesh(&data);
        // Should have merged quads — far fewer vertices than 16*16*6 faces
        let face_count = result.indices.len() / 6;
        // With greedy meshing, a uniform 16x16 face should merge to 1 quad per direction
        assert!(face_count < 16 * 16, "Greedy meshing should reduce face count");
    }
}
