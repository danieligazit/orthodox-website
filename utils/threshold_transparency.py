from PIL import Image

def filter_pixels(input_path, output_path, threshold=100):
    """
    Keeps pixels above a certain brightness threshold and makes
    everything else transparent.
    
    :param input_path: Path to the source image.
    :param output_path: Path to save the result (must be .png).
    :param threshold: 0 to 255. Higher means only brighter pixels are kept.
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
        
        # 3. Calculate brightness. 
        # A simple average is (R + G + B) / 3.
        # For more human-eye accuracy, you can use: (0.299*R + 0.587*G + 0.114*B)
        brightness = (item[0] + item[1] + item[2]) / 3
        
        # 4. Apply the threshold
        if brightness > threshold:
            # If above threshold, keep the original pixel
            newData.append(item)
        else:
            # If below threshold, make it transparent
            # (255, 255, 255, 0) -> The '0' at the end is Alpha (Transparency)
            newData.append((255, 255, 255, 0))
    
    # 5. Update the image with the new pixel list
    img.putdata(newData)
    
    # 6. Save the file
    # Important: Must be saved as PNG to retain transparency!
    img.save(output_path, "PNG")
    print(f"Success! Saved to {output_path}")

# --- Usage ---
if __name__ == "__main__":
    # Example usage:
    # Ensure you have an image named 'input.jpg' or change the filename below.
    try:
        filter_pixels("orthodox-o-logo-v2-inverted.png", "orthodox-o-logo-v2-transparent.png", threshold=120)
    except FileNotFoundError:
        print("Error: Could not find 'input.jpg'. Please check the file path.")