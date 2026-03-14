import 'package:cloud_firestore/cloud_firestore.dart';
import '../../core/constants/disease_types.dart';

/// ML Classification result
class MLClassification {
  final DiseaseType disease;
  final double confidence; // 0-1 scale
  final String modelVersion;

  MLClassification({
    required this.disease,
    required this.confidence,
    required this.modelVersion,
  });

  Map<String, dynamic> toJson() => {
        'disease': disease.technicalName,
        'confidence': confidence,
        'modelVersion': modelVersion,
      };

  factory MLClassification.fromJson(Map<String, dynamic> json) =>
      MLClassification(
        disease: DiseaseTypeExtension.fromTechnicalName(
            json['disease'] as String),
        confidence: (json['confidence'] as num).toDouble(),
        modelVersion: json['modelVersion'] as String,
      );
}

/// Expert review data
class ExpertReview {
  final String expertId;
  final String confirmedDisease;
  final String notes;
  final DateTime reviewedAt;

  ExpertReview({
    required this.expertId,
    required this.confirmedDisease,
    required this.notes,
    required this.reviewedAt,
  });

  Map<String, dynamic> toJson() => {
        'expertId': expertId,
        'confirmedDisease': confirmedDisease,
        'notes': notes,
        'reviewedAt': Timestamp.fromDate(reviewedAt),
      };

  factory ExpertReview.fromJson(Map<String, dynamic> json) => ExpertReview(
        expertId: json['expertId'] as String,
        confirmedDisease: json['confirmedDisease'] as String,
        notes: json['notes'] as String,
        reviewedAt: (json['reviewedAt'] as Timestamp).toDate(),
      );
}

/// Detection status enum
enum DetectionStatus {
  pendingReview,
  confirmed,
  falsePositive,
}

extension DetectionStatusExtension on DetectionStatus {
  String get value {
    switch (this) {
      case DetectionStatus.pendingReview:
        return 'pending_review';
      case DetectionStatus.confirmed:
        return 'confirmed';
      case DetectionStatus.falsePositive:
        return 'false_positive';
    }
  }

  static DetectionStatus fromString(String status) {
    switch (status.toLowerCase()) {
      case 'pending_review':
        return DetectionStatus.pendingReview;
      case 'confirmed':
        return DetectionStatus.confirmed;
      case 'false_positive':
        return DetectionStatus.falsePositive;
      default:
        return DetectionStatus.pendingReview;
    }
  }
}

/// Disease Detection model
class DiseaseDetectionModel {
  final String detectionId;
  final String farmerId;
  final String imageUrl;
  final DateTime timestamp;
  final GeoPoint location;
  final MLClassification mlClassification;
  final ExpertReview? expertReview;
  final DetectionStatus status;
  final bool referredToExpert;

  DiseaseDetectionModel({
    required this.detectionId,
    required this.farmerId,
    required this.imageUrl,
    required this.timestamp,
    required this.location,
    required this.mlClassification,
    this.expertReview,
    required this.status,
    required this.referredToExpert,
  });

  /// Check if confidence is below threshold (needs expert review)
  bool get needsExpertReview =>
      mlClassification.confidence < MLConstants.confidenceThreshold;

  Map<String, dynamic> toJson() => {
        'detectionId': detectionId,
        'farmerId': farmerId,
        'imageUrl': imageUrl,
        'timestamp': Timestamp.fromDate(timestamp),
        'location': location,
        'mlClassification': mlClassification.toJson(),
        if (expertReview != null) 'expertReview': expertReview!.toJson(),
        'status': status.value,
        'referredToExpert': referredToExpert,
      };

  factory DiseaseDetectionModel.fromJson(Map<String, dynamic> json) =>
      DiseaseDetectionModel(
        detectionId: json['detectionId'] as String,
        farmerId: json['farmerId'] as String,
        imageUrl: json['imageUrl'] as String,
        timestamp: (json['timestamp'] as Timestamp).toDate(),
        location: json['location'] as GeoPoint,
        mlClassification: MLClassification.fromJson(
            json['mlClassification'] as Map<String, dynamic>),
        expertReview: json['expertReview'] != null
            ? ExpertReview.fromJson(
                json['expertReview'] as Map<String, dynamic>)
            : null,
        status: DetectionStatusExtension.fromString(json['status'] as String),
        referredToExpert: json['referredToExpert'] as bool,
      );

  /// Create a copy with updated fields
  DiseaseDetectionModel copyWith({
    String? detectionId,
    String? farmerId,
    String? imageUrl,
    DateTime? timestamp,
    GeoPoint? location,
    MLClassification? mlClassification,
    ExpertReview? expertReview,
    DetectionStatus? status,
    bool? referredToExpert,
  }) {
    return DiseaseDetectionModel(
      detectionId: detectionId ?? this.detectionId,
      farmerId: farmerId ?? this.farmerId,
      imageUrl: imageUrl ?? this.imageUrl,
      timestamp: timestamp ?? this.timestamp,
      location: location ?? this.location,
      mlClassification: mlClassification ?? this.mlClassification,
      expertReview: expertReview ?? this.expertReview,
      status: status ?? this.status,
      referredToExpert: referredToExpert ?? this.referredToExpert,
    );
  }
}
