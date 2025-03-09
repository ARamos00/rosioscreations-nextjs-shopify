import Image, { ImageProps } from "next/image";
import React from "react";

// LogoIcon component renders the logo image with preset styling.
// It omits width, height, src, alt, and fill from props so that these values remain fixed.
export default function LogoIcon(
    props: Omit<ImageProps, "src" | "alt" | "fill" | "width" | "height">
) {
    return (
        <div className="flex items-center">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#D8D8D8] shadow-md">
                {/* The Next.js Image component uses hard-coded values for src, alt, and fill.
            Any additional props (without conflicts) are spread in. */}
                <Image
                    src="/logo.png"
                    alt="Rosio's Creations Logo"
                    fill
                    sizes="(max-width: 768px) 48px, 64px"
                    className="object-contain"
                    {...props}
                />
            </div>
        </div>
    );
}
