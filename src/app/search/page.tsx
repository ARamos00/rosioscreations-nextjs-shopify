import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { defaultSort, sorting } from "@/lib/constants";
import { getProducts } from "@/lib/shopify";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function SearchPage({
                                           searchParams,
                                         }: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
  sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? "results" : "result";
  return (
      <div className="mx-auto max-w-screen-2xl px-4 py-8">
        {searchValue ? (
            <p className="mb-4 text-lg text-gray-800">
              {products.length === 0
                  ? "There are no products that match"
                  : `Showing ${products.length} ${resultsText} for `}
              <span className="font-semibold text-[#EFAA9F]">
            &quot;{searchValue}&quot;
          </span>
            </p>
        ) : null}
        {products.length > 0 ? (
            <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductGridItems products={products} />
            </Grid>
        ) : null}
      </div>
  );
}
