// src/pages/AdminPage.tsx
import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import AboutForm from '../components/AboutForm'; // ✅ New form component
import Coaches from '../components/Coaches';
import Achievements from '../components/Achievements';
import Partners from '../components/Partners';
import Testinomials from '../components/Testinomials';
import Touranments from '../components/Touranments';
import AdminsForm from '../components/AdminsForm';



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
      <AboutForm />
      <Coaches />
      <Achievements />
      <Partners/>
      <Testinomials/>
      <Touranments/>
      <AdminsForm/>
    </div>
  );
};

export default AdminPage;
