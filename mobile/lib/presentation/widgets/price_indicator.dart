import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/disease_types.dart';

/// Price indicator widget for supply chain prices
class PriceIndicator extends StatelessWidget {
  final double pricePerKg;
  final QualityGrade qualityGrade;
  final DateTime? lastUpdated;
  final bool showTrend;
  final double? previousPrice;

  const PriceIndicator({
    Key? key,
    required this.pricePerKg,
    required this.qualityGrade,
    this.lastUpdated,
    this.showTrend = false,
    this.previousPrice,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(symbol: '₹', decimalDigits: 2);
    final trend = _calculateTrend();

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.primary,
            AppColors.primaryLight,
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildQualityBadge(),
              if (showTrend && trend != null) _buildTrendIndicator(trend),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            currencyFormat.format(pricePerKg),
            style: const TextStyle(
              fontSize: 36,
              fontWeight: FontWeight.bold,
              color: AppColors.textOnPrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'per kilogram',
            style: TextStyle(
              fontSize: 16,
              color: AppColors.textOnPrimary.withOpacity(0.8),
            ),
          ),
          if (lastUpdated != null) ...[
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(
                  Icons.access_time,
                  size: 16,
                  color: AppColors.textOnPrimary.withOpacity(0.7),
                ),
                const SizedBox(width: 6),
                Text(
                  'Updated ${_formatLastUpdated(lastUpdated!)}',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textOnPrimary.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildQualityBadge() {
    Color badgeColor;
    switch (qualityGrade) {
      case QualityGrade.premium:
        badgeColor = AppColors.success;
        break;
      case QualityGrade.standard:
        badgeColor = AppColors.info;
        break;
      case QualityGrade.low:
        badgeColor = AppColors.warning;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: badgeColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        qualityGrade.displayName,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: AppColors.textOnPrimary,
        ),
      ),
    );
  }

  Widget _buildTrendIndicator(double trendPercent) {
    final isPositive = trendPercent > 0;
    final color = isPositive ? AppColors.success : AppColors.error;
    final icon = isPositive ? Icons.trending_up : Icons.trending_down;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 20, color: color),
          const SizedBox(width: 4),
          Text(
            '${trendPercent.abs().toStringAsFixed(1)}%',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  double? _calculateTrend() {
    if (previousPrice == null || previousPrice == 0) return null;
    return ((pricePerKg - previousPrice!) / previousPrice!) * 100;
  }

  String _formatLastUpdated(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    } else {
      return DateFormat('MMM dd').format(dateTime);
    }
  }
}
