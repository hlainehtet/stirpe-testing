// src/components/CheckoutForm.tsx
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MjQ3MzcwNzQsImV4cCI6MTc0MDI4OTA3NH0.pqmqwO1JdX6_WILOrehIjORHNhraTyXvw6N1dlGo-WI";
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const points = (document.getElementById("points") as HTMLInputElement)
      .value;
    const productId = (document.getElementById("productId") as HTMLInputElement)
      .value;

    try {
      const response = await fetch(
        "https://nestjs-stripe-test.onrender.com/v1/stripe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ points, productId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret, paymentIntentId } = await response.json();

      const result = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements?.getElement(CardNumberElement)!,
          billing_details: {
            name: name,
          },
        },
      });
      console.log(result?.paymentIntent?.status);
      if (result?.error) {
        setErrorMessage(result.error.message || "Payment failed");
      } else if (result?.paymentIntent?.status === "succeeded") {
        await fetch(
          "https://nestjs-stripe-test.onrender.com/v1/userpoints/updatepoints",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${"your-jwt-token-here"}`,
            },
            body: JSON.stringify({ points, paymentIntentId, productId }),
          }
        );

        alert(`Payment successful! You've purchased ${points} points.`);
        (document.getElementById("payment-form") as HTMLFormElement).reset();
      } else if (result?.paymentIntent.status === "requires_action") {
        // Handle further actions like 3D Secure
        console.log("confirm card payment");
        const confirmationResult = await stripe?.confirmCardPayment(
          clientSecret
        );
        if (confirmationResult?.error) {
          setErrorMessage(confirmationResult?.error?.message);
        } else if (confirmationResult?.paymentIntent.status === "succeeded") {
          // Payment succeeded after authentication
          alert("Payment succeeded after additional authentication!");
        }
      }
    } catch (error: any) {
      setErrorMessage(error.message);
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
            required
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
        <div className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
          <div className="mb-4">
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Card Number
            </label>
            <div
              id="card-number"
              className="p-3 mt-2 border border-gray-300 rounded-lg"
            >
              <CardNumberElement />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label
                htmlFor="expiry"
                className="block text-sm font-medium text-gray-700"
              >
                Expiry (MM/YY)
              </label>
              <div
                id="card-expiry"
                className="p-3 mt-2 border border-gray-300 rounded-lg"
              >
                <CardExpiryElement />
              </div>
            </div>
            <div className="flex-1">
              <label
                htmlFor="cvc"
                className="block text-sm font-medium text-gray-700"
              >
                CVC
              </label>
              <div
                id="card-cvc"
                className="p-3 mt-2 border border-gray-300 rounded-lg"
              >
                <CardCvcElement />
              </div>
            </div>
          </div>
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

export default CheckoutForm;
