import { getCollections } from "@/lib/shopify";
import FilterList from "./filter";
import { Suspense } from "react";
import clsx from "clsx";

// Async component that fetches collections and renders them using FilterList.
async function CollectionList() {
  // Retrieve collections from Shopify.
  const collections = await getCollections();

  // Render the FilterList with the collections and a title.
  return <FilterList list={collections} title="Collections" />;
}

// CSS class strings used for the skeleton loader.
const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded";
const activeAndTitles = "bg-neutral-800 dark:bg-neutral-300";
const items = "bg-neutral-400 dark:bg-neutral-700";

// Collections component renders the CollectionList wrapped in a Suspense component.
export default function Collections() {
  return (
      <Suspense
          // Fallback skeleton loader displayed while CollectionList is loading.
          fallback={
            <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
              <div className={clsx(skeleton, activeAndTitles)} />
              <div className={clsx(skeleton, activeAndTitles)} />
              <div className={clsx(skeleton, items)} />
              <div className={clsx(skeleton, items)} />
              <div className={clsx(skeleton, items)} />
              <div className={clsx(skeleton, items)} />
              <div className={clsx(skeleton, items)} />
              <div className={clsx(skeleton, items)} />
              <div className={clsx(skeleton, items)} />
              <div className={clsx(skeleton, items)} />
            </div>
          }
      >
        {/* Render the CollectionList component once data is loaded */}
        <CollectionList />
      </Suspense>
  );
}
