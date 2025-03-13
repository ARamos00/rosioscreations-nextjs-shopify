"use client";

import { ProductOption, ProductVariant } from "@/lib/shopify/types";
import { useProduct, useUpdateURL } from "./product-context";
import clsx from "clsx";

type Combination = {
    id: string;
    availableForSale: boolean;
    [key: string]: string | boolean;
};

export default function VariantSelector({
                                            options,
                                            variants,
                                        }: {
    options: ProductOption[];
    variants: ProductVariant[];
}) {
    const { state, updateOption } = useProduct();
    const updateURL = useUpdateURL();

    const hasNoOptionsOrJustOneOption =
        !options.length ||
        (options.length === 1 && options[0]?.values.length === 1);
    if (hasNoOptionsOrJustOneOption) {
        return null;
    }

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

    return options.map((option) => (
        <form key={option.id}>
            <dl className="mb-8">
                <dt className="mb-4 text-sm uppercase tracking-wide text-secondary">
                    {option.name}
                </dt>
                <dd className="flex flex-wrap gap-3">
                    {option.values.map((value) => {
                        const optionNameLowerCase = option.name.toLowerCase();
                        const optionParams = { ...state, [optionNameLowerCase]: value };

                        const filtered = Object.entries(optionParams).filter(
                            ([key, value]) =>
                                options.find(
                                    (option) =>
                                        option.name.toLowerCase() === key &&
                                        option.values.includes(value)
                                )
                        );

                        const isAvailableForSale = combinations.find((combination) =>
                            filtered.every(
                                ([key, value]) =>
                                    combination[key] === value && combination.availableForSale
                            )
                        );

                        const isActive = state[optionNameLowerCase] === value;

                        return (
                            <button
                                formAction={() => {
                                    const newState = updateOption(optionNameLowerCase, value);
                                    updateURL(newState);
                                }}
                                key={value}
                                aria-disabled={!isAvailableForSale}
                                disabled={!isAvailableForSale}
                                title={`${option.name} ${value}${
                                    !isAvailableForSale ? " (Out of Stock)" : ""
                                }`}
                                className={clsx(
                                    "flex min-w-[48px] items-center justify-center rounded-full border px-2 py-1 text-sm transition duration-300 ease-in-out",
                                    // Base styling: dark background (primary), light text (secondary)
                                    "bg-primary border-secondary text-secondary",
                                    // Active state styling
                                    {
                                        "cursor-default ring-2 ring-secondary": isActive,
                                        "ring-1 ring-transparent hover:ring-secondary":
                                            !isActive && isAvailableForSale,
                                    },
                                    // Disabled state styling
                                    {
                                        "relative z-10 cursor-not-allowed overflow-hidden bg-primary text-secondary opacity-50 ring-1 ring-secondary":
                                            !isAvailableForSale,
                                        "before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-secondary before:transition-transform":
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
