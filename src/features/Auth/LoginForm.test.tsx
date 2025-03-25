import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, beforeEach, expect, vi } from 'vitest';

import { Provider, useDispatch } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter, useNavigate } from 'react-router-dom';

import { LoginForm } from './LoginForm';
//import { useLazyLoginQuery } from './_LoginService';

vi.mock('./_LoginService', () => ({
  useLazyLoginQuery: vi.fn(() => [vi.fn(), { data: [], isLoading: false, error: null }]),
}));

vi.mock('react-redux', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useDispatch: vi.fn(),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('LoginForm', () => {
  const initialState = {};
  const mockStore = configureMockStore();
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore(initialState);
    vi.clearAllMocks();
  });

  it('Test ==> Render Login Form', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
  });

  it('Test ==> Client side validation (REQUIRED): ', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      const emailError = screen.getByText('Please input your Email!', { selector: 'div' });
      const passError = screen.getByText('Please input your password!', { selector: 'div' });
      expect(emailError).toBeInTheDocument();
      expect(passError).toBeInTheDocument();
    });
  });

  it('Test ==> Handle login', async () => {
    // const mockTriggerLogin = vi.fn().mockImplementation(() => ({
    //   unwrap: vi.fn().mockRejectedValue(new Error('Login failed')),
    // }));
    const mockDispatch = vi.fn();
    const mockNavigate = vi.fn();

    vi.mock('./_LoginService', () => ({
      useLazyLoginQuery: vi.fn(() => [
        vi.fn(),
        { data: [], isLoading: false, error: null, reset: vi.fn() },
      ]),
    }));
    vi.mocked(useDispatch).mockReturnValue(mockDispatch);
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '1455' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // await waitFor(() => {
    //   expect(mockTriggerLogin).toHaveBeenCalledWith({
    //     email: 'test@gmail.com',
    //     password: '1212212',
    //     remember: true,
    //   });
    //   expect(mockDispatch).not.toHaveBeenCalled();
    //   expect(mockNavigate).not.toHaveBeenCalled();
    // });
  });
});
