import React from "react"
import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard";
import { Route, Routes } from "react-router-dom";
import Products from "./pages/Products";
import Invertory from "./pages/Invertory";
import Calculator from "./pages/Calculator";
import { SystemHealth } from "./pages/SystemHealth";
function App() {
  
  return (
    <>
      <Navbar></Navbar>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/inventory" element={<Invertory />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/health" element={<SystemHealth />} />
      </Routes>
      
    </>
  )
}

export default App
