"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ListItem, type PathFilterItem } from ".";
import Link from "next/link";
import { createUrl } from "@/lib/utils";
import type { SortFilterItem } from "@/lib/constants";
import clsx from "clsx";

// Renders a filter item that navigates using a defined path.
function PathFilterItem({ item }: { item: PathFilterItem }) {
    const pathname = usePathname(); // Get current URL path
    const searchParams = useSearchParams(); // Get current search parameters
    const active = pathname === item.path; // Determine if this item is active
    const newParams = new URLSearchParams(searchParams.toString());
    const DynamicTag = active ? "p" : Link; // Use a paragraph tag if active, Link if not

    newParams.delete("q"); // Remove any "q" query parameter

    return (
        <li className="mt-2 flex text-black dark:text-white" key={item.title}>
            <DynamicTag
                href={createUrl(item.path, newParams)}
                className={clsx(
                    "w-full text-sm underline-offset-4 hover:underline dark:hover:text-neutral-100",
                    {
                        "underline underline-offset-4": active,
                    }
                )}
            >
                {item.title}
            </DynamicTag>
        </li>
    );
}

// Renders a filter item that sorts results based on a slug.
function SortFilterItem({ item }: { item: SortFilterItem }) {
    const pathname = usePathname(); // Get current URL path
    const searchParams = useSearchParams(); // Get current search parameters
    const active = searchParams.get("sort") === item.slug; // Check if the current sort matches this item
    const q = searchParams.get("q"); // Get current "q" query parameter

    const href = createUrl(
        pathname,
        new URLSearchParams({
            ...(q && { q }), // Include "q" parameter if it exists
            ...(item.slug && item.slug.length && { sort: item.slug }), // Include "sort" parameter if slug is valid
        })
    );
    const DynamicTag = active ? "p" : Link; // Use a paragraph tag if active, otherwise Link

    return (
        <li className="mt-2 flex text-sm text-black dark:text-white" key={item.title}>
            <DynamicTag
                prefetch={!active ? false : undefined}
                href={href}
                className={clsx("w-full hover:underline hover:underline-offset-4", {
                    "underline underline-offset-4": active,
                })}
            >
                {item.title}
            </DynamicTag>
        </li>
    );
}

// FilterItem component renders either a PathFilterItem or a SortFilterItem based on the item's properties.
export function FilterItem({ item }: { item: ListItem }) {
    return "path" in item ? (
        <PathFilterItem item={item} />
    ) : (
        <SortFilterItem item={item} />
    );
}
