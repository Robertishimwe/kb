import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const allowedEmails = ['robertishimwe0@gmail.com']; // Add your allowed email addresses here

const Login = () => {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    if (allowedEmails.includes(decoded.email)) {
      localStorage.setItem('user', JSON.stringify(decoded));
      navigate('/articles');
    } else {
      alert('You are not authorized to access this application.');
    }
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default Login;