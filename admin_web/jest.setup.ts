import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Set dummy Firebase environment variables for tests
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'dummy';
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'dummy.firebaseapp.com';
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'dummy-id';
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'dummy.appspot.com';
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456789';
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = '1:123456789:web:abcdef';
process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = 'G-XXXXXXX';

// Mock firebase/auth and firebase config for tests
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(() => ({})),
}));

jest.mock('@/lib/firebase/config', () => ({
  auth: {},
}));
