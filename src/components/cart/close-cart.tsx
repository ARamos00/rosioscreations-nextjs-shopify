// Import the XMarkIcon component from Heroicons and the clsx utility for conditional class names.
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

// CloseCart component renders a styled container with a close icon.
// Accepts an optional "className" prop for additional styling.
export default function CloseCart({ className }: { className?: string }) {
    return (
        // Container div with flex layout, sizing, and styling for light and dark themes.
        <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
            {/* Render the close icon with a hover effect using clsx to merge class names */}
            <XMarkIcon
                className={clsx("h-6 transition-all ease-in-out hover:scale-110", className)}
            />
        </div>
    );
}
