from PIL import Image
img = Image.open(r"assets/sections/network-benefits-cutout.png").convert("RGBA")
print("size", img.size)
pts=[(0,0),(10,10),(50,50),(100,100),(300,50),(600,50),(20,500)]
for pt in pts:
    print(pt, img.getpixel(pt))
