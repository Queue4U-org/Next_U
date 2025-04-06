import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementPopupProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementPopup = ({ achievement, onClose }: AchievementPopupProps) => {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          className="fixed bottom-20 right-4 bg-navy-800 rounded-lg p-4 shadow-lg border border-yellow-400 max-w-sm"
          onClick={onClose}
        >
          <motion.div
            className="absolute inset-0 bg-yellow-400 opacity-10 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <div className="relative flex items-center gap-4">
            <div className="bg-yellow-400 rounded-full p-2">
              <Award className="w-6 h-6 text-navy-900" />
            </div>
            <div>
              <h3 className="font-bold text-yellow-400">Achievement Unlocked!</h3>
              <p className="text-white font-medium">{achievement.title}</p>
              <p className="text-sm text-gray-400">{achievement.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};