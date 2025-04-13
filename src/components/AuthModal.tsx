import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [walletStatus, setWalletStatus] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setWalletStatus(`Wallet Connected: ${account}`);
      } catch (err) {
        setWalletStatus('Connection rejected.');
        console.error(err);
      }
    } else {
      alert('MetaMask not found. Install it from https://metamask.io');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Handle Login logic
      console.log('Logging in with:', email, password);
      // Ideally, integrate with backend authentication logic
    } else {
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      // Handle Sign Up logic
      console.log('Signing up with:', email, password);
      // Ideally, integrate with backend signup logic
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-navy-900 w-full max-w-md rounded-lg shadow-xl overflow-hidden"
          >
            <div className="relative p-6">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-white"
                aria-label="Close Modal"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-center mb-6 text-purple-400">Account</h2>

              <div className="flex mb-6 bg-navy-950 rounded-lg p-1">
                <button
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    isLogin ? 'bg-purple-600 text-white' : 'text-purple-400'
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    !isLogin ? 'bg-purple-600 text-white' : 'text-purple-400'
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-navy-950 border border-blue-900 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-navy-950 border border-blue-900 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Password"
                  />
                </div>
                {!isLogin && (
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full bg-navy-950 border border-blue-900 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      aria-label="Confirm Password"
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="text-center">
                    <a href="#" className="text-purple-400 hover:text-purple-300 text-sm">
                      Reset password?
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </button>

                <button
                  type="button"
                  onClick={connectWallet}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Connect Wallet
                </button>

                {walletStatus && (
                  <p className="text-center text-sm text-purple-400">{walletStatus}</p>
                )}

                {isLogin ? (
                  <p className="text-center text-sm">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Create one
                    </button>
                  </p>
                ) : (
                  <p className="text-center text-sm">
                    Already have an account?{' '}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Login
                    </button>
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

