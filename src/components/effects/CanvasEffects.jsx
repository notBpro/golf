import React from 'react';
import { motion } from 'framer-motion';

// Card 1: Matrix Digital Rain Effect - Electric Blue
export const MatrixEffect = ({ animationSpeed, containerClassName, colors }) => {
  const blueColor = '#00bfff'; // Electric blue
  
  return (
    <motion.div
      className={`absolute inset-0 ${containerClassName}`}
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(100% at 50% 50%)' }}
      exit={{ clipPath: 'circle(0% at 50% 50%)' }}
      transition={{ duration: animationSpeed / 10 }}
      style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' }} // Dark blue background
    >
      {/* Digital Rain */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '2px',
            height: '60px',
            background: `linear-gradient(transparent, ${blueColor}, transparent)`,
            left: `${6.6 * i}%`,
          }}
          animate={{
            y: ['-60px', '460px']
          }}
          transition={{
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'linear'
          }}
        />
      ))}
      
      {/* Splatter effects */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`splatter-${i}`}
          style={{
            position: 'absolute',
            left: `${12 * i + 5}%`,
            top: '80%',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            delay: (1.5 + Math.random()) * (i + 1),
            repeatDelay: 2 + Math.random() * 2,
          }}
        >
          {[...Array(6)].map((_, j) => (
            <motion.div
              key={j}
              style={{
                position: 'absolute',
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: blueColor,
                left: '0px',
                top: '0px',
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 30],
                y: [0, (Math.random() - 0.5) * 20],
                opacity: [1, 0],
                scale: [1, 0]
              }}
              transition={{
                duration: 0.5,
                delay: j * 0.05,
                ease: 'easeOut'
              }}
            />
          ))}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Card 2: Progress Tracking Effect - Mint Green
export const ProgressTrackingEffect = ({ animationSpeed, containerClassName, colors }) => {
  const mintColor = '#66ffb2'; // Mint green
  
  return (
    <motion.div
      className={`absolute inset-0 ${containerClassName}`}
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(100% at 50% 50%)' }}
      exit={{ clipPath: 'circle(0% at 50% 50%)' }}
      transition={{ duration: animationSpeed / 10 }}
      style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)' }} // Dark green background
    >
      {/* Moving bars */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '100px',
            height: '4px',
            background: mintColor,
            top: `${25 + i * 13}%`,
            left: '20%',
            boxShadow: `0 0 10px ${mintColor}`
          }}
          animate={{
            width: ['20px', '150px', '20px']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut'
          }}
        />
      ))}
      
      {/* Floating dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: mintColor,
            borderRadius: '50%',
            left: `${30 + (i % 3) * 20}%`,
            top: `${60 + Math.floor(i / 3) * 20}%`,
            boxShadow: `0 0 10px ${mintColor}`
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </motion.div>
  );
};

// Card 3: Radar Sweep Effect - Electric Blue
export const RadarEffect = ({ animationSpeed, containerClassName, colors }) => {
  const blueColor = '#00bfff'; // Electric blue
  
  return (
    <motion.div
      className={`absolute inset-0 ${containerClassName}`}
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(100% at 50% 50%)' }}
      exit={{ clipPath: 'circle(0% at 50% 50%)' }}
      transition={{ duration: animationSpeed / 10 }}
      style={{ background: 'linear-gradient(135deg, #164e63 0%, #0e7490 100%)' }} // Dark teal background
    >
      {/* Radar circles */}
      {[1, 2, 3, 4].map((radius) => (
        <motion.div
          key={radius}
          style={{
            position: 'absolute',
            width: `${radius * 60}px`,
            height: `${radius * 60}px`,
            borderRadius: '50%',
            border: `1px solid ${blueColor}`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.3
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: radius * 0.3,
          }}
        />
      ))}
      
      {/* Radar sweep */}
      <motion.div
        style={{
          position: 'absolute',
          width: '2px',
          height: '120px',
          background: `linear-gradient(to bottom, ${blueColor}, transparent)`,
          top: '50%',
          left: '50%',
          transformOrigin: 'bottom center',
          transform: 'translate(-50%, -100%)',
        }}
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      
      {/* Radar blips */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`blip-${i}`}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: blueColor,
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            boxShadow: `0 0 6px ${blueColor}`
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </motion.div>
  );
};



