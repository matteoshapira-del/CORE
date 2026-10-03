#!/usr/bin/env python3
"""Procedural exercise illustrations for CORE (flat-cartoon style).

Draws a parametric figure with Pillow (supersampled, LANCZOS downscale) to
match the existing AI-generated art in icons/exercises/: cream background,
coral top, navy shorts, warm skin, dark-brown ponytail, coral shoes, thin dark
outlines and a soft grey floor shadow.

Usage:
    python3 tools/draw_poses.py                 # render every pose
    python3 tools/draw_poses.py art_leg_swings  # render selected poses
    python3 tools/draw_poses.py --sheet out.png # also write a contact sheet
    python3 tools/draw_poses.py --outdir /tmp/x # write somewhere else

World units: 1.0 ~ one head height, y points UP, angles in degrees
(0 = +x / right, 90 = up). Only dependencies: Pillow + numpy.
"""
import argparse
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_OUT = os.path.normpath(os.path.join(HERE, '..', 'icons', 'exercises'))

SS = 4                     # supersampling factor
W, H = 682, 600            # output size
OW = 2.6                   # outline width (final px)

# Palette sampled from the existing PNGs (cat_pose, kneeling_hip_flexor ...)
C = dict(
    bg=(247, 246, 238),
    top=(248, 103, 86),
    shorts=(50, 54, 72),
    skin=(240, 178, 142),
    hair=(72, 51, 42),
    shoe=(242, 106, 90),
    sole=(252, 250, 245),
    shadow=(215, 207, 197),
    ink=(46, 37, 37),
    arrow=(40, 38, 38),
    wood=(214, 172, 124),
    wall=(226, 222, 212),
    step=(206, 200, 190),
    towel=(226, 200, 152),
    pillow=(170, 196, 212),
    mat=(206, 222, 216),
    lip=(196, 110, 96),
)
FAR = 0.92                 # far-side limbs are drawn slightly darker

# Segment lengths / radii (head-height units)
L_TORSO, L_THIGH, L_SHIN, L_UARM, L_FARM, L_NECK = 2.5, 1.85, 1.78, 1.3, 1.2, 0.60
R_THIGH, R_KNEE, R_ANKLE = 0.43, 0.26, 0.155
R_SHOULDER, R_ELBOW, R_WRIST = 0.205, 0.155, 0.12
HS = 1.02                  # head scale
T_SHOULDER = 0.86          # shoulder joint position along the torso axis


# ----------------------------------------------------------------- geometry
def v(x, y=None):
    if y is None:
        return np.asarray(x, dtype=float)
    return np.array([x, y], dtype=float)


def dirv(a):
    r = math.radians(a)
    return np.array([math.cos(r), math.sin(r)])


def ang(p):
    return math.degrees(math.atan2(p[1], p[0]))


def rot(p, a):
    r = math.radians(a)
    c, s = math.cos(r), math.sin(r)
    return np.array([c * p[0] - s * p[1], s * p[0] + c * p[1]])


def norm(p):
    n = np.linalg.norm(p)
    return p / n if n > 1e-9 else p


def arc_pts(c, r, a0, a1, n=None):
    n = n or max(6, int(abs(a1 - a0) / 6) + 2)
    return np.array([c + r * dirv(a0 + (a1 - a0) * i / (n - 1)) for i in range(n)])


def circle(c, r, n=40):
    return arc_pts(v(c), r, 0, 360, n)[:-1]


def ellipse(c, rx, ry, a=0.0, n=44):
    c = v(c)
    return np.array([c + rot(v(rx * math.cos(t), ry * math.sin(t)), a)
                     for t in np.linspace(0, 2 * math.pi, n, endpoint=False)])


def capsule(p1, r1, p2, r2):
    """Tapered capsule (two circles + outer tangents)."""
    p1, p2 = v(p1), v(p2)
    d = np.linalg.norm(p2 - p1)
    if d < abs(r1 - r2) + 1e-6:
        return circle(p1 if r1 >= r2 else p2, max(r1, r2))
    a = ang(p2 - p1)
    th = math.degrees(math.acos(max(-1, min(1, (r1 - r2) / d))))
    pts = list(arc_pts(p1, r1, a + th, a + 360 - th))
    pts += list(arc_pts(p2, r2, a - th, a + th))
    return np.array(pts)


def quad(p1, r1, p2, r2):
    p1, p2 = v(p1), v(p2)
    n = rot(norm(p2 - p1), 90)
    return np.array([p1 + n * r1, p2 + n * r2, p2 - n * r2, p1 - n * r1])


def rrect(x0, y0, x1, y1, r=0.08):
    r = min(r, abs(x1 - x0) / 2, abs(y1 - y0) / 2)
    pts = []
    for cx, cy, a0 in ((x1 - r, y1 - r, 0), (x0 + r, y1 - r, 90),
                       (x0 + r, y0 + r, 180), (x1 - r, y0 + r, 270)):
        pts += list(arc_pts(v(cx, cy), r, a0, a0 + 90, 6))
    return np.array(pts)


def catmull(ctrl, closed=True, k=8):
    P = [v(p) for p in ctrl]
    n = len(P)
    out = []
    rng = range(n) if closed else range(n - 1)
    for i in rng:
        p0 = P[(i - 1) % n] if closed or i > 0 else P[0]
        p1, p2 = P[i], P[(i + 1) % n]
        p3 = P[(i + 2) % n] if closed or i + 2 < n else P[-1]
        for j in range(k):
            t = j / k
            t2, t3 = t * t, t * t * t
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
                              + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    if not closed:
        out.append(P[-1])
    return np.array(out)


def clip_half(poly, p0, nrm):
    """Keep the part of polygon where dot(p-p0, nrm) <= 0 (Sutherland-Hodgman)."""
    out = []
    n = len(poly)
    for i in range(n):
        a, b = poly[i], poly[(i + 1) % n]
        da, db = np.dot(a - p0, nrm), np.dot(b - p0, nrm)
        if da <= 0:
            out.append(a)
        if (da <= 0) != (db <= 0):
            t = da / (da - db)
            out.append(a + t * (b - a))
    return np.array(out)


def ik(root, target, l1, l2, bend):
    """Two-bone IK. bend=+1 puts the middle joint left (CCW) of root->target."""
    root, target = v(root), v(target)
    d = target - root
    dist = np.linalg.norm(d)
    dist = min(max(dist, abs(l1 - l2) + 1e-3), l1 + l2 - 1e-4)
    base = ang(d)
    ca = (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist)
    A = math.degrees(math.acos(max(-1, min(1, ca))))
    a1 = base + bend * A
    j = root + l1 * dirv(a1)
    return a1, ang(target - j)


def shade(c, f):
    return tuple(int(max(0, min(255, x * f))) for x in c)


