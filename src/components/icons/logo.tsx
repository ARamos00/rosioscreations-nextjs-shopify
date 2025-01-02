import React from "react";

// LogoIcon component renders a placeholder SVG logo
export default function LogoIcon(props: React.ComponentProps<"svg">) {
  return (
      <svg
          xmlns="http://www.w3.org/2000/svg" // Defines the SVG namespace
          width="100%" // Ensures the SVG scales to fit its container
          height="100%" // Optional: Can be added for consistency
          viewBox="0 0 160 160" // Sets the coordinate system for scaling
          {...props} // Spreads additional props for reusability (e.g., className, style)
      >
        {/* Background rectangle with a neutral color */}
        <rect
            width="160" // Matches the viewBox dimensions
            height="160" // Matches the viewBox dimensions
            fill="#8B7E74" // Neutral earthy color for the placeholder background
        />

        {/* Placeholder text centered within the SVG */}
        <text
            x="50%" // Centers the text horizontally
            y="50%" // Centers the text vertically
            fill="#FFFFFF" // White text for high contrast
            fontSize="16" // Font size for readability
            fontFamily="Arial, sans-serif" // Web-safe fonts for consistency
            textAnchor="middle" // Horizontal text alignment
            alignmentBaseline="middle" // Vertical text alignment
        >
          Logo Placeholder
        </text>
      </svg>
  );
}
