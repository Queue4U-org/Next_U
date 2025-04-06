import { motion } from 'framer-motion';
import { Timer, Award, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export const DailyChallenge = () => {
  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate time remaining until next challenge
    const interval = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-navy-900 rounded-lg p-6 border border-blue-900"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold">Daily Challenge</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Timer size={16} />
          <span>{timeLeft}</span>
        </div>
      </div>

      <div className="bg-navy-800 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Ultimate Warrior</h3>
        <p className="text-blue-300 text-sm mb-3">
          Complete 3 quests from each category today to earn bonus XP and a special achievement.
        </p>
        <div className="w-full h-2 bg-navy-950 rounded-full">
          <motion.div
            className="h-full bg-yellow-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-gray-400">Progress: {progress}%</span>
          <span className="text-yellow-400">Reward: +500 XP</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
      >
        <span>View All Challenges</span>
        <ArrowRight size={16} />
      </motion.button>
    </motion.div>
  );
};