# -------------------------------------------------------------------- scene
class Scene:
    def __init__(self):
        self.items = []
        self.ghost = 1.0         # alpha applied to subsequently added items

    def add(self, it):
        it.setdefault('alpha', self.ghost)
        self.items.append(it)
        return it

    def group(self, parts, outline=True, tag='fig'):
        """parts: [(polygon, color)]; outlines all parts first, then fills -> one silhouette."""
        return self.add(dict(k='group', parts=[(np.asarray(p), c) for p, c in parts if c is not None],
                             outline=outline, tag=tag))

    def line(self, pts, w=1.6, color=None, tag='fig', ww=None):
        """Polyline; w in final px, or ww in world units."""
        return self.add(dict(k='line', pts=np.asarray(pts, float), w=w, ww=ww,
                             color=color or C['ink'], tag=tag))

    def stroke(self, pts, ww, color, tag='prop'):
        """Thick outlined band (towel/strap) of world width ww."""
        self.add(dict(k='line', pts=np.asarray(pts, float), w=None, ww=ww, pad=OW * 2,
                      color=C['ink'], tag=tag))
        self.add(dict(k='line', pts=np.asarray(pts, float), w=None, ww=ww, color=color, tag=tag))

    def arrow(self, pts, heads='end', tag='arrow'):
        return self.add(dict(k='arrow', pts=np.asarray(pts, float), heads=heads, tag=tag))

    def arc_arrow(self, c, r, a0, a1, heads='end'):
        return self.arrow(arc_pts(v(c), r, a0, a1), heads)

    def translate(self, d):
        d = v(d)
        for it in self.items:
            if it['k'] == 'group':
                it['parts'] = [(p + d, c) for p, c in it['parts']]
            else:
                it['pts'] = it['pts'] + d

    def points(self, tags=None):
        out = []
        for it in self.items:
            if tags and it['tag'] not in tags:
                continue
            if it['k'] == 'group':
                out += [p for p, _ in it['parts']]
            else:
                out.append(it['pts'])
        return np.vstack(out) if out else np.zeros((0, 2))

    def ground(self, tags=('fig',)):
        """Shift everything so the lowest figure point sits on y=0."""
        self.translate((0, -self.points(tags)[:, 1].min()))

    def floor_shadow(self, pad=0.6, tags=('fig', 'prop'), y_tol=0.3, x_range=None):
        if x_range is None:
            P = self.points(tags)
            low = P[P[:, 1] < y_tol]
            x0, x1 = low[:, 0].min(), low[:, 0].max()
        else:
            x0, x1 = x_range
        e = ellipse(((x0 + x1) / 2, 0.02), (x1 - x0) / 2 + pad, 0.2, n=72)
        self.items.insert(0, dict(k='group', parts=[(e, C['shadow'])], outline=False,
                                  tag='shadow', alpha=1.0))

    def mat(self, pad=0.45):
        P = self.points(('fig', 'prop'))
        x0, y0 = P.min(0) - pad
        x1, y1 = P.max(0) + pad
        self.items.insert(0, dict(k='group', parts=[(rrect(x0, y0, x1, y1, 0.25), C['mat'])],
                                  outline=True, tag='mat', alpha=1.0))

    # ------------------------------------------------------------ render
    def render(self, path=None, w=W, h=H, margin=0.075):
        P = self.points()
        minx, miny = P.min(0)
        maxx, maxy = P.max(0)
        bw, bh = maxx - minx, maxy - miny
        s = min(w * (1 - 2 * margin) / bw, h * (1 - 2 * margin) / bh)
        ox = w / 2 - s * (minx + maxx) / 2
        oy = h / 2 + s * (miny + maxy) / 2

        def px(p):
            p = np.atleast_2d(p)
            return [((ox + s * x) * SS, (oy - s * y) * SS) for x, y in p]

        img = Image.new('RGBA', (w * SS, h * SS), C['bg'] + (255,))
        layer, ldraw, cur_alpha = None, None, None

        def flush():
            nonlocal img, layer, ldraw, cur_alpha
            if layer is not None:
                if cur_alpha < 1:
                    a = layer.getchannel('A').point(lambda x: int(x * cur_alpha))
                    layer.putalpha(a)
                img = Image.alpha_composite(img, layer)
            layer, ldraw, cur_alpha = None, None, None

        def get_draw(alpha):
            nonlocal layer, ldraw, cur_alpha
            if layer is None or alpha != cur_alpha:
                flush()
                layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
                ldraw = ImageDraw.Draw(layer)
                cur_alpha = alpha
            return ldraw

        def poly_line(d, pts, width, color, closed=False):
            q = px(pts)
            if closed:
                q = q + q[:1]
            width = max(1, int(round(width)))
            d.line(q, fill=color, width=width, joint='curve')
            r = width / 2
            for (x, y) in (q[:1] + q[-1:]) if not closed else []:
                d.ellipse([x - r, y - r, x + r, y + r], fill=color)

        for it in self.items:
            d = get_draw(it['alpha'])
            if it['k'] == 'group':
                if it['outline']:
                    for p, _ in it['parts']:
                        d.polygon(px(p), fill=C['ink'])
                        poly_line(d, p, 2 * OW * SS, C['ink'], closed=True)
                for p, col in it['parts']:
                    d.polygon(px(p), fill=col)
            elif it['k'] == 'line':
                wpx = it['w'] * SS if it['w'] else it['ww'] * s * SS + it.get('pad', 0) * SS
                poly_line(d, it['pts'], wpx, it['color'])
            elif it['k'] == 'arrow':
                pts = it['pts']
                q = np.array(px(pts))
                hl = 13 * SS
                # shorten the shaft so it does not poke out of the head
                shaft = q.copy()
                ends = []
                if it['heads'] in ('end', 'both'):
                    ends.append((q[-1], q[-1] - q[-2]))
                if it['heads'] in ('start', 'both'):
                    ends.append((q[0], q[0] - q[1]))
                if it['heads'] in ('end', 'both'):
                    shaft[-1] = q[-1] - norm(q[-1] - q[-2]) * hl * 0.6
                if it['heads'] in ('start', 'both'):
                    shaft[0] = q[0] - norm(q[0] - q[1]) * hl * 0.6
                d.line([tuple(x) for x in shaft], fill=C['arrow'], width=int(2.6 * SS), joint='curve')
                for tip, dv in ends:
                    dv = norm(dv)
                    nv = np.array([-dv[1], dv[0]])
                    b = tip - dv * hl
                    d.polygon([tuple(tip), tuple(b + nv * hl * 0.5), tuple(b - nv * hl * 0.5)],
                              fill=C['arrow'])
        flush()
        out = img.convert('RGB').resize((w, h), Image.LANCZOS)
        if path:
            out.save(path, optimize=True)
        return out


# ---------------------------------------------------------- torso helpers
SIDE_PROF = [  # (t, front, back) offsets from the spine axis
    (-0.14, 0.17, 0.28), (-0.07, 0.36, 0.47), (0.04, 0.45, 0.55), (0.17, 0.44, 0.53),
    (0.40, 0.38, 0.38), (0.60, 0.47, 0.39), (0.74, 0.53, 0.43), (0.87, 0.47, 0.44),
    (0.97, 0.34, 0.39), (1.04, 0.15, 0.23)]
FRONT_PROF = [  # (t, half width)
    (-0.13, 0.50), (-0.05, 0.72), (0.08, 0.78), (0.20, 0.74), (0.42, 0.60), (0.62, 0.67),
    (0.78, 0.76), (0.89, 0.84), (0.97, 0.74), (1.03, 0.42)]
