import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LandingDiscovery } from '../LandingDiscovery';

function Destination() { const location = useLocation(); return <p>{location.pathname}{location.search}</p>; }

describe('homepage discovery', () => {
  it('submits a trimmed search as an encoded catalog query', () => {
    render(<MemoryRouter><Routes><Route path="/" element={<LandingDiscovery />} /><Route path="/core/" element={<Destination />} /></Routes></MemoryRouter>);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '  C++ & testing  ' } });
    fireEvent.submit(screen.getByRole('search'));
    expect(screen.getByText('/core/?q=C%2B%2B+%26+testing')).toBeInTheDocument();
  });

  it('opens a full catalog for an empty query and uses the selected agent guide', () => {
    render(<MemoryRouter><Routes><Route path="/" element={<LandingDiscovery />} /><Route path="/core/" element={<Destination />} /></Routes></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('Using'), { target: { value: 'cursor-skills' } });
    expect(screen.getByRole('link', { name: /Open setup guide/ })).toHaveAttribute('href', '/docs/cursor-skills/');
    expect(screen.getByRole('link', { name: 'Review security' })).toHaveAttribute('href', '/core/?category=security');
    fireEvent.submit(screen.getByRole('search'));
    expect(screen.getByText('/core/')).toBeInTheDocument();
  });
});
