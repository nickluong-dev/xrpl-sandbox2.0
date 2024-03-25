import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Client } from "xrpl";
import NavBar from "./components/Navbar";
import Test from "./pages/Test";
import CreateAndSend from "./pages/CreateAndSend";
import MintAndBurn from "./pages/MintBurnSell";
// import './App.css'

function App() {
  return (
    <div className="App ">
      <BrowserRouter>
        <NavBar />

        <Routes>
          <Route path="/" element={<Test />} />
          <Route path="/createandsend" element={<CreateAndSend />} />
          <Route path="/mintburnsell" element={<MintAndBurn />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
