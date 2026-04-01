import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Browse from './pages/Browse';
import Detail from './pages/Detail';
import Compare from './pages/Compare';
import Submit from './pages/Submit';

export default function App() {
  const [compareList, setCompareList] = useState([]);

  function toggleCompare(fridge) {
    setCompareList(prev => {
      const exists = prev.find(f => f.id === fridge.id);
      if (exists) return prev.filter(f => f.id !== fridge.id);
      if (prev.length >= 4) return prev;
      return [...prev, fridge];
    });
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar compareCount={compareList.length} />
        <Routes>
          <Route path="/"           element={<Browse  compareList={compareList} onCompare={toggleCompare} />} />
          <Route path="/fridge/:id" element={<Detail  compareList={compareList} onCompare={toggleCompare} />} />
          <Route path="/compare"    element={<Compare compareList={compareList} onCompare={toggleCompare} />} />
          <Route path="/submit"     element={<Submit />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
