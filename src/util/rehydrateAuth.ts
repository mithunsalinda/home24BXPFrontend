import { loginSuccess } from '../features/Auth/_LoginSlice';

export const rehydrateAuth = (store: any) => {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      store.dispatch(loginSuccess(user));
    } catch (err) {
      console.warn('Failed to parse stored user data:', err);
    }
  }
};
