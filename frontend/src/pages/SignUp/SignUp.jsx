import React, { useState } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Password from '../../components/Input/Password';
import { validateEmail } from '../../utils/Helper';
import Login from '../Login/Login';
import axiosInstance from '../../utils/axiosInstance';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Both password fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);

    console.log('Signing up with:', { name, email, password });
    //  signup API  here
    try{
      const response = await axiosInstance.post("/create-account",{
        fullName:name,
        email:email,
        password:password,
      })

      if(response.data && response.data.error){
        setError(response.data.error);
        return;
      }
      if (response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');
      }
      }catch(error){
        if(error.response && error.response.data && error.response.data.message){
          setError(error.response.data.message);
        }
        else{
          setError('Something went wrong. Please try again later.');
        }
      }
    // }

  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#181825] px-4">
        <div className="w-full max-w-md bg-[#1e1e2f] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-[#DCCBFF] mb-6">Create Your DailyLog Account</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-[#A2A2BC] mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded bg-[#2a2a3e] text-white focus:outline-none focus:ring-2 focus:ring-[#DCCBFF]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[#A2A2BC] mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded bg-[#2a2a3e] text-white focus:outline-none focus:ring-2 focus:ring-[#DCCBFF]"
              />
            </div>

            <div>
              <label className="block text-[#A2A2BC] mb-2">Password</label>
              <Password value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div>
              <label className="block text-[#A2A2BC] mb-2">Confirm Password</label>
              <Password value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#DCCBFF] text-[#181825] font-semibold py-2 rounded hover:bg-[#bba7ff] transition"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#A2A2BC]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#DCCBFF] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
