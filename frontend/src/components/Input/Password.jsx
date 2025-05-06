import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const Password = ({ value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative w-full mt-4">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder || "Password"}
        className="w-full px-4 py-2 pr-10 rounded bg-[#2a2a3e] text-white focus:outline-none focus:ring-2 focus:ring-[#DCCBFF]"
      />
      <span
        className="absolute right-3 top-2.5 text-white cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
      </span>
    </div>
  );
};

export default Password;
