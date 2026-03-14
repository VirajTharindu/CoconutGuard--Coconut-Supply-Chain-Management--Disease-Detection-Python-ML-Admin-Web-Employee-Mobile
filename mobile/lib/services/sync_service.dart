import 'package:flutter/foundation.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'firestore_service.dart';

class SyncService {
  static final SyncService _instance = SyncService._internal();
  factory SyncService() => _instance;
  SyncService._internal() {
    _initConnectionListener();
  }

  final FirestoreService _firestoreService = FirestoreService();
  final Box _offlineBox = Hive.box('offline_queue');

  void _initConnectionListener() {
    Connectivity().onConnectivityChanged.listen((List<ConnectivityResult> results) {
      // Check if any connection type is available (not .none)
      bool isConnected = results.any((result) => result != ConnectivityResult.none);
      
      if (isConnected) {
        debugPrint("🌐 Connectivity restored. Syncing queue...");
        _processOfflineQueue();
      }
    });
  }

  /// Saves a detection. Tries Firestore first, falls back to Hive if offline.
  Future<void> saveDetection({
    required String label,
    required double confidence,
    required String imageUrl,
    required bool requiresExpert,
  }) async {
    final connectivityResults = await Connectivity().checkConnectivity();
    bool isConnected = connectivityResults.any((result) => result != ConnectivityResult.none);
    
    final data = {
      'label': label,
      'confidence': confidence,
      'imageUrl': imageUrl,
      'requiresExpert': requiresExpert,
      'timestamp': DateTime.now().toIso8601String(),
    };

    if (!isConnected) {
      debugPrint("🔌 Offline mode: Queuing detection to Hive.");
      await _offlineBox.add(data);
    } else {
      try {
        await _firestoreService.saveDetection(
          label: label,
          confidence: confidence,
          imageUrl: imageUrl,
          requiresExpert: requiresExpert,
        );
      } catch (e) {
        debugPrint("❌ Firestore failed: $e. Queuing to Hive.");
        await _offlineBox.add(data);
      }
    }
  }

  Future<void> _processOfflineQueue() async {
    if (_offlineBox.isEmpty) {
      debugPrint("✅ Offline queue is empty.");
      return;
    }

    debugPrint("🔄 Processing ${_offlineBox.length} offline items...");
    
    final List<int> keysToDelete = [];
    
    for (var key in _offlineBox.keys) {
      final Map<dynamic, dynamic> data = _offlineBox.get(key);
      
      try {
        await _firestoreService.saveDetection(
          label: data['label'],
          confidence: data['confidence'],
          imageUrl: data['imageUrl'],
          requiresExpert: data['requiresExpert'],
        );
        keysToDelete.add(key.toInt());
      } catch (e) {
        debugPrint("❌ Sync failed for item $key: $e");
        // Stop syncing if connection drops again or fatal error
        return; 
      }
    }

    await _offlineBox.deleteAll(keysToDelete);
    debugPrint("✅ Sync complete. Processed ${keysToDelete.length} items.");
  }
}
