import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './pages/Landing/Layout';
import Landing from './pages/Landing/Landing';
import Menu from './pages/Landing/Menu';
import About from './pages/Landing/About';
import Contact from './pages/Landing/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="menu" element={<Menu />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
