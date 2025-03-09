import { ImageResponse } from "next/og"; // Import ImageResponse to create dynamic Open Graph images
import LogoIcon from "./icons/logo"; // Import the LogoIcon component for displaying the logo

// Define the props for the OG image. The title is optional.
export type Props = {
    title?: string;
};

// The OpengraphImage function generates an Open Graph image.
// It accepts optional props and returns a Promise resolving to an ImageResponse.
export default async function OpengraphImage(
    props?: Props
): Promise<ImageResponse> {
    // Merge the default title from the environment variable with any provided props.
    const { title } = {
        ...{
            title: process.env.SITE_NAME,
        },
        ...props,
    };

    // Return a new ImageResponse with the rendered JSX element and configuration options.
    return new ImageResponse(
        (
            // Container div with twin.macro (Tailwind) styles for layout and background.
            <div tw="flex h-full w-full flex-col items-center justify-center bg-black">
                {/* Logo container with fixed dimensions, border, and rounded corners */}
                <div tw="flex flex-none items-center justify-center border border-neutral-700 h-[160px] w-[160px] rounded-3xl">
                    {/* Render the logo icon.
              NOTE: Do not pass width, height, or fill props here because LogoIcon is designed
              to use its own hard-coded values to avoid conflicts. */}
                    <LogoIcon />
                </div>
                {/* Title text displayed below the logo */}
                <p tw="mt-12 text-6xl font-bold text-white">{title}</p>
            </div>
        ),
        {
            width: 1200, // Specify the width of the generated image
            height: 630, // Specify the height of the generated image
            fonts: [
                {
                    name: "Inter", // Use the Inter font in the generated image
                    // Fetch the Inter Bold font and convert the response to an ArrayBuffer
                    data: await fetch(
                        new URL("../fonts/Inter-Bold.ttf", import.meta.url)
                    ).then((res) => res.arrayBuffer()),
                    style: "normal",
                    weight: 700,
                },
            ],
        }
    );
}
