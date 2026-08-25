// __tests__/pages/login.integration.test.tsx
// Mock Next.js router before importing the component
jest.mock('next/navigation', () => {
  const mockRouter = { push: jest.fn() };
  return { useRouter: () => mockRouter };
});

// Mock firebase/auth to resolve for valid credentials
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn((_, email, password) => {
    if (email === 'valid@example.com' && password === 'correctpass') {
      return Promise.resolve({ user: { uid: 'test' } });
    }
    return Promise.reject(new Error('Invalid email or password'));
  }),
}));

// Mock firebase config
jest.mock('@/lib/firebase/config', () => ({
  auth: {},
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';

describe('LoginPage integration tests', () => {
  test('successful login redirects to home', async () => {
    render(<LoginPage />);
    const router = require('next/navigation').useRouter();
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'correctpass' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/');
    });
  });
});
