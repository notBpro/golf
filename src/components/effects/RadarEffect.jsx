import React from 'react';
import { motion } from 'framer-motion';

const RadarEffect = ({ animationSpeed, containerClassName, colors }) => {
  return (
    <motion.div
      className={`absolute inset-0 ${containerClassName}`}
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(100% at 50% 50%)' }}
      exit={{ clipPath: 'circle(0% at 50% 50%)' }}
      transition={{ duration: animationSpeed / 10 }}
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
            border: `1px solid ${colors ? `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})` : '#ffffff'}`,
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
          background: `linear-gradient(to bottom, ${colors ? `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})` : '#ffffff'}, transparent)`,
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
            background: colors ? `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})` : '#ffffff',
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            boxShadow: `0 0 6px ${colors ? `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})` : '#ffffff'}`
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

export default RadarEffect;
```

```

## 2. Icon Components

```jsx:src/components/icons/GolfIcons.jsx
import React from 'react';

export const GolfIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ color: '#10b981' }}>
    <circle cx="30" cy="15" r="3" fill="currentColor" />
    <path d="M30 20 L30 50 M25 45 L35 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ChartIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ color: '#10b981' }}>
    <path d="M10 50 L20 30 L30 35 L40 20 L50 25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    <circle cx="20" cy="30" r="2" fill="currentColor" />
    <circle cx="30" cy="35" r="2" fill="currentColor" />
    <circle cx="40" cy="20" r="2" fill="currentColor" />
  </svg>
);

export const TargetIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ color: '#10b981' }}>
    <circle cx="30" cy="30" r="25" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="30" cy="30" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="30" cy="30" r="5" fill="currentColor" />
  </svg>
);
```

## 3. Feature Card Component

```jsx:src/components/features/FeatureCard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FeatureCard = ({ title, icon, children }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(55, 65, 81, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        padding: '2rem',
        width: '300px',
        height: '400px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        overflow: 'hidden'
      }}
    >
      {/* Corner Icons */}
      <div style={{ position: 'absolute', top: '-12px', left: '-12px', color: '#10b981', fontSize: '24px' }}>+</div>
      <div style={{ position: 'absolute', top: '-12px', right: '-12px', color: '#10b981', fontSize: '24px' }}>+</div>
      <div style={{ position: 'absolute', bottom: '-12px', left: '-12px', color: '#10b981', fontSize: '24px' }}>+</div>
      <div style={{ position: 'absolute', bottom: '-12px', right: '-12px', color: '#10b981', fontSize: '24px' }}>+</div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 20, textAlign: 'center' }}>
        <motion.div
          animate={{
            y: hovered ? -16 : 0,
            opacity: hovered ? 0 : 1
          }}
          transition={{ duration: 0.2 }}
          style={{ marginBottom: '1rem' }}
        >
          {icon}
        </motion.div>
        <motion.h2
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? -8 : 0,
            color: hovered ? '#ffffff' : '#10b981'
          }}
          transition={{ duration: 0.2 }}
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#10b981',
            margin: 0,
            textShadow: hovered ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none'
          }}
        >
          {title}
        </motion.h2>
      </div>
    </div>
  );
};

export default FeatureCard;
```

## 4. Background Effects Component

```jsx:src/components/layout/BackgroundEffects.jsx
import React from 'react';
import { motion } from 'framer-motion';

const BackgroundEffects = () => {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.4
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundEffects;
```

## 5. Clean Landing Page

```jsx:src/pages/Landing.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Components
import FeatureCard from '../components/features/FeatureCard';
import BackgroundEffects from '../components/layout/BackgroundEffects';
import { GolfIcon, ChartIcon, TargetIcon } from '../components/icons/GolfIcons';

// Effects
import MatrixEffect from '../components/effects/MatrixEffect';
import CircuitEffect from '../components/effects/CircuitEffect';
import RadarEffect from '../components/effects/RadarEffect';

const Landing = () => {
  const [globalHovered, setGlobalHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #374151 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      <BackgroundEffects />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%', maxWidth: '1200px' }}
      >
        {/* Header */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '1rem',
            textAlign: 'center'
          }}
        >
          Unlock Your Golf{" "}
          <motion.span
            animate={{
              color: globalHovered ? "#10b981" : "#ffffff",
              textShadow: globalHovered ? "0 0 20px #10b981" : "none"
            }}
            transition={{ duration: 0.3 }}
          >
            Potential
          </motion.span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{
            color: '#d1d5db',
            fontSize: '1.25rem',
            marginBottom: '4rem',
            maxWidth: '600px',
            margin: '0 auto 4rem auto'
          }}
        >
          Discover insights hidden in your scorecards
        </motion.p>

        {/* Cards */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            flexDirection: window.innerWidth < 1024 ? 'column' : 'row',
            gap: '2rem',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
          onMouseEnter={() => setGlobalHovered(true)}
          onMouseLeave={() => setGlobalHovered(false)}
        >
          <FeatureCard title="Scan & Analyze" icon={<GolfIcon />}>
            <MatrixEffect
              animationSpeed={5}
              containerClassName="bg-gradient-to-br from-emerald-900 to-emerald-700"
              colors={[[16, 185, 129]]}
            />
          </FeatureCard>

          <FeatureCard title="Track Progress" icon={<ChartIcon />}>
            <CircuitEffect
              animationSpeed={4}
              containerClassName="bg-gradient-to-br from-slate-900 to-slate-700"
              colors={[[148, 163, 184]]}
            />
          </FeatureCard>

          <FeatureCard title="Improve Game" icon={<TargetIcon />}>
            <RadarEffect
              animationSpeed={6}
              containerClassName="bg-gradient-to-br from-teal-900 to-teal-700"
              colors={[[20, 184, 166]]}
            />
          </FeatureCard>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          style={{ marginTop: '4rem' }}
        >
          <motion.button
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '2rem',
              border: 'none',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 15px 35px rgba(16, 185, 129, 0.4)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            Start Your Journey
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;
```

## Benefits of This Structure:

✅ **Industry Standard Organization**:
- `components/effects/` - Reusable animation effects
- `components/features/` - Feature-specific components
- `components/icons/` - Icon components
- `components/layout/` - Layout and background components

✅ **Maintainability**:
- Each component has a single responsibility
- Easy to test individual components
- Changes to effects don't affect other parts

✅ **Reusability**:
- Effects can be used in other parts of your app
- Icons can be reused anywhere
- FeatureCard is a generic component

✅ **Clean Code**:
- Landing page is now much more readable
- Easy to understand what each part does
- Simple to add new features or effects

This is exactly how most professional React applications are structured!

