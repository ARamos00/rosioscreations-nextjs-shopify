// components/event-decor/EventDecorCalendar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface EventDecorBooking {
    id: number;
    booking_date: string; // Format: YYYY-MM-DD
    booking_type: string;
    customer_id: number;
}

const EventDecorCalendar: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [booking, setBooking] = useState<EventDecorBooking | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [bookedDates, setBookedDates] = useState<string[]>([]);

    // Helper to format date as YYYY-MM-DD
    const formatDate = (date: Date): string => date.toISOString().split("T")[0];

    // Fetch booking for the selected date (for display purposes)
    useEffect(() => {
        const fetchBooking = async () => {
            setLoading(true);
            console.log("[fetchBooking] Fetching booking for:", formatDate(selectedDate));
            try {
                const dateStr = formatDate(selectedDate);
                const response = await fetch(`/api/event-decor?date=${dateStr}`);
                console.log("[fetchBooking] Response status:", response.status);
                if (!response.ok) {
                    throw new Error("Failed to fetch booking");
                }
                const data = await response.json();
                console.log("[fetchBooking] Data:", data);
                if (data.bookings && data.bookings.length > 0) {
                    console.log("[fetchBooking] Booking exists for date:", dateStr);
                    setBooking(data.bookings[0]);
                } else {
                    console.log("[fetchBooking] No booking for date:", dateStr);
                    setBooking(null);
                }
            } catch (error) {
                console.error("[fetchBooking] Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [selectedDate]);

    // Fetch all booked dates from the database
    useEffect(() => {
        const fetchAllBookings = async () => {
            console.log("[fetchAllBookings] Fetching all event decor bookings");
            try {
                const response = await fetch("/api/event-decor");
                console.log("[fetchAllBookings] Response status:", response.status);
                if (!response.ok) {
                    throw new Error("Failed to fetch all bookings");
                }
                const data = await response.json();
                console.log("[fetchAllBookings] Data:", data);
                if (data.bookings) {
                    const dates = data.bookings.map((b: EventDecorBooking) => b.booking_date);
                    console.log("[fetchAllBookings] Booked dates:", dates);
                    setBookedDates(dates);
                }
            } catch (error) {
                console.error("[fetchAllBookings] Error:", error);
            }
        };

        fetchAllBookings();
    }, []);

    // Create a new booking if one doesn't exist
    const handleBooking = async () => {
        console.log("[handleBooking] Creating booking for:", formatDate(selectedDate));
        try {
            const dateStr = formatDate(selectedDate);
            const customer_id = 1; // Replace with real auth system ID
            const response = await fetch(`/api/event-decor`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ booking_date: dateStr, customer_id }),
            });
            console.log("[handleBooking] Response status:", response.status);
            const data = await response.json();
            console.log("[handleBooking] Data:", data);
            if (response.ok) {
                alert("Booking created successfully!");
                setBooking(data.booking);
                // Add new booking date to bookedDates state
                setBookedDates((prev) => [...prev, dateStr]);
            } else {
                alert(data.message || "Booking creation failed.");
            }
        } catch (error) {
            console.error("[handleBooking] Error:", error);
        }
    };

    return (
        <div>
            <h2>Event Decor Booking Calendar</h2>
            <Calendar
                onChange={(date) => {
                    console.log("[Calendar] Date changed to:", date);
                    setSelectedDate(date as Date);
                }}
                value={selectedDate}
                tileClassName={({ date, view }) => {
                    if (view === "month") {
                        const dateStr = formatDate(date);
                        if (bookedDates.includes(dateStr)) {
                            return "booked-date";
                        }
                    }
                    return "";
                }}
                tileDisabled={({ date, view }) => {
                    if (view === "month") {
                        const dateStr = formatDate(date);
                        return bookedDates.includes(dateStr);
                    }
                    return false;
                }}
            />
            <div style={{ marginTop: "1rem" }}>
                <p>
                    Selected Date: {selectedDate.toDateString()} ({formatDate(selectedDate)})
                </p>
                {loading ? (
                    <p>Loading booking...</p>
                ) : booking ? (
                    <p>This date is booked (Customer ID: {booking.customer_id})</p>
                ) : (
                    <button onClick={handleBooking}>Book Event Decor for this Date</button>
                )}
            </div>
            <style jsx>{`
        .booked-date {
          background-color: #ccc !important;
          color: #666 !important;
          pointer-events: none;
        }
      `}</style>
        </div>
    );
};

export default EventDecorCalendar;
