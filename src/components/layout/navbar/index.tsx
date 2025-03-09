import { getMenu } from "@/lib/shopify";
import { Menu } from "@/lib/shopify/types";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import Search from "./search";
import LogoSquare from "@/components/logo-square";
import CartModal from "@/components/cart/modal";

// Navbar component fetches the menu and renders the navigation bar
export async function Navbar() {
  // Retrieve the menu data using a specific menu handle
  const menu = await getMenu("next-js-frontend-menu");
  return (
      // Navigation container with sticky positioning and backdrop blur
      <nav className="flex items-center justify-between p-4 lg:px-6 sticky top-0 backdrop-blur-sm z-[999]">
        {/* Mobile menu: visible on small screens */}
        <div className="block flex-none md:hidden">
          <MobileMenu menu={menu} />
        </div>
        <div className="flex w-full items-center">
          {/* Left section: logo and desktop menu */}
          <div className="flex w-full md:w-1/3">
            <Link
                href={"/"}
                prefetch={true}
                className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
            >
              <LogoSquare />
              {/* Optionally display the site name (commented out) */}
              {/* <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {process.env.SITE_NAME}
            </div> */}
            </Link>
            {menu.length > 0 ? (
                // Desktop menu: visible on medium screens and above
                <ul className="hidden gap-6 text-sm md:flex md:items-center">
                  {menu.map((item: Menu) => (
                      <li key={item.title}>
                        <Link
                            href={item.path}
                            prefetch={true}
                            className="text-gray-700 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                        >
                          {item.title}
                        </Link>
                      </li>
                  ))}
                </ul>
            ) : null}
          </div>
          {/* Center section: search bar (visible on medium screens and above) */}
          <div className="hidden justify-center md:flex md:w-1/3">
            <Search />
          </div>
          {/* Right section: cart modal */}
          <div className="flex justify-end md:w-1/3">
            <CartModal />
          </div>
        </div>
      </nav>
  );
}
