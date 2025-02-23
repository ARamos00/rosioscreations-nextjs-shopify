"use client";

import React from "react";
import ServiceCalendar from "./ServiceCalendar";
import EventRentalCalendar from "./EventRentalCalendar";
import { ExtendedProduct } from "@/lib/shopify/extendedTypes";

interface BookingCalendarProps {
    product: ExtendedProduct;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ product }) => {
    // Determine bookable status from the metafield value.
    const bookableField = product.bookableMetafield;
    const rawBookableValue = bookableField?.value;
    const isBookable =
        typeof rawBookableValue === "string" &&
        rawBookableValue.toLowerCase() === "true";

    if (!isBookable) {
        return <div>This product is not bookable.</div>;
    }

    // Get the event or service choice value and normalize for comparison.
    const eventOrServiceField = product.eventOrServiceChoice;
    const bookingType = eventOrServiceField?.value.toLowerCase() || "";

    if (bookingType.includes("service")) {
        return <ServiceCalendar product={product} />;
    } else if (bookingType.includes("event") || bookingType.includes("rental")) {
        return <EventRentalCalendar product={product} />;
    } else {
        return (
            <div>
                No booking type defined. Please set the{" "}
                <code>eventOrServiceChoice</code> metafield to "Service" or "Event Rental".
            </div>
        );
    }
};

export default BookingCalendar;
