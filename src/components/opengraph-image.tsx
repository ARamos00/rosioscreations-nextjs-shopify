import { ImageResponse } from "next/og"; // Import Next.js OG image response creator
import LogoIcon from "./icons/logo"; // Import the LogoIcon component to display the logo

// Define the props type for the Open Graph image; the title is optional.
export type Props = {
    title?: string;
};

// This function generates a dynamic Open Graph image.
// It uses JSX with Twin.Macro's "tw" attributes for styling.
// Note: Ensure your project is properly configured to handle "tw" attributes.
export default async function OpengraphImage(
    props?: Props
): Promise<ImageResponse> {
    // Merge the default title (from environment variable) with any props passed in.
    const { title } = {
        ...{
            title: process.env.SITE_NAME,
        },
        ...props,
    };

    // Return a new ImageResponse which renders a custom OG image.
    return new ImageResponse(
        (
            // Container div styled with Twin.Macro "tw" attribute.
            <div tw="flex h-full w-full flex-col items-center justify-center bg-black">
                {/* Logo container with fixed dimensions, border, and rounded corners */}
                <div tw="flex flex-none items-center justify-center border border-neutral-700 h-[160px] w-[160px] rounded-3xl">
                    {/* Render the logo icon with specified width, height, and fill color */}
                    <LogoIcon width="64" height="58" fill="white" />
                </div>
                {/* Render the title text below the logo */}
                <p tw="mt-12 text-6xl font-bold text-white">{title}</p>
            </div>
        ),
        {
            width: 1200, // Width of the generated OG image
            height: 630, // Height of the generated OG image
            fonts: [
                {
                    name: "Inter", // Custom font name to be used in the image
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
