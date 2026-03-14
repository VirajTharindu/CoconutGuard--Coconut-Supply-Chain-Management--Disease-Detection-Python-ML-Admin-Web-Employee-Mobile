import 'package:flutter/material.dart';

/// Coconut-Modern Color Palette
/// Designed for high contrast and farmer-friendly visibility
class AppColors {
  AppColors._(); // Private constructor to prevent instantiation

  // Primary Colors (Growth & Nature)
  static const Color primary = Color(0xFF166534); // Rich Forest Green
  static const Color primaryLight = Color(0xFF22C55E); // Leaf Green
  static const Color primaryDark = Color(0xFF064E3B); // Deep Jungle

  // Secondary Colors (Earth & Harvest)
  static const Color secondary = Color(0xFF92400E); // Harvest Brown
  static const Color secondaryLight = Color(0xFFFACC15); // Sunbright Yellow
  static const Color secondaryDark = Color(0xFF78350F);

  // Accent Colors (Purity & Visibility)
  static const Color accent = Color(0xFFF8FAFC); // Slate White
  static const Color accentDark = Color(0xFFE2E8F0);

  // Status Colors (Action Oriented)
  static const Color success = Color(0xFF15803D); 
  static const Color warning = Color(0xFFEA580C); // High-Vis Orange
  static const Color error = Color(0xFFBE123C); // Alert Crimson
  static const Color info = Color(0xFF0369A1); // Deep Sea Blue

  // UI Backgrounds
  static const Color background = Color(0xFFF1F5F9); // Light Gray-Blue
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceDark = Color(0xFF0F172A);

  // Text Colors (High Contrast)
  static const Color textPrimary = Color(0xFF0F172A); // Almost Black
  static const Color textSecondary = Color(0xFF475569); // Slate Gray
  static const Color textOnPrimary = Color(0xFFFFFFFF);
  static const Color textOnSecondary = Color(0xFFFFFFFF);

  // Border & Divider
  static const Color border = Color(0xFFCBD5E1);
  static const Color divider = Color(0xFFE2E8F0);

  // Disease Colors (Restored for helper methods)
  static const Color diseaseRed = error;
  static const Color diseaseYellow = warning;
  static const Color diseaseGray = textSecondary;
  static const Color healthy = success;

  // Confidence Score Colors (for ML predictions)
  static Color getConfidenceColor(double confidence) {
    if (confidence >= 0.9) {
      return success;
    } else if (confidence >= 0.7) {
      return info;
    } else if (confidence >= 0.5) {
      return warning;
    } else {
      return error;
    }
  }

  // Disease type color mapping
  static Color getDiseaseColor(String diseaseType) {
    switch (diseaseType.toLowerCase()) {
      case 'bud_rot':
      case 'stem_bleeding':
        return diseaseRed;
      case 'wclwd':
        return diseaseYellow;
      case 'gray_leaf_spot':
        return diseaseGray;
      case 'healthy':
        return healthy;
      default:
        return textSecondary;
    }
  }
}
