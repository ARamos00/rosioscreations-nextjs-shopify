import clsx from "clsx";
import Image from "next/image";
import Label from "../label";

// GridTileImage renders an image tile with optional interactive effects and an optional label overlay.
export function GridTileImage({
                                  isInteractive = true,
                                  active,
                                  label,
                                  ...props
                              }: {
    isInteractive?: boolean;
    active?: boolean;
    label?: {
        title: string;
        amount: string;
        currencyCode: string;
        position?: "bottom" | "center";
    };
} & React.ComponentProps<typeof Image>) {
    return (
        <div
            // Apply base styles, border styles based on active state, and set relative positioning if a label is provided.
            className={clsx(
                "group flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-[#F8E1D9] dark:bg-neutral-900",
                {
                    relative: label,
                    "border-2 border-[#EFAA9F]": active,
                    "border border-[#D8D8D8] hover:border-[#EFAA9F]": !active,
                }
            )}
        >
            {props.src ? (
                // Render the image with interactive scale effect if enabled.
                <Image
                    className={clsx("relative h-full w-full object-contain", {
                        "transition duration-300 ease-in-out group-hover:scale-105": isInteractive,
                    })}
                    {...props}
                />
            ) : null}
            {label ? (
                // Render the label overlay if provided.
                <Label
                    title={label.title}
                    amount={label.amount}
                    currencyCode={label.currencyCode}
                    position={label.position}
                />
            ) : null}
        </div>
    );
}
