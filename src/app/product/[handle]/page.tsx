import { GridTileImage } from "@/components/grid/tile";
import Gallery from "@/components/product/gallery";
import { ProductProvider } from "@/components/product/product-context";
import { ProductDescription } from "@/components/product/product-description";
import BookingCalendar from "@/components/calendar/BookingCalendar";
import { HIDDEN_PRODUCT_TAG } from "@/lib/constants";
import { getProduct, getProductRecommendations } from "@/lib/shopify";
import { Image } from "@/lib/shopify/types";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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

export default async function ProductPage({
                                              params,
                                          }: {
    params: { handle: string };
}) {
    const product = await getProduct(params.handle);
    if (!product) return notFound();

    return (
        <ProductProvider>
            <div className="mx-auto max-w-screen-2xl px-4">
                <div className="flex flex-col lg:flex-row gap-8 rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
                    {/* Left Section: Gallery and Description */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-8">
                        {/* Gallery */}
                        <Suspense
                            fallback={
                                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
                            }
                        >
                            <Gallery
                                images={product.images.slice(0, 5).map((image: Image) => ({
                                    src: image.url,
                                    altText: image.altText,
                                }))}
                            />
                        </Suspense>

                        {/* Product Description */}
                        <div>
                            <Suspense fallback={null}>
                                <ProductDescription product={product} />
                            </Suspense>
                        </div>
                    </div>

                    {/* Right Section: Title, Price, and Calendar */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        {/* Booking Calendar */}
                        <div className="rounded-lg border border-neutral-200 p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                            <BookingCalendar productId={product.id} />
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                <RelatedProducts id={product.id} />
            </div>
        </ProductProvider>
    );
}

async function RelatedProducts({ id }: { id: string }) {
    const relatedProducts = await getProductRecommendations(id);

    if (!relatedProducts) return null;

    return (
        <div className="py-8">
            <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
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
