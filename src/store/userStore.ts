import { create } from 'zustand';
import { UserProfile, Quest } from '../types';

interface UserStore {
  profile: UserProfile;
  updateStats: (stats: Partial<UserProfile['stats']>) => void;
  completeQuest: (questId: string) => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  updateAchievements: () => void;
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
    questsCompleted: 0,
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
      unlockedAt: new Date(),
    },
    {
      id: '2',
      title: 'Knowledge Seeker',
      description: 'Complete 5 intelligence quests',
      icon: '📚',
      progress: 0,
      maxProgress: 5,
    },
  ],
  rank: 'Novice',
  joinedAt: new Date(),
  lastActive: new Date(),
};

export const useUserStore = create<UserStore>((set) => ({
  profile: initialProfile,
  updateStats: (newStats) =>
    set((state) => ({
      profile: {
        ...state.profile,
        stats: { ...state.profile.stats, ...newStats },
      },
    })),
  completeQuest: (questId) =>
    set((state) => {
      const quest = state.profile.quests.find((q) => q.id === questId);
      if (!quest || quest.completed) return state;

      const newStats = { ...state.profile.stats };
      newStats[quest.type] += quest.rewards.statIncrease;
      newStats.questsCompleted += 1;

      // Update quest completion status
      const updatedQuests = state.profile.quests.map((q) =>
        q.id === questId ? { ...q, completed: true } : q
      );

      // Update the quest progress in achievements
      const updatedAchievements = state.profile.achievements.map((ach) => {
        if (ach.id === '2' && quest.type === 'intelligence') {
          ach.progress += 1;
          if (ach.progress === ach.maxProgress) {
            ach.unlockedAt = new Date();
          }
        }
        return ach;
      });

      return {
        profile: {
          ...state.profile,
          stats: newStats,
          quests: updatedQuests,
          achievements: updatedAchievements,
        },
      };
    }),
  addXP: (amount) =>
    set((state) => {
      const newXP = state.profile.stats.xp + amount;
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > state.profile.stats.level;

      // If leveled up, update the rank
      let newRank = state.profile.rank;
      if (newLevel >= 5) newRank = 'Adept';
      if (newLevel >= 10) newRank = 'Expert';
      if (newLevel >= 15) newRank = 'Master';

      return {
        profile: {
          ...state.profile,
          stats: {
            ...state.profile.stats,
            xp: newXP,
            level: newLevel,
          },
          rank: newRank,
        },
      };
    }),
  updateStreak: () =>
    set((state) => {
      const newStreak = state.profile.stats.streak + 1;

      // Ensure the streak doesn't reset when it shouldn't
      const updatedStreak = newStreak <= 30 ? newStreak : 30; // cap at 30 days for example

      return {
        profile: {
          ...state.profile,
          stats: {
            ...state.profile.stats,
            streak: updatedStreak,
          },
        },
      };
    }),
  updateAchievements: () =>
    set((state) => {
      const updatedAchievements = state.profile.achievements.map((ach) => {
        // Check if any achievements should be updated based on progress
        if (ach.progress === ach.maxProgress && !ach.unlockedAt) {
          ach.unlockedAt = new Date(); // Mark as unlocked
        }
        return ach;
      });

      return {
        profile: {
          ...state.profile,
          achievements: updatedAchievements,
        },
      };
    }),
}));
