import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EditorWorkspace from './pages/EditorWorkspace';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/editor/:id" element={<EditorWorkspace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
