/// App-wide string constants
class AppStrings {
  AppStrings._(); // Private constructor

  // App Info
  static const String appName = 'Coconut Guard';
  static const String appTagline = 'Protecting Coconut Farms with AI';

  // Authentication
  static const String loginTitle = 'Welcome Farmer';
  static const String loginSubtitle = 'Sign in to protect your coconut farm';
  static const String phoneNumber = 'Phone Number';
  static const String enterOTP = 'Enter OTP';
  static const String verifyOTP = 'Verify OTP';
  static const String resendOTP = 'Resend OTP';

  // Navigation
  static const String vision = 'Disease Check';
  static const String supplyChain = 'Supply Chain';
  static const String profile = 'Profile';
  static const String history = 'History';

  // Vision Module
  static const String scanCoconut = 'Scan Coconut Leaf';
  static const String takePicture = 'Take Picture';
  static const String retake = 'Retake';
  static const String analyzing = 'Analyzing...';
  static const String detectionResult = 'Detection Result';
  static const String confidence = 'Confidence';
  static const String saveToHistory = 'Save to History';
  static const String viewHistory = 'View History';
  static const String expertReviewNeeded = 'Expert Review Needed';
  static const String expertReviewNote =
      'Confidence is low. This has been flagged for expert review.';

  // Disease Names
  static const String budRot = 'Bud Rot';
  static const String stemBleeding = 'Stem Bleeding';
  static const String grayLeafSpot = 'Gray Leaf Spot';
  static const String wclwd = 'Wilt Disease (WCLWD)';
  static const String healthy = 'Healthy';

  // Supply Chain
  static const String harvestTracker = 'Harvest Tracker';
  static const String logHarvest = 'Log Harvest';
  static const String currentPrices = 'Current Prices';
  static const String quantity = 'Quantity (kg)';
  static const String qualityGrade = 'Quality Grade';
  static const String premium = 'Premium';
  static const String standard = 'Standard';
  static const String low = 'Low';
  static const String harvestDate = 'Harvest Date';
  static const String totalRevenue = 'Total Revenue';
  static const String pricePerKg = 'Price per kg';

  // Common Actions
  static const String save = 'Save';
  static const String cancel = 'Cancel';
  static const String delete = 'Delete';
  static const String edit = 'Edit';
  static const String submit = 'Submit';
  static const String loading = 'Loading...';
  static const String refresh = 'Refresh';

  // Error Messages
  static const String errorGeneric = 'Something went wrong. Please try again.';
  static const String errorNetwork = 'No internet connection';
  static const String errorCamera = 'Unable to access camera';
  static const String errorLocation = 'Unable to get location';
  static const String errorImage = 'Unable to process image';
  static const String errorModel = 'ML model not loaded';
  static const String errorAuth = 'Authentication failed';
  static const String errorFirebase = 'Database error. Please try again.';

  // Success Messages
  static const String successSaved = 'Saved successfully';
  static const String successDeleted = 'Deleted successfully';
  static const String successUpdated = 'Updated successfully';

  // Permissions
  static const String permissionCamera = 'Camera permission required';
  static const String permissionLocation = 'Location permission required';
  static const String permissionStorage = 'Storage permission required';
}
