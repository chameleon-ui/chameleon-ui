/**
 * PNG image utilities (@chameleon-ui/utils).
 *
 * Framework-free, zero-native-dependency image helpers built on `pngjs`.
 *
 * NOTE: These are generic image-processing primitives (decode, encode,
 * clear a region). They are NOT a watermark-detection/removal feature and
 * must never be used to strip authorship/ownership marks from images you do
 * not have the right to modify. Always handle only assets you own or are
 * licensed to alter.
 */

import { PNG } from 'pngjs';
import type { PNGWithMetadata } from 'pngjs';

/** A region of an image, in pixel coordinates (0-based, exclusive of `x1`/`y1`). */
export interface PixelRegion {
  /** Left column (inclusive). */
  x0: number;
  /** Top row (inclusive). */
  y0: number;
  /** Right column (exclusive). */
  x1: number;
  /** Bottom row (exclusive). */
  y1: number;
}

/** Recovers the precise x/y bounds covered by non-transparent pixels in an image. */
export function opaqueBounds(image: PNG): PixelRegion {
  const w = image.width;
  const h = image.height;
  const data = image.data;
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const alpha = data[(y * w + x) * 4 + 3];
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) {
    // fully transparent image
    return { x0: 0, y0: 0, x1: 0, y1: 0 };
  }
  return { x0: minX, y0: minY, x1: maxX + 1, y1: maxY + 1 };
}

/** Clamps a region to the image bounds. */
export function clampRegion(region: PixelRegion, width: number, height: number): PixelRegion {
  return {
    x0: Math.max(0, Math.min(width, region.x0)),
    y0: Math.max(0, Math.min(height, region.y0)),
    x1: Math.max(0, Math.min(width, region.x1)),
    y1: Math.max(0, Math.min(height, region.y1)),
  };
}

/**
 * Sets every pixel in `region` to fully transparent.
 *
 * @param image The PNG to modify in place (RGBA).
 * @param region The region to clear. Coordinates are clamped to the image.
 * @returns The number of pixels that were made transparent (0 if the region is empty/offscreen).
 */
export function clearRegionToTransparent(image: PNG, region: PixelRegion): number {
  const clipped = clampRegion(region, image.width, image.height);
  if (clipped.x1 <= clipped.x0 || clipped.y1 <= clipped.y0) return 0;

  const data = image.data;
  const w = image.width;
  let changed = 0;
  for (let y = clipped.y0; y < clipped.y1; y++) {
    for (let x = clipped.x0; x < clipped.x1; x++) {
      const idx = (y * w + x) * 4;
      if (data[idx + 3] !== 0) changed++;
      data[idx + 3] = 0; // alpha -> 0 (fully transparent)
    }
  }
  return changed;
}

/** Encodes a PNG to a Buffer. */
export function toBuffer(image: PNG): Buffer {
  return PNG.sync.write(image);
}

/** Decodes a PNG Buffer. Throws on invalid input. */
export function fromBuffer(buffer: Buffer): PNGWithMetadata {
  return PNG.sync.read(buffer);
}

/** Creates a blank fully-transparent PNG of the given size. */
export function createBlank(width: number, height: number): PNG {
  const png = new PNG({ width, height });
  png.data.fill(0); // RGBA all zero -> fully transparent
  return png;
}
