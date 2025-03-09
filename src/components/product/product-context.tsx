/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter, useSearchParams } from "next/navigation"; // Next.js hooks for routing and accessing URL search parameters
import React, { createContext, useContext, useMemo, useOptimistic } from "react"; // React hooks for state management and context

// Define the shape of the product state; it's a record of string key-value pairs with an optional 'image' property.
type ProductState = {
  [key: string]: string;
} & {
  image?: string;
};

// Define the context type for products, including the current state and functions to update options and image.
type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => ProductState;
  updateImage: (index: string) => ProductState;
};

// Create the ProductContext with an undefined initial value.
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider component that supplies product state and update functions to its children.
export function ProductProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams(); // Get current URL search parameters

  // Function to build the initial state from URL search parameters.
  const getInitialState = () => {
    const params: ProductState = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  };

  // Use an optimistic state update hook; it merges the previous state with updates.
  const [state, setOptimisticState] = useOptimistic(
      getInitialState(),
      (prevState: ProductState, update: ProductState) => ({
        ...prevState,
        ...update,
      })
  );

  // Function to update a specific product option in the state.
  const updateOption = (name: string, value: string) => {
    const newState = { [name]: value };
    setOptimisticState(newState);
    return { ...state, ...newState };
  };

  // Function to update the product image index in the state.
  const updateImage = (index: string) => {
    const newState = { image: index };
    setOptimisticState(newState);
    return { ...state, ...newState };
  };

  // Memoize the context value to prevent unnecessary re-renders.
  const value = useMemo(
      () => ({
        state,
        updateOption,
        updateImage,
      }),
      [state]
  );

  return (
      <ProductContext.Provider value={value}>
        {children}
      </ProductContext.Provider>
  );
}

// Custom hook to access the product context.
export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}

// Custom hook that returns a function to update the URL query parameters based on product state.
export function useUpdateURL() {
  const router = useRouter(); // Get the router instance

  return (state: ProductState) => {
    const newParams = new URLSearchParams(window.location.search);
    // Update or add each state entry to the URL parameters.
    Object.entries(state).forEach(([key, value]) => {
      newParams.set(key, value);
    });
    // Push the updated query parameters to the URL without scrolling.
    router.push(`?${newParams.toString()}`, { scroll: false });
  };
}
