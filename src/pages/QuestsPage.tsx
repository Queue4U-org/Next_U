import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  Dumbbell,
  Brain,
  Music,
  Bot as Lotus,
  Cog,
  Scroll,
  Trophy,
  X,
  Plus,
  Calendar,
  Facebook,
  Instagram,
  Mail
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { motion, AnimatePresence } from 'framer-motion';

const disableBodyScroll = () => document.body.style.overflow = 'hidden';
const enableBodyScroll = () => document.body.style.overflow = 'auto';

const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.8, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const modalContent = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.3 } }
};

interface QuestCategory {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  progress: number;
  xp: number;
  category: string;
}

interface CustomQuest {
  id: string;
  title: string;
  deadline: string;
  completed: boolean;
}

export const QuestsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { profile } = useUserStore();
  const [selectedQuest, setSelectedQuest] = useState<QuestCategory | null>(null);
  const [questInProgress, setQuestInProgress] = useState(false);
  const [xpProgress, setXpProgress] = useState(0);
  const [showCustomQuestModal, setShowCustomQuestModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [customQuests, setCustomQuests] = useState<CustomQuest[]>(() => {
    const saved = localStorage.getItem('customQuests');
    return saved ? JSON.parse(saved) : [];
  });
  const [newQuest, setNewQuest] = useState({ title: '', deadline: '' });

  useEffect(() => {
    localStorage.setItem('customQuests', JSON.stringify(customQuests));
  }, [customQuests]);

  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.from('.quest-category', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    selectedQuest ? disableBodyScroll() : enableBodyScroll();
    return () => enableBodyScroll();
  }, [selectedQuest]);

  if (!profile || !profile.stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950 text-white">
        Loading stats...
      </div>
    );
  }

  const stats = profile.stats;

  const questCategories: QuestCategory[] = [
    { icon: Dumbbell, title: 'Strength Training', progress: stats.strength, xp: 120, category: 'Physical' },
    { icon: Brain, title: 'Intelligence', progress: stats.intelligence, xp: 150, category: 'Mental' },
    { icon: Music, title: 'Discipline', progress: stats.discipline, xp: 100, category: 'Habit' },
    { icon: Lotus, title: 'Spiritual Training', progress: stats.spiritual, xp: 200, category: 'Inner Peace' }
  ];

  const handleOpenModal = (quest: QuestCategory) => {
    setSelectedQuest(quest);
  };

  const handleCloseModal = () => {
    setSelectedQuest(null);
    setXpProgress(0);
    setQuestInProgress(false);
  };

  const handleStartQuest = () => {
    if (selectedQuest && !questInProgress) {
      setQuestInProgress(true);
      
      gsap.to('.xp-bar', {
        width: '100%',
        duration: 3,
        ease: 'power3.out',
        onComplete: () => {
          setXpProgress(selectedQuest.xp);
          setQuestInProgress(false);
        }
      });
    }
  };

  const handleAddCustomQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuest.title && newQuest.deadline) {
      setCustomQuests(prev => [...prev, {
        id: Date.now().toString(),
        title: newQuest.title,
        deadline: newQuest.deadline,
        completed: false
      }]);
      setNewQuest({ title: '', deadline: '' });
      setShowCustomQuestModal(false);
    }
  };

  const toggleCustomQuestComplete = (id: string) => {
    setCustomQuests(prev => prev.map(quest => 
      quest.id === id ? { ...quest, completed: !quest.completed } : quest
    ));
  };

  const deleteCustomQuest = (id: string) => {
    setCustomQuests(prev => prev.filter(quest => quest.id !== id));
  };

  const handleSocialLogin = (platform: string) => {
    console.log(`Logging in with ${platform}`);
    // Here you would implement the actual social login logic
    setShowLeaderboardModal(false);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Quests</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCustomQuestModal(true)}
              className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={20} />
              <span>Add Custom Quest</span>
            </button>
            <button
              onClick={() => setShowLeaderboardModal(true)}
              className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Trophy size={20} />
              <span>Leaderboard</span>
            </button>
          </div>
        </div>

        {/* Main Quest Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {questCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                className="quest-category bg-navy-900 rounded-lg p-6 border border-blue-900 hover:border-blue-700 transition-all duration-300 cursor-pointer"
                onClick={() => handleOpenModal(category)}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <Icon size={24} className="text-blue-400 flex-shrink-0" />
                  <h2 className="text-xl font-bold text-white">{category.title}</h2>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, category.progress))}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-300">Progress: {category.progress}%</span>
                    <span className="text-yellow-400">+{category.xp} XP</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Quests Section */}
        <div className="bg-navy-900 rounded-lg p-6 border border-blue-900 mb-6">
          <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
            <Scroll className="text-purple-400" />
            Custom Quests
          </h2>
          <div className="space-y-4">
            {customQuests.map(quest => (
              <div
                key={quest.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  quest.completed ? 'bg-navy-800/50' : 'bg-navy-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={quest.completed}
                    onChange={() => toggleCustomQuestComplete(quest.id)}
                    className="w-5 h-5 rounded border-blue-400"
                  />
                  <div className={quest.completed ? 'line-through text-gray-500' : 'text-white'}>
                    <h3 className="font-semibold">{quest.title}</h3>
                    <p className="text-sm text-blue-400">Due: {new Date(quest.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteCustomQuest(quest.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            {customQuests.length === 0 && (
              <p className="text-gray-400 text-center py-4">No custom quests yet. Add one to get started!</p>
            )}
          </div>
        </div>

        {/* Additional Quest Types */}
        <div className="space-y-4">
          {/* Secret Quests */}
          <motion.div 
            className="quest-category bg-navy-900 rounded-lg p-6 border border-blue-900 hover:border-blue-700 transition-all duration-300 cursor-pointer"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <Cog size={24} className="text-blue-400 flex-shrink-0" />
              <h2 className="text-xl font-bold text-white">Secret Quests</h2>
            </div>
            <div className="space-y-2">
              <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full w-0" />
              </div>
              <p className="text-sm text-blue-300">Progress: 0%</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quest Modal */}
      <AnimatePresence>
        {selectedQuest && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalBackdrop}
          >
            <motion.div
              className="bg-navy-900 rounded-lg p-6 w-full max-w-md relative border border-blue-700"
              variants={modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <selectedQuest.icon size={32} className="text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">{selectedQuest.title}</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-blue-400">{selectedQuest.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">XP Reward:</span>
                    <span className="text-yellow-400">+{selectedQuest.xp} XP</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Current Progress:</span>
                    <span className="text-blue-400">{selectedQuest.progress}%</span>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
                      <div
                        className="xp-bar h-full bg-blue-400 rounded-full transition-all duration-500"
                        style={{ width: `${questInProgress ? 100 : xpProgress}%` }}
                      />
                    </div>
                    {questInProgress && (
                      <p className="text-sm text-blue-300 text-center">Quest in progress...</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleStartQuest}
                  disabled={questInProgress}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    questInProgress
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {questInProgress ? 'In Progress...' : 'Start Quest'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Quest Modal */}
      <AnimatePresence>
        {showCustomQuestModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalBackdrop}
          >
            <motion.div
              className="bg-navy-900 rounded-lg p-6 w-full max-w-md relative border border-purple-700"
              variants={modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowCustomQuestModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-white">Create Custom Quest</h2>

              <form onSubmit={handleAddCustomQuest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Quest Title
                  </label>
                  <input
                    type="text"
                    value={newQuest.title}
                    onChange={(e) => setNewQuest(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-navy-800 border border-purple-900 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-600"
                    placeholder="Enter quest title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={newQuest.deadline}
                    onChange={(e) => setNewQuest(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full bg-navy-800 border border-purple-900 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Create Quest
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard Social Login Modal */}
      <AnimatePresence>
        {showLeaderboardModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalBackdrop}
          >
            <motion.div
              className="bg-navy-900 rounded-lg p-6 w-full max-w-md relative border border-blue-700"
              variants={modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLeaderboardModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-white">Connect to View Leaderboard</h2>
                <p className="text-gray-400">Connect with your social account to compete with others!</p>

                <div className="space-y-4">
                  <button
                    onClick={() => handleSocialLogin('facebook')}
                    className="w-full bg-[#1877F2] hover:bg-[#1865D3] text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Facebook size={20} />
                    Continue with Facebook
                  </button>

                  <button
                    onClick={() => handleSocialLogin('instagram')}
                    className="w-full bg-[#E4405F] hover:bg-[#D63851] text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Instagram size={20} />
                    Continue with Instagram
                  </button>

                  <button
                    onClick={() => handleSocialLogin('google')}
                    className="w-full bg-[#DB4437] hover:bg-[#C53929] text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail size={20} />
                    Continue with Google
                  </button>
                </div>

                <p className="text-sm text-gray-400">
                  By connecting, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
