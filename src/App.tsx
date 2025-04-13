import { Route, Switch } from 'wouter';
import { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { QuestsPage } from './pages/QuestsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthModal } from './components/AuthModal';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="flex justify-end p-4">
        <button
          onClick={toggleAuthModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          aria-label="Login"
        >
          Login
        </button>
      </div>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-24">
        <Switch>
          <Route path="/" children={<HomePage />} />
          <Route path="/quests" children={<QuestsPage />} />
          <Route path="/profile" children={<ProfilePage />} />
          <Route path="/settings" children={<SettingsPage />} />
        </Switch>
      </main>

      <Navigation />
      
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={toggleAuthModal}
        />
      )}
    </div>
  );
}

export default App;
