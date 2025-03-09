"use client";

import { ProductOption, ProductVariant } from "@/lib/shopify/types"; // Import types for product options and variants
import { useProduct, useUpdateURL } from "./product-context"; // Import custom hooks to manage product state and URL updates
import clsx from "clsx"; // Utility to conditionally join CSS class names

// Define a type for the combination of selected options for a variant.
// It includes the variant id, its availability, and key-value pairs of options.
type Combination = {
    id: string;
    availableForSale: boolean;
    [key: string]: string | boolean;
};

// VariantSelector component renders buttons for each product option
// allowing users to select different variant combinations.
export default function VariantSelector({
                                            options,
                                            variants,
                                        }: {
    options: ProductOption[];
    variants: ProductVariant[];
}) {
    // Get current product state and update function from context
    const { state, updateOption } = useProduct();
    // Get function to update the URL query parameters
    const updateURL = useUpdateURL();

    // If there are no options or only one option with a single value, no need to render a selector.
    const hasNoOptionsOrJustOneOption =
        !options.length ||
        (options.length === 1 && options[0]?.values.length === 1);
    if (hasNoOptionsOrJustOneOption) {
        return null;
    }

    // Build an array of combinations from variants.
    // Each combination includes the variant id, its availability, and all selected options in lowercase.
    const combinations: Combination[] = variants.map((variant) => ({
        id: variant.id,
        availableForSale: variant.availableForSale,
        ...variant.selectedOptions.reduce(
            (accumulator, option) => ({
                ...accumulator,
                [option.name.toLowerCase()]: option.value,
            }),
            {}
        ),
    }));

    // For each product option, render a form containing buttons for each possible value.
    return options.map((option) => (
        <form key={option.id}>
            {/* Option name as label */}
            <dl className="mb-8">
                <dt className="mb-4 text-sm uppercase tracking-wide text-gray-700 dark:text-white">
                    {option.name}
                </dt>
                <dd className="flex flex-wrap gap-3">
                    {option.values.map((value) => {
                        const optionNameLowerCase = option.name.toLowerCase();

                        // Build the new option parameters based on current state,
                        // preserving previously selected options.
                        const optionParams = { ...state, [optionNameLowerCase]: value };

                        // Filter out any parameters that don't match valid options
                        const filtered = Object.entries(optionParams).filter(
                            ([key, value]) =>
                                options.find(
                                    (option) =>
                                        option.name.toLowerCase() === key &&
                                        option.values.includes(value)
                                )
                        );

                        // Check if the combination corresponding to these parameters is available for sale.
                        const isAvailableForSale = combinations.find((combination) =>
                            filtered.every(
                                ([key, value]) =>
                                    combination[key] === value && combination.availableForSale
                            )
                        );

                        // Determine if this option value is currently selected.
                        const isActive = state[optionNameLowerCase] === value;

                        return (
                            <button
                                formAction={() => {
                                    // Update the product state for the selected option and update the URL accordingly.
                                    const newState = updateOption(optionNameLowerCase, value);
                                    updateURL(newState);
                                }}
                                key={value}
                                aria-disabled={!isAvailableForSale} // Mark as disabled if not available for sale.
                                disabled={!isAvailableForSale}
                                title={`${option.name} ${value}${
                                    !isAvailableForSale ? " (Out of Stock)" : ""
                                }`}
                                className={clsx(
                                    "flex min-w-[48px] items-center justify-center rounded-full border px-2 py-1 text-sm transition duration-300 ease-in-out",
                                    // Base styling for available option buttons.
                                    "bg-[#F8E1D9] border-[#D8D8D8] text-gray-800 dark:border-neutral-800 dark:bg-neutral-900",
                                    // Styling for active (selected) state.
                                    {
                                        "cursor-default ring-2 ring-[#EFAA9F]": isActive,
                                        "ring-1 ring-transparent hover:ring-[#EFAA9F]":
                                            !isActive && isAvailableForSale,
                                    },
                                    // Styling for disabled state.
                                    {
                                        "relative z-10 cursor-not-allowed overflow-hidden bg-[#F6EEE8] text-[#D8D8D8] ring-1 ring-[#D8D8D8]":
                                            !isAvailableForSale,
                                        "before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-[#D8D8D8] before:transition-transform":
                                            !isAvailableForSale,
                                        "dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 dark:before:bg-neutral-700":
                                            !isAvailableForSale,
                                    }
                                )}
                            >
                                {value}
                            </button>
                        );
                    })}
                </dd>
            </dl>
        </form>
    ));
}
