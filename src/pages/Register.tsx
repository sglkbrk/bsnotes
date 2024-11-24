import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    var error = validateForm();
    if (error) {
      setMessage(error);
    } else {
      setLoading(true);
      axios
        .post(config.apiUrl + 'User/register', { name, surname, email, password })
        .then((response) => {
          if (response.status === 200) {
            setMessage('User registered successfully! Redirecting to login page...');
            setTimeout(() => {
              navigate('/login');
            }, 3000);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error('Login error:', error);
          if (error && error.response && error.response.data && error.response.data.message) setMessage(error.response.data.message);
        });
    }
  };

  const validateForm = () => {
    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required.';
    } else if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) {
      return 'Password is required.';
    } else if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }
    const nameRegex = /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/;
    if (!name) {
      return 'Name is required.';
    } else if (!nameRegex.test(name)) {
      return 'Name must only contain letters.';
    }
    const surnameRegex = /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/;
    if (!surname) {
      return 'Surname is required.';
    } else if (!surnameRegex.test(surname)) {
      return 'Surname must only contain letters.';
    }
    return '';
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
          </div>
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
          <p className="text-xs text-gray-500 py-2 ">{message}</p>
          <button
            disabled={loading}
            type="submit"
            className="w-full p-2 bg-[#FDB460] text-white rounded hover:bg-[#f7a600] transition duration-200"
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
