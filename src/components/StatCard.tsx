import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dumbbell, Brain, Music, Bot as Lotus } from 'lucide-react';

interface StatCardProps {
  type: 'strength' | 'intelligence' | 'discipline' | 'spiritual';
  value: number;
  onTrainClick: () => void;
}

export const StatCard = ({ type, value, onTrainClick }: StatCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const icons = {
    strength: Dumbbell,
    intelligence: Brain,
    discipline: Music,
    spiritual: Lotus
  };

  const Icon = icons[type];

  const descriptions = {
    strength: 'Physical power and endurance',
    intelligence: 'Mental acuity and problem-solving',
    discipline: 'Focus and determination',
    spiritual: 'Inner peace and meditation'
  };

  // Ensure that value is between 0 and 100
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-navy-900 p-6 rounded-lg border border-blue-900 relative overflow-hidden"
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-blue-400 opacity-0 blur-xl"
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Icon className="w-6 h-6 text-blue-400" aria-label={`${type} icon`} />
            <h3 className="capitalize text-lg font-bold">{type}</h3>
          </div>
          <span className="text-blue-400 font-semibold">{safeValue}%</span>
        </div>

        <p className="text-sm text-gray-400 mb-4">{descriptions[type]}</p>

        <div className="w-full h-2 bg-navy-950 rounded-full mb-4">
          <motion.div
            className="h-full bg-blue-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${safeValue}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        <motion.button
          onClick={onTrainClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={`Train ${type}`}
        >
          Train {type}
        </motion.button>
      </div>
    </motion.div>
  );
};

