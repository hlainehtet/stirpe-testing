// src/components/CheckoutForm.tsx
import React, { useState } from "react";

const CheckoutForm2: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<any>();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MjQ3NTc4NjMsImV4cCI6MTc0MDMwOTg2M30.Lv4Cw3XT_0FB-IVNraOUFG7UtkgDW2Hx8hI__RP3TMw";
    const points = (document.getElementById("points") as HTMLInputElement)
      .value;
    const productId = (document.getElementById("productId") as HTMLInputElement)
      .value;
    try {
      // Call your server to create a Payment Link
      const response = await fetch(
        "https://nestjs-stripe-test.onrender.com/v1/stripe/payment-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include your JWT token
          },
          body: JSON.stringify({ points, productId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment link");
      }

      const { url } = await response.json();

      // Redirect the user to the Payment Link
      window.location.href = url;
    } catch (error) {
      // Handle any errors that occurred during the fetch process

      setErrorMessage(error);
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-center">
        Buy Points with Stripe
      </h1>
      <form id="payment-form" onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Card Owner's Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="points"
            className="block text-sm font-medium text-gray-700"
          >
            Points to Buy
          </label>
          <input
            id="points"
            type="number"
            min="1"
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="productId"
            className="block text-sm font-medium text-gray-700"
          >
            Product Id
          </label>
          <input
            id="productId"
            type="number"
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          id="submit"
          type="submit"
          className="w-full py-3 font-semibold text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Pay
        </button>
        {errorMessage && (
          <div id="error-message" className="mt-4 text-center text-red-600">
            {errorMessage}
          </div>
        )}
      </form>
      <div className="mt-6 text-center">
        <a href="refund" className="text-blue-600 hover:underline">
          Refund
        </a>
      </div>
    </div>
  );
};

export default CheckoutForm2;
