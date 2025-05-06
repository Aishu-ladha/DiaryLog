
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Password from '../../components/Input/Password';   
import { validateEmail } from '../../utils/Helper';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateEmail(email)){
        setError('Invalid email address');
        return;
    }

    if(!password){
        setError('Password is required');
        return;
    }
    setError("");

   try{
       const response = await axiosInstance.post("/login",{
        email:email,
        password:password,
       });

       if (response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');
      }
      
   }catch(err){
       if(err.response && err.response.data && err.response.data.message){
        setError(err.response.data.message);
       }
       else{
        setError('Something went wrong. Please try again later.');
       }
   };

    console.log('Logging in with email:', email);
    // You can add authentication logic here
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-[#181825] px-4">
      <div className="w-full max-w-md bg-[#1e1e2f] p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[#DCCBFF] mb-6">Login to DailyLog</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <Password value={password} onChange={(e)=>setPassword(e.target.value)}/>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#DCCBFF] text-[#181825] font-semibold py-2 rounded hover:bg-[#bba7ff] transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#A2A2BC]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#DCCBFF] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  </>
  );

};

export default Login;
