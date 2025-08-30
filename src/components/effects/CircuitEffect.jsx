import React from 'react';
import { motion } from 'framer-motion';

const CircuitEffect = ({ animationSpeed, containerClassName, colors }) => {
  return (
    <motion.div
      className={`absolute inset-0 ${containerClassName}`}
      initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' }}
      animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
      exit={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' }}
      transition={{ duration: animationSpeed / 10 }}
    >
      {/* Horizontal circuit lines */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`h-line-${i}`}
          style={{
            position: 'absolute',
            height: '2px',
            width: '0px',
            background: colors ? `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})` : '#ffffff',
            top: `${12.5 * i + 10}%`,
            left: '10%',
            boxShadow: `0 0 6px ${colors ? `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})` : '#ffffff'}`
          }}
          animate={{
            width: ['0px', '150px', '300px', '150px', '0px'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
      
      {/* Vertical circuit lines */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`v-line-${i}`}
          style={{
            position: 'absolute',
            width: '2px',
            height: '0px',
            background: colors ? `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})` : '#ffffff',
            left: `${16.6 * i + 15}%`,
            top: '10%',
            boxShadow: `0 0 6px ${colors ? `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})` : '#ffffff'}`
          }}
          animate={{
            height: ['0px', '100px', '200px', '100px', '0px'],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.4 + 1,
          }}
        />
      ))}
      
      {/* Circuit nodes */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`node-${i}`}
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: colors ? `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})` : '#ffffff',
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            boxShadow: `0 0 10px ${colors ? `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})` : '#ffffff'}`
          }}
          animate={{
            scale: [0, 1, 1.5, 1, 0],
            opacity: [0, 1, 1, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      {/* Connection pulses */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`pulse-${i}`}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: colors ? `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})` : '#ffffff',
            left: '20%',
            top: `${25 * i + 15}%`,
          }}
          animate={{
            x: [0, 200, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut'
          }}
        />
      ))}
    </motion.div>
  );
};

export default CircuitEffect;
```

