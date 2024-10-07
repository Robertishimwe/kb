import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
      Logout
    </Button>
  );
};

export default LogoutButton;