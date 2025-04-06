import { create } from 'zustand';
import { UserProfile, Quest } from '../types';

interface UserStore {
  profile: UserProfile;
  updateStats: (stats: Partial<UserProfile['stats']>) => void;
  completeQuest: (questId: string) => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
}

const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;

const initialProfile: UserProfile = {
  username: 'Warrior',
  stats: {
    level: 1,
    xp: 0,
    strength: 10,
    intelligence: 10,
    discipline: 10,
    spiritual: 10,
    streak: 0,
    questsCompleted: 0
  },
  quests: [],
  achievements: [
    {
      id: '1',
      title: 'First Steps',
      description: 'Begin your journey',
      icon: '🏃',
      progress: 1,
      maxProgress: 1,
      unlockedAt: new Date()
    },
    {
      id: '2',
      title: 'Knowledge Seeker',
      description: 'Complete 5 intelligence quests',
      icon: '📚',
      progress: 0,
      maxProgress: 5
    }
  ],
  rank: 'Novice',
  joinedAt: new Date(),
  lastActive: new Date()
};

export const useUserStore = create<UserStore>((set) => ({
  profile: initialProfile,
  updateStats: (newStats) =>
    set((state) => ({
      profile: {
        ...state.profile,
        stats: { ...state.profile.stats, ...newStats }
      }
    })),
  completeQuest: (questId) =>
    set((state) => {
      const quest = state.profile.quests.find(q => q.id === questId);
      if (!quest || quest.completed) return state;

      const newStats = { ...state.profile.stats };
      newStats[quest.type] += quest.rewards.statIncrease;
      newStats.questsCompleted += 1;
      
      return {
        profile: {
          ...state.profile,
          stats: newStats,
          quests: state.profile.quests.map((q) =>
            q.id === questId ? { ...q, completed: true } : q
          )
        }
      };
    }),
  addXP: (amount) =>
    set((state) => {
      const newXP = state.profile.stats.xp + amount;
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > state.profile.stats.level;

      return {
        profile: {
          ...state.profile,
          stats: {
            ...state.profile.stats,
            xp: newXP,
            level: newLevel
          }
        }
      };
    }),
  updateStreak: () =>
    set((state) => ({
      profile: {
        ...state.profile,
        stats: {
          ...state.profile.stats,
          streak: state.profile.stats.streak + 1
        }
      }
    }))
}));