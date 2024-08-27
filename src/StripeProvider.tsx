// src/StripeProvider.tsx
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

const stripePromise = loadStripe(
  "pk_test_51PoKDDHRsXH2EgmHQNF72bhsnRzsgU3vL6MvLAFtzrQyrUKt2lUIuldhfsXpmBmZIRE7hPoRMCLGaN3UTmicg2dA00erPpocgp"
); // Replace with your actual publishable key

interface StripeProviderProps {
  children: React.ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => (
  <Elements stripe={stripePromise}>{children}</Elements>
);

export default StripeProvider;
