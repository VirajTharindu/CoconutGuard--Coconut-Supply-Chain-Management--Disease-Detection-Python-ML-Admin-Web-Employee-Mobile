/// Disease types enumeration
enum DiseaseType {
  budRot,
  stemBleeding,
  grayLeafSpot,
  wclwd,
  healthy,
}

/// Extension methods for DiseaseType
extension DiseaseTypeExtension on DiseaseType {
  /// Get display name for disease
  String get displayName {
    switch (this) {
      case DiseaseType.budRot:
        return 'Bud Rot';
      case DiseaseType.stemBleeding:
        return 'Stem Bleeding';
      case DiseaseType.grayLeafSpot:
        return 'Gray Leaf Spot';
      case DiseaseType.wclwd:
        return 'Wilt Disease (WCLWD)';
      case DiseaseType.healthy:
        return 'Healthy Coconut';
    }
  }

  /// Get technical name (matches ML model output)
  String get technicalName {
    switch (this) {
      case DiseaseType.budRot:
        return 'bud_rot';
      case DiseaseType.stemBleeding:
        return 'stem_bleeding';
      case DiseaseType.grayLeafSpot:
        return 'gray_leaf_spot';
      case DiseaseType.wclwd:
        return 'wclwd';
      case DiseaseType.healthy:
        return 'healthy';
    }
  }

  /// Get disease description
  String get description {
    switch (this) {
      case DiseaseType.budRot:
        return 'Fungal infection affecting the growing bud. Can be fatal if not treated early.';
      case DiseaseType.stemBleeding:
        return 'Bacterial disease causing trunk discoloration and oozing. Affects nutrient flow.';
      case DiseaseType.grayLeafSpot:
        return 'Fungal leaf disease. Reduces photosynthesis and overall plant health.';
      case DiseaseType.wclwd:
        return 'Wilt disease (lethal yellowing). Highly contagious and often fatal.';
      case DiseaseType.healthy:
        return 'No disease detected. Continue regular monitoring and maintenance.';
    }
  }

  /// Get treatment recommendations
  String get treatment {
    switch (this) {
      case DiseaseType.budRot:
        return 'Remove infected bud tissue. Apply Bordeaux mixture. Improve drainage.';
      case DiseaseType.stemBleeding:
        return 'Root feeding with potassium. Apply resistant paste. Remove infected bark.';
      case DiseaseType.grayLeafSpot:
        return 'Spray fungicides. Remove infected leaves. Ensure proper spacing.';
      case DiseaseType.wclwd:
        return 'Remove infected palms immediately. Vector control. Plant resistant varieties.';
      case DiseaseType.healthy:
        return 'Continue regular care: watering, fertilizing, and pest monitoring.';
    }
  }

  /// Get severity level (1-5, where 5 is most severe)
  int get severity {
    switch (this) {
      case DiseaseType.budRot:
        return 4;
      case DiseaseType.stemBleeding:
        return 3;
      case DiseaseType.grayLeafSpot:
        return 2;
      case DiseaseType.wclwd:
        return 5; // Most severe
      case DiseaseType.healthy:
        return 0;
    }
  }

  /// Parse from technical name string
  static DiseaseType fromTechnicalName(String name) {
    switch (name.toLowerCase()) {
      case 'bud_rot':
        return DiseaseType.budRot;
      case 'stem_bleeding':
        return DiseaseType.stemBleeding;
      case 'gray_leaf_spot':
        return DiseaseType.grayLeafSpot;
      case 'wclwd':
        return DiseaseType.wclwd;
      case 'healthy':
        return DiseaseType.healthy;
      default:
        throw Exception('Unknown disease type: $name');
    }
  }
}

/// Quality grade for harvest
enum QualityGrade {
  premium,
  standard,
  low,
}

extension QualityGradeExtension on QualityGrade {
  String get displayName {
    switch (this) {
      case QualityGrade.premium:
        return 'Premium';
      case QualityGrade.standard:
        return 'Standard';
      case QualityGrade.low:
        return 'Low';
    }
  }

  String get technicalName {
    switch (this) {
      case QualityGrade.premium:
        return 'premium';
      case QualityGrade.standard:
        return 'standard';
      case QualityGrade.low:
        return 'low';
    }
  }

  static QualityGrade fromTechnicalName(String name) {
    switch (name.toLowerCase()) {
      case 'premium':
        return QualityGrade.premium;
      case 'standard':
        return QualityGrade.standard;
      case 'low':
        return QualityGrade.low;
      default:
        return QualityGrade.standard;
    }
  }
}

/// ML Model Constants
class MLConstants {
  MLConstants._();

  static const String modelFileName = 'coconut_disease_model.tflite';
  static const String modelPath = 'assets/models/$modelFileName';
  static const int inputImageSize = 224; // 224x224 for MobileNetV2
  static const double confidenceThreshold = 0.7; // 70% threshold for expert referral
  static const int numClasses = 5; // 4 diseases + healthy

  // Class indices (must match training order)
  static const int budRotIndex = 0;
  static const int stemBleedingIndex = 1;
  static const int grayLeafSpotIndex = 2;
  static const int wclwdIndex = 3;
  static const int healthyIndex = 4;
}
