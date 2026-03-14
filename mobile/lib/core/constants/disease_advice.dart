class DiseaseAdvice {
  static const Map<String, Map<String, String>> data = {
    'bud_rot': {
      'poetry': "Do not despair, friend of the soil;\nThough rot has touched the bud,\nLife's resilience flows in your toil.",
      'steps': "1. Apply 1% Bordeaux mixture to the crown.\n2. Clean the infected area thoroughly.\n3. Protect surrounding palms with fungicide.",
    },
    'stem_bleeding': {
      'poetry': "The trunk may weep, but hope remains;\nStrong roots run deep beneath the plains,\nTo heal the wound and ease the pains.",
      'steps': "1. Chisel out the affected tissues completely.\n2. Apply warm coal tar or Bordeaux paste.\n3. Root feed with 5ml of Calixin in 100ml water.",
    },
    'leaf_spot': {
      'poetry': "Spots upon the green may show,\nBut with your care, the palm shall grow,\nAnd vibrant fronds again will blow.",
      'steps': "1. Cut and burn severely affected leaves.\n2. Spray copper oxychloride (3g/liter).\n3. Improve soil nutrition with potash.",
    },
    'healthy': {
      'poetry': "Golden sun and emerald leaf,\nA harvest joy beyond belief,\nNature's bounty, farmer's chief.",
      'steps': "1. Continue regular irrigation and manuring.\n2. Keep the basin clean and weed-free.\n3. Monitor periodically for any changes.",
    },
    'unknown': {
      'poetry': "Nature holds mysteries deep and vast,\nLet us seek wisdom from the past,\nAnd ensure the coconut's future is cast.",
      'steps': "1. Consult a local agricultural officer.\n2. Take a clear photo for expert review.\n3. Monitor the symptom progression.",
    },
  };

  static Map<String, String> getAdvice(String label) {
    return data[label] ?? data['unknown']!;
  }
}
