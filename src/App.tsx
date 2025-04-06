import { Route, Switch } from 'wouter';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { QuestsPage } from './pages/QuestsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-24">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/quests" component={QuestsPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/settings" component={SettingsPage} />
        </Switch>
      </main>

      <Navigation />
    </div>
  );
}

export default App;