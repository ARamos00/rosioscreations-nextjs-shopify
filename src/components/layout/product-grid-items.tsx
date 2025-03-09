import { Product } from "@/lib/shopify/types"; // Import Product type
import Grid from "../grid"; // Import Grid component for layout
import Link from "next/link"; // Import Next.js Link component for navigation
import { GridTileImage } from "../grid/tile"; // Import GridTileImage for displaying product images

// ProductGridItems renders a grid of products with image and label
export default function ProductGridItems({
                                           products,
                                         }: {
  products: Product[];
}) {
  return (
      <>
        {products.map((product) => (
            // Render each product inside a Grid.Item with a fade-in animation
            <Grid.Item key={product.handle} className="animate-fadeIn">
              {/* Link to the product detail page */}
              <Link
                  href={`/product/${product.handle}`}
                  className="relative inline-block h-full w-full"
                  prefetch={true}
              >
                {/* Display the product image with label containing title and price */}
                <GridTileImage
                    alt={product.title}
                    label={{
                      title: product.title,
                      amount: product.priceRange.maxVariantPrice.amount,
                      currencyCode: product.priceRange.maxVariantPrice.currencyCode,
                    }}
                    src={product.featuredImage?.url}
                    fill
                    sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </Link>
            </Grid.Item>
        ))}
      </>
  );
}
