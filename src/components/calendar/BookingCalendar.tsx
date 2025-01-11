"use client";

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchBookings } from '@/lib/bookingQueries'; // Import fetchBookings
import { format } from 'date-fns'; // Utility for formatting dates

/**
 * BookingCalendar Component
 * Fetches unavailable dates for a product and allows the user to select a date.
 * @param {string} productId - The unique ID of the product.
 */
export default function BookingCalendar({ productId }: { productId: string }) {
    const [unavailableDates, setUnavailableDates] = useState<string[]>([]); // State for unavailable dates
    const [selectedDate, setSelectedDate] = useState<string | null>(null); // State for the currently selected date

    /**
     * Fetches unavailable dates from the database and updates the calendar state.
     */
    useEffect(() => {
        const fetchUnavailableDates = async () => {
            try {
                // Fetch all bookings using fetchBookings
                const bookings = await fetchBookings();
                console.log('Fetched bookings:', bookings); // Debug: Log fetched bookings

                // Extract numeric product ID from Shopify GID
                const numericProductId = Number(productId.split('/').pop());
                if (isNaN(numericProductId)) {
                    console.error('Invalid product ID:', productId);
                    return;
                }

                // Filter bookings for the current product and format booking dates
                const productBookings = bookings
                    .filter((booking: { product_id: number }) => booking.product_id === numericProductId)
                    .map((booking: { booking_date: string }) => format(new Date(booking.booking_date), 'yyyy-MM-dd'));

                console.log('Unavailable dates:', productBookings); // Debug: Log unavailable dates
                setUnavailableDates(productBookings); // Update state with unavailable dates
            } catch (error) {
                console.error('Error fetching bookings:', error); // Log errors during fetching
            }
        };

        fetchUnavailableDates(); // Fetch bookings when the component mounts or productId changes
    }, [productId]);

    /**
     * Handles the selection of a date on the calendar.
     * @param {Date} date - The selected date.
     */
    const handleDateSelection = (date: Date) => {
        const formattedDate = format(date, 'yyyy-MM-dd'); // Format selected date
        setSelectedDate(formattedDate); // Update the selected date state
        console.log('Selected date:', formattedDate); // Debug: Log the selected date
    };

    /**
     * Determines whether a given date should be disabled on the calendar.
     * @param {Date} date - The date to check.
     * @returns {boolean} - True if the date is unavailable, false otherwise.
     */
    const isDateDisabled = (date: Date) => {
        const formattedDate = date.toISOString().split('T')[0]; // Format date to 'yyyy-MM-dd'
        return unavailableDates.includes(formattedDate); // Check if the date is unavailable
    };

    return (
        <div className="p-4 rounded-lg border bg-white shadow-md dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Select a Booking Date</h2>
            <Calendar
                tileDisabled={({ date }) => isDateDisabled(date)} // Disable unavailable dates
                tileClassName={({ date }) =>
                    selectedDate === format(date, 'yyyy-MM-dd')
                        ? 'bg-blue-500 text-white' // Highlight selected date
                        : isDateDisabled(date)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' // Style for disabled dates
                            : ''
                }
                onClickDay={handleDateSelection} // Handle date selection
                className="react-calendar w-full max-w-md mx-auto border-none"
            />
            <p className="mt-4 text-gray-600 dark:text-gray-300">
                {selectedDate ? `You selected: ${selectedDate}` : 'Please select a date.'}
            </p>
        </div>
    );
}
