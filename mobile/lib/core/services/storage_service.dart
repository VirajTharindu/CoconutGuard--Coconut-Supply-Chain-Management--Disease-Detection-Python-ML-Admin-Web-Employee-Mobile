import 'dart:io';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:image/image.dart' as img;

/// Cloud Storage service for image uploads
class StorageService {
  final FirebaseStorage _storage = FirebaseStorage.instance;

  /// Upload image with compression
  Future<String> uploadImage({
    required File imageFile,
    required String path,
    int quality = 85,
    int? maxWidth,
  }) async {
    try {
      // Read and compress image
      final bytes = await imageFile.readAsBytes();
      final image = img.decodeImage(bytes);

      if (image == null) {
        throw Exception('Failed to decode image');
      }

      // Resize if needed
      final resized = maxWidth != null && image.width > maxWidth
          ? img.copyResize(image, width: maxWidth)
          : image;

      // Compress
      final compressed = img.encodeJpg(resized, quality: quality);

      // Upload to Firebase Storage
      final ref = _storage.ref().child(path);
      await ref.putData(compressed);

      // Get download URL
      return await ref.getDownloadURL();
    } catch (e) {
      throw Exception('Failed to upload image: $e');
    }
  }

  /// Upload disease detection image
  Future<String> uploadDetectionImage({
    required File imageFile,
    required String userId,
    required String detectionId,
  }) async {
    final path = 'disease_images/$userId/$detectionId.jpg';
    return uploadImage(
      imageFile: imageFile,
      path: path,
      quality: 85,
      maxWidth: 1024,
    );
  }

  /// Upload profile picture
  Future<String> uploadProfilePicture({
    required File imageFile,
    required String userId,
  }) async {
    final path = 'profile_pictures/$userId.jpg';
    return uploadImage(
      imageFile: imageFile,
      path: path,
      quality: 90,
      maxWidth: 512,
    );
  }

  /// Delete file from storage
  Future<void> deleteFile(String path) async {
    try {
      final ref = _storage.ref().child(path);
      await ref.delete();
    } catch (e) {
      throw Exception('Failed to delete file: $e');
    }
  }

  /// Get download URL for a file
  Future<String> getDownloadURL(String path) async {
    try {
      final ref = _storage.ref().child(path);
      return await ref.getDownloadURL();
    } catch (e) {
      throw Exception('Failed to get download URL: $e');
    }
  }
}
