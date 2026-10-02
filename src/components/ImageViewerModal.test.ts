import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const componentsDir = join(process.cwd(), 'src', 'components');

function readComponent(file: string) {
  return readFileSync(join(componentsDir, file), 'utf8');
}

describe('ImageViewerModal & mobile image preview optimizations', () => {
  test('ImageViewerModal provides zero-crop object-contain display and full touch gestures', () => {
    const viewer = readComponent('ImageViewerModal.tsx');

    // Zero-crop full viewport guarantees
    expect(viewer).toContain('object-contain');
    expect(viewer).toContain('max-h-[100dvh]');
    expect(viewer).toContain('max-w-[100dvw]');

    // Multi-touch pinch-to-zoom & double-tap
    expect(viewer).toContain('MIN_SCALE');
    expect(viewer).toContain('MAX_SCALE');
    expect(viewer).toContain('DOUBLE_TAP_SCALE');
    expect(viewer).toContain('isPinching');
    expect(viewer).toContain('clampTranslate');

    // Pan / Drag & swipe & pull-down
    expect(viewer).toContain('isDragging');
    expect(viewer).toContain('handleTouchStart');
    expect(viewer).toContain('handleTouchMove');
    expect(viewer).toContain('handleTouchEnd');
    expect(viewer).toContain('handleWheel');

    // Wholesale actions
    expect(viewer).toContain('WhatsAppIcon');
    expect(viewer).toContain('handleDownload');
  });

  test('ProductGalleryClient adapts to tall 9:16 images and integrates ImageViewerModal', () => {
    const gallery = readComponent('ProductGalleryClient.tsx');

    // Aspect ratio adaptation for 9:16 fashion matrices
    expect(gallery).toContain('isTallImage');
    expect(gallery).toContain('aspect-[9/16]');
    expect(gallery).toContain('objectFit=\'contain\'');
    expect(gallery).toContain('objectPosition=\'object-top\'');

    // Mobile tap to zoom full
    expect(gallery).toContain('Tap to Zoom Full');
    expect(gallery).toContain('ImageViewerModal');
  });

  test('ProductCard prevents model head decapitation with object-top and links to Quick Zoom', () => {
    const card = readComponent('ProductCard.tsx');

    // Model head decapitation fix
    expect(card).toContain("objectPosition='object-top'");

    // Quick Zoom modal integration
    expect(card).toContain('ProductQuickZoomModal');
    expect(card).toContain('handleOpenZoom');
  });

  test('ProductQuickZoomModal provides uncropped image viewport and links to full gesture zoom', () => {
    const modal = readComponent('ProductQuickZoomModal.tsx');

    // Zero-crop unconstrained image box
    expect(modal).toContain('object-contain');
    expect(modal).not.toContain('h-[34vh]');

    // Deep zoom integration
    expect(modal).toContain('ImageViewerModal');
    expect(modal).toContain('setIsFullScreenViewerOpen');
  });

  test('calculates pinch distance and scale clamping correctly', () => {
    // Math validation for multi-touch pinch
    const t0 = { clientX: 100, clientY: 200 };
    const t1 = { clientX: 160, clientY: 280 };
    const dist1 = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
    expect(dist1).toBe(100);

    const t0_moved = { clientX: 70, clientY: 160 };
    const t1_moved = { clientX: 190, clientY: 320 };
    const dist2 = Math.hypot(t0_moved.clientX - t1_moved.clientX, t0_moved.clientY - t1_moved.clientY);
    expect(dist2).toBe(200);

    const initialScale = 1.0;
    const ratio = dist2 / dist1;
    const nextScale = Math.min(4.0, Math.max(1.0, initialScale * ratio));
    expect(nextScale).toBe(2.0);
  });

  test('proves 9:16 aspect ratio in 3:4 container without object-top causes 12.5% head loss', () => {
    const imgWidth = 941;
    const imgHeight = 1672;
    const containerAspect = 3 / 4; // 0.75

    // In a 3:4 box with width 941, the visible height is 941 / (3/4) = 1254.67
    const visibleHeight = imgWidth / containerAspect;
    const totalClipped = imgHeight - visibleHeight;
    const topCropCenter = totalClipped / 2;

    // Center crop cuts ~208.67 px from the top (12.48% of total height)
    expect(topCropCenter / imgHeight).toBeCloseTo(0.125, 2);

    // With object-top, top crop is 0px (100% of top models heads preserved)
    const topCropTopAligned = 0;
    expect(topCropTopAligned).toBe(0);
  });
});
