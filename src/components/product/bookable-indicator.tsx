"use client";

import React, { useEffect } from "react"; // Import React and useEffect hook
import { ExtendedProduct } from "@/lib/shopify/extendedTypes"; // Import ExtendedProduct type

interface BookableIndicatorProps {
    product: ExtendedProduct; // Prop type for the product
}

const BookableIndicator: React.FC<BookableIndicatorProps> = ({ product }) => {
    // Log metafield values for debugging when the product changes
    useEffect(() => {
        console.log("Debug - Bookable Metafield:", product.bookableMetafield);
        console.log("Debug - Event or Service Choice Metafield:", product.eventOrServiceChoice);
    }, [product]);

    // Extract and determine the bookable status from the product metafield
    const bookableField = product.bookableMetafield;
    const rawBookableValue = bookableField?.value;
    const isBookable =
        typeof rawBookableValue === "string" && rawBookableValue.toLowerCase() === "true";

    // Extract the event or service choice value, defaulting if not provided
    const eventOrServiceField = product.eventOrServiceChoice;
    const eventOrServiceValue = eventOrServiceField?.value || "Not specified";

    // Define inline styles for the indicator circle based on bookable status
    const indicatorStyle: React.CSSProperties = {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        backgroundColor: isBookable ? "green" : "red",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        margin: "1rem",
    };

    return (
        <div>
            {/* Display the bookable status inside a styled circle */}
            <div style={indicatorStyle}>
                {isBookable ? "Bookable" : "Not Bookable"}
            </div>
            {/* Display the event or service choice value */}
            <div>
                <strong>Event/Service Choice:</strong> {eventOrServiceValue}
            </div>
            {/* Debug information rendered as formatted JSON */}
            <pre>
        {JSON.stringify({ rawBookableValue, isBookable, eventOrServiceValue }, null, 2)}
      </pre>
        </div>
    );
};

export default BookableIndicator;
