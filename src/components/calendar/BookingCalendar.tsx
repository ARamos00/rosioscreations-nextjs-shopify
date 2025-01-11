"use client";

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchBookings } from '@/lib/bookingQueries'; // Function to fetch bookings from the database
import { format } from 'date-fns'; // Utility for formatting dates

/**
 * BookingCalendar Component
 * Displays a calendar where users can view unavailable dates for a specific product.
 * @param {string} productId - The unique ID of the product for which bookings are displayed.
 */
export default function BookingCalendar({ productId }: { productId: string }) {
    // State to hold an array of unavailable dates in 'yyyy-MM-dd' format
    const [unavailableDates, setUnavailableDates] = useState<string[]>([]);

    // Effect to fetch bookings whenever the productId changes
    useEffect(() => {
        console.log('Raw productId:', productId); // Debug: Log the full product ID received as a prop

        // Extract the numeric product ID from the Shopify GID format (gid://shopify/Product/...)
        const numericProductId = Number(productId.split('/').pop());
        console.log('Extracted numericProductId:', numericProductId); // Debug: Log the numeric product ID

        // Fetch and process bookings for the current product
        const loadBookings = async () => {
            try {
                const bookings = await fetchBookings(); // Fetch all bookings from the database
                console.log('Fetched bookings:', bookings); // Debug: Log all fetched bookings

                // Filter and format bookings related to this product
                const productBookings = bookings.map((booking) => {
                    const formattedDate = format(new Date(booking.booking_date), 'yyyy-MM-dd');
                    console.log(`Adding date to unavailableDates: ${formattedDate}`); // Debug: Log each unavailable date
                    return formattedDate;
                });

                // Update state with formatted unavailable dates
                console.log('Final Unavailable dates:', productBookings); // Debug: Log final list of unavailable dates
                setUnavailableDates(productBookings);
            } catch (error) {
                console.error('Error loading bookings:', error); // Log any errors during the fetch process
            }
        };

        loadBookings(); // Trigger booking load on component mount
    }, [productId]); // Re-run this effect when productId changes

    /**
     * Determines if a given date should be disabled on the calendar.
     * @param {Date} date - The date to check.
     * @returns {boolean} - True if the date is unavailable, false otherwise.
     */
    const isDateDisabled = (date: Date) => {
        const formattedDate = date.toISOString().split('T')[0]; // Format the date to 'yyyy-MM-dd'
        return unavailableDates.includes(formattedDate); // Check if the date is in the unavailableDates array
    };

    return (
        <div className="p-4 rounded-lg border bg-white shadow-md dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Select a Booking Date
            </h2>
            <Calendar
                // Disable unavailable dates on the calendar
                tileDisabled={({ date }) => isDateDisabled(date)}
                // Apply custom styles for disabled tiles
                tileClassName={({ date }) =>
                    isDateDisabled(date) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''
                }
                // Log the selected date when a user clicks on a calendar tile
                onClickDay={(value) => console.log('Selected date:', value)}
                className="react-calendar w-full max-w-md mx-auto border-none"
            />
            {/* Apply Tailwind CSS styles globally for the calendar */}
            <style jsx global>{`
                .react-calendar {
                    @apply text-sm;
                }
                .react-calendar__tile--now {
                    @apply bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200;
                }
                .react-calendar__tile--active {
                    @apply bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200;
                }
                .react-calendar__tile--disabled {
                    @apply bg-gray-300 text-gray-500 cursor-not-allowed;
                }
            `}</style>
        </div>
    );
}