T_WAIST = 0.30


class Spine:
    """Quadratic-Bezier spine from hip H, chord angle `a`, curl (+ = flexion/rounded)."""

    def __init__(self, H, a, curl=0.0, s=1, L=L_TORSO):
        self.H, self.s = v(H), s
        d = dirv(a)
        back = rot(d, 90 * s)
        self.P0 = self.H
        self.P2 = self.H + L * d
        self.P1 = self.H + 0.5 * L * d + curl * L * back

    def pt(self, t):
        if t < 0:
            return self.P0 + t * self.tan(0) * L_TORSO
        if t > 1:
            return self.P2 + (t - 1) * self.tan(1) * L_TORSO
        return (1 - t) ** 2 * self.P0 + 2 * (1 - t) * t * self.P1 + t * t * self.P2

    def tan(self, t):
        t = min(1, max(0, t))
        return norm(2 * (1 - t) * (self.P1 - self.P0) + 2 * t * (self.P2 - self.P1))

    def front(self, t):  # side view: chest direction
        return rot(self.tan(t), -90 * self.s)

    def right(self, t):  # front view: image-right when upright
        return rot(self.tan(t), -90)


# ------------------------------------------------------------ body parts
def shorts_leg(hip, knee, shorts=0.5, r_hip=R_THIGH):
    th = knee - hip
    hem = hip + th * shorts
    rh = r_hip + (R_KNEE - r_hip) * shorts + 0.03
    n = rot(norm(th), 90)
    return quad(hip, r_hip + 0.04, hem, rh), (hem + n * rh, hem - n * rh)


def leg_parts(hip, knee, ankle, col_skin, col_shorts, shorts=0.5, r_hip=R_THIGH, with_shorts=True):
    parts = [(capsule(hip, r_hip, knee, R_KNEE), col_skin),
             (capsule(knee, R_KNEE, ankle, R_ANKLE), col_skin)]
    if not with_shorts:
        return parts, None
    q, hem = shorts_leg(hip, knee, shorts, r_hip)
    parts.append((circle(hip, r_hip + 0.04), col_shorts))
    parts.append((q, col_shorts))
    return parts, hem


def shoe_side(ankle, d_ang, s, col, col_sole):
    """Side-view shoe. d_ang: heel->toe direction; s: which side is 'up' (rot(d, 90*s))."""
    d = dirv(d_ang)
    u = rot(d, 90 * s)

    def P(x, y):
        return ankle + x * d + y * u
    body = catmull([P(-0.2, -0.27), P(0.45, -0.28), P(0.78, -0.27), P(0.9, -0.17),
                    P(0.8, -0.06), P(0.45, 0.04), P(0.16, 0.17), P(-0.12, 0.17), P(-0.24, -0.06)], k=6)
    sole = clip_half(body, P(0, -0.195), u)
    xs = [np.dot(q - ankle, d) for q in sole]
    return [(body, col), (sole, col_sole)], (P(min(xs) + 0.02, -0.195), P(max(xs) - 0.02, -0.195))


def shoe_front(ankle, down_ang, col, col_sole, splay=0.0):
    d = dirv(down_ang)
    r = rot(d, 90)

    def P(x, y):
        return ankle + (x + splay * y) * r + y * d
    body = catmull([P(-0.16, -0.02), P(0.16, -0.02), P(0.21, 0.2), P(0.2, 0.36),
                    P(-0.2, 0.36), P(-0.21, 0.2)], k=6)
    sole = clip_half(body, P(0, 0.29), -d)
    return [(body, col), (sole, col_sole)], (P(-0.2, 0.29), P(0.2, 0.29))


def arm_parts(sh, el, wr, col_skin, col_top, sleeve=0.36, hand=None):
    ua = el - sh
    parts = [(capsule(sh, R_SHOULDER, el, R_ELBOW), col_skin),
             (capsule(el, R_ELBOW, wr, R_WRIST), col_skin)]
    fd = norm(wr - el) if hand is None else dirv(hand)
    parts.append((ellipse(wr + fd * 0.13, 0.21, 0.12, ang(fd)), col_skin))
    hem = sh + ua * sleeve
    rs = R_SHOULDER + 0.04
    parts.append((circle(sh, rs), col_top))
    parts.append((quad(sh, rs, hem, rs - 0.01), col_top))
    n = rot(norm(ua), 90)
    return parts, (hem + n * (rs - 0.01), hem - n * (rs - 0.01))


# -------------------------------------------------------------- figures
def resolve_limb(root, spec, l1, l2):
    if 'to' in spec:
        a1, a2 = ik(root, spec['to'], l1, l2, spec.get('bend', 1))
    else:
        a1, a2 = spec['a']
    j1 = root + l1 * dirv(a1)
    if 'end' in spec:                       # explicit end point (projected length)
        j2 = v(spec['end'])
    else:
        j2 = j1 + spec.get('l2', l2) * dirv(a2)
    return j1, j2, a1, ang(j2 - j1)


