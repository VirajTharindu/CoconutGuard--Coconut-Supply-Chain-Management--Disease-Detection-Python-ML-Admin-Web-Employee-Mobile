import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../core/constants/app_colors.dart';
import '../../services/ml_service.dart';
import '../../services/sync_service.dart';
import '../../core/constants/disease_advice.dart';

class CameraScreen extends StatefulWidget {
  const CameraScreen({Key? key}) : super(key: key);

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  CameraController? _controller;
  Future<void>? _initializeControllerFuture;
  bool _isProcessing = false;
  Map<String, dynamic>? _prediction;
  final MLService _mlService = MLService();
  final SyncService _syncService = SyncService();

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  Future<void> _initializeCamera() async {
    final cameras = await availableCameras();
    final firstCamera = cameras.first;

    _controller = CameraController(
      firstCamera,
      ResolutionPreset.medium,
    );

    _initializeControllerFuture = _controller!.initialize();
    if (mounted) setState(() {});
  }

  Future<void> _processImage(XFile imageFile) async {
    setState(() => _isProcessing = true);

    try {
      final prediction = await _mlService.predict(imageFile);

      // Save using SyncService (handles online/offline automatically)
      await _syncService.saveDetection(
        label: prediction['label'],
        confidence: prediction['confidence'],
        imageUrl: "gs://mock-bucket/images/${DateTime.now().millisecondsSinceEpoch}.jpg", 
        requiresExpert: prediction['requiresExpert'],
      );

      setState(() {
        _prediction = prediction;
        _isProcessing = false;
      });

      _showResultDialog(prediction);
    } catch (e) {
      debugPrint("Error processing image: $e");
      setState(() => _isProcessing = false);
    }
  }

  void _showResultDialog(Map<String, dynamic> prediction) {
    final bool isExpertNeeded = prediction['requiresExpert'];
    final String label = prediction['label'];
    final advice = DiseaseAdvice.getAdvice(label);
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 60,
                height: 6,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
              const SizedBox(height: 24),
              Icon(
                isExpertNeeded ? Icons.warning_amber_rounded : Icons.check_circle,
                size: 64,
                color: isExpertNeeded ? AppColors.warning : AppColors.success,
              ),
              const SizedBox(height: 16),
              Text(
                "Detected: ${label.toUpperCase().replaceAll('_', ' ')}",
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              
              // Poetic Advice
              Container(
                padding: const EdgeInsets.all(16),
                margin: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primary.withOpacity(0.2)),
                ),
                child: Text(
                  advice['poetry']!,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 16,
                    fontStyle: FontStyle.italic,
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              
              // Practical Steps
              if (!isExpertNeeded || label != 'healthy') ...[
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    "Practical Steps:",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    advice['steps']!,
                    style: const TextStyle(fontSize: 15, height: 1.5, color: Colors.black87),
                  ),
                ),
                const SizedBox(height: 24),
              ],
    
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text("Done", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ),
              ),
               const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<void>(
        future: _initializeControllerFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            return Stack(
              children: [
                CameraPreview(_controller!),
                Positioned(
                  bottom: 40,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: FloatingActionButton(
                      onPressed: _isProcessing
                          ? null
                          : () async {
                              try {
                                await _initializeControllerFuture;
                                final image = await _controller!.takePicture();
                                await _processImage(image);
                              } catch (e) {
                                print(e);
                              }
                            },
                      backgroundColor: AppColors.primary,
                      child: _isProcessing
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Icon(Icons.camera_alt, size: 32),
                    ),
                  ),
                ),
              ],
            );
          } else {
            return const Center(child: CircularProgressIndicator());
          }
        },
      ),
    );
  }
}
