import 'package:cloud_firestore/cloud_firestore.dart';

/// User role enum
enum UserRole {
  farmer,
  expert,
  admin,
}

extension UserRoleExtension on UserRole {
  String get value {
    switch (this) {
      case UserRole.farmer:
        return 'farmer';
      case UserRole.expert:
        return 'expert';
      case UserRole.admin:
        return 'admin';
    }
  }

  static UserRole fromString(String role) {
    switch (role.toLowerCase()) {
      case 'farmer':
        return UserRole.farmer;
      case 'expert':
        return UserRole.expert;
      case 'admin':
        return UserRole.admin;
      default:
        return UserRole.farmer;
    }
  }
}

/// Farm details model
class FarmDetails {
  final String farmId;
  final double area; // in hectares
  final int treeCount;

  FarmDetails({
    required this.farmId,
    required this.area,
    required this.treeCount,
  });

  Map<String, dynamic> toJson() => {
        'farmId': farmId,
        'area': area,
        'treeCount': treeCount,
      };

  factory FarmDetails.fromJson(Map<String, dynamic> json) => FarmDetails(
        farmId: json['farmId'] as String,
        area: (json['area'] as num).toDouble(),
        treeCount: json['treeCount'] as int,
      );
}

/// User location model
class UserLocation {
  final double latitude;
  final double longitude;
  final String region;

  UserLocation({
    required this.latitude,
    required this.longitude,
    required this.region,
  });

  GeoPoint toGeoPoint() => GeoPoint(latitude, longitude);

  Map<String, dynamic> toJson() => {
        'lat': latitude,
        'lng': longitude,
        'region': region,
      };

  factory UserLocation.fromJson(Map<String, dynamic> json) => UserLocation(
        latitude: (json['lat'] as num).toDouble(),
        longitude: (json['lng'] as num).toDouble(),
        region: json['region'] as String,
      );

  factory UserLocation.fromGeoPoint(GeoPoint geoPoint, String region) =>
      UserLocation(
        latitude: geoPoint.latitude,
        longitude: geoPoint.longitude,
        region: region,
      );
}

/// User model
class UserModel {
  final String uid;
  final UserRole role;
  final String name;
  final String email;
  final String phone;
  final UserLocation location;
  final DateTime createdAt;
  final List<FarmDetails>? farms;

  UserModel({
    required this.uid,
    required this.role,
    required this.name,
    required this.email,
    required this.phone,
    required this.location,
    required this.createdAt,
    this.farms,
  });

  Map<String, dynamic> toJson() => {
        'uid': uid,
        'role': role.value,
        'name': name,
        'email': email,
        'phone': phone,
        'location': location.toJson(),
        'createdAt': Timestamp.fromDate(createdAt),
        if (farms != null) 'farms': farms!.map((f) => f.toJson()).toList(),
      };

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        uid: json['uid'] as String,
        role: UserRoleExtension.fromString(json['role'] as String),
        name: json['name'] as String,
        email: json['email'] as String? ?? '',
        phone: json['phone'] as String,
        location: UserLocation.fromJson(json['location'] as Map<String, dynamic>),
        createdAt: (json['createdAt'] as Timestamp).toDate(),
        farms: json['farms'] != null
            ? (json['farms'] as List)
                .map((f) => FarmDetails.fromJson(f as Map<String, dynamic>))
                .toList()
            : null,
      );

  /// Create a copy with updated fields
  UserModel copyWith({
    String? uid,
    UserRole? role,
    String? name,
    String? email,
    String? phone,
    UserLocation? location,
    DateTime? createdAt,
    List<FarmDetails>? farms,
  }) {
    return UserModel(
      uid: uid ?? this.uid,
      role: role ?? this.role,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      location: location ?? this.location,
      createdAt: createdAt ?? this.createdAt,
      farms: farms ?? this.farms,
    );
  }
}
