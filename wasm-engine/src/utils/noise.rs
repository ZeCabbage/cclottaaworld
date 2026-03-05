//! Noise utilities for procedural generation.
//! Uses the `noise` crate for Perlin/Simplex noise.

use noise::{NoiseFn, Perlin, Seedable};

/// Global noise generator (seeded deterministically).
fn perlin() -> Perlin {
    Perlin::new(42)
}

/// Sample 2D Perlin noise at (x, z). Returns value in [-1, 1].
pub fn sample_2d(x: f64, z: f64) -> f64 {
    perlin().get([x, z])
}

/// Sample 3D Perlin noise at (x, y, z). Returns value in [-1, 1].
pub fn sample_3d(x: f64, y: f64, z: f64) -> f64 {
    perlin().get([x, y, z])
}
