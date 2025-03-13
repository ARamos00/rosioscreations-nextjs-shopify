import { GridTileImage } from "@/components/grid/tile";
import Gallery from "@/components/product/gallery";
import { ProductProvider } from "@/components/product/product-context";
import { ProductDescription } from "@/components/product/product-description";
import { HIDDEN_PRODUCT_TAG } from "@/lib/constants";
import { getProduct, getProductRecommendations } from "@/lib/shopify";
import { Image } from "@/lib/shopify/types";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BookableIndicator from "@/components/product/bookable-indicator";
import BookingCalendar from "@/components/calendar/BookingCalendar";
import { BookingDateProvider } from "@/components/calendar/bookingDateContext";
import { ExtendedProduct } from "@/lib/shopify/extendedTypes";

/**
 * generateMetadata
 *
 * Dynamically builds SEO metadata for the product page.
 * If the product isn't found, it triggers a 404 using Next.js's notFound().
 */
export async function generateMetadata({
                                           params,
                                       }: {
    params: { handle: string };
}): Promise<Metadata> {
    const product = await getProduct(params.handle);
    if (!product) return notFound();

    const { url, width, height, altText: alt } = product.featuredImage || {};
    const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

    return {
        title: product.seo.title || product.title,
        description: product.seo.description || product.description,
        robots: {
            index: indexable,
            follow: indexable,
            googleBot: {
                index: indexable,
                follow: indexable,
            },
        },
        openGraph: url
            ? {
                images: [
                    {
                        url,
                        width,
                        height,
                        alt,
                    },
                ],
            }
            : null,
    };
}

/**
 * ProductPage Component
 *
 * Renders the product page with an image gallery, product description,
 * booking calendar, and related products. The main product details container now
 * uses a light background (bg-secondary) with dark text (text-primary) for maximum readability.
 */
export default async function ProductPage({
                                              params,
                                          }: {
    params: { handle: string };
}) {
    const product = await getProduct(params.handle);
    if (!product) return notFound();

    // Cast product to ExtendedProduct to include our metafields.
    const extendedProduct = product as ExtendedProduct;

    return (
        <ProductProvider>
            <BookingDateProvider>
                <div className="mx-auto max-w-screen-2xl px-4 py-8">
                    {/* Main product details container with light background and dark text */}
                    <div className="flex flex-col rounded-lg border border-primary bg-secondary p-8 md:p-12 shadow-md lg:flex-row lg:gap-8 text-primary">
                        {/* Left Section: Product Image Gallery */}
                        <div className="h-full w-full basis-full lg:basis-4/6">
                            <Suspense
                                fallback={
                                    <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden bg-secondary" />
                                }
                            >
                                <Gallery
                                    images={product.images.slice(0, 5).map((image: Image) => ({
                                        src: image.url,
                                        altText: image.altText,
                                    }))}
                                />
                            </Suspense>
                            {/* Center the BookingCalendar below the image. Note: BookingCalendar already carries its own styling to stand out. */}
                            <div className="mt-16 py-16 flex justify-center">
                                <BookingCalendar product={extendedProduct} />
                            </div>
                        </div>
                        {/* Right Section: Product Description and Booking Features */}
                        <div className="basis-full lg:basis-2/6">
                            <Suspense fallback={null}>
                                <ProductDescription product={product} />
                                {/* Uncomment below if you want to show the BookableIndicator */}
                                {/* <BookableIndicator product={extendedProduct} /> */}
                            </Suspense>
                        </div>
                    </div>
                    {/* Related Products Section */}
                    <RelatedProducts id={product.id} />
                </div>
            </BookingDateProvider>
        </ProductProvider>
    );
}

/**
 * RelatedProducts Component
 *
 * Fetches and renders a list of related products based on the current product's ID.
 */
async function RelatedProducts({ id }: { id: string }) {
    const relatedProducts = await getProductRecommendations(id);
    if (!relatedProducts) return null;

    return (
        <div className="py-8">
            <h2 className="mb-4 text-2xl font-bold text-primary">Related Products</h2>
            <ul className="flex w-full gap-4 overflow-x-auto pt-1">
                {relatedProducts.map((product) => (
                    <li
                        key={product.handle}
                        className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
                    >
                        <Link
                            className="relative h-full w-full"
                            href={`/product/${product.handle}`}
                            prefetch={true}
                        >
                            <GridTileImage
                                alt={product.title}
                                label={{
                                    title: product.title,
                                    amount: product.priceRange.maxVariantPrice.amount,
                                    currencyCode: product.priceRange.maxVariantPrice.currencyCode,
                                }}
                                src={product.featuredImage?.url}
                                fill
                                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
