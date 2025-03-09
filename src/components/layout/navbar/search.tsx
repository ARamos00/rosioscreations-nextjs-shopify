"use client";

import { createUrl } from "@/lib/utils"; // Utility to construct URLs with query parameters
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"; // Search icon component
import { useRouter, useSearchParams } from "next/navigation"; // Next.js hooks for routing and query parameters

// Search component handles the search form functionality
export default function Search() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // onSubmit handles the search form submission
    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); // Prevent the default form submission

        const val = e.target as HTMLFormElement;
        const search = val.search as HTMLInputElement;
        const newParams = new URLSearchParams(searchParams.toString());

        // Set or delete the "q" query parameter based on input value
        if (search.value) {
            newParams.set("q", search.value);
        } else {
            newParams.delete("q");
        }

        // Navigate to the search page with updated query parameters
        router.push(createUrl("/search", newParams));
    }

    return (
        <form
            onSubmit={onSubmit}
            className="max-w-[550px] relative w-full lg:w-80 xl:w-full"
        >
            {/* Search input field with prefilled value from query parameter */}
            <input
                key={searchParams?.get("q")}
                type="text"
                name="search"
                placeholder="Search for products..."
                autoComplete="off"
                defaultValue={searchParams?.get("q") || ""}
                className="text-md w-full rounded-lg border border-[#D8D8D8] bg-white px-4 py-2 text-gray-800 placeholder:text-neutral-500 md:text-sm dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
            />
            {/* Magnifying glass icon positioned inside the input */}
            <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
                <MagnifyingGlassIcon className="h-4 text-[#EFAA9F]" />
            </div>
        </form>
    );
}

// SearchSkeleton component renders a placeholder version of the search form
export function SearchSkeleton() {
    return (
        <form className="max-w-[550px] relative w-full lg:w-80 xl:w-full">
            <input
                type="text"
                placeholder="Search for products..."
                className="w-full rounded-lg border border-[#D8D8D8] bg-white px-4 py-2 text-sm text-gray-800 placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
            />
            <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
                <MagnifyingGlassIcon className="h-4 text-[#EFAA9F]" />
            </div>
        </form>
    );
}
