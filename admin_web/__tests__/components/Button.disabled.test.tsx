import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button component - disabled state', () => {
  test('renders disabled button when disabled prop is true', () => {
    render(<Button disabled={true}>Disabled</Button>);
    const btn = screen.getByRole('button', { name: /disabled/i });
    expect(btn).toBeDisabled();
  });
});
