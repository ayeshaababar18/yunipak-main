import os
from PIL import Image

def compress_images():
    source_dir = 'gallery'
    target_dir = 'public/gallery'
    thumbs_dir = os.path.join(target_dir, 'thumbs')

    os.makedirs(target_dir, exist_ok=True)
    os.makedirs(thumbs_dir, exist_ok=True)

    for filename in os.listdir(source_dir):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            source_path = os.path.join(source_dir, filename)
            target_path = os.path.join(target_dir, filename)
            thumb_path = os.path.join(thumbs_dir, filename)

            print(f"Processing {filename}...")
            
            with Image.open(source_path) as img:
                # 1. Save optimized main image (max 1200px width/height, preserving aspect ratio)
                img_copy = img.copy()
                img_copy.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                
                # Check for EXIF orientation and transpose if needed
                try:
                    # pylint: disable=protected-access
                    if hasattr(img_copy, '_getexif'):
                        exif = img_copy._getexif()
                        if exif is not None:
                            orientation = exif.get(274)
                            if orientation == 3:
                                img_copy = img_copy.rotate(180, expand=True)
                            elif orientation == 6:
                                img_copy = img_copy.rotate(270, expand=True)
                            elif orientation == 8:
                                img_copy = img_copy.rotate(90, expand=True)
                except Exception as e:
                    print(f"Error handling EXIF for {filename}: {e}")

                img_copy.save(target_path, 'JPEG', quality=80, optimize=True)
                print(f"Saved optimized image to {target_path}")

                # 2. Save thumbnail (max 400px width/height)
                thumb_img = img.copy()
                thumb_img.thumbnail((400, 400), Image.Resampling.LANCZOS)
                
                try:
                    if hasattr(thumb_img, '_getexif'):
                        exif = thumb_img._getexif()
                        if exif is not None:
                            orientation = exif.get(274)
                            if orientation == 3:
                                thumb_img = thumb_img.rotate(180, expand=True)
                            elif orientation == 6:
                                thumb_img = thumb_img.rotate(270, expand=True)
                            elif orientation == 8:
                                thumb_img = thumb_img.rotate(90, expand=True)
                except Exception as e:
                    print(f"Error handling EXIF for {filename} thumbnail: {e}")

                thumb_img.save(thumb_path, 'JPEG', quality=80, optimize=True)
                print(f"Saved thumbnail to {thumb_path}")

if __name__ == '__main__':
    compress_images()
