#!/usr/bin/env python3
"""
Script to remove black background from logo image.
Usage: python remove_background.py <input_image> <output_image>
"""

import sys
from PIL import Image
import numpy as np

def remove_black_background(input_path, output_path, threshold=30):
    """
    Remove black background from image, making it transparent.
    
    Args:
        input_path: Path to input image
        output_path: Path to save output image (PNG with transparency)
        threshold: RGB threshold for black detection (0-255)
    """
    try:
        # Open the image
        img = Image.open(input_path)
        
        # Convert to RGBA if not already
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Convert to numpy array for processing
        data = np.array(img)
        
        # Create mask: pixels that are black (or very dark) become transparent
        # Check if all RGB channels are below threshold
        mask = (data[:, :, 0] < threshold) & (data[:, :, 1] < threshold) & (data[:, :, 2] < threshold)
        
        # Set alpha channel to 0 (transparent) for black pixels
        data[:, :, 3] = np.where(mask, 0, data[:, :, 3])
        
        # Convert back to PIL Image
        result = Image.fromarray(data)
        
        # Save as PNG (supports transparency)
        result.save(output_path, 'PNG')
        print(f"Successfully processed image: {output_path}")
        print(f"Black background removed (threshold: {threshold})")
        
    except ImportError:
        print("Error: PIL (Pillow) is not installed.")
        print("Install it with: pip install Pillow")
        sys.exit(1)
    except Exception as e:
        print(f"Error processing image: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python remove_background.py <input_image> <output_image>")
        print("Example: python remove_background.py logo.png src/assets/images/logo.png")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    threshold = int(sys.argv[3]) if len(sys.argv) > 3 else 30
    
    remove_black_background(input_path, output_path, threshold)


