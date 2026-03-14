# ML Core - Coconut Disease Detection

## Overview

This directory contains the machine learning utilities for training and preparing the coconut disease detection CNN model.

## Directory Structure

```
ml_core/
├── prepare_dataset.py         # Dataset preprocessing script
├── train_model.ipynb          # Jupyter notebook for model training
├── convert_to_tflite.py       # TensorFlow to TFLite conversion
├── requirements.txt           # Python dependencies
├── datasets/
│   ├── raw/                   # Original images (organized by class)
│   │   ├── bud_rot/
│   │   ├── stem_bleeding/
│   │   ├── gray_leaf_spot/
│   │   ├── wclwd/
│   │   └── healthy/
│   └── processed/             # Preprocessed images
│       ├── train/
│       ├── validation/
│       └── test/
└── models/
    └── coconut_disease_model.tflite
```

## Disease Classes

1. **bud_rot** - Bud Rot Disease
2. **stem_bleeding** - Stem Bleeding
3. **gray_leaf_spot** - Gray Leaf Spot
4. **wclwd** - Wilt Disease (Coconut Lethal Yellowing Disease)
5. **healthy** - Healthy coconut tree

## Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Usage

### 1. Prepare Dataset

Place raw images in `datasets/raw/{class_name}/` folders, then run:

```bash
python prepare_dataset.py
```

This will:
- Resize images to 224x224
- Apply data augmentation
- Split into train/validation/test sets (70/20/10)
- Balance classes

### 2. Train Model

Open and run the Jupyter notebook:

```bash
jupyter notebook train_model.ipynb
```

### 3. Convert to TFLite

After training, convert the model to TensorFlow Lite format:

```bash
python convert_to_tflite.py --model-path models/coconut_cnn.h5 --output models/coconut_disease_model.tflite
```

## Model Architecture

- **Base**: MobileNetV2 (transfer learning)
- **Input**: 224x224x3 RGB images
- **Output**: 5 classes (softmax)
- **Optimization**: Quantized for mobile deployment

## Performance Targets

- **Accuracy**: ≥ 90%
- **Precision**: ≥ 85% per class
- **Recall**: ≥ 85% per class
- **Model Size**: < 10 MB (for mobile)

## Integration

The trained `.tflite` model should be copied to:
- Flutter: `mobile/assets/models/coconut_disease_model.tflite`

## Notes

- Ensure balanced dataset (minimum 500 images per class)
- Use high-quality images (min 224x224)
- Validate model performance before deployment
