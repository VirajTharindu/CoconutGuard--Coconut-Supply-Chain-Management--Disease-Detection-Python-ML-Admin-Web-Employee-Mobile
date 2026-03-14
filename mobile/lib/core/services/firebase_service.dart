import 'package:cloud_firestore/cloud_firestore.dart';

/// Core Firebase service for database operations
class FirebaseService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Collection names
  static const String usersCollection = 'users';
  static const String detectionsCollection = 'disease_detections';
  static const String supplyChainNodesCollection = 'supply_chain_nodes';
  static const String harvestLogsCollection = 'harvest_logs';

  /// Get Firestore instance
  FirebaseFirestore get firestore => _firestore;

  /// Create a new document in a collection
  Future<String> create({
    required String collection,
    required Map<String, dynamic> data,
    String? documentId,
  }) async {
    try {
      if (documentId != null) {
        await _firestore.collection(collection).doc(documentId).set(data);
        return documentId;
      } else {
        final docRef = await _firestore.collection(collection).add(data);
        return docRef.id;
      }
    } catch (e) {
      throw Exception('Failed to create document: $e');
    }
  }

  /// Read a document by ID
  Future<Map<String, dynamic>?> read({
    required String collection,
    required String documentId,
  }) async {
    try {
      final doc = await _firestore.collection(collection).doc(documentId).get();
      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (e) {
      throw Exception('Failed to read document: $e');
    }
  }

  /// Update a document
  Future<void> update({
    required String collection,
    required String documentId,
    required Map<String, dynamic> data,
  }) async {
    try {
      await _firestore.collection(collection).doc(documentId).update(data);
    } catch (e) {
      throw Exception('Failed to update document: $e');
    }
  }

  /// Delete a document
  Future<void> delete({
    required String collection,
    required String documentId,
  }) async {
    try {
      await _firestore.collection(collection).doc(documentId).delete();
    } catch (e) {
      throw Exception('Failed to delete document: $e');
    }
  }

  /// Query documents with filters
  Future<List<Map<String, dynamic>>> query({
    required String collection,
    List<QueryFilter>? filters,
    int? limit,
    String? orderBy,
    bool descending = false,
  }) async {
    try {
      Query query = _firestore.collection(collection);

      // Apply filters
      if (filters != null) {
        for (final filter in filters) {
          query = query.where(filter.field, isEqualTo: filter.value);
        }
      }

      // Apply ordering
      if (orderBy != null) {
        query = query.orderBy(orderBy, descending: descending);
      }

      // Apply limit
      if (limit != null) {
        query = query.limit(limit);
      }

      final snapshot = await query.get();
      return snapshot.docs
          .map((doc) => {'id': doc.id, ...doc.data() as Map<String, dynamic>})
          .toList();
    } catch (e) {
      throw Exception('Failed to query documents: $e');
    }
  }

  /// Listen to real-time updates on a document
  Stream<Map<String, dynamic>?> listenToDocument({
    required String collection,
    required String documentId,
  }) {
    return _firestore
        .collection(collection)
        .doc(documentId)
        .snapshots()
        .map((snapshot) => snapshot.exists ? snapshot.data() : null);
  }

  /// Listen to real-time updates on a collection
  Stream<List<Map<String, dynamic>>> listenToCollection({
    required String collection,
    List<QueryFilter>? filters,
    String? orderBy,
    bool descending = false,
  }) {
    Query query = _firestore.collection(collection);

    if (filters != null) {
      for (final filter in filters) {
        query = query.where(filter.field, isEqualTo: filter.value);
      }
    }

    if (orderBy != null) {
      query = query.orderBy(orderBy, descending: descending);
    }

    return query.snapshots().map((snapshot) {
      return snapshot.docs
          .map((doc) => {'id': doc.id, ...doc.data() as Map<String, dynamic>})
          .toList();
    });
  }

  /// Save disease detection
  Future<String> saveDetection(Map<String, dynamic> detectionData) async {
    return create(
      collection: detectionsCollection,
      data: detectionData,
    );
  }

  /// Get user's detection history
  Future<List<Map<String, dynamic>>> getUserDetections(String userId) async {
    return query(
      collection: detectionsCollection,
      filters: [QueryFilter('farmerId', userId)],
      orderBy: 'timestamp',
      descending: true,
    );
  }

  /// Save harvest log
  Future<String> saveHarvestLog(Map<String, dynamic> harvestData) async {
    return create(
      collection: harvestLogsCollection,
      data: harvestData,
    );
  }

  /// Get user's harvest logs
  Future<List<Map<String, dynamic>>> getUserHarvestLogs(String userId) async {
    return query(
      collection: harvestLogsCollection,
      filters: [QueryFilter('farmerId', userId)],
      orderBy: 'harvestDate',
      descending: true,
    );
  }

  /// Get current prices from supply chain nodes
  Future<List<Map<String, dynamic>>> getCurrentPrices() async {
    return query(
      collection: supplyChainNodesCollection,
      orderBy: 'lastUpdated',
      descending: true,
    );
  }
}

/// Query filter helper class
class QueryFilter {
  final String field;
  final dynamic value;

  QueryFilter(this.field, this.value);
}
