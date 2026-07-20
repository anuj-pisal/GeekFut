from PIL import Image

def remove_background(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Check if the pixel is white or light gray (the checkerboard pattern)
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            # Set alpha to 0 for these background pixels
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print("Successfully removed background!")

if __name__ == '__main__':
    remove_background('public/logo.jpg', 'public/logo.png')
