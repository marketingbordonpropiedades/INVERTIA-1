from collections import deque
from PIL import Image
import math

src = r"assets/sections/network-benefits-cutout.png"
out = r"assets/sections/network-benefits-clean.png"
img = Image.open(src).convert("RGBA")
w,h = img.size
px = img.load()

# Estimated checkerboard pattern from the baked background.
cell = 20
light = (254,254,254)
dark = (240,240,240)

visited = [[False]*w for _ in range(h)]
q = deque()

# Seed flood fill from all image edges.
for x in range(w):
    q.append((x,0))
    q.append((x,h-1))
for y in range(h):
    q.append((0,y))
    q.append((w-1,y))

def expected(x,y):
    return light if ((x//cell + y//cell) % 2 == 0) else dark

def is_bg(x,y):
    r,g,b,a = px[x,y]
    if a == 0:
        return True
    er,eg,eb = expected(x,y)
    # Low-saturation, near checker color. Tight enough to stop at cards and artwork.
    if max(r,g,b) - min(r,g,b) > 18:
        return False
    dist = abs(r-er) + abs(g-eg) + abs(b-eb)
    return dist <= 24

while q:
    x,y = q.popleft()
    if x < 0 or y < 0 or x >= w or y >= h or visited[y][x]:
        continue
    visited[y][x] = True
    if not is_bg(x,y):
        continue
    px[x,y] = (255,255,255,0)
    q.append((x+1,y))
    q.append((x-1,y))
    q.append((x,y+1))
    q.append((x,y-1))

# Light cleanup: any remaining almost-checker pixels directly adjacent to transparent pixels
# are background remnants; remove them too.
for _ in range(2):
    to_clear = []
    for y in range(1,h-1):
        for x in range(1,w-1):
            if px[x,y][3] == 0:
                continue
            if not is_bg(x,y):
                continue
            neighbors = [px[x+1,y][3], px[x-1,y][3], px[x,y+1][3], px[x,y-1][3]]
            if any(a == 0 for a in neighbors):
                to_clear.append((x,y))
    for x,y in to_clear:
        px[x,y] = (255,255,255,0)

img.save(out)
print(out)
