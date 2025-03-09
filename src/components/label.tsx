import clsx from "clsx"; // Utility to conditionally join CSS class names
import Price from "./price"; // Import Price component to display formatted price

// Label component renders a label with a title and a price badge.
// The position prop controls the spacing and alignment of the label.
export default function Label({
                                  title,
                                  amount,
                                  currencyCode,
                                  position = "bottom",
                              }: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
}) {
    return (
        // Outer container for the label positioned absolutely at the bottom left.
        // Conditional classes adjust padding based on the 'position' prop.
        <div
            className={clsx(
                "absolute bottom-0 left-0 flex w-full px-4 pb-4 srccontainer/label",
                {
                    "lg:px-20 lg:pb-[35%]": position === "center",
                }
            )}
        >
            {/* Inner container with a semi-transparent background and rounded border */}
            <div className="flex items-center rounded-full border border-[#D8D8D8] bg-white/70 p-1 text-xs font-semibold text-gray-800 backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
                {/* Title displayed in an h3 element with styling */}
                <h3 className="mr-4 line-clamp-2 flex-grow pl-2 leading-none tracking-tight">
                    {title}
                </h3>
                {/* Price badge with its own styling */}
                <Price
                    className="flex-none rounded-full bg-[#EFAA9F] p-2 text-white"
                    amount={amount}
                    currencyCode={currencyCode}
                    currencyCodeClassName="hidden src[275px]/label:inline"
                />
            </div>
        </div>
    );
}
