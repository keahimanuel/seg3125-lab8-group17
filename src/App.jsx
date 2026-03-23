import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BrowsePets from './pages/BrowsePets';
import PetProfile from './pages/PetProfile';
import AdoptionForm from './pages/AdoptionForm';
import Messages from './pages/Messages';
import FAQ from './pages/FAQ';
import CareGuides from './pages/CareGuides';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pets" element={<BrowsePets />} />
          <Route path="/pets/:id" element={<PetProfile />} />
          <Route path="/apply/:id" element={<AdoptionForm />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/guides" element={<CareGuides />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
