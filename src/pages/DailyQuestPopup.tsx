import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Info, Square, CheckSquare, X, AlertTriangle } from 'lucide-react';

interface DailyQuestPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Task {
  id: string;
  name: string;
  total: number;
  completed: number;
}

export const DailyQuestPopup = ({ isOpen, onClose }: DailyQuestPopupProps) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'PUSHUPS', total: 10, completed: 0 },
    { id: '2', name: 'SITUPS', total: 10, completed: 0 },
    { id: '3', name: 'OUTDOOR RUN', total: 1, completed: 0 }
  ]);

  const allTasksCompleted = tasks.every(task => task.completed === task.total);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    if (allTasksCompleted) {
      onClose();
    } else {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              completed: task.completed === task.total ? 0 : task.total
            }
          : task
      )
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-navy-950 rounded-lg p-8 max-w-lg w-full border-2 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)] relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Warning Message */}
            <AnimatePresence>
              {showWarning && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-4 bg-red-500 text-white px-4 py-2 rounded-t-lg flex items-center gap-2"
                >
                  <AlertTriangle size={20} />
                  <span>Complete all tasks before closing!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close popup"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <Info size={32} className="text-blue-400" />
              <h2 className="text-3xl font-bold tracking-tight">QUEST INFO</h2>
            </div>

            <div className="space-y-6">
              {tasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="w-full flex items-center gap-4 p-2 rounded hover:bg-navy-900 transition-colors"
                >
                  {task.completed === task.total ? (
                    <CheckSquare size={24} className="text-green-400 flex-shrink-0" />
                  ) : (
                    <Square size={24} className="text-blue-400 flex-shrink-0" />
                  )}
                  <span className="text-xl">
                    {task.total} {task.name} [{task.completed}/{task.total}]
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="text-3xl font-mono mb-2">TIMER: {timeLeft}</div>
              <p className="text-red-400 font-semibold">
                WARNING: FAILURE TO COMPLETE THE DAILY QUEST WILL RESULT IN AN APPROPRIATE PENALTY
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
