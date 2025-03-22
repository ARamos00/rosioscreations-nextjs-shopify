import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import DualCalendar from "@/components/calendar/DualCalendar"; // Import the DualCalendar component

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
        <section className="w-full flex items-center justify-center py-12">
          <div
              className="relative w-full max-w-screen-2xl h-[60vh] rounded-lg overflow-hidden"
              style={{
                backgroundImage: "url('/banner.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
          >
            {/* Overlay for better text contrast */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Content Container */}
            <div className="relative z-10 px-4 md:px-6 text-center space-y-6 h-full flex flex-col justify-center">
              <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] text-secondary">
                Hello, <span className="font-bold">I&apos;m Maria Ramos</span>, the owner and decorator of <span
                  className="font-bold">Rosio&rsquo;s Creations</span>.
              </h1>
              <p className="mx-auto max-w-[700px] md:text-xl text-secondary">
                An event decorator dedicated to transforming spaces into unforgettable and magical experiences. Let us
                make your event exceptional.
              </p>
              <div className="flex flex-col w-full md:flex-row gap-2 text-nowrap justify-center">
                <Link
                    href="/search/services-collection-event-decor-and-design"
                    className="inline-flex h-9 items-center justify-center rounded-md border border-secondary bg-primary px-4 py-2 text-sm font-medium text-secondary shadow transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Explore Services
                </Link>
                <Link
                    href="/search/event-rentals"
                    className="inline-flex h-9 items-center justify-center rounded-md border border-secondary bg-primary px-4 py-2 text-sm font-medium text-secondary shadow transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Browse Rentals
                </Link>
                <Link
                    href="/search/sales"
                    className="inline-flex h-9 items-center justify-center rounded-md border border-secondary bg-primary px-4 py-2 text-sm font-medium text-secondary shadow transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  View Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Calendar Overview Section */}
        <section className="w-full py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold mb-8 text-secondary">
              Booking Dates
            </h2>
            <DualCalendar/>
          </div>
        </section>

        {/* Collections Section */}
        <section className="w-full py-12 grid place-content-center">
          <div className="container space-y-8 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-6 py-2 text-2xl font-bold text-secondary">
                  Featured Collections
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-secondary">
                  Our Services and Rentals
                </h2>
                <p className="max-w-[900px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover our premium offerings, tailored for your needs.
                </p>
              </div>
            </div>
            <div
                className="mx-auto grid items-start justify-center gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-4">
              {[
                {
                  href: "/search/services-collection-event-decor-and-design",
                  src: "/services-collection.png",
                  alt: "Services Collection",
                  title: "Services Collection",
                },
                {
                  href: "/search/event-rentals",
                  src: "/rental-collection.png",
                  alt: "Rental Collection",
                  title: "Rentals Collection",
                },
                {
                  href: "/search/sales",
                  src: "/sales-collection.png",
                  alt: "Sales Collection",
                  title: "Sales Collection",
                },
                {
                  href: "/search",
                  src: "/all-collection.png",
                  alt: "All Collections",
                  title: "All Collections",
                },
              ].map((collection, idx) => (
                  <div key={idx} className="relative group overflow-hidden rounded-lg">
                    <Link href={collection.href} className="block">
                      <Image
                          src={collection.src}
                          width={400}
                          height={500}
                          alt={collection.alt}
                          className="aspect-[4/5] object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Dark overlay with subtle hover effect */}
                      <div
                          className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity duration-300"></div>

                      {/* Pattern overlay with explicit background for contrast */}
                      <div
                          className="absolute inset-0 flex items-center justify-center pattern-overlay bg-secondary bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-primary text-lg font-bold">
                          {collection.title}
                        </h3>
                      </div>
                    </Link>
                  </div>
              ))}
            </div>
          </div>
        </section>
      </main>
  );
}
