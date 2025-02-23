"use client";
import React, { useEffect } from "react";
import { ExtendedProduct } from "@/lib/shopify/extendedTypes";

interface BookableIndicatorProps {
    product: ExtendedProduct;
}

const BookableIndicator: React.FC<BookableIndicatorProps> = ({ product }) => {
    useEffect(() => {
        console.log("Debug - Bookable Metafield:", product.bookableMetafield);
        console.log("Debug - Event or Service Choice Metafield:", product.eventOrServiceChoice);
    }, [product]);

    // Determine bookable status from the metafield value
    const bookableField = product.bookableMetafield;
    const rawBookableValue = bookableField?.value;
    const isBookable =
        typeof rawBookableValue === "string" && rawBookableValue.toLowerCase() === "true";

    // Get Event or Service Choice value
    const eventOrServiceField = product.eventOrServiceChoice;
    const eventOrServiceValue = eventOrServiceField?.value || "Not specified";

    // Styling for the bookable indicator circle
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
            <div style={indicatorStyle}>
                {isBookable ? "Bookable" : "Not Bookable"}
            </div>
            <div>
                <strong>Event/Service Choice:</strong> {eventOrServiceValue}
            </div>
            {/* Debug Information */}
            <pre>
        {JSON.stringify({ rawBookableValue, isBookable, eventOrServiceValue }, null, 2)}
      </pre>
        </div>
    );
};

export default BookableIndicator;
