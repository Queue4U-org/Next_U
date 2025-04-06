import { useUserStore } from '../store/userStore';
import { Flame } from 'lucide-react';

export const Header = () => {
  const { profile } = useUserStore();
  
  return (
    <div className="flex justify-between items-center p-4 bg-navy-900">
      <div className="flex items-center gap-2">
        <span className="text-blue-400">LVL: {profile.stats.level}</span>
        <div className="w-32 h-2 bg-blue-900 rounded-full">
          <div 
            className="h-full bg-blue-400 rounded-full transition-all duration-300"
            style={{ width: `${(profile.stats.xp % 100)}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white font-bold">{profile.username}</span>
        <Flame className="w-6 h-6 text-blue-400" />
      </div>
    </div>
  );
};