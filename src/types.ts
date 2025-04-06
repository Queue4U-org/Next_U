export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'strength' | 'intelligence' | 'discipline' | 'spiritual' | 'secret' | 'personal';
  xp: number;
  completed: boolean;
  duration?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  rewards: {
    xp: number;
    statIncrease: number;
    special?: string;
  };
}

export interface UserStats {
  level: number;
  xp: number;
  strength: number;
  intelligence: number;
  discipline: number;
  spiritual: number;
  streak: number;
  questsCompleted: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface UserProfile {
  username: string;
  stats: UserStats;
  quests: Quest[];
  achievements: Achievement[];
  rank: string;
  joinedAt: Date;
  lastActive: Date;
}