import { describe, expect, it } from 'vitest';
import { PNG } from 'pngjs';
import {
  clearRegionToTransparent,
  fromBuffer,
  opaqueBounds,
  toBuffer,
  type PixelRegion,
} from '@chameleon-ui/utils';

/** Builds a small RGBA buffer where a sub-rectangle (x0,y0)..(x1,y1) is opaque. */
function buildRect(w: number, h: number, rx0: number, ry0: number, rx1: number, ry1: number): Buffer {
  const png = new PNG({ width: w, height: h });
  png.data.fill(0);
  for (let y = ry0; y < ry1; y++) {
    for (let x = rx0; x < rx1; x++) {
      const i = (y * w + x) * 4;
      png.data[i] = 255; // R
      png.data[i + 1] = 128; // G
      png.data[i + 2] = 32; // B
      png.data[i + 3] = 255; // A
    }
  }
  return PNG.sync.write(png);
}

describe('@chameleon-ui/utils image', () => {
  it('opaqueBounds finds the exact opaque rectangle', () => {
    const buffer = buildRect(100, 100, 10, 20, 60, 70);
    const img = fromBuffer(buffer);
    const b = opaqueBounds(img);
    expect(b).toEqual({ x0: 10, y0: 20, x1: 60, y1: 70 });
  });

  it('clearRegionToTransparent zeroes the region (like our logo watermark case)', () => {
    // emulates the logo: an opaque shape + a separate opaque watermark strip near the bottom
    const w = 64;
    const h = 64;
    const img = fromBuffer(buildRect(w, h, 4, 4, 60, 40)); // main body
    // add a separate "watermark" line at the very bottom, isolated from the body
    for (let x = 8; x < 30; x++) {
      const i = (37 * w + x) * 4;
      img.data[i] = 0;
      img.data[i + 1] = 0;
      img.data[i + 2] = 0;
      img.data[i + 3] = 200;
    }

    const region: PixelRegion = { x0: 6, y0: 36, x1: 32, y1: 39 };
    const changed = clearRegionToTransparent(img, region);
    expect(changed).toBeGreaterThan(0);

    // region must now be fully transparent
    for (let y = 36; y < 39; y++) {
      for (let x = 6; x < 32; x++) {
        expect(img.data[(y * w + x) * 4 + 3]).toBe(0);
      }
    }
    // main body (outside region) must be untouched
    for (let y = 4; y < 34; y++) {
      for (let x = 4; x < 60; x++) {
        if (!(x >= 6 && x < 32 && y >= 36 && y < 39)) {
          expect(img.data[(y * w + x) * 4 + 3]).toBeGreaterThan(0);
        }
      }
    }
  });

  it('round-trips through toBuffer/fromBuffer', () => {
    const buffer = buildRect(32, 32, 2, 2, 20, 20);
    const img = fromBuffer(buffer);
    const re = fromBuffer(toBuffer(img));
    expect(re.width).toBe(32);
    expect(re.height).toBe(32);
    expect(Buffer.compare(toBuffer(re), toBuffer(img))).toBe(0);
  });

  it('clearRegionToTransparent clamps out-of-bounds regions', () => {
    const buffer = buildRect(16, 16, 0, 0, 16, 16); // fully opaque
    const img = fromBuffer(buffer);
    const changed = clearRegionToTransparent(img, { x0: -5, y0: -5, x1: 3, y1: 3 });
    expect(changed).toBe(9); // 3x3 clamped
  });
});
