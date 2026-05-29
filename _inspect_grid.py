from PIL import Image
img = Image.open(r"assets/sections/network-benefits-cutout.png").convert("RGBA")
for y in [20,40,60,80,100,120]:
    row=[]
    for x in [20,40,60,80,100,120,140,160,180,200]:
        row.append(img.getpixel((x,y)))
    print(y,row)
