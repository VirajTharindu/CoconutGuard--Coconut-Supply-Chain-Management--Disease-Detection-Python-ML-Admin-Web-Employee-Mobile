import 'package:cloud_firestore/cloud_firestore.dart';
import '../../core/constants/disease_types.dart';

/// Harvest log model
class HarvestModel {
  final String logId;
  final String farmerId;
  final DateTime harvestDate;
  final double quantity; // kilograms
  final QualityGrade qualityGrade;
  final String? soldTo; // Supply chain node ID
  final double? pricePerKg;
  final double? totalRevenue;

  HarvestModel({
    required this.logId,
    required this.farmerId,
    required this.harvestDate,
    required this.quantity,
    required this.qualityGrade,
    this.soldTo,
    this.pricePerKg,
    this.totalRevenue,
  });

  /// Calculate total revenue if price is available
  double? get calculatedRevenue {
    if (pricePerKg != null) {
      return quantity * pricePerKg!;
    }
    return totalRevenue;
  }

  Map<String, dynamic> toJson() => {
        'logId': logId,
        'farmerId': farmerId,
        'harvestDate': Timestamp.fromDate(harvestDate),
        'quantity': quantity,
        'qualityGrade': qualityGrade.technicalName,
        if (soldTo != null) 'soldTo': soldTo,
        if (pricePerKg != null) 'pricePerKg': pricePerKg,
        if (totalRevenue != null) 'totalRevenue': totalRevenue,
      };

  factory HarvestModel.fromJson(Map<String, dynamic> json) => HarvestModel(
        logId: json['logId'] as String,
        farmerId: json['farmerId'] as String,
        harvestDate: (json['harvestDate'] as Timestamp).toDate(),
        quantity: (json['quantity'] as num).toDouble(),
        qualityGrade: QualityGradeExtension.fromTechnicalName(
            json['qualityGrade'] as String),
        soldTo: json['soldTo'] as String?,
        pricePerKg: json['pricePerKg'] != null
            ? (json['pricePerKg'] as num).toDouble()
            : null,
        totalRevenue: json['totalRevenue'] != null
            ? (json['totalRevenue'] as num).toDouble()
            : null,
      );

  /// Create a copy with updated fields
  HarvestModel copyWith({
    String? logId,
    String? farmerId,
    DateTime? harvestDate,
    double? quantity,
    QualityGrade? qualityGrade,
    String? soldTo,
    double? pricePerKg,
    double? totalRevenue,
  }) {
    return HarvestModel(
      logId: logId ?? this.logId,
      farmerId: farmerId ?? this.farmerId,
      harvestDate: harvestDate ?? this.harvestDate,
      quantity: quantity ?? this.quantity,
      qualityGrade: qualityGrade ?? this.qualityGrade,
      soldTo: soldTo ?? this.soldTo,
      pricePerKg: pricePerKg ?? this.pricePerKg,
      totalRevenue: totalRevenue ?? this.totalRevenue,
    );
  }
}
