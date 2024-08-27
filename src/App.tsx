// src/App.tsx
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CheckoutPage from "./CheckoutForm";
import RefundPage from "./RefundForm";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/refund" element={<RefundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
