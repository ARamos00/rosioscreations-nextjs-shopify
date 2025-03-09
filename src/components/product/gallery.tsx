"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { GridTileImage } from "../grid/tile";
import { useProduct, useUpdateURL } from "./product-context";

// Gallery component displays a product image gallery with navigation controls.
export default function Gallery({
                                  images,
                                }: {
  images: { src: string; altText: string }[];
}) {
  // Get the current product state and function to update the image index.
  const { state, updateImage } = useProduct();
  // Get the function to update the URL based on new state.
  const updateURL = useUpdateURL();
  // Parse the current image index from state; default to 0 if not set.
  const imageIndex = state.image ? parseInt(state.image) : 0;

  // Determine the next image index, wrapping to 0 if at the end.
  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  // Determine the previous image index, wrapping to the last image if at the start.
  const previousImageIndex =
      imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  // CSS classes for the navigation buttons.
  const buttonClassName =
      "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center";

  return (
      <form>
        {/* Main image container */}
        <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
          {images[imageIndex] && (
              <Image
                  className="h-full w-full object-contain"
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  src={images[imageIndex]?.src as string}
                  alt={images[imageIndex]?.altText as string}
                  priority={true}
              />
          )}

          {/* Render navigation controls if there is more than one image */}
          {images.length > 1 ? (
              <div className="absolute bottom-[15%] flex w-full justify-center">
                <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
                  {/* Button for previous image */}
                  <button
                      formAction={() => {
                        const newState = updateImage(previousImageIndex.toString());
                        updateURL(newState);
                      }}
                      aria-label="Previous product image"
                      className={buttonClassName}
                  >
                    <ArrowLeftIcon className="h-5" />
                  </button>
                  {/* Separator */}
                  <div className="mx-1 h-6 w-px bg-neutral-500"></div>
                  {/* Button for next image */}
                  <button
                      formAction={() => {
                        const newState = updateImage(nextImageIndex.toString());
                        updateURL(newState);
                      }}
                      aria-label="Next product image"
                      className={buttonClassName}
                  >
                    <ArrowRightIcon className="h-5" />
                  </button>
                </div>
              </div>
          ) : null}
        </div>
        {/* Thumbnail navigation if there is more than one image */}
        {images.length > 1 ? (
            <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
              {images.map((image, index) => {
                const isActive = index === imageIndex; // Determine if this thumbnail is active.
                return (
                    <li key={image.src} className="h-20 w-20">
                      <button
                          formAction={() => {
                            const newState = updateImage(index.toString());
                            updateURL(newState);
                          }}
                          aria-label="Select product image"
                          className="h-full w-full"
                      >
                        <GridTileImage
                            alt={image.altText}
                            src={image.src}
                            active={isActive}
                            width={80}
                            height={80}
                        />
                      </button>
                    </li>
                );
              })}
            </ul>
        ) : null}
      </form>
  );
}
