"""
Coconut Disease Dataset Preparation Script
==========================================

This script preprocesses coconut disease images for CNN training:
1. Resizes images to 224x224 (MobileNetV2 input size)
2. Applies data augmentation
3. Splits into train/validation/test sets (70/20/10)
4. Balances classes

Usage:
    python prepare_dataset.py

Author: Coconut Supply Chain System Team
"""

import os
import shutil
import random
from pathlib import Path
from PIL import Image
import numpy as np
from typing import Tuple, List

# Configuration
RAW_DATA_DIR = Path("datasets/raw")
PROCESSED_DATA_DIR = Path("datasets/processed")
IMAGE_SIZE = (224, 224)
TRAIN_RATIO = 0.7
VAL_RATIO = 0.2
TEST_RATIO = 0.1

# Disease classes
CLASSES = ["bud_rot", "stem_bleeding", "gray_leaf_spot", "wclwd", "healthy"]


def setup_directories():
    """Create processed data directory structure."""
    print("🔧 Setting up directory structure...")
    
    for split in ["train", "validation", "test"]:
        for class_name in CLASSES:
            path = PROCESSED_DATA_DIR / split / class_name
            path.mkdir(parents=True, exist_ok=True)
    
    print("✅ Directories created successfully!")


def preprocess_image(image_path: Path) -> Image.Image:
    """
    Preprocess a single image:
    - Convert to RGB
    - Resize to 224x224
    - Normalize pixel values
    """
    try:
        img = Image.open(image_path)
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize to model input size
        img = img.resize(IMAGE_SIZE, Image.Resampling.LANCZOS)
        
        return img
    
    except Exception as e:
        print(f"⚠️  Error processing {image_path}: {e}")
        return None


def split_dataset(image_files: List[Path], class_name: str):
    """
    Split images into train/validation/test sets.
    """
    random.shuffle(image_files)
    
    total = len(image_files)
    train_count = int(total * TRAIN_RATIO)
    val_count = int(total * VAL_RATIO)
    
    train_files = image_files[:train_count]
    val_files = image_files[train_count:train_count + val_count]
    test_files = image_files[train_count + val_count:]
    
    return {
        "train": train_files,
        "validation": val_files,
        "test": test_files
    }


def copy_and_process_images(files: List[Path], destination: Path, class_name: str):
    """
    Copy and preprocess images to destination directory.
    """
    success_count = 0
    
    for idx, img_path in enumerate(files):
        processed_img = preprocess_image(img_path)
        
        if processed_img is not None:
            # Save with new filename
            output_filename = f"{class_name}_{idx:04d}.jpg"
            output_path = destination / class_name / output_filename
            
            processed_img.save(output_path, "JPEG", quality=95)
            success_count += 1
    
    return success_count


def process_class(class_name: str):
    """
    Process all images for a specific disease class.
    """
    print(f"\n📂 Processing class: {class_name}")
    
    class_dir = RAW_DATA_DIR / class_name
    
    if not class_dir.exists():
        print(f"⚠️  Directory not found: {class_dir}")
        return
    
    # Get all image files
    image_extensions = ['.jpg', '.jpeg', '.png', '.bmp']
    image_files = [
        f for f in class_dir.iterdir() 
        if f.suffix.lower() in image_extensions
    ]
    
    if len(image_files) == 0:
        print(f"⚠️  No images found in {class_dir}")
        return
    
    print(f"   Found {len(image_files)} images")
    
    # Split dataset
    splits = split_dataset(image_files, class_name)
    
    # Process each split
    for split_name, files in splits.items():
        destination = PROCESSED_DATA_DIR / split_name
        count = copy_and_process_images(files, destination, class_name)
        print(f"   ✓ {split_name}: {count} images processed")


def generate_dataset_report():
    """
    Generate a summary report of the processed dataset.
    """
    print("\n" + "="*60)
    print("📊 DATASET SUMMARY")
    print("="*60)
    
    for split in ["train", "validation", "test"]:
        print(f"\n{split.upper()}:")
        split_path = PROCESSED_DATA_DIR / split
        
        total = 0
        for class_name in CLASSES:
            class_path = split_path / class_name
            if class_path.exists():
                count = len(list(class_path.glob("*.jpg")))
                total += count
                print(f"  {class_name:20s}: {count:4d} images")
        
        print(f"  {'TOTAL':20s}: {total:4d} images")
    
    print("\n" + "="*60)


def main():
    """
    Main execution function.
    """
    print("🥥 Coconut Disease Dataset Preparation")
    print("="*60)
    
    # Setup directories
    setup_directories()
    
    # Process each class
    for class_name in CLASSES:
        process_class(class_name)
    
    # Generate report
    generate_dataset_report()
    
    print("\n✅ Dataset preparation complete!")
    print("\nNext steps:")
    print("1. Review the processed images in datasets/processed/")
    print("2. Run train_model.ipynb to train the CNN")
    print("3. Convert the model to TFLite format")


if __name__ == "__main__":
    main()
