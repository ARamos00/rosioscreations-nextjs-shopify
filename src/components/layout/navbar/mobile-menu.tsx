"use client";

import { Menu } from "@/lib/shopify/types";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Fragment, useState } from "react";
import Search from "./search";

// MobileMenu component renders a mobile navigation menu with a slide-in panel.
export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const [isOpen, setIsOpen] = useState(false);

  // Handlers to open and close the mobile menu.
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  return (
      <>
        {/* Button to open the mobile menu */}
        <button
            onClick={openMobileMenu}
            aria-label="Open mobile menu"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-[#D8D8D8] text-gray-800 transition-colors md:hidden dark:border-neutral-700 dark:text-white"
        >
          <Bars3Icon className="h-4" />
        </button>

        {/* Transition for the mobile menu */}
        <Transition show={isOpen}>
          <Dialog onClose={closeMobileMenu} className="relative z-50">
            {/* Backdrop transition */}
            <Transition.Child
                as={Fragment}
                enter="transition-all ease-in-out duration-300"
                enterFrom="opacity-0 backdrop-blur-none"
                enterTo="opacity-100 backdrop-blur-[.5px]"
                leave="transition-all ease-in-out duration-200"
                leaveFrom="opacity-100 backdrop-blur-[.5px]"
                leaveTo="opacity-0 backdrop-blur-none"
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            </Transition.Child>

            {/* Slide-in panel transition for the mobile menu */}
            <Transition.Child
                as={Fragment}
                enter="transition-all ease-in-out duration-300"
                enterFrom="translate-x-[-100%]"
                enterTo="translate-x-0"
                leave="transition-all ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-[-100%]"
            >
              <Dialog.Panel className="fixed inset-0 flex h-full w-full flex-col bg-[#F6EEE8] p-6 text-gray-800 backdrop-blur-xl dark:bg-neutral-900/90 dark:text-white">
                <div className="p-4">
                  {/* Button to close the mobile menu */}
                  <button
                      className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-[#D8D8D8] text-gray-800 transition-colors dark:border-neutral-700 dark:text-white"
                      onClick={closeMobileMenu}
                      aria-label="Close mobile menu"
                  >
                    <XMarkIcon className="h-6" />
                  </button>
                  <div className="mb-4 w-full">
                    <Search />
                  </div>
                  {/* Render the menu links if the menu array has items */}
                  {menu.length > 0 ? (
                      <ul className="flex w-full flex-col">
                        {menu.map((item: Menu) => (
                            <li
                                key={item.title}
                                className="py-2 text-xl text-gray-800 transition-colors hover:text-[#EFAA9F] dark:text-white"
                            >
                              <Link
                                  href={item.path}
                                  prefetch={true}
                                  onClick={closeMobileMenu}
                              >
                                {item.title}
                              </Link>
                            </li>
                        ))}
                      </ul>
                  ) : null}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </Dialog>
        </Transition>
      </>
  );
}
