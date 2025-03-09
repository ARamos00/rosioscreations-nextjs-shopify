"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { Cart, CartItem, Product, ProductVariant } from "@/lib/shopify/types";
import { createContext, use, useContext, useMemo, useOptimistic } from "react";

// Define the types of updates that can be applied to a cart item.
type UpdateType = "plus" | "minus" | "delete";

// Define the shape of the Cart context.
type CartContextType = {
  cart: Cart | undefined;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  addCartItem: (
      variant: ProductVariant,
      product: Product,
      bookingDate?: Date | null,
      bookingType?: string | null
  ) => void;
};

// Define actions for our cart reducer.
type CartAction =
    | {
  type: "UPDATE_ITEM";
  payload: { merchandiseId: string; updateType: UpdateType };
}
    | {
  type: "ADD_ITEM";
  payload: {
    variant: ProductVariant;
    product: Product;
    bookingDate?: Date | null;
    bookingType?: string | null;
  };
};

// Create the Cart context.
const CartContext = createContext<CartContextType | undefined>(undefined);

// Returns an empty cart object.
function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
      totalTaxAmount: { amount: "0", currencyCode: "USD" },
    },
  };
}

// Helper function to calculate the cost for a given quantity and unit price.
function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

// Updates a cart item based on the update type.
// Returns the updated item or null if the item should be removed.
function updateCartItem(
    item: CartItem,
    updateType: UpdateType
): CartItem | null {
  if (updateType === "delete") return null;

  const newQuantity =
      updateType === "plus" ? item.quantity + 1 : item.quantity - 1;

  if (newQuantity === 0) return null;

  // Calculate the cost per single unit.
  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  // Calculate new total amount based on updated quantity.
  const newTotalAmount = calculateItemCost(newQuantity, singleItemAmount.toString());

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
    // Preserve existing booking information if available.
    bookingDate: (item as any).bookingDate ?? null,
    bookingType: (item as any).bookingType ?? null,
  };
}

// Updates the overall cart totals based on the provided cart items.
function updateCartTotals(
    lines: CartItem[]
): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
      (sum, item) => sum + Number(item.cost.totalAmount.amount),
      0
  );

  // Use the currency code from the first item, or default to "USD".
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

// Creates or updates a cart item based on whether it already exists.
function createOrUpdateCartItem(
    existingItem: CartItem | undefined,
    variant: ProductVariant,
    product: Product,
    bookingDate?: Date | null,
    bookingType?: string | null
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
    // Use provided booking details or preserve existing ones.
    bookingDate:
        bookingDate || (existingItem && (existingItem as any).bookingDate) || null,
    bookingType:
        bookingType || (existingItem && (existingItem as any).bookingType) || null,
  };
}

// Reducer to update the cart state based on actions.
function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { merchandiseId, updateType } = action.payload;
      // Update matching cart items and filter out any that return null.
      const updatedLines = currentCart.lines
          .map((item) =>
              item.merchandise.id === merchandiseId
                  ? updateCartItem(item, updateType)
                  : item
          )
          .filter(Boolean) as CartItem[];

      // If no items remain, reset totals.
      if (updatedLines.length === 0) {
        return {
          ...currentCart,
          lines: [],
          totalQuantity: 0,
          cost: {
            ...currentCart.cost,
            totalAmount: { ...currentCart.cost.totalAmount, amount: "0" },
          },
        };
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case "ADD_ITEM": {
      const { variant, product, bookingDate, bookingType } = action.payload;
      const existingItem = currentCart.lines.find(
          (item) => item.merchandise.id === variant.id
      );
      // Create a new or updated cart item.
      const updatedItem = createOrUpdateCartItem(
          existingItem,
          variant,
          product,
          bookingDate,
          bookingType
      );

      const updatedLines = existingItem
          ? currentCart.lines.map((item) =>
              item.merchandise.id === variant.id ? updatedItem : item
          )
          : [...currentCart.lines, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    default:
      return currentCart;
  }
}

// CartProvider component that wraps children with the Cart context.
export function CartProvider({
                               children,
                               cartPromise,
                             }: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  // Resolve the initial cart from the provided promise.
  const initialCart = use(cartPromise);
  // Set up optimistic updates using the cart reducer.
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
      initialCart,
      cartReducer
  );

  // Function to update a cart item (e.g., increment, decrement, or delete).
  const updateCartItem = (merchandiseId: string, updateType: UpdateType) => {
    updateOptimisticCart({
      type: "UPDATE_ITEM",
      payload: { merchandiseId, updateType },
    });
  };

  // Function to add an item to the cart.
  const addCartItem = (
      variant: ProductVariant,
      product: Product,
      bookingDate?: Date | null,
      bookingType?: string | null
  ) => {
    updateOptimisticCart({
      type: "ADD_ITEM",
      payload: { variant, product, bookingDate, bookingType },
    });
  };

  // Memoize the context value to avoid unnecessary re-renders.
  const value = useMemo(
      () => ({
        cart: optimisticCart,
        updateCartItem,
        addCartItem,
      }),
      [optimisticCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to access the Cart context.
export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
