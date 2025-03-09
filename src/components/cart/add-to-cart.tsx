"use client";

import { Product, ProductVariant } from "@/lib/shopify/types"; // Import product types
import { useProduct } from "../product/product-context"; // Hook for product context
import { useCart } from "./cart-context"; // Hook for cart context
import { useBookingDate } from "@/components/calendar/bookingDateContext"; // Hook for booking date context
import { useFormState } from "react-dom"; // Hook for handling form state and server actions
import clsx from "clsx"; // Utility for conditionally joining classNames
import { PlusIcon } from "@heroicons/react/24/outline"; // Icon component
import { addItem } from "./actions"; // Server action to add an item to the cart

// ExtendedProduct extends Product with additional metafields (e.g., eventOrServiceChoice)
import { ExtendedProduct } from "@/lib/shopify/extendedTypes";

// SubmitButton Component
// Renders a button with different states based on product availability and selection.
function SubmitButton({
                          availableForSale,
                          selectedVariantId,
                      }: {
    availableForSale: boolean;
    selectedVariantId: string | undefined;
}) {
    // Define base button classes with a Warm Peach accent (#EFAA9F)
    const buttonClasses =
        "relative flex w-full items-center justify-center rounded-full bg-[#EFAA9F] p-4 tracking-wide text-white";
    // Classes for disabled button state
    const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

    // If product is out of stock, render a disabled button
    if (!availableForSale) {
        return (
            <button disabled className={clsx(buttonClasses, disabledClasses)}>
                Out of Stock
            </button>
        );
    }

    // If no variant is selected, render a disabled button with an alert
    if (!selectedVariantId) {
        return (
            <button
                aria-label="Please select an option"
                disabled
                className={clsx(buttonClasses, disabledClasses)}
            >
                <div className="absolute left-0 ml-4">
                    <PlusIcon className="h-5" />
                </div>
                Add to Cart
            </button>
        );
    }

    // Otherwise, render an enabled button for adding to the cart
    return (
        <button
            aria-label="Add to cart"
            className={clsx(buttonClasses, "hover:opacity-90")}
        >
            <div className="absolute left-0 ml-4">
                <PlusIcon className="h-5" />
            </div>
            Add To Cart
        </button>
    );
}

// AddToCart Component
// Handles adding a product to the cart with optional booking attributes.
export function AddToCart({ product }: { product: Product }) {
    // Destructure product properties: variants and sale availability
    const { variants, availableForSale } = product;
    // Access addCartItem function from cart context for optimistic UI updates
    const { addCartItem } = useCart();
    // Retrieve booking date from booking date context
    const { bookingDate } = useBookingDate();
    // Access product state (selected options) from product context
    const { state } = useProduct();
    // Set up form state with the addItem server action
    const [message, formAction] = useFormState(addItem, null);

    // Determine the currently selected variant by matching selected options with product state
    const variant = variants.find((variant: ProductVariant) =>
        variant.selectedOptions.every(
            (option) => option.value === state[option.name.toLowerCase()]
        )
    );
    // If there is only one variant, use it as the default
    const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
    // Use the found variant or the default variant
    const selectedVariantId = variant?.id || defaultVariantId;
    // Retrieve the final variant object based on the selected variant ID
    const finalVariant = variants.find(
        (variant) => variant.id === selectedVariantId
    )!;

    // Cast product to ExtendedProduct to access additional metafields
    const extendedProduct = product as ExtendedProduct;
    // Retrieve bookingType from metafield; fallback to empty string if not available
    const bookingType = extendedProduct.eventOrServiceChoice?.value || "";

    return (
        <form
            action={async (formData: FormData) => {
                // Extract bookingDate from hidden input
                const bookingDateFromForm =
                    formData.get("bookingDate")?.toString() || undefined;
                // Extract bookingType from hidden input
                const bookingTypeFromForm =
                    formData.get("bookingType")?.toString() || undefined;
                console.log(
                    "Server action bookingDate from form:",
                    bookingDateFromForm
                );
                console.log(
                    "Server action bookingType from form:",
                    bookingTypeFromForm
                );
                // Perform an optimistic update by adding the item to the cart immediately
                addCartItem(finalVariant, product, bookingDate);
                // Execute the server action with the selected variant and booking details
                await formAction({
                    selectedVariantId,
                    bookingDate: bookingDateFromForm,
                    bookingType: bookingTypeFromForm,
                });
            }}
        >
            {/* Hidden input for bookingDate */}
            <input
                type="hidden"
                name="bookingDate"
                value={bookingDate ? bookingDate.toISOString() : ""}
            />
            {/* Hidden input for bookingType */}
            <input type="hidden" name="bookingType" value={bookingType} />
            {/* Render the submit button with proper states */}
            <SubmitButton
                availableForSale={availableForSale}
                selectedVariantId={selectedVariantId}
            />
            {/* Screen reader message for form state updates */}
            <p className="sr-only" role="status" aria-label="polite">
                {message}
            </p>
        </form>
    );
}
