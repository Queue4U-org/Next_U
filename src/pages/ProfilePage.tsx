import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { Trophy, Star, Medal, Award } from 'lucide-react';

export const ProfilePage = () => {
  const { profile } = useUserStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-navy-900 rounded-lg p-6 border border-blue-900 text-center">
        <div className="w-24 h-24 mx-auto bg-blue-400 rounded-full mb-4 flex items-center justify-center">
          <span className="text-3xl font-bold">{profile.username[0]}</span>
        </div>
        <h1 className="text-2xl font-bold">{profile.username}</h1>
        <p className="text-blue-400">Level {profile.stats.level} Warrior</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-navy-900 p-4 rounded-lg border border-blue-900">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span>Achievements</span>
          </div>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-navy-900 p-4 rounded-lg border border-blue-900">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-blue-400" />
            <span>Total XP</span>
          </div>
          <p className="text-2xl font-bold">{profile.stats.xp}</p>
        </div>
      </div>

      <div className="bg-navy-900 rounded-lg p-6 border border-blue-900">
        <h2 className="text-xl font-bold mb-4">Stats</h2>
        <div className="space-y-4">
          {Object.entries(profile.stats).map(([stat, value]) => (
            stat !== 'level' && stat !== 'xp' && (
              <div key={stat} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="capitalize">{stat}</span>
                  <span className="text-blue-400">{value}%</span>
                </div>
                <div className="w-full h-2 bg-navy-950 rounded-full">
                  <div
                    className="h-full bg-blue-400 rounded-full transition-all duration-300"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      <div className="bg-navy-900 rounded-lg p-6 border border-blue-900">
        <h2 className="text-xl font-bold mb-4">Badges</h2>
        <div className="grid grid-cols-3 gap-4">
          {[Medal, Award, Trophy].map((Icon, index) => (
            <div key={index} className="bg-navy-800 p-4 rounded-lg text-center opacity-50">
              <Icon className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm">Locked</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};