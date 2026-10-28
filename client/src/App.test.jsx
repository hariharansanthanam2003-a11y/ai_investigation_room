import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';

describe('caseboard',()=>{
  it('renders the landing page and sample case link',()=>{render(<MemoryRouter><App/></MemoryRouter>);expect(screen.getByText(/Some truths are/i)).toBeInTheDocument();expect(screen.getByRole('link',{name:/try a sample case/i})).toHaveAttribute('href','/case/sample');});
});
