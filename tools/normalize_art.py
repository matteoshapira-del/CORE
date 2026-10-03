"""Normalise exercise PNGs: drop caption fragments / grid lines, centre figure on a square cream canvas.

Usage: python3 tools/normalize_art.py <src_dir> <out_dir> [skip-names...]
Run after tools/draw_poses.py (which writes 682x600 art_*.png) to square them up like the rest:
art_* files are skipped by default — copy them under another name or edit the filter.
"""
import sys, glob, os
import numpy as np
from PIL import Image
from scipy import ndimage
src_dir, out_dir = sys.argv[1], sys.argv[2]
OUT = 640
def bg_color(a):
    h, w, _ = a.shape
    # sample just inside the borders (skip 12px to avoid grid lines)
    patches = [a[12:40, 12:40], a[12:40, w-40:w-12], a[h-40:h-12, 12:40], a[h-40:h-12, w-40:w-12]]
    px = np.concatenate([p.reshape(-1, 3) for p in patches])
    lum = px.mean(axis=1)
    px = px[lum >= np.percentile(lum, 40)]           # ignore stray dark bits
    return np.median(px, axis=0)
def process(path):
    im = Image.open(path).convert('RGB'); a = np.asarray(im).astype(int); h, w, _ = a.shape
    bg = bg_color(a)
    mask = np.abs(a - bg).sum(axis=2) > 36
    # kill thin edge lines: rows/cols near the border that are mostly "ink"
    for i in list(range(0, 14)) + list(range(h - 14, h)):
        if mask[i].mean() > 0.45: mask[i] = False
    for j in list(range(0, 14)) + list(range(w - 14, w)):
        if mask[:, j].mean() > 0.45: mask[:, j] = False
    grown = ndimage.binary_dilation(mask, iterations=6)
    lab, n = ndimage.label(grown)
    if n == 0: return None
    sizes = ndimage.sum(mask, lab, range(1, n + 1))
    main = int(np.argmax(sizes)) + 1
    keep = np.zeros(n + 1, bool); keep[main] = True
    ys, xs = np.where(lab == main); y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    my, mx = int((y1 - y0) * 0.12) + 10, int((x1 - x0) * 0.12) + 10
    sl = ndimage.find_objects(lab)
    for k in range(1, n + 1):
        if k == main: continue
        s = sl[k - 1]; cy0, cy1, cx0, cx1 = s[0].start, s[0].stop, s[1].start, s[1].stop
        touches = cy0 <= 3 or cx0 <= 3 or cy1 >= h - 3 or cx1 >= w - 3
        inside = cy0 >= y0 - my and cy1 <= y1 + my and cx0 >= x0 - mx and cx1 <= x1 + mx
        big = sizes[k - 1] > 0.15 * sizes[main - 1]
        if (inside and not touches) or (big and not touches): keep[k] = True
    keepmask = keep[lab] & grown
    out = a.copy(); out[~keepmask] = bg
    ys, xs = np.where(keepmask & mask)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    crop = Image.fromarray(out[y0:y1 + 1, x0:x1 + 1].astype('uint8'))
    cw, ch = crop.size; side = int(max(cw, ch) * 1.14)
    canvas = Image.new('RGB', (side, side), tuple(int(c) for c in bg))
    canvas.paste(crop, ((side - cw) // 2, (side - ch) // 2))
    return canvas.resize((OUT, OUT), Image.LANCZOS)
skip = set(sys.argv[3:])
for f in sorted(glob.glob(os.path.join(src_dir, '*.png'))):
    name = os.path.basename(f)
    if name.startswith('art_') or name in skip: continue
    r = process(f)
    if r is None: print('SKIP', name); continue
    r.save(os.path.join(out_dir, name), 'PNG', optimize=True)
print('done')