class Figure:
    """Parametric cartoon figure.

    view='side' : facing s=+1 (right) / -1 (left); limbs 'near' and 'far'.
    view='front': facing the viewer; limbs 'L' and 'R' = image-left / image-right.
    pose keys: hip, torso (chord angle), curl, head (head up-axis angle), legs, arms,
               eyes ('open'/'closed'), mouth (True), order (draw order list)
    leg spec : {'a': (thigh, shin)} or {'to': ankle, 'bend': +-1}; 'foot': abs angle
               or 'frel' (relative, 90 = neutral); 'shoe': 'side'|'front'; 'fs': side sign
    arm spec : {'a': (upper, fore)} or {'to': wrist, 'bend': +-1}
    """

    def __init__(self, view='side', s=1, hip=(0, 0), torso=90, curl=0.0, head=None,
                 legs=None, arms=None, eyes='open', order=None, neck=L_NECK, hair='pony',
                 head_shift=0.0, shoulder_spread=0.74, pony=None):
        self.view, self.s = view, s
        self.pony = pony
        self.sp = Spine(hip, torso, curl, s)
        self.H = v(hip)
        self.legs = legs or {}
        self.arms = arms or {}
        self.eyes = eyes
        self.hair = hair
        sp = self.sp
        self.N = sp.pt(1.0)
        tang = ang(sp.tan(1.0))
        self.head_ang = tang if head is None else head
        if view == 'side':
            self.face = dirv(self.head_ang - 90 * s)
            self.HC = self.N + neck * HS * dirv(self.head_ang) + 0.07 * self.face + head_shift * self.face
            sh = sp.pt(T_SHOULDER)
            self.sh = {'near': sh, 'far': sh + 0.0}
            self.hp = {'near': self.H, 'far': self.H}
        else:
            r = sp.right(1.0)
            self.HC = self.N + (neck + 0.12) * HS * dirv(self.head_ang)
            rs, rh = sp.right(T_SHOULDER), sp.right(0)
            self.sh = {'L': sp.pt(T_SHOULDER) - shoulder_spread * rs,
                       'R': sp.pt(T_SHOULDER) + shoulder_spread * rs}
            self.hp = {'L': self.H - 0.40 * rh, 'R': self.H + 0.40 * rh}
        self.J = {}
        for k, spec in self.legs.items():
            self.J['leg_' + k] = resolve_limb(self.hp[k], spec, spec.get('l1', L_THIGH), L_SHIN)
        for k, spec in self.arms.items():
            self.J['arm_' + k] = resolve_limb(self.sh[k], spec, spec.get('l1', L_UARM), L_FARM)
        if order is None:
            if view == 'side':
                order = ['arm_far', 'leg_far', 'torso', 'leg_near', 'head', 'arm_near']
            else:
                order = ['leg_L', 'leg_R', 'torso', 'head', 'arm_L', 'arm_R']
        self.order = order

    # convenience accessors
    def knee(self, k):
        return self.J['leg_' + k][0]

    def ankle(self, k):
        return self.J['leg_' + k][1]

    def elbow(self, k):
        return self.J['arm_' + k][0]

    def wrist(self, k):
        return self.J['arm_' + k][1]

    # ---------------------------------------------------------- drawing
    def draw(self, sc, only=None):
        for name in self.order:
            if only and name not in only:
                continue
            if name == 'torso':
                self.draw_torso(sc)
            elif name == 'head':
                self.draw_head(sc)
            elif name.startswith('leg_') and name in self.J:
                self.draw_leg(sc, name[4:])
            elif name.startswith('arm_') and name in self.J:
                self.draw_arm(sc, name[4:])

    def _f(self, k):
        return FAR if k == 'far' else 1.0

    def draw_leg(self, sc, k):
        spec = self.legs[k]
        f = self._f(k)
        hip = self.hp[k]
        knee, ankle, a1, a2 = self.J['leg_' + k]
        with_shorts = spec.get('with_shorts', self.view == 'side')
        parts, hem = leg_parts(hip, knee, ankle, shade(C['skin'], f), shade(C['shorts'], f),
                               shorts=spec.get('shorts', 0.5), with_shorts=with_shorts,
                               r_hip=R_THIGH if self.view == 'side' else 0.37)
        shoe = spec.get('shoe', 'side' if self.view == 'side' else 'front')
        if shoe == 'side':
            fa = spec['foot'] if 'foot' in spec else a2 + self.s * spec.get('frel', 90)
            sp_, sl = shoe_side(ankle, fa, spec.get('fs', self.s), shade(C['shoe'], f),
                                shade(C['sole'], f))
        else:
            sp_, sl = shoe_front(ankle, a2, shade(C['shoe'], f), shade(C['sole'], f),
                                 splay=spec.get('splay', 0.0))
        sc.group(parts + sp_)
        if hem:
            sc.line(hem, 2.0)
        sc.line(sl, 1.6)

    def draw_arm(self, sc, k):
        f = self._f(k)
        el, wr, _, _ = self.J['arm_' + k]
        parts, hem = arm_parts(self.sh[k], el, wr, shade(C['skin'], f), shade(C['top'], f),
                               sleeve=self.arms[k].get('sleeve', 0.36), hand=self.arms[k].get('hand'))
        sc.group(parts)
        sc.line(hem, 2.0)

    def draw_torso(self, sc):
        sp = self.sp
        neck_base = sp.pt(0.93)
        neck = capsule(neck_base, 0.2, self.HC - 0.25 * dirv(self.head_ang), 0.17)
        pts_f, pts_b = [], []
        if self.view == 'side':
            for t, fo, bo in SIDE_PROF:
                pts_f.append(sp.pt(t) + fo * sp.front(t))
                pts_b.append(sp.pt(t) - bo * sp.front(t))
            prof = SIDE_PROF
        else:
            for t, hw in FRONT_PROF:
                pts_f.append(sp.pt(t) + hw * sp.right(t))
                pts_b.append(sp.pt(t) - hw * sp.right(t))
        body = catmull(pts_f + pts_b[::-1], k=8)
        tw = T_WAIST
        shorts = clip_half(body, sp.pt(tw), sp.tan(tw))
        # waist line endpoints
        if self.view == 'side':
            fo = np.interp(tw, [p[0] for p in SIDE_PROF], [p[1] for p in SIDE_PROF])
            bo = np.interp(tw, [p[0] for p in SIDE_PROF], [p[2] for p in SIDE_PROF])
            w0, w1 = sp.pt(tw) + fo * sp.front(tw), sp.pt(tw) - bo * sp.front(tw)
        else:
            hw = np.interp(tw, [p[0] for p in FRONT_PROF], [p[1] for p in FRONT_PROF])
            w0, w1 = sp.pt(tw) + hw * sp.right(tw), sp.pt(tw) - hw * sp.right(tw)
        sc.group([(neck, C['skin'])])
        sc.group([(body, C['top']), (shorts, C['shorts'])])
        sc.line([w0, w1], 2.0)
        if self.view == 'front':
            # one shorts garment: pelvis + upper thighs of legs drawn behind the torso
            parts, hems = [(shorts, C['shorts'])], []
            for k, spec in self.legs.items():
                if spec.get('with_shorts', False):
                    continue
                q, hem = shorts_leg(self.hp[k], self.knee(k), spec.get('shorts', 0.5), r_hip=0.36)
                parts.append((q, C['shorts']))
                hems.append(hem)
            if len(parts) > 1:
                sc.group(parts)
                for hm in hems:
                    sc.line(hm, 2.0)
            if len(hems) == 2:
                c = sp.pt(0)
                inner = [min(hm, key=lambda q: np.linalg.norm(q - c)) for hm in hems]
                if np.linalg.norm(inner[0] - inner[1]) < 0.4:
                    sc.line([sp.pt(-0.05), (inner[0] + inner[1]) / 2], 1.8)
        # neckline
        if self.view == 'side':
            t1 = 1.0
            c = sp.pt(t1) + 0.05 * sp.front(t1)
            sc.line(arc_pts(c, 0.2, ang(sp.front(t1)) - 70, ang(sp.front(t1)) + 20, 8), 1.6)
        else:
            c = sp.pt(1.0)
            a = ang(sp.tan(1.0))
            sc.line(arc_pts(c, 0.26, a - 180 - 55, a - 180 + 55, 10), 1.6)

    def draw_head(self, sc):
        if self.view == 'side':
            self._head_side(sc)
        else:
            self._head_front(sc)

    def _ponytail(self, sc, base, back):
        if self.pony is None:                      # hangs with gravity
            mid = base + 0.30 * back + 0.20 * v(0, -1)
            tip = mid + 0.10 * back + 0.50 * v(0, -1)
        else:                                      # lies along a given direction
            d = dirv(self.pony)
            mid = base + 0.38 * d + 0.06 * back
            tip = mid + 0.45 * d
        sc.group([(capsule(base, 0.16 * HS, mid, 0.15 * HS), C['hair']),
                  (capsule(mid, 0.15 * HS, tip, 0.05), C['hair'])])

    def _head_side(self, sc):
        u, w = self.face, dirv(self.head_ang)
        Cc = self.HC

        def P(x, y):
            return Cc + HS * (x * u + y * w)
        back = -u
        if self.hair == 'pony':
            self._ponytail(sc, P(-0.4, 0.3), back)
        skull = np.array([P(*p) for p in ellipse((0, 0.04), 0.46, 0.5)])
        jaw = np.array([P(*p) for p in ellipse((0.13, -0.18), 0.33, 0.32)])
        nose = np.array([P(*p) for p in circle((0.44, -0.02), 0.075, 20)])
        sc.group([(skull, C['skin']), (jaw, C['skin']), (nose, C['skin'])])
        if self.hair == 'pony':
            hp = [(0.30, 0.36), (0.10, 0.52), (-0.22, 0.53), (-0.46, 0.33), (-0.52, 0.02),
                  (-0.42, -0.26), (-0.24, -0.30), (-0.17, -0.06), (-0.02, 0.13), (0.2, 0.2), (0.36, 0.24)]
        else:
            hp = [(0.32, 0.34), (0.10, 0.54), (-0.22, 0.53), (-0.46, 0.30), (-0.48, 0.0),
                  (-0.36, -0.14), (-0.17, -0.02), (-0.02, 0.17), (0.2, 0.24), (0.36, 0.26)]
        hair = catmull([P(*p) for p in hp], k=6)
        sc.group([(hair, C['hair'])])
        ear = np.array([P(*p) for p in ellipse((-0.06, -0.06), 0.07, 0.095)])
        sc.group([(ear, C['skin'])])
        if self.eyes == 'closed':
            sc.line([P(0.2, 0.03), P(0.26, 0.0), P(0.32, 0.03)], 2.0)
        else:
            sc.group([(np.array([P(*p) for p in circle((0.28, 0.05), 0.05, 16)]), C['ink'])],
                     outline=False)
            sc.line([P(0.21, 0.17), P(0.35, 0.17)], 1.6)
        sc.line([P(0.3, -0.26), P(0.38, -0.25)], 1.6)

    def _head_front(self, sc):
        w = dirv(self.head_ang)
        u = rot(w, -90)
        Cc = self.HC

        def P(x, y):
            return Cc + HS * (x * u + y * w)
        if self.hair == 'pony':
            tail = catmull([P(0.30, 0.25), P(0.55, 0.05), P(0.58, -0.35), P(0.48, -0.55),
                            P(0.40, -0.25), P(0.32, 0.0)], k=6)
            sc.group([(tail, C['hair'])])
        ears = [np.array([P(*p) for p in ellipse((sx * 0.41, -0.04), 0.075, 0.11)]) for sx in (-1, 1)]
        face = np.array([P(*p) for p in ellipse((0, -0.02), 0.41, 0.5)])
        sc.group([(ears[0], C['skin']), (ears[1], C['skin']), (face, C['skin'])])
        hp = [(-0.44, -0.08), (-0.46, 0.22), (-0.3, 0.48), (0.0, 0.57), (0.3, 0.48), (0.46, 0.22),
              (0.44, -0.08), (0.36, 0.14), (0.15, 0.27), (-0.05, 0.25), (-0.3, 0.2), (-0.38, 0.1)]
        sc.group([(catmull([P(*p) for p in hp], k=6), C['hair'])])
        for sx in (-1, 1):
            if self.eyes == 'closed':
                sc.line([P(sx * 0.2, 0.0), P(sx * 0.15, -0.035), P(sx * 0.1, 0.0)], 2.1)
            else:
                sc.group([(np.array([P(*p) for p in circle((sx * 0.15, -0.01), 0.045, 16)]),
                           C['ink'])], outline=False)
            sc.line([P(sx * 0.22, 0.11), P(sx * 0.09, 0.12)], 1.6)
        sc.line([P(-0.09, -0.24), P(0.0, -0.28), P(0.09, -0.24)], 1.7)


