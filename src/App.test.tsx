import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';
import { LoginForm } from './LoginForm';
import Login from '../../pages/Login';
import '@testing-library/jest-dom/vitest';
describe('App', () => {
  it('renders the App component', () => {
    render(<App />);

    screen.debug(); // prints out the jsx in the App component unto the command line
  });
});
