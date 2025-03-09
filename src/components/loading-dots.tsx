import clsx from "clsx"; // Utility to conditionally join CSS classes

// Base CSS classes for the individual dot elements
const dots = "mx-[1px] inline-block h-1 w-1 animate-blink rounded-md";

// LoadingDots component renders three animated dots to indicate a loading state.
const LoadingDots = ({ className }: { className: string }) => {
    return (
        // Container that centers the dots horizontally
        <span className="mx-2 inline-flex items-center">
      {/* First dot without delay */}
            <span className={clsx(dots, className)} />
            {/* Second dot with a 200ms animation delay */}
            <span className={clsx(dots, "animation-delay-[200ms]", className)} />
            {/* Third dot with a 400ms animation delay */}
            <span className={clsx(dots, "animation-delay-[400ms]", className)} />
    </span>
    );
};

export default LoadingDots;
