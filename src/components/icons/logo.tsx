import Image from "next/image";
import React from "react";

// LogoIcon component renders the logo image with preset styling.
export default function LogoIcon(props: React.ComponentProps<"img">) {
    // Destructure to remove width and height to prevent conflicts with the 'fill' property.
    const { width, height, ...rest } = props;
    return (
        <div className="flex items-center">
            {/* Container with fixed size, rounded border, and shadow */}
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#D8D8D8] shadow-md">
                {/* Next.js Image component with 'fill' layout */}
                <Image
                    src="/logo.png"
                    alt="Rosio's Creations Logo"
                    fill
                    sizes="(max-width: 768px) 48px, 64px"
                    className="object-contain"
                    {...rest}
                />
            </div>
        </div>
    );
}
