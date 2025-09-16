import './App.css';
import Hero from '..//src/pages/hero.js';
import SocialScroll from './pages/socialScroll.js';

function App() {
  return (
    <div className="App"
    style={{ backgroundImage: 'url(/icons/black-paper.png)' }}
    >
      <Hero />
      <SocialScroll />
    </div>
  );
}

export default App;
