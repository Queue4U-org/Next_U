import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { Trophy, Flame, Target, Star } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { DailyChallenge } from '../components/DailyChallenge';
import { AchievementPopup } from '../components/AchievementPopup';
import { Achievement } from '../types';

export const HomePage = () => {
  const { profile, updateStats, addXP } = useUserStore();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);

  const handleTraining = (stat: keyof typeof profile.stats) => {
    const increase = Math.floor(Math.random() * 5) + 1;
    updateStats({ [stat]: Math.min(profile.stats[stat] + increase, 100) });
    addXP(increase * 2);
    
    if (profile.stats[stat] + increase >= 100) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
      
      // Trigger achievement
      const newAchievement = {
        id: Date.now().toString(),
        title: `${stat.charAt(0).toUpperCase() + stat.slice(1)} Master`,
        description: `Reached maximum ${stat} level!`,
        icon: '🏆',
        progress: 100,
        maxProgress: 100,
        unlockedAt: new Date()
      };
      setRecentAchievement(newAchievement);
    }
  };

  useEffect(() => {
    if (recentAchievement) {
      const timer = setTimeout(() => setRecentAchievement(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [recentAchievement]);

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

      <div className="bg-navy-900 rounded-lg p-6 border border-blue-900">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {profile.username}!</h1>
            <p className="text-blue-400">Continue your journey to greatness</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="relative"
          >
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
                ease: "easeInOut"
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
            <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-yellow-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(profile.stats.xp % 100)}%` }}
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

      <DailyChallenge />

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

      <motion.div
        className="bg-navy-900 rounded-lg p-6 border border-blue-900"
        whileHover={{ scale: 1.01 }}
      >
        <h2 className="text-xl font-bold mb-4">Recent Achievements</h2>
        <div className="space-y-4">
          {profile.achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              className={`flex items-center gap-4 ${
                achievement.unlockedAt ? 'text-white' : 'text-gray-400'
              }`}
              whileHover={{ x: achievement.unlockedAt ? 10 : 0 }}
            >
              <span className="text-2xl">{achievement.icon}</span>
              <div>
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm">{achievement.description}</p>
                <div className="w-full h-1 bg-navy-950 rounded-full mt-2">
                  <motion.div
                    className="h-full bg-blue-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  />
                </div>
              </div>
              {achievement.unlockedAt && (
                <span className="ml-auto text-green-400">✓</span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AchievementPopup
        achievement={recentAchievement}
        onClose={() => setRecentAchievement(null)}
      />
    </motion.div>
  );
};