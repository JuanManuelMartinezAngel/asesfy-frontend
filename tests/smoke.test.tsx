import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from '@/app/page';

describe('Smoke Tests', () => {
  it('renders the home page without crashing', () => {
    render(<HomePage />);
    expect(screen.getByText('Gestión Fiscal')).toBeInTheDocument();
    expect(screen.getByText('Simplificada')).toBeInTheDocument();
  });

  it('displays the main call-to-action button', () => {
    render(<HomePage />);
    const ctaButton = screen.getByRole('link', { name: /empezar ahora/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/onboarding');
  });

  it('shows the feature cards', () => {
    render(<HomePage />);
    expect(screen.getByText('Automatización Fiscal')).toBeInTheDocument();
    expect(screen.getByText('Asesoramiento Profesional')).toBeInTheDocument();
    expect(screen.getByText('Seguridad Garantizada')).toBeInTheDocument();
  });
});