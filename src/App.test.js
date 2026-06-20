import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ToolNet application shell', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: /tn toolnet/i })).toBeInTheDocument();
});
