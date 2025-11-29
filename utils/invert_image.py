from PIL import Image

def invert_image(input_path, output_path):
    """
    Inverts an image (white becomes black, black becomes white)
    while preserving transparency.
    
    :param input_path: Path to the source image.
    :param output_path: Path to save the result (must be .png to preserve transparency).
    """
    
    print(f"Processing: {input_path}...")
    
    # 1. Open image and convert to RGBA (Red, Green, Blue, Alpha)
    # We need 'Alpha' to support transparency.
    img = Image.open(input_path).convert("RGBA")
    
    # 2. Get the list of pixels from the image
    datas = img.getdata()
    
    newData = []
    
    for item in datas:
        # item is a tuple: (Red, Green, Blue, Alpha)
        r, g, b, a = item
        
        # 3. If the pixel is transparent, keep it transparent
        if a == 0:
            newData.append((0, 0, 0, 0))
        else:
            # 4. Invert the RGB values (255 - value)
            # White (255, 255, 255) becomes Black (0, 0, 0)
            # Black (0, 0, 0) becomes White (255, 255, 255)
            inverted_r = 255 - r
            inverted_g = 255 - g
            inverted_b = 255 - b
            
            # Keep the original alpha channel
            newData.append((inverted_r, inverted_g, inverted_b, a))
    
    # 5. Update the image with the new pixel list
    img.putdata(newData)
    
    # 6. Save the file
    # Important: Must be saved as PNG to retain transparency!
    img.save(output_path, "PNG")
    print(f"Success! Saved to {output_path}")

# --- Usage ---
if __name__ == "__main__":
    # Example usage:
    # Ensure you have an image named 'orthodox-o-logo-transparent.png' or change the filename below.
    try:
        invert_image("orthodox-o-logo-v2.jpg", "orthodox-o-logo-v2-inverted.png")
    except FileNotFoundError:
        print("Error: Could not find the input file. Please check the file path.")

