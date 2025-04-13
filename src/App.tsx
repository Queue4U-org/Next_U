import { Route, Switch } from 'wouter';
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { QuestsPage } from './pages/QuestsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './components/AuthModal';
import { DailyQuestPopup } from './pages/DailyQuestPopup';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDailyQuestOpen, setIsDailyQuestOpen] = useState(false);

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  // Show daily quest popup when user logs in
  useEffect(() => {
    const showDailyQuest = () => {
      setIsDailyQuestOpen(true);
    };

    // Listen for successful login
    const handleLogin = () => {
      showDailyQuest();
    };

    // Simulate login completion
    if (!isAuthModalOpen && location.pathname === '/home') {
      handleLogin();
    }
  }, [isAuthModalOpen]);

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/home">
          {() => (
            <>
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
                <HomePage />
              </main>

              <Navigation />
            </>
          )}
        </Route>
        <Route path="/quests">
          {() => (
            <>
              <Header />
              <main className="container mx-auto px-4 py-8 pb-24">
                <QuestsPage />
              </main>
              <Navigation />
            </>
          )}
        </Route>
        <Route path="/profile">
          {() => (
            <>
              <Header />
              <main className="container mx-auto px-4 py-8 pb-24">
                <ProfilePage />
              </main>
              <Navigation />
            </>
          )}
        </Route>
        <Route path="/settings">
          {() => (
            <>
              <Header />
              <main className="container mx-auto px-4 py-8 pb-24">
                <SettingsPage />
              </main>
              <Navigation />
            </>
          )}
        </Route>
      </Switch>
      
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={toggleAuthModal}
        />
      )}

      <DailyQuestPopup
        isOpen={isDailyQuestOpen}
        onClose={() => setIsDailyQuestOpen(false)}
      />
    </div>
  );
}

export default App;
