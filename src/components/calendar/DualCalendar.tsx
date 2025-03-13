"use client";

import React, { useState, useEffect } from "react";
import CalendarView from "./CalendarView";
import { fetchBookedDates } from "@/lib/bookingHelpers";

// DualCalendar component displays two calendars: one for services and one for event rentals.
const DualCalendar: React.FC = () => {
    // State to hold booked dates for the service calendar.
    const [serviceBookedDates, setServiceBookedDates] = useState<string[]>([]);
    // State to hold booked dates for the event rental calendar.
    const [eventBookedDates, setEventBookedDates] = useState<string[]>([]);
    // State to manage loading status while fetching data.
    const [loading, setLoading] = useState<boolean>(true);
    // State to capture any error that occurs during data fetching.
    const [error, setError] = useState<string | null>(null);

    // useEffect hook to fetch booked dates when the component mounts.
    useEffect(() => {
        async function getDates() {
            try {
                // Fetch booked dates for both service and event calendars concurrently.
                const [serviceDates, eventDates] = await Promise.all([
                    fetchBookedDates("service"),
                    fetchBookedDates("event"),
                ]);
                // Update state with fetched dates.
                setServiceBookedDates(serviceDates);
                setEventBookedDates(eventDates);
            } catch (err: any) {
                // Log the error and update the error state.
                console.error("Error fetching booked dates:", err);
                setError(err.message || "Unknown error");
            } finally {
                // Mark loading as complete.
                setLoading(false);
            }
        }
        getDates();
    }, []);

    // Render a loading message if data is still being fetched.
    if (loading) {
        return <div className="text-center p-4 text-secondary">Loading calendars...</div>;
    }

    // Render an error message if an error occurred during data fetching.
    if (error) {
        return <div className="text-center p-4 text-red-500">Error: {error}</div>;
    }

    // Render the dual calendars side by side (or stacked on small screens).
    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Service Calendar Section */}
            <div className="flex-1 bg-primary p-6 rounded-lg shadow-lg flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4 text-secondary">Service Calendar</h2>
                <div className="w-full flex justify-center">
                    <CalendarView bookedDates={serviceBookedDates} interactive={false} />
                </div>
            </div>
            {/* Event Rental Calendar Section */}
            <div className="flex-1 bg-primary p-6 rounded-lg shadow-lg flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4 text-secondary">Event Rental Calendar</h2>
                <div className="w-full flex justify-center">
                    <CalendarView bookedDates={eventBookedDates} interactive={false} />
                </div>
            </div>
        </div>
    );
};

export default DualCalendar;
