import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Dumbbell, Brain, Music, Bot as Lotus, Cog, Scroll, Trophy } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { motion } from 'framer-motion';

export const QuestsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { profile } = useUserStore();

  useEffect(() => {
    if (containerRef.current) {
      gsap.from('.quest-category', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }
  }, []);

  const questCategories = [
    { icon: Dumbbell, title: 'Strength Training', progress: profile.stats.strength },
    { icon: Brain, title: 'Intelligence', progress: profile.stats.intelligence },
    { icon: Music, title: 'Discipline', progress: profile.stats.discipline },
    { icon: Lotus, title: 'Spiritual Training', progress: profile.stats.spiritual }
  ];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Quests</h1>
        <button className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Trophy size={20} />
          <span>Leaderboard</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {questCategories.map((category, index) => (
          <div
            key={index}
            className="quest-category bg-navy-900 rounded-lg p-6 border border-blue-900 hover:border-blue-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              <category.icon size={24} className="text-blue-400" />
              <h2 className="text-xl font-bold">{category.title}</h2>
            </div>
            <div className="w-full h-2 bg-blue-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full transition-all duration-300"
                style={{ width: `${category.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="quest-category bg-navy-900 rounded-lg p-6 border border-blue-900 hover:border-blue-700 transition-colors cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <Cog size={24} className="text-blue-400" />
            <h2 className="text-xl font-bold">Secret Quests</h2>
          </div>
          <div className="w-full h-2 bg-blue-900 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full w-0" />
          </div>
        </div>

        <div className="quest-category bg-navy-900 rounded-lg p-6 border border-blue-900 hover:border-blue-700 transition-colors cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <Scroll size={24} className="text-blue-400" />
            <h2 className="text-xl font-bold">Personal Quests</h2>
            <span className="text-blue-400">0 Quests Remaining</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};