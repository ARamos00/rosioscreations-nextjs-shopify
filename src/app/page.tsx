import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

// Metadata definition
export const metadata: Metadata = {
  title: "Rosio's Creations",
  description:
      "High-performance e-commerce store built with Next.js, Vercel, and Shopify.",
  openGraph: {
    type: "website",
    title: "Rosio's Creations",
    description:
        "High-performance e-commerce store built with Next.js, Vercel, and Shopify.",
  },
};

export default function Home() {
  return (
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-12 md:pt-24 lg:pt-32 border-bottom-b">
          <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div>
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Hello, <span className="text-red-300">I&#39;m Maria Ramos</span>, the owner and decorator of{" "}
                  <span className="text-red-300">Rosio&rsquo;s Creations</span>.
                </h1>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  An event decorator dedicated to transforming spaces into unforgettable and magical experiences. Let us make your event exceptional.
                </p>
                <div className="flex flex-col w-full md:flex-row gap-2 text-nowrap">
                  <Link
                      href="/search/services-collection-event-decor-and-design"
                      className="inline-flex h-9 items-center justify-center rounded-md border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Explore Services
                  </Link>
                  <Link
                      href="/search/event-rentals"
                      className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Browse Rentals
                  </Link>
                  <Link
                      href="/search/sales"
                      className="inline-flex h-9 items-center justify-center rounded-md border border-red-300 bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-red-300 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    View Sales
                  </Link>
                </div>
              </div>
            </div>
            <Image
                src="/banner.png"
                width={1270}
                height={300}
                alt="Hero Banner"
                priority
                className="rounded-t-xl object-cover mx-auto"
            />
          </div>
        </section>

        {/* Collections Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 grid place-content-center">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Featured Collections
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Our Services and Rentals
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover our premium offerings, tailored for your needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start justify-center gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-4">
              <div className="grid gap-1">
                <Link
                    href="/search/services-collection-event-decor-and-design"
                    className="group"
                >
                  <Image
                      src="/services-collection.png"
                      width={400}
                      height={500}
                      alt="Services Collection"
                      className="aspect-[4/5] overflow-hidden rounded-lg object-cover group-hover:scale-105 transition-transform"
                  />
                  <h3 className="mt-4 text-lg font-bold group-hover:underline">
                    Services Collection
                  </h3>
                </Link>
              </div>
              <div className="grid gap-1">
                <Link href="/search/event-rentals" className="group">
                  <Image
                      src="/rental-collection.png"
                      width={400}
                      height={500}
                      alt="Rental Collection"
                      className="aspect-[4/5] overflow-hidden rounded-lg object-cover group-hover:scale-105 transition-transform"
                  />
                  <h3 className="mt-4 text-lg font-bold group-hover:underline">
                    Rentals Collection
                  </h3>
                </Link>
              </div>
              <div className="grid gap-1">
                <Link href="/search/sales" className="group">
                  <Image
                      src="/sales-collection.png"
                      width={400}
                      height={500}
                      alt="Sales Collection"
                      className="aspect-[4/5] overflow-hidden rounded-lg object-cover group-hover:scale-105 transition-transform"
                  />
                  <h3 className="mt-4 text-lg font-bold group-hover:underline">
                    Sales Collection
                  </h3>
                </Link>
              </div>
              <div className="grid gap-1">
                <Link href="/search" className="group">
                  <Image
                      src="/all-collection.png"
                      width={400}
                      height={500}
                      alt="All Collections"
                      className="aspect-[4/5] overflow-hidden rounded-lg object-cover group-hover:scale-105 transition-transform"
                  />
                  <h3 className="mt-4 text-lg font-bold group-hover:underline">
                    All Collections
                  </h3>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
  );
}