# ------------------------------------------------------------------ props
def chair(sc, x_front, x_back, seat_y=1.85, back_h=2.1, facing=1):
    """Side-view chair; the backrest is at x_back."""
    x0, x1 = min(x_front, x_back), max(x_front, x_back)
    t = 0.16
    parts = [(rrect(x0 + 0.08, 0, x0 + 0.24, seat_y - t, 0.04), shade(C['wood'], 0.9)),
             (rrect(x1 - 0.24, 0, x1 - 0.08, seat_y - t, 0.04), shade(C['wood'], 0.9))]
    sc.group(parts, tag='prop')
    bx = x_back
    post = rrect(bx - 0.09, seat_y - 0.1, bx + 0.09, seat_y + back_h, 0.05)
    panel = rrect(bx - 0.13, seat_y + back_h - 0.8, bx + 0.13, seat_y + back_h, 0.07)
    sc.group([(post, C['wood']), (panel, C['wood'])], tag='prop')
    sc.group([(rrect(x0, seat_y - t, x1, seat_y, 0.05), C['wood'])], tag='prop')


def wall(sc, x0, x1, y1):
    sc.group([(rrect(x0, 0, x1, y1, 0.03), C['wall'])], tag='prop')


def pillow(sc, c, rx, ry, a=0.0):
    sc.group([(ellipse(c, rx, ry, a, n=60), C['pillow'])], tag='prop')


# ================================================================== POSES
POSES = {}
HIP_STAND = 0.3 + L_SHIN + L_THIGH      # hip height when standing straight
SIDE_ORDER_HEAD_LAST = ['arm_far', 'leg_far', 'torso', 'leg_near', 'arm_near', 'head']


def pose(name):
    def deco(fn):
        POSES[name] = fn
        return fn
    return deco


def draw_with_props(sc, fig, props):
    """Draw figure layers in fig.order; names found in `props` call that prop instead."""
    for name in fig.order:
        if name in props:
            props[name]()
        else:
            fig.draw(sc, only=[name])


def bolster(sc, x0, x1, h):
    sc.group([(rrect(x0, 0, x1, h, h / 2), C['pillow'])], tag='prop')
    sc.line([(x1 - h * 0.5, h * 0.18), (x1 - h * 0.5, h * 0.82)], 1.4)


def solve(fn, lo, hi, it=40):
    """Bisection: find x in [lo, hi] with fn(x) == 0 (fn monotone)."""
    flo = fn(lo)
    for _ in range(it):
        mid = (lo + hi) / 2
        if (fn(mid) > 0) == (flo > 0):
            lo, flo = mid, fn(mid)
        else:
            hi = mid
    return (lo + hi) / 2


def head_low(f):
    return f.HC[1] - 0.5 * HS


@pose('art_childs_pose')
def p_childs():
    sc = Scene()
    knee = v(0, R_KNEE)
    hip = knee + L_THIGH * dirv(156)
    kw = dict(hip=hip, curl=0.17, head=-70, neck=0.45)
    ta = solve(lambda a: head_low(Figure(torso=a, **kw)) - 0.02, -30, 20)
    f = Figure(torso=ta, **kw, pony=150,
               legs={'near': {'a': (-22, 180), 'foot': 180},
                     'far': {'a': (-22, 180), 'foot': 180}},
               arms={'near': {'to': (3.25, 0.13), 'bend': 1},
                     'far': {'to': (3.4, 0.12), 'bend': 1}},
               order=SIDE_ORDER_HEAD_LAST)
    f.draw(sc)
    sc.floor_shadow()
    return sc


