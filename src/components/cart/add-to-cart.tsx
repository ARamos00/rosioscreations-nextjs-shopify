"use client";

import { Product, ProductVariant } from "@/lib/shopify/types";
import { useProduct } from "../product/product-context";
import { useCart } from "./cart-context";
import { useBookingDate } from "@/components/calendar/bookingDateContext";
import { useFormState } from "react-dom";
import clsx from "clsx";
import { PlusIcon } from "@heroicons/react/24/outline";
import { addItem } from "./actions";

// We assume ExtendedProduct extends Product and includes metafields
// such as eventOrServiceChoice.
import { ExtendedProduct } from "@/lib/shopify/extendedTypes";

function SubmitButton({
                          availableForSale,
                          selectedVariantId,
                      }: {
    availableForSale: boolean;
    selectedVariantId: string | undefined;
}) {
    const buttonClasses =
        "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white";
    const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

    if (!availableForSale) {
        return (
            <button disabled className={clsx(buttonClasses, disabledClasses)}>
                Out of Stock
            </button>
        );
    }

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

    return (
        <button
            aria-label="Add to cart"
            className={clsx(buttonClasses, { "hover:opacity-90": true })}
        >
            <div className="absolute left-0 ml-4">
                <PlusIcon className="h-5" />
            </div>
            Add To Cart
        </button>
    );
}

export function AddToCart({ product }: { product: Product }) {
    const { variants, availableForSale } = product;
    const { addCartItem } = useCart();
    const { bookingDate } = useBookingDate();
    const { state } = useProduct();
    const [message, formAction] = useFormState(addItem, null);

    const variant = variants.find((variant: ProductVariant) =>
        variant.selectedOptions.every(
            (option) => option.value === state[option.name.toLowerCase()]
        )
    );
    const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
    const selectedVariantId = variant?.id || defaultVariantId;
    const finalVariant = variants.find(
        (variant) => variant.id === selectedVariantId
    )!;

    // Cast product to ExtendedProduct so we can access additional metafields.
    const extendedProduct = product as ExtendedProduct;
    const bookingType = extendedProduct.eventOrServiceChoice?.value || "";

    return (
        <form
            action={async (formData: FormData) => {
                // Extract bookingDate from hidden input:
                const bookingDateFromForm =
                    formData.get("bookingDate")?.toString() || undefined;
                // Extract bookingType from hidden input:
                const bookingTypeFromForm =
                    formData.get("bookingType")?.toString() || undefined;
                console.log("Server action bookingDate from form:", bookingDateFromForm);
                console.log("Server action bookingType from form:", bookingTypeFromForm);
                // Optimistic update:
                addCartItem(finalVariant, product, bookingDate);
                // Pass both values as a single object to the server action:
                await formAction({
                    selectedVariantId,
                    bookingDate: bookingDateFromForm,
                    bookingType: bookingTypeFromForm,
                });
            }}
        >
            {/* Hidden input to include bookingDate in form submission */}
            <input
                type="hidden"
                name="bookingDate"
                value={bookingDate ? bookingDate.toISOString() : ""}
            />
            {/* Hidden input to include bookingType in form submission */}
            <input type="hidden" name="bookingType" value={bookingType} />
            <SubmitButton
                availableForSale={availableForSale}
                selectedVariantId={selectedVariantId}
            />
            <p className="sr-only" role="status" aria-label="polite">
                {message}
            </p>
        </form>
    );
}
