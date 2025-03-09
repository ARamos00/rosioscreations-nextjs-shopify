import { SortFilterItem } from "@/lib/constants";
import { FilterItem } from "./item";
import FilterItemDropDown from "./dropdown";

// Define a type for filter items that use a path for navigation.
export type PathFilterItem = { title: string; path: string };
// A ListItem can be either a sort filter item or a path filter item.
export type ListItem = SortFilterItem | PathFilterItem;

// Component that renders a list of FilterItem components.
function FilterItemList({ list }: { list: ListItem[] }) {
  return (
      <>
        {list.map((item: ListItem, i) => (
            // Render each filter item with a unique key.
            <FilterItem key={i} item={item} />
        ))}
      </>
  );
}

// FilterList component displays a navigation section for filters.
// It shows a title (if provided) and switches between a desktop and mobile layout.
export default function FilterList({
                                     list,
                                     title,
                                   }: {
  list: ListItem[];
  title?: string;
}) {
  return (
      <>
        <nav>
          {title ? (
              // Display the title on medium screens and above.
              <h3 className="hidden text-xs text-neutral-500 md:block dark:text-neutral-400">
                {title}
              </h3>
          ) : null}
          {/* Desktop view: render the list of filter items inline */}
          <ul className="hidden md:block">
            <FilterItemList list={list} />
          </ul>
          {/* Mobile view: render the filter items in a dropdown */}
          <ul className="md:hidden">
            <FilterItemDropDown list={list} />
          </ul>
        </nav>
      </>
  );
}