@pose('art_childs_pose_supported')
def p_childs_supported():
    sc = Scene()
    knee = v(0, R_KNEE)
    hip = knee + L_THIGH * dirv(150)
    f0 = Figure(hip=hip, torso=2, curl=0.08)
    sh = f0.sh['near']
    f = Figure(hip=hip, torso=2, curl=0.08, head=-12, neck=0.5, pony=205, eyes='closed',
               legs={'near': {'a': (-30, 180), 'foot': 180},
                     'far': {'a': (-30, 180), 'foot': 180}},
               arms={'near': {'to': (sh[0] + 1.9, 0.13), 'bend': -1},
                     'far': {'to': (sh[0] + 2.0, 0.12), 'bend': -1}},
               order=['arm_far', 'leg_far', 'bolster', 'torso', 'leg_near', 'arm_near', 'head'])
    draw_with_props(sc, f, {'bolster': lambda: bolster(sc, -0.9, 2.35, 0.92)})
    sc.floor_shadow()
    return sc


def _seated(head, near_shin, arrow_a, arrow_r=2.3, chin_arrow=False):
    sc = Scene()
    seat_y = 1.72
    hip = v(0, seat_y + 0.38)
    chair(sc, 1.15, -0.75, seat_y)
    g = Figure(hip=hip, legs={'near': {'a': (0, -86), 'foot': 2}})
    sc.ghost = 0.3
    g.draw(sc, only=['leg_near'])
    sc.ghost = 1.0
    f = Figure(hip=hip, torso=90, curl=-0.02, head=head,
               legs={'near': {'a': (0, near_shin), 'frel': 90 if near_shin < -60 else 98},
                     'far': {'a': (-2, -99), 'foot': 0}},
               arms={'near': {'to': (0.45, seat_y + 0.2), 'bend': -1},
                     'far': {'to': (0.35, seat_y + 0.2), 'bend': -1}})
    f.draw(sc)
    sc.arc_arrow(f.knee('near'), arrow_r, arrow_a[0], arrow_a[1], heads='both')
    if chin_arrow:
        sc.arc_arrow(f.HC, 1.0, -8, 42, heads='end')
    sc.floor_shadow()
    return sc


@pose('art_sciatic_nerve_slider')
def p_sciatic():
    return _seated(head=120, near_shin=-8, arrow_a=(-82, -18), chin_arrow=True)


@pose('art_sciatic_slider_gentle')
def p_sciatic_gentle():
    return _seated(head=90, near_shin=-50, arrow_a=(-82, -56))


@pose('art_standing_back_extension')
def p_back_ext():
    sc = Scene()
    kw = dict(hip=(0, 0), torso=104, curl=-0.08)
    f0 = Figure(**kw)
    t = 0.3
    tgt = f0.sp.pt(t) - 0.52 * f0.sp.front(t)
    f = Figure(**kw, head=130,
               legs={'near': {'a': (-97, -92), 'foot': 0}, 'far': {'a': (-97, -92), 'foot': 0}},
               arms={'near': {'to': tgt, 'bend': -1}, 'far': {'to': tgt + v(-0.04, 0.06), 'bend': -1}},
               order=['leg_far', 'arm_far', 'torso', 'leg_near', 'head', 'arm_near'])
    f.draw(sc)
    sc.arc_arrow(f.HC + v(0.1, -0.1), 1.2, 60, 125, heads='end')
    sc.ground()
    sc.floor_shadow()
    return sc


@pose('art_leg_swings')
def p_leg_swings():
    sc = Scene()
    hip = v(0, HIP_STAND)
    sc.group([(rrect(0.8, 0, 1.06, 6.0, 0.06), C['wood'])], tag='prop')
    sc.group([(rrect(0.58, 0, 1.28, 0.14, 0.05), shade(C['wood'], 0.85))], tag='prop')
    g = Figure(hip=hip, legs={'near': {'a': (-130, -134), 'frel': 70}})
    sc.ghost = 0.3
    g.draw(sc, only=['leg_near'])
    sc.ghost = 1.0
    f0 = Figure(hip=hip)
    hip_tgt = f0.sp.pt(0.36) + 0.12 * f0.sp.front(0.36)
    f = Figure(hip=hip, torso=90, head=90,
               legs={'near': {'a': (-42, -48), 'frel': 75}, 'far': {'a': (-90, -90), 'foot': 0}},
               arms={'far': {'to': (0.84, 5.05), 'bend': -1}, 'near': {'to': hip_tgt, 'bend': -1}})
    f.draw(sc)
    sc.arc_arrow(hip, 3.15, -128, -50, heads='both')
    sc.floor_shadow(x_range=(-0.4, 1.3))
    return sc


SUPINE = dict(hip=(0, 0.5), torso=180, head=180, pony=184)


@pose('art_supine_9090_hamstring')
def p_9090():
    sc = Scene()
    hip = v(SUPINE['hip'])
    tgt = hip + 1.05 * dirv(92) + v(0.45, 0)
    f = Figure(**SUPINE,
               legs={'near': {'a': (92, 6), 'frel': 82},
                     'far': {'to': (2.3, 0.3), 'bend': 1, 'foot': 0}},
               arms={'near': {'to': tgt, 'bend': 1}, 'far': {'to': tgt + v(0.05, 0.1), 'bend': 1}},
               order=['arm_far', 'leg_far', 'torso', 'leg_near', 'head', 'arm_near'])
    f.draw(sc)
    sc.ground()
    sc.floor_shadow()
    return sc


@pose('art_supine_hamstring_towel')
def p_towel():
    sc = Scene()
    hand = v(-0.65, 2.0)
    f = Figure(**SUPINE,
               legs={'near': {'a': (87, 55), 'frel': 88},
                     'far': {'a': (-3, 0), 'frel': 80}},
               arms={'near': {'to': hand, 'bend': 1}, 'far': {'to': hand + v(0.04, 0.08), 'bend': 1}},
               order=['arm_far', 'leg_far', 'torso', 'leg_near', 'towel', 'head', 'arm_near'])
    ankle = f.ankle('near')
    fa = ang(ankle - f.knee('near')) + 88
    d, u = dirv(fa), rot(dirv(fa), 90)
    heel = ankle - 0.24 * d - 0.36 * u
    toe = ankle + 0.8 * d - 0.36 * u
    h = hand + v(0.12, 0.05)
    draw_with_props(sc, f, {'towel': lambda: sc.stroke([h, heel, toe, h], 0.1, C['towel'])})
    sc.ground()
    sc.floor_shadow()
    return sc


@pose('art_bear_hug')
def p_bear_hug():
    sc = Scene()
    kw = dict(view='front', hip=(0, HIP_STAND), torso=90, shoulder_spread=0.7)
    f0 = Figure(**kw)
    shL, shR = f0.sh['L'], f0.sh['R']
    f = Figure(**kw, head=90, neck=0.46,
               legs={'L': {'a': (-93, -90)}, 'R': {'a': (-87, -90)}},
               arms={'L': {'to': shR + v(0.15, 0.16), 'bend': -1},
                     'R': {'to': shL + v(-0.15, 0.1), 'bend': 1}},
               order=['leg_L', 'leg_R', 'torso', 'head', 'arm_R', 'arm_L'])
    f.draw(sc)
    sc.ground()
    sc.floor_shadow()
    return sc


