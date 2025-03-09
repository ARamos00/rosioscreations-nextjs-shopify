import Image, { ImageProps } from "next/image";
import React from "react";

// LogoIcon component renders a logo image with preset styling.
// To avoid conflicts with hard-coded values, we omit "src", "alt", "fill", "width", and "height"
// from the props that can be passed in. This prevents these properties from being overwritten.
export default function LogoIcon(
    props: Omit<ImageProps, "src" | "alt" | "fill" | "width" | "height">
) {
    return (
        <div className="flex items-center">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#D8D8D8] shadow-md">
                <Image
                    src="/logo.png" // Hard-coded logo image source
                    alt="Rosio's Creations Logo" // Hard-coded alt text for accessibility
                    fill // Boolean prop to make the image fill its parent container
                    sizes="(max-width: 768px) 48px, 64px" // Responsive sizing for the image
                    className="object-contain"
                    {...props} // Spread any additional props (without the conflicting ones)
                />
            </div>
        </div>
    );
}
