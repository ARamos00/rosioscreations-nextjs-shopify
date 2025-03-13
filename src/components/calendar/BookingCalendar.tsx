"use client";
import React from "react";
import ServiceCalendar from "./ServiceCalendar";
import EventRentalCalendar from "./EventRentalCalendar";
import { ExtendedProduct } from "@/lib/shopify/extendedTypes";

interface BookingCalendarProps {
    product: ExtendedProduct;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ product }) => {
    const bookableField = product.bookableMetafield;
    const rawBookableValue = bookableField?.value;
    const isBookable =
        typeof rawBookableValue === "string" &&
        rawBookableValue.toLowerCase() === "true";

    if (!isBookable) {
        return (
            <div className="text-center p-4 bg-secondary rounded-lg shadow text-primary">
                This product is not bookable.
            </div>
        );
    }

    const eventOrServiceField = product.eventOrServiceChoice;
    const bookingType = eventOrServiceField?.value.toLowerCase() || "";

    let calendarComponent;
    if (bookingType.includes("service")) {
        calendarComponent = <ServiceCalendar product={product} />;
    } else if (bookingType.includes("event") || bookingType.includes("rental")) {
        calendarComponent = <EventRentalCalendar product={product} />;
    } else {
        calendarComponent = (
            <div className="text-center text-primary">
                No booking type defined. Please set the <code>eventOrServiceChoice</code>{" "}
                metafield to "Service" or "Event Rental".
            </div>
        );
    }

    return (
        <div className="booking-calendar bg-secondary p-6 rounded-lg shadow-lg">
            {calendarComponent}
        </div>
    );
};

export default BookingCalendar;
