import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { Trophy, Flame, Target, Star, X } from 'lucide-react';
import { StatCard } from '../components/StatCard';

export const HomePage = () => {
  const { profile, updateStats, addXP } = useUserStore();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const handleTraining = (stat: keyof typeof profile.stats) => {
    const increase = Math.floor(Math.random() * 5) + 1;
    const newStatValue = Math.min(profile.stats[stat] + increase, 100);

    updateStats({ [stat]: newStatValue });
    addXP(increase * 2);

    // Check if training level reaches 100, and trigger level-up animation
    if (newStatValue >= 100 && profile.stats[stat] < 100) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 relative"
    >
      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-0 left-0 right-0 bg-yellow-400 text-navy-950 p-4 rounded-lg text-center font-bold z-50"
          >
            🎉 Level Up! You've mastered a skill! 🎉
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              className="bg-navy-800 p-6 rounded-xl shadow-lg w-11/12 max-w-md text-white relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}  // Prevent modal close on inner click
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
                onClick={() => setSelectedAchievement(null)}
              >
                <X />
              </button>
              <div className="text-4xl mb-4">{selectedAchievement.icon}</div>
              <h2 className="text-2xl font-bold mb-2">{selectedAchievement.title}</h2>
              <p className="mb-4">{selectedAchievement.description}</p>
              {selectedAchievement.unlockedAt && (
                <p className="text-green-400 text-sm">Unlocked on: {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Section */}
      <div className="bg-navy-900 rounded-lg p-6 border border-blue-900">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {profile.username}!</h1>
            <p className="text-blue-400">Continue your journey to greatness</p>
          </div>
          <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="relative">
            <Flame className="w-12 h-12 text-blue-400" />
            <motion.div
              className="absolute inset-0 bg-blue-400 opacity-20 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-navy-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>Level {profile.stats.level}</span>
            </div>
            <div className="w-full h-2 bg-navy-950 rounded-full">
              <motion.div
                className="h-full bg-yellow-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${profile.stats.xp % 100}%` }}  // Adjust XP bar based on XP progress
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="bg-navy-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-blue-400" />
              <span>Daily Streak</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">
              {profile.stats.streak} days
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          type="strength"
          value={profile.stats.strength}
          onTrainClick={() => handleTraining('strength')}
        />
        <StatCard
          type="intelligence"
          value={profile.stats.intelligence}
          onTrainClick={() => handleTraining('intelligence')}
        />
        <StatCard
          type="discipline"
          value={profile.stats.discipline}
          onTrainClick={() => handleTraining('discipline')}
        />
        <StatCard
          type="spiritual"
          value={profile.stats.spiritual}
          onTrainClick={() => handleTraining('spiritual')}
        />
      </div>

      {/* Achievements */}
      <motion.div
        className="bg-navy-900 rounded-lg p-6 border border-blue-900"
        whileHover={{ scale: 1.01 }}
      >
        <h2 className="text-xl font-bold mb-4">Recent Achievements</h2>
        <div className="space-y-4">
          {profile.achievements.map((achievement) => (
            <div
              key={achievement.id}
              onClick={() => setSelectedAchievement(achievement)}
              className={`flex items-center gap-4 cursor-pointer hover:bg-navy-700 p-2 rounded ${
                achievement.unlockedAt ? 'text-white' : 'text-gray-400'
              }`}
            >
              <span className="text-2xl">{achievement.icon}</span>
              <div>
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm">{achievement.description}</p>
              </div>
              {achievement.unlockedAt && (
                <span className="ml-auto text-green-400">✓</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
