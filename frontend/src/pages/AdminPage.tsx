// src/pages/AdminPage.tsx
import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import Form from '../components/Form'; // ✅ New form component
import AchieveForm from '../components/AchieveForm';

const AdminPage = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('adminToken') || null
  );

  const handleLoginSuccess = (token: string) => {
    setToken(token);
    localStorage.setItem('adminToken', token);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  if (!token) return <LoginForm onLoginSuccess={handleLoginSuccess} />;

  return (
    <div>
      <h2>Admin Panel</h2>
      <button onClick={handleLogout}>Logout</button>
      <br /><br />

      {/* ✅ Embedded form component */}
      <Form />
      <AchieveForm />
    </div>
  );
};

export default AdminPage;
