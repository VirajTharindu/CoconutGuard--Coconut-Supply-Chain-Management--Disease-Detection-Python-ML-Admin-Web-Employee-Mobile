"""
TensorFlow to TensorFlow Lite Conversion Script
==============================================

Converts a trained Keras model to TensorFlow Lite format for mobile deployment.

Usage:
    python convert_to_tflite.py --model-path models/coconut_cnn.h5 --output models/coconut_disease_model.tflite

Author: Coconut Supply Chain System Team
"""

import tensorflow as tf
import argparse
from pathlib import Path


def convert_to_tflite(model_path: str, output_path: str, quantize: bool = True):
    """
    Convert a Keras model to TensorFlow Lite format.
    
    Args:
        model_path: Path to the saved Keras model (.h5 or SavedModel)
        output_path: Path to save the TFLite model
        quantize: Whether to apply quantization (reduces model size)
    """
    print(f"🔄 Loading model from: {model_path}")
    
    # Load the Keras model
    model = tf.keras.models.load_model(model_path)
    
    # Create TFLite converter
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    
    if quantize:
        print("⚙️  Applying quantization for smaller model size...")
        # Dynamic range quantization
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
    
    # Convert the model
    print("🔧 Converting to TFLite format...")
    tflite_model = converter.convert()
    
    # Save the model
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'wb') as f:
        f.write(tflite_model)
    
    # Calculate model size
    size_mb = output_path.stat().st_size / (1024 * 1024)
    
    print(f"✅ Model converted successfully!")
    print(f"📦 Output: {output_path}")
    print(f"📏 Size: {size_mb:.2f} MB")
    
    if size_mb > 10:
        print("⚠️  Warning: Model size exceeds 10 MB. Consider more aggressive quantization.")


def main():
    parser = argparse.ArgumentParser(description='Convert Keras model to TFLite')
    parser.add_argument('--model-path', type=str, required=True,
                        help='Path to the Keras model (.h5)')
    parser.add_argument('--output', type=str, required=True,
                        help='Output path for TFLite model')
    parser.add_argument('--no-quantize', action='store_true',
                        help='Disable quantization')
    
    args = parser.parse_args()
    
    convert_to_tflite(
        model_path=args.model_path,
        output_path=args.output,
        quantize=not args.no_quantize
    )


if __name__ == "__main__":
    main()
