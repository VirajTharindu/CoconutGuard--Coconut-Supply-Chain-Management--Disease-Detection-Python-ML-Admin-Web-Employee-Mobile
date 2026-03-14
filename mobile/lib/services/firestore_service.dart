import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  Future<void> saveDetection({
    required String label,
    required double confidence,
    required String imageUrl,
    required bool requiresExpert,
  }) async {
    final user = _auth.currentUser;
    try {
      if (user == null) {
        debugPrint("🧪 Demo Mode: Saving detection locally (Mock)");
        return;
      }
      
      await _db.collection('detections').add({
        'userId': user.uid,
        'label': label,
        'confidence': confidence,
        'imageUrl': imageUrl,
        'requiresExpert': requiresExpert,
        'status': requiresExpert ? 'pending_review' : 'completed',
        'timestamp': FieldValue.serverTimestamp(),
        'location': {
          'latitude': 0.0,
          'longitude': 0.0,
        }
      });
      debugPrint("✅ Detection saved to Firestore");
    } catch (e) {
      debugPrint("⚠️ Firestore failed, but app will continue: $e");
      // Don't rethrow to allow offline/mock behavior to continue
    }
  }

  Stream<QuerySnapshot> getUserDetections() {
    final user = _auth.currentUser;
    if (user == null) {
      debugPrint("🧪 Demo Mode: Returning empty stream for detections");
      return const Stream.empty();
    }
    return _db
        .collection('detections')
        .where('userId', isEqualTo: user.uid)
        .orderBy('timestamp', descending: true)
        .snapshots();
  }
}
