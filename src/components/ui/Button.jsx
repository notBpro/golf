import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  onClick,
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black',
    secondary: 'border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black',
    ghost: 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
  };

  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg'
  };

  const combinedClasses = `font-bold rounded-full transition-all duration-300 flex items-center gap-2 justify-center ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