@pose('art_donkey_kicks')
def p_donkey():
    sc = Scene()
    hip = v(0, R_KNEE + L_THIGH)
    f0 = Figure(hip=hip, torso=11)
    sh = f0.sh['near']
    f = Figure(hip=hip, torso=11, head=0, pony=205,
               legs={'near': {'a': (172, 82), 'foot': 182},
                     'far': {'a': (-90, 180), 'foot': 180}},
               arms={'near': {'to': (sh[0] + 0.05, 0.2), 'bend': 1, 'hand': -8},
                     'far': {'to': (sh[0] - 0.05, 0.2), 'bend': 1, 'hand': -8}})
    f.draw(sc)
    a = f.ankle('near')
    sc.arrow([a + v(0.6, -0.55), a + v(0.6, 0.45)])
    sc.ground()
    sc.floor_shadow()
    return sc


@pose('art_open_book')
def p_open_book():
    """Top-down: knees stacked to one side, chest opened to the ceiling (front view)."""
    sc = Scene()
    kw = dict(view='front', hip=(0, 0), torso=180, shoulder_spread=0.74)
    f0 = Figure(**kw)
    shL = f0.sh['L']                        # image-bottom shoulder (bottom arm)
    pillow(sc, (f0.HC[0] - 0.05, f0.HC[1]), 0.85, 0.7)
    g = Figure(**kw, arms={'L': {'a': (-78, -80)}})
    g.sh['L'] = shL + v(0.18, 0)
    g.J['arm_L'] = resolve_limb(g.sh['L'], g.arms['L'], L_UARM, L_FARM)
    sc.ghost = 0.32
    g.draw(sc, only=['arm_L'])
    sc.ghost = 1.0
    f = Figure(**kw, head=170,
               legs={'L': {'a': (-90, 0), 'shoe': 'side', 'foot': -90, 'fs': -1},
                     'R': {'a': (-84, 4), 'shoe': 'side', 'foot': -88, 'fs': -1, 'with_shorts': True}},
               arms={'L': {'a': (-95, -95)}, 'R': {'a': (95, 95)}},
               order=['leg_L', 'arm_L', 'arm_R', 'torso', 'leg_R', 'head'])
    f.hp['R'] = f.hp['L'] + v(0.2, 0.05)       # top leg stacked on the bottom one
    f.J['leg_R'] = resolve_limb(f.hp['R'], f.legs['R'], L_THIGH, L_SHIN)
    f.draw(sc)
    c = f.sp.pt(T_SHOULDER)
    sc.arc_arrow(c, 2.9, -112, -250, heads='end')
    sc.mat()
    return sc


@pose('art_heel_drops')
def p_heel_drops():
    sc = Scene()
    step_h, edge = 1.0, 0.0
    wall_x = 2.25
    wall(sc, wall_x, wall_x + 0.5, 7.6)
    sc.group([(rrect(edge, 0, wall_x + 0.02, step_h, 0.04), C['step'])], tag='prop')
    fa = 36
    d, u = dirv(fa), rot(dirv(fa), 90)
    ball = v(edge + 0.1, step_h)
    ankle = ball - 0.6 * d + 0.28 * u
    hip = ankle + v(0.08, L_SHIN + L_THIGH - 0.02)
    legs = {'near': {'to': ankle, 'bend': 1, 'foot': fa},
            'far': {'to': ankle + v(0.05, 0), 'bend': 1, 'foot': fa}}
    f0 = Figure(hip=hip)
    sh = f0.sh['near']
    f = Figure(hip=hip, torso=90, head=90, legs=legs,
               arms={'near': {'to': (wall_x - 0.16, sh[1] + 0.05), 'bend': -1, 'hand': 80},
                     'far': {'a': (-95, -88)}})
    f.draw(sc)
    heel = ankle - 0.2 * d - 0.28 * u
    sc.arrow([heel + v(-0.5, 0.8), heel + v(-0.5, -0.2)])
    sc.floor_shadow(x_range=(-0.8, wall_x + 0.5))
    return sc


@pose('art_knee_plank')
def p_knee_plank():
    sc = Scene()
    knee = v(0, R_KNEE)
    el_y = R_ELBOW
    # body line knee->shoulder so that the shoulder sits one upper-arm above the elbow
    reach = L_THIGH + L_TORSO * T_SHOULDER
    a = math.degrees(math.asin((el_y + L_UARM - knee[1]) / reach))
    hip = knee + L_THIGH * dirv(a)
    f = Figure(hip=hip, torso=a, head=a + 6,
               legs={'near': {'a': (a + 180, 128), 'frel': 45},
                     'far': {'a': (a + 180, 134), 'frel': 45}},
               arms={'near': {'a': (-90, 0)}, 'far': {'a': (-90, 0)}})
    for k, dx in (('near', 0.0), ('far', -0.1)):
        e = f.sh[k] + v(dx, -L_UARM)
        f.J['arm_' + k] = (e, e + v(L_FARM, 0), -90, 0)
    f.draw(sc)
    sc.ground()
    sc.floor_shadow()
    return sc


@pose('art_sun_salute')
def p_sun_salute():
    sc = Scene()
    f = Figure(hip=(0, HIP_STAND), torso=96, curl=-0.08, head=112,
               legs={'near': {'a': (-93, -91), 'foot': 0}, 'far': {'a': (-93, -91), 'foot': 0}},
               arms={'near': {'a': (104, 101)}, 'far': {'a': (106, 102)}},
               order=SIDE_ORDER_HEAD_LAST)
    f.draw(sc)
    sc.ground()
    sc.floor_shadow()
    return sc


@pose('art_standing_hamstring_chair')
def p_ham_chair():
    sc = Scene()
    hip = v(0, HIP_STAND)
    seat_y = 1.72
    la = -33
    ankle = hip + (L_THIGH + L_SHIN) * dirv(la)
    seat_y = ankle[1] - 0.25                 # heel rests on the seat
    chair(sc, ankle[0] - 0.55, ankle[0] + 1.15, seat_y, back_h=1.9)
    tgt = hip + 1.2 * dirv(la) + v(0, 0.32)
    f = Figure(hip=hip, torso=48, head=44,
               legs={'near': {'a': (la, la), 'frel': 70},
                     'far': {'a': (-92, -90), 'foot': 0}},
               arms={'near': {'to': tgt, 'bend': -1}, 'far': {'to': tgt + v(0.15, 0.05), 'bend': -1}})
    f.draw(sc)
    sc.floor_shadow()
    return sc


