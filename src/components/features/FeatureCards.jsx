import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from './FeatureCard';
import { GolfIcon, ChartIcon, TargetIcon } from '../icons/GolfIcons';
import { MatrixEffect, CircuitEffect, RadarEffect } from '../effects/CanvasEffects';

const FeatureCards = ({ globalHovered, setGlobalHovered }) => {
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
  );
};

export default FeatureCards;
