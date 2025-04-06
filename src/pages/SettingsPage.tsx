import { motion } from 'framer-motion';
import { Bell, Moon, Volume2, Shield, LogOut } from 'lucide-react';

export const SettingsPage = () => {
  const settings = [
    { icon: Bell, label: 'Notifications', value: true },
    { icon: Moon, label: 'Dark Mode', value: true },
    { icon: Volume2, label: 'Sound Effects', value: true },
    { icon: Shield, label: 'Privacy', value: false }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-navy-900 rounded-lg divide-y divide-blue-900">
        {settings.map((setting, index) => (
          <div key={index} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <setting.icon className="w-5 h-5 text-blue-400" />
              <span>{setting.label}</span>
            </div>
            <button
              className={`w-12 h-6 rounded-full transition-colors ${
                setting.value ? 'bg-blue-600' : 'bg-navy-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                  setting.value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <button className="w-full bg-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2">
        <LogOut className="w-5 h-5" />
        <span>Log Out</span>
      </button>
    </motion.div>
  );
};