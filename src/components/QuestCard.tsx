import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Trophy, Clock, Star, ArrowRight } from 'lucide-react';
import { Quest } from '../types';
import { useUserStore } from '../store/userStore';

interface QuestCardProps {
  quest: Quest;
  onComplete?: () => void;
}

export const QuestCard = ({ quest, onComplete }: QuestCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const completeQuest = useUserStore((state) => state.completeQuest);
  const addXP = useUserStore((state) => state.addXP);

  const difficultyColors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-orange-400',
    legendary: 'text-purple-400'
  };

  const handleComplete = () => {
    completeQuest(quest.id);
    addXP(quest.rewards.xp);
    onComplete?.();
  };

  useEffect(() => {
    if (quest.duration) {
      // Simulate countdown timer
      const interval = setInterval(() => {
        setTimeLeft(quest.duration || '');
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [quest.duration]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-navy-800 rounded-lg p-6 border border-blue-900 relative overflow-hidden"
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-blue-400 opacity-0 blur-xl"
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{quest.title}</h3>
        <span className={`${difficultyColors[quest.difficulty]} text-sm font-medium`}>
          {quest.difficulty.toUpperCase()}
        </span>
      </div>

      <p className="text-blue-300 mb-4">{quest.description}</p>

      <div className="space-y-3">
        {timeLeft && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock size={16} />
            <span>{timeLeft} remaining</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-yellow-400">
          <Trophy size={16} />
          <span>+{quest.rewards.xp} XP</span>
        </div>

        {quest.rewards.special && (
          <div className="flex items-center gap-2 text-sm text-purple-400">
            <Star size={16} />
            <span>{quest.rewards.special}</span>
          </div>
        )}
      </div>

      <motion.button
        onClick={handleComplete}
        disabled={quest.completed}
        className={`mt-4 w-full px-4 py-2 rounded flex items-center justify-center gap-2 ${
          quest.completed
            ? 'bg-green-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        whileHover={{ scale: quest.completed ? 1 : 1.02 }}
        whileTap={{ scale: quest.completed ? 1 : 0.98 }}
      >
        {quest.completed ? (
          'Completed'
        ) : (
          <>
            <span>Start Quest</span>
            <ArrowRight size={16} />
          </>
        )}
      </motion.button>
    </motion.div>
  );
};