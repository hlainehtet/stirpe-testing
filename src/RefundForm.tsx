// src/components/RefundForm.tsx
import React, { useState } from "react";

const RefundForm: React.FC = () => {
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRefund = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const response = await fetch(
        "https://nestjs-stripe-test.onrender.com/v1/stripe/refund",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${"your-jwt-token-here"}`, // Include the JWT token
          },
          body: JSON.stringify({ paymentIntentId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to request refund");
      }

      const result = await response.json();
      alert(`Refund requested successfully: ${result.message}`);
      setPaymentIntentId(""); // Reset the form
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Request Refund</h1>
      <form id="refund-form" onSubmit={handleRefund} className="space-y-4">
        <div>
          <label
            htmlFor="paymentIntentId"
            className="block text-sm font-medium text-gray-700"
          >
            Payment Intent ID
          </label>
          <input
            id="paymentIntentId"
            type="text"
            value={paymentIntentId}
            onChange={(e) => setPaymentIntentId(e.target.value)}
            required
            className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          id="submit"
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Request Refund
        </button>
        {errorMessage && (
          <div id="error-message" role="alert" className="text-red-600 mt-4">
            {errorMessage}
          </div>
        )}
        <div className="text-center mt-6">
          <a href="/" className="text-blue-600 hover:underline">
            Home
          </a>
        </div>
      </form>
    </div>
  );
};

export default RefundForm;
