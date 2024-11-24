import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(config.apiUrl + 'User/login', { email, password })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          navigate('/');
          window.location.reload();
        } else {
          setMessage('Error');
        }
      })
      .catch((error) => {
        setMessage(error.response.data);
        console.error('Login error:', error);
      });
    // Login işlemi burada yapılacak
  };

  const goToRegister = () => {
    navigate('/register'); // Register sayfasına yönlendir
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
          </div>
          <p className="text-xs text-red-500 py-2 ">{message}</p>
          <button type="submit" className="w-full p-2 bg-[#FDB460] text-white rounded hover:bg-[#f7a600] transition duration-200">
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            Don't have an account?
            <button onClick={goToRegister} className="text-[#FDB460] font-semibold">
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
