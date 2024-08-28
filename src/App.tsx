// src/App.tsx
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CheckoutPage from "./CheckoutForm";
import CheckoutPage2 from "./CheckoutForm2";
import PaySuccess from "./PaySuccess";
import RefundPage from "./RefundForm";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/checkout" element={<CheckoutPage2 />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/success" element={<PaySuccess />} />
      </Routes>
    </Router>
  );
};

export default App;
