import { render } from '@testing-library/react';
import App from './App';
import { describe, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
describe('App', () => {
  it('renders the App component', () => {
    render(<App />);
  });
});
