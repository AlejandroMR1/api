import './App.css';
import Home from "./pages/Home";
import Login from './pages/Login';
import { Routes, Route } from 'react-router-dom';
import ReporteUno from './pages/ReporteUno';


function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />

    </Routes>
  );
}

export default App;


