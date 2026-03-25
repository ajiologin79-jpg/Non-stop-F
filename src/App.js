import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductPage from "./pages/ProductPage";
import StockPage from "./pages/StockPage";

function App() {
  return (
    <BrowserRouter>

      {/* Navbar visible on all pages */}
      <Navbar />

      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/stock" element={<StockPage />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;