"use client";
import React from "react";
import ServiceCalendar from "./ServiceCalendar";
import EventRentalCalendar from "./EventRentalCalendar";
import { ExtendedProduct } from "@/lib/shopify/extendedTypes";

// Define the props interface for BookingCalendar component
interface BookingCalendarProps {
    product: ExtendedProduct;
}

// Functional component for displaying a booking calendar based on product details
const BookingCalendar: React.FC<BookingCalendarProps> = ({ product }) => {
    // Extract the bookable metafield from the product
    const bookableField = product.bookableMetafield;
    const rawBookableValue = bookableField?.value;
    // Determine if the product is bookable by checking if the metafield value is a string "true" (case-insensitive)
    const isBookable =
        typeof rawBookableValue === "string" &&
        rawBookableValue.toLowerCase() === "true";

    // If the product is not bookable, return a message indicating this
    if (!isBookable) {
        return (
            <div className="text-center p-4 bg-[#F6EEE8] rounded-lg shadow">
                This product is not bookable.
            </div>
        );
    }

    // Extract the event or service choice metafield and normalize the value for comparison
    const eventOrServiceField = product.eventOrServiceChoice;
    const bookingType = eventOrServiceField?.value.toLowerCase() || "";

    // Initialize the calendar component variable to conditionally render the appropriate calendar
    let calendarComponent;
    if (bookingType.includes("service")) {
        // Render ServiceCalendar if the booking type indicates a service
        calendarComponent = <ServiceCalendar product={product} />;
    } else if (bookingType.includes("event") || bookingType.includes("rental")) {
        // Render EventRentalCalendar if the booking type indicates an event or rental
        calendarComponent = <EventRentalCalendar product={product} />;
    } else {
        // Render a default message if no valid booking type is defined
        calendarComponent = (
            <div>
                No booking type defined. Please set the <code>eventOrServiceChoice</code>{" "}
                metafield to &quot;Service&quot; or &quot;Event Rental&quot;.
            </div>
        );
    }

    // Return the booking calendar container with the appropriate calendar component inside
    return (
        <div className="booking-calendar bg-[#F8E1D9] p-6 rounded-lg shadow-lg">
            {calendarComponent}
        </div>
    );
};

export default BookingCalendar;
