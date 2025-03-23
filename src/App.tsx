import { BrowserRouter as Router, Routes, Route } from 'react-router';
import './App.css';
import Login from './pages/Login';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AuthLayout from './layouts/AuthLayout';

import ProtectedDashboardLayout from './layouts/ProtectedDashboardLayout';
import Dashboard from './pages/Dashboard';
function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>
            <Route path="/" element={<ProtectedDashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </Router>
      </Provider>
    </>
  );
}

export default App;
