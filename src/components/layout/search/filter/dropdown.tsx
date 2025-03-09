"use client";
import { usePathname, useSearchParams } from "next/navigation"; // Hooks to access the current URL path and query parameters
import { ListItem } from "."; // Import ListItem type from the current module
import { useEffect, useRef, useState } from "react"; // React hooks for state and side effects
import { ChevronDownIcon } from "@heroicons/react/24/outline"; // Icon used for the dropdown arrow
import { FilterItem } from "./item"; // Component to render individual filter items

// FilterItemDropDown component renders a dropdown filter menu based on a list of filter items
export default function FilterItemDropDown({ list }: { list: ListItem[] }) {
  const pathname = usePathname(); // Current URL pathname
  const searchParams = useSearchParams(); // Current search parameters
  const [active, setActive] = useState(""); // State to track the active filter item's title
  const [openSelect, setOpenSelect] = useState(false); // State to control whether the dropdown is open

  const ref = useRef<HTMLDivElement>(null); // Ref to the dropdown container for detecting outside clicks

  // Effect to close the dropdown when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Effect to update the active filter based on the current pathname or search parameters
  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if (
          ("path" in listItem && pathname === listItem.path) ||
          ("slug" in listItem && searchParams.get("sort") === listItem.slug)
      ) {
        setActive(listItem.title);
      }
    });
  }, [pathname, list, searchParams]);

  return (
      <div className="relative" ref={ref}>
        {/* Dropdown header: displays the active filter and toggles the dropdown on click */}
        <div
            onClick={() => setOpenSelect(!openSelect)}
            className="flex w-full items-center justify-between rounded border border-black/30 px-4 py-2 text-sm dark:border-white/30"
        >
          {active}
          <ChevronDownIcon className="h-4" />
        </div>
        {/* Dropdown menu: rendered only when openSelect is true */}
        {openSelect && (
            <div
                onClick={() => setOpenSelect(false)}
                className="absolute z-40 w-full rounded-b-md bg-white p-4 shadow-md dark:bg-black"
            >
              {list.map((item: ListItem, i) => (
                  // Render each filter item using the FilterItem component
                  <FilterItem item={item} key={i} />
              ))}
            </div>
        )}
      </div>
  );
}
