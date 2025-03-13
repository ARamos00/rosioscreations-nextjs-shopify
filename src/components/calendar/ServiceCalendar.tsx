"use client";

import React, { useState, useEffect } from "react";
import { fetchBookedDates } from "@/lib/bookingHelpers";
import { ExtendedProduct } from "@/lib/shopify/extendedTypes";
import CalendarView from "@/components/calendar/CalendarView";

interface ServiceCalendarProps {
    product: ExtendedProduct;
}

const ServiceCalendar: React.FC<ServiceCalendarProps> = ({ product }) => {
    const [bookedDates, setBookedDates] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getDates() {
            try {
                const dates = await fetchBookedDates("service");
                setBookedDates(dates);
            } catch (err: any) {
                console.error("Error fetching booked dates for service:", err);
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        }
        getDates();
    }, []);

    return (
        <div className="p-4 bg-primary rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-secondary">
                Service Calendar
            </h2>
            {loading ? (
                <div className="text-center text-secondary">
                    Loading booked dates...
                </div>
            ) : error ? (
                <div className="text-center p-4 text-red-500">Error: {error}</div>
            ) : (
                <CalendarView bookedDates={bookedDates} />
            )}
        </div>
    );
};

export default ServiceCalendar;
