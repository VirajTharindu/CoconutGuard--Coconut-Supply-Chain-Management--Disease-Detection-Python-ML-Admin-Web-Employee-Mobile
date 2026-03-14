import 'dart:typed_data';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart';
import 'package:cross_file/cross_file.dart'; 
// Note: Actual TFLite implementation requires tflite_flutter package.
// This is a service structure ready for integration.
// import 'package:tflite_flutter/tflite_flutter.dart'; 
import 'package:image/image.dart' as img;

class MLService {
  // Singleton pattern
  static final MLService _instance = MLService._internal();
  factory MLService() => _instance;
  MLService._internal();

  // Interpreter? _interpreter; 
  // List<String>? _labels;

  static const String modelFile = "coconut_disease_model.tflite";
  static const String labelsFile = "assets/labels.txt";
  static const double confidenceThreshold = 0.70;

  bool _isLoaded = false;

  Future<void> loadModel() async {
    try {
      // _interpreter = await Interpreter.fromAsset(modelFile);
      // _labels = await _loadLabels();
      _isLoaded = true;
      debugPrint("✅ ML Model loaded successfully");
    } catch (e) {
      debugPrint("⚠️ ML Model not found or failed to load: $e");
      debugPrint("👉 Continuing with MOCK INFERENCE for development.");
    }
  }

  /*
  Future<List<String>> _loadLabels() async {
    final fileString = await rootBundle.loadString(labelsFile);
    return fileString.split('\n');
  }
  */

  /// Runs inference on an image file.
  /// Returns a Map with 'label', 'confidence', and 'requiresExpert'.
  Future<Map<String, dynamic>> predict(XFile imageFile) async {
    if (!_isLoaded) await loadModel(); // && _interpreter == null

    String label = 'unknown';
    double confidence = 0.0;

    // if (_interpreter != null) {
      try {
        // 1. Preprocess image
        var input = await _preprocessImage(imageFile);

        // 2. Run Inference
        // Output: [1, 4] -> List<List<double>>
        // var output = List.generate(1, (_) => List.filled(4, 0.0));
        // _interpreter!.run(input, output);
        
        // Find max confidence
        /*
        List<double> probabilities = List<double>.from(output[0]);
        double maxProb = -1.0;
        int maxIndex = -1;
        
        for (int i = 0; i < probabilities.length; i++) {
          if (probabilities[i] > maxProb) {
            maxProb = probabilities[i];
            maxIndex = i;
          }
        }
        
        confidence = maxProb;
        // Map index to label (placeholder labels for now)
        List<String> labels = ['bud_rot', 'stem_bleeding', 'leaf_spot', 'healthy'];
        label = labels[maxIndex];
        */
        throw Exception("Interpreter disabled");
        
      } catch (e) {
        // print("❌ Inference failed: $e. Falling back to mock.");
        final mock = _mockInference();
        label = mock['label'];
        confidence = mock['confidence'];
      }
    /*
    } else {
      // Fallback if interpreter didn't load
      final mock = _mockInference();
      label = mock['label'];
      confidence = mock['confidence'];
    }
    */

    // 3. Confidence Logic
    final bool requiresExpert = confidence < confidenceThreshold;

    debugPrint("🧠 Prediction: $label ($confidence) | Expert Needed: $requiresExpert");

    return {
      'label': label,
      'confidence': confidence,
      'requiresExpert': requiresExpert,
      'timestamp': DateTime.now().toIso8601String(),
    };
  }

  // Preprocess image: Resize to 224x224 and Normalize to [0, 1]
  Future<List<List<List<List<double>>>>> _preprocessImage(XFile imageFile) async {
    final bytes = await imageFile.readAsBytes();
    final rawImage = img.decodeImage(bytes)!;
    final resizedImage = img.copyResize(rawImage, width: 224, height: 224);

    // Convert to float32 [1, 224, 224, 3]
    var input = List.generate(1, (i) => List.generate(224, (j) => List.generate(224, (k) => List.filled(3, 0.0))));

    for (var y = 0; y < 224; y++) {
      for (var x = 0; x < 224; x++) {
        final pixel = resizedImage.getPixel(x, y);
        
        // Normalize pixel values to [0, 1]
        input[0][y][x][0] = pixel.r / 255.0;
        input[0][y][x][1] = pixel.g / 255.0;
        input[0][y][x][2] = pixel.b / 255.0;
      }
    }
    return input;
  }

  Map<String, dynamic> _mockInference() {
    // Simulating a result
    // classes: bud_rot, stem_bleeding, leaf_spot, healthy
    return {
      'label': 'bud_rot',
      'confidence': 0.85, // Change to 0.65 to test low confidence
    };
  }
  
  void dispose() {
    // _interpreter?.close();
  }
}
