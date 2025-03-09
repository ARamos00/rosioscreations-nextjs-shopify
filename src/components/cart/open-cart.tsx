import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

// OpenCart component renders a shopping cart icon with an optional quantity badge.
export default function OpenCart({
                                     className,
                                     quantity,
                                 }: {
    className?: string;
    quantity?: number;
}) {
    return (
        <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-[#D8D8D8] text-gray-800 transition-colors dark:border-neutral-700 dark:text-white">
            <ShoppingCartIcon
                className={clsx("h-4 transition-all ease-in-out hover:scale-110", className)}
            />
            {/* If a quantity is provided, display it as a badge */}
            {quantity ? (
                <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-[#EFAA9F] text-[11px] font-medium text-white">
                    {quantity}
                </div>
            ) : null}
        </div>
    );
}
