"use client";

import { CartItem } from "@/lib/shopify/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { removeItem } from "./actions";

// DeleteItemButton component handles the removal of a cart item.
// It performs an optimistic UI update and then executes a server action to remove the item.
export function DeleteItemButton({
                                   item,
                                   optimisticUpdate,
                                 }: {
  item: CartItem;
  optimisticUpdate: any;
}) {
  // useFormState manages form submission state for the removeItem server action.
  const [message, formAction] = useFormState(removeItem, null);
  // Extract the merchandise ID from the cart item.
  const merchandiseId = item.merchandise.id;
  // Bind the merchandise ID to the form action.
  const actionWithVariant = formAction.bind(null, merchandiseId);

  return (
      // Form that triggers the delete action on submission.
      <form
          action={async () => {
            // Perform an optimistic update to immediately remove the item.
            optimisticUpdate(merchandiseId, "delete");
            // Execute the server action to remove the item from the cart.
            await actionWithVariant();
          }}
      >
        <button
            type="submit"
            aria-label="Remove cart item"
            className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
        >
          {/* Display the XMarkIcon as the delete icon */}
          <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
        </button>
        {/* Hidden status message for screen readers */}
        <p aria-live="polite" className="sr-only" role="status">
          {message}
        </p>
      </form>
  );
}
