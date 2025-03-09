"use server";

import { TAGS } from "@/lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "@/lib/shopify";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Adds an item to the cart with optional booking attributes.
export async function addItem(
    prevState: any,
    data: { selectedVariantId: string | undefined; bookingDate?: string; bookingType?: string }
) {
  // Retrieve the cart ID from cookies.
  let cartId = cookies().get("cartId")?.value;
  if (!cartId || !data.selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    // Log booking details for debugging.
    console.log("Server addItem: bookingDate is", data.bookingDate);
    console.log("Server addItem: bookingType is", data.bookingType);

    // Build attributes array conditionally based on provided booking data.
    const attributes = [];
    if (data.bookingDate) {
      attributes.push({ key: "bookingDate", value: data.bookingDate });
    }
    if (data.bookingType) {
      attributes.push({ key: "bookingType", value: data.bookingType });
    }

    // Add the item to the cart with the specified variant, quantity, and attributes.
    await addToCart(cartId, [
      {
        merchandiseId: data.selectedVariantId,
        quantity: 1,
        attributes,
      },
    ]);
    // Revalidate the cart cache tag.
    revalidateTag(TAGS.cart);
  } catch (error) {
    return "Error adding item to cart";
  }
}

// Updates the quantity of an item in the cart.
export async function updateItemQuantity(
    prevState: any,
    payload: {
      merchandiseId: string;
      quantity: number;
    }
) {
  // Retrieve the cart ID from cookies.
  let cartId = cookies().get("cartId")?.value;
  if (!cartId) {
    return "Missing cart ID";
  }

  const { merchandiseId, quantity } = payload;

  try {
    // Get the current cart data.
    const cart = await getCart(cartId);
    if (!cart) {
      return "Error fetching cart";
    }

    // Find the line item that matches the merchandise ID.
    const lineItem = cart.lines.find(
        (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        // Remove the item if quantity is set to 0.
        await removeFromCart(cartId, [lineItem.id]);
      } else {
        // Update the item quantity.
        await updateCart(cartId, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item is not found in the cart and quantity is greater than 0, add it.
      await addToCart(cartId, [{ merchandiseId, quantity }]);
    }

    // Revalidate the cart cache tag.
    revalidateTag(TAGS.cart);
  } catch (error) {
    console.error(error);
    return "Error updating item quantity";
  }
}

// Removes an item from the cart.
export async function removeItem(prevState: any, merchandiseId: string) {
  // Retrieve the cart ID from cookies.
  let cartId = cookies().get("cartId")?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  try {
    // Get the current cart data.
    const cart = await getCart(cartId);
    if (!cart) {
      return "Error fetching cart";
    }

    // Find the line item corresponding to the merchandise ID.
    const lineItem = cart.lines.find(
        (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      // Remove the item from the cart.
      await removeFromCart(cartId, [lineItem.id]);
      // Revalidate the cart cache tag.
      revalidateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch (error) {
    return "Error removing item from cart";
  }
}

// Redirects the user to the checkout page.
export async function redirectToCheckout() {
  // Retrieve the cart ID from cookies.
  let cartId = cookies().get("cartId")?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  // Get the current cart data.
  let cart = await getCart(cartId);

  if (!cart) {
    return "Error fetching cart";
  }

  // Redirect to the checkout URL.
  redirect(cart.checkoutUrl);
}

// Creates a new cart and sets its ID in a cookie.
export async function createCartAndSetCookie() {
  let cart = await createCart();
  cookies().set("cartId", cart.id!);
}