@pose('art_reclined_butterfly')
def p_reclined_butterfly():
    sc = Scene()
    legs = {}
    for k, sg in (('L', -1), ('R', 1)):
        legs[k] = {'a': (sg * 55, 0), 'end': (1.9, sg * 0.3), 'shoe': 'side', 'foot': 0, 'fs': sg}
    f = Figure(view='front', hip=(0, 0), torso=180, head=180, eyes='closed',
               legs=legs, arms={'L': {'a': (188, 181)}, 'R': {'a': (172, 179)}},
               order=['arm_L', 'arm_R', 'leg_L', 'leg_R', 'torso', 'head'])
    f.draw(sc)
    sc.mat()
    return sc


@pose('art_pilates_hundred')
def p_hundred():
    sc = Scene()
    f = Figure(hip=(0, 0.5), torso=162, curl=0.13, head=128, pony=225,
               legs={'near': {'a': (44, 44), 'frel': 30}, 'far': {'a': (46, 46), 'frel': 30}},
               arms={'near': {'a': (-14, -12)}, 'far': {'a': (-11, -10)}})
    f.draw(sc)
    P = f.wrist('near')
    sc.arrow([P + v(0.6, -0.4), P + v(0.6, 0.45)], heads='both')
    sc.ground()
    sc.floor_shadow()
    return sc


@pose('art_pilates_roll_up')
def p_roll_up():
    sc = Scene()
    f = Figure(hip=(0, 0.5), torso=126, curl=0.3, head=52, pony=215,
               legs={'near': {'a': (-2, 0), 'frel': 88}, 'far': {'a': (-1, 0), 'frel': 88}},
               arms={'near': {'a': (-2, -2)}, 'far': {'a': (0, 0)}})
    f.draw(sc)
    sc.ground()
    sc.floor_shadow()
    return sc


@pose('art_pilates_criss_cross')
def p_criss_cross():
    sc = Scene()
    kw = dict(hip=(0, 0.5), torso=158, curl=0.14, head=132, pony=220)
    f0 = Figure(**kw)
    back_head = f0.HC - 0.4 * f0.face + 0.12 * dirv(f0.head_ang)
    f = Figure(**kw,
               legs={'far': {'a': (112, 0), 'frel': 50},
                     'near': {'a': (14, 14), 'frel': 30}},
               arms={'near': {'to': back_head, 'bend': -1},
                     'far': {'to': back_head + v(0.05, 0.05), 'bend': -1}},
               order=['leg_far', 'arm_far', 'torso', 'leg_near', 'arm_near', 'head'])
    sh = f.sh['near']
    el = sh + L_UARM * norm(f.knee('far') - sh)          # elbow drives to the opposite knee
    f.J['arm_near'] = (el, back_head, 0, 0)
    f.draw(sc)
    sc.ground()
    sc.floor_shadow()
    return sc


@pose('art_pilates_saw')
def p_saw():
    sc = Scene()
    kw = dict(hip=(0, 0.5), torso=34, curl=0.16)
    f = Figure(**kw, head=8,
               legs={'near': {'a': (-3, -1), 'frel': 88}, 'far': {'a': (2, 3), 'frel': 88}},
               arms={'near': {'a': (-22, -18)}, 'far': {'a': (148, 152)}},
               order=['leg_far', 'arm_far', 'torso', 'leg_near', 'arm_near', 'head'])
    f.draw(sc)
    sc.ground()
    sc.floor_shadow()
    return sc


@pose('art_pilates_open_leg_rocker')
def p_open_leg_rocker():
    sc = Scene()
    hip = v(0, 0.5)
    la = 63
    tgt = hip + 3.15 * dirv(la)
    f = Figure(hip=hip, torso=118, curl=0.02, head=108,
               legs={'near': {'a': (la, la), 'frel': 35}, 'far': {'a': (la + 6, la + 6), 'frel': 35}},
               arms={'near': {'to': tgt, 'bend': 1}, 'far': {'to': tgt + v(-0.1, 0.2), 'bend': 1}})
    f.draw(sc)
    sc.ground()
    sc.floor_shadow()
    return sc


@pose('art_leg_lowers')
def p_leg_lowers():
    sc = Scene()
    g = Figure(**SUPINE, legs={'near': {'a': (30, 30), 'frel': 40}, 'far': {'a': (31, 31), 'frel': 40}})
    sc.ghost = 0.3
    g.draw(sc, only=['leg_far', 'leg_near'])
    sc.ghost = 1.0
    f = Figure(**SUPINE, legs={'near': {'a': (60, 60), 'frel': 40}, 'far': {'a': (61, 61), 'frel': 40}},
               arms={'near': {'a': (-6, -2)}, 'far': {'a': (-5, -2)}})
    f.draw(sc)
    sc.arc_arrow(v(SUPINE['hip']), 4.4, 55, 37, heads='end')
    sc.ground()
    sc.floor_shadow()
    return sc


@pose('art_eyes_closed_romberg')
def p_romberg():
    sc = Scene()
    kw = dict(view='front', hip=(0, HIP_STAND), torso=90)
    f0 = Figure(**kw)
    yc = f0.sh['L'][1] - 0.8
    f = Figure(**kw, head=90, eyes='closed',
               legs={'L': {'to': (-0.21, 0.3), 'bend': -1}, 'R': {'to': (0.21, 0.3), 'bend': 1}},
               arms={'L': {'to': (0.66, yc + 0.08), 'bend': -1},
                     'R': {'to': (-0.66, yc - 0.12), 'bend': 1}},
               order=['leg_L', 'leg_R', 'torso', 'head', 'arm_L', 'arm_R'])
    f.draw(sc)
    sc.ground()
    sc.floor_shadow()
    return sc


# ------------------------------------------------------------------ main
def contact_sheet(paths, out, cell=240, cols=6, extra=()):
    allp = list(extra) + list(paths)
    rows = math.ceil(len(allp) / cols)
    sheet = Image.new('RGB', (cols * cell, rows * (cell + 22)), (255, 255, 255))
    d = ImageDraw.Draw(sheet)
    for i, p in enumerate(allp):
        im = Image.open(p).convert('RGB')
        im.thumbnail((cell - 8, cell - 8), Image.LANCZOS)
        x, y = (i % cols) * cell, (i // cols) * (cell + 22)
        sheet.paste(im, (x + (cell - im.width) // 2, y + 2))
        # 44px thumbnail inset
        t = Image.open(p).convert('RGB')
        t.thumbnail((44, 44), Image.LANCZOS)
        sheet.paste(t, (x + cell - t.width - 2, y + cell - t.height - 2))
        d.text((x + 4, y + cell + 4), os.path.basename(p)[:38], fill=(0, 0, 0))
    sheet.save(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('names', nargs='*')
    ap.add_argument('--outdir', default=DEFAULT_OUT)
    ap.add_argument('--sheet')
    a = ap.parse_args()
    names = a.names or list(POSES)
    os.makedirs(a.outdir, exist_ok=True)
    written = []
    for n in names:
        n = n.replace('.png', '')
        if n not in POSES:
            sys.exit('unknown pose ' + n)
        assert n.startswith('art_'), 'refusing to write non art_ file'
        path = os.path.join(a.outdir, n + '.png')
        POSES[n]().render(path)
        written.append(path)
        print('wrote', path)
    if a.sheet:
        contact_sheet(written, a.sheet)
        print('sheet', a.sheet)


if __name__ == '__main__':
    main()
