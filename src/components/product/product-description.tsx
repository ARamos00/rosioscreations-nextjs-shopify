import { Product } from "@/lib/shopify/types"; // Import Product type
import Price from "../price"; // Component to display price
import VariantSelector from "./variant-selector"; // Component for selecting product variants
import Prose from "../prose"; // Component to render HTML content
import { AddToCart } from "../cart/add-to-cart"; // Component for adding the product to the cart

// Renders the product description section including title, price, variant selector, description, and add-to-cart button.
export function ProductDescription({ product }: { product: Product }) {
    return (
        <>
            {/* Product header with title and price */}
            <div className="mb-6 flex flex-col border-b pb-6 border-secondary">
                {/* Product title */}
                <h1 className="mb-2 text-5xl font-medium text-secondary">
                    {product.title}
                </h1>
                {/* Price badge */}
                <div className="mr-auto w-auto rounded-full bg-secondary p-2 text-sm text-primary">
                    <Price
                        amount={product.priceRange.maxVariantPrice.amount}
                        currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                    />
                </div>
            </div>
            {/* Variant selector for product options */}
            <VariantSelector options={product.options} variants={product.variants} />
            {/* Render product description if available */}
            {product.descriptionHtml ? (
                <Prose
                    className="mb-6 text-sm leading-relaxed text-secondary"
                    html={product.descriptionHtml}
                />
            ) : null}
            {/* Add to cart button */}
            <AddToCart product={product} />
        </>
    );
}
