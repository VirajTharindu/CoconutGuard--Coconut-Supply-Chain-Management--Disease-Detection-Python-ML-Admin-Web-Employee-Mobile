import os
import shutil
import random
import argparse
from pathlib import Path

# Configuration
CLASSES = ['bud_rot', 'stem_bleeding', 'leaf_spot', 'healthy']
SPLIT_RATIOS = {'train': 0.7, 'val': 0.2, 'test': 0.1}

def create_directory_structure(base_path):
    """Creates the train/val/test directory structure."""
    for split in ['train', 'val', 'test']:
        for class_name in CLASSES:
            os.makedirs(os.path.join(base_path, split, class_name), exist_ok=True)
    print(f"✅ Directory structure created at {base_path}")

def get_image_files(source_dir):
    """Recursively finds all image files in a directory."""
    extensions = ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']
    files = []
    for ext in extensions:
        files.extend(list(Path(source_dir).rglob(ext)))
    return files

def split_dataset(source_base, target_base):
    """
    Distributes images from source folders (named by class) into train/val/test splits.
    
    Expected source structure:
    source_base/
        bud_rot/
        stem_bleeding/
        ...
    """
    create_directory_structure(target_base)
    
    for class_name in CLASSES:
        source_class_dir = os.path.join(source_base, class_name)
        if not os.path.exists(source_class_dir):
            print(f"⚠️  Warning: Source directory not found for class '{class_name}' at {source_class_dir}")
            continue
            
        images = get_image_files(source_class_dir)
        random.shuffle(images)
        
        total_images = len(images)
        train_count = int(total_images * SPLIT_RATIOS['train'])
        val_count = int(total_images * SPLIT_RATIOS['val'])
        # Test gets the remainder
        
        train_imgs = images[:train_count]
        val_imgs = images[train_count:train_count+val_count]
        test_imgs = images[train_count+val_count:]
        
        print(f"Processing '{class_name}': {total_images} images (Train: {len(train_imgs)}, Val: {len(val_imgs)}, Test: {len(test_imgs)})")
        
        # Helper to copy
        def copy_files(file_list, split_name):
            target_dir = os.path.join(target_base, split_name, class_name)
            for img_path in file_list:
                shutil.copy2(img_path, os.path.join(target_dir, img_path.name))
                
        copy_files(train_imgs, 'train')
        copy_files(val_imgs, 'val')
        copy_files(test_imgs, 'test')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Prepare Coconut Disease Dataset for CNN Training")
    parser.add_argument('--source', type=str, required=True, help="Path to raw dataset with class subfolders")
    parser.add_argument('--target', type=str, required=True, help="Path to output processed dataset")
    
    args = parser.parse_args()
    
    print("🥥 Coconut Guard - ML Dataset Prepper")
    print("=====================================")
    
    if not os.path.exists(args.source):
        print(f"❌ Error: Source directory '{args.source}' does not exist.")
        exit(1)
        
    split_dataset(args.source, args.target)
    print("\n✨ Dataset preparation complete!")
