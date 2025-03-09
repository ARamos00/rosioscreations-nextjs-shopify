import clsx from "clsx"; // Utility for conditionally joining class names
import LogoIcon from "./icons/logo"; // Import the LogoIcon component

// LogoSquare component renders a square container with the logo icon inside.
// It accepts an optional "size" prop to adjust dimensions.
export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
    return (
        <div
            // Base styles: flex container with center alignment, border, and white background.
            // Conditional styles: use larger dimensions if size is not provided,
            // and smaller dimensions if size is "sm".
            className={clsx(
                "flex flex-none items-center justify-center border border-neutral-200 bg-white",
                {
                    "h-[40px] w-[40px] rounded-xl": !size,        // Default size and rounded corners
                    "h-[30px] w-[30px] rounded-lg": size === "sm",   // Smaller size and less rounded for "sm"
                }
            )}
        >
            <LogoIcon
                // Set the logo icon size based on the "size" prop.
                className={clsx({
                    "h-[16px] w-[16px]": !size,       // Default logo size
                    "h-[10px] w-[10px]": size === "sm", // Smaller logo size for "sm"
                })}
            />
        </div>
    );
}
