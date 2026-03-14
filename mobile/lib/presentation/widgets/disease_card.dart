import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/disease_types.dart';

/// Disease information card widget
class DiseaseCard extends StatelessWidget {
  final DiseaseType disease;
  final double confidence;
  final bool isCompact;
  final VoidCallback? onTap;

  const DiseaseCard({
    Key? key,
    required this.disease,
    required this.confidence,
    this.isCompact = false,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final diseaseColor = AppColors.getDiseaseColor(disease.technicalName);
    final confidenceColor = AppColors.getConfidenceColor(confidence);

    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: diseaseColor, width: 2),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: isCompact ? _buildCompact(diseaseColor, confidenceColor) 
              : _buildFull(diseaseColor, confidenceColor),
        ),
      ),
    );
  }

  Widget _buildCompact(Color diseaseColor, Color confidenceColor) {
    return Row(
      children: [
        _buildSeverityIcon(diseaseColor),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                disease.displayName,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: diseaseColor,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '${(confidence * 100).toStringAsFixed(1)}% Confidence',
                style: TextStyle(
                  fontSize: 16,
                  color: confidenceColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildFull(Color diseaseColor, Color confidenceColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            _buildSeverityIcon(diseaseColor),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    disease.displayName,
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: diseaseColor,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Text(
                        'Confidence: ',
                        style: TextStyle(
                          fontSize: 18,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      Text(
                        '${(confidence * 100).toStringAsFixed(1)}%',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: confidenceColor,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        const Divider(),
        const SizedBox(height: 12),
        Text(
          'Description',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          disease.description,
          style: TextStyle(
            fontSize: 16,
            color: AppColors.textSecondary,
            height: 1.5,
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'Treatment',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          disease.treatment,
          style: TextStyle(
            fontSize: 16,
            color: AppColors.textSecondary,
            height: 1.5,
          ),
        ),
      ],
    );
  }

  Widget _buildSeverityIcon(Color diseaseColor) {
    final severity = disease.severity;
    IconData iconData;

    if (disease == DiseaseType.healthy) {
      iconData = Icons.check_circle;
    } else if (severity >= 4) {
      iconData = Icons.warning_amber_rounded;
    } else if (severity >= 3) {
      iconData = Icons.error_outline;
    } else {
      iconData = Icons.info_outline;
    }

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: diseaseColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Icon(
        iconData,
        size: 40,
        color: diseaseColor,
      ),
    );
  }
}
