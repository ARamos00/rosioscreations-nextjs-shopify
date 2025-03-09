"use client";
import React, { useState } from "react";
import Calendar from "react-calendar"; // Import the react-calendar component
import "react-calendar/dist/Calendar.css"; // Import default calendar styles
import { useBookingDate } from "./bookingDateContext"; // Custom hook to manage booking date context
import { MouseEvent } from "react";

// Define props for CalendarView component
interface CalendarViewProps {
    bookedDates: string[]; // Array of booked date strings in "YYYY-MM-DD" format
    month?: number; // Optional month (0-indexed, where 0 = January)
    year?: number; // Optional year
    onSelectDate?: (date: Date) => void; // Optional callback when a date is selected
    interactive?: boolean; // Optional flag to enable/disable interactive features, defaults to true
}

// CalendarView component definition
const CalendarView: React.FC<CalendarViewProps> = ({
                                                       bookedDates,
                                                       month,
                                                       year,
                                                       onSelectDate,
                                                       interactive = true, // Default interactive to true
                                                   }) => {
    const now = new Date();
    // Set default date using provided year/month or fallback to current date
    const defaultDate = new Date(year || now.getFullYear(), month ?? now.getMonth(), 1);
    // State to hold the currently selected date, initialized to defaultDate
    const [selectedDate, setSelectedDate] = useState<Date | null>(defaultDate);
    // Get the setBookingDate function from the booking date context
    const { setBookingDate } = useBookingDate();

    // Helper function to format a Date as "YYYY-MM-DD"
    const formatDate = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    // Function to assign a custom class to calendar tiles based on booked dates
    const tileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month") {
            const formatted = formatDate(date);
            // If the date is in the bookedDates array, assign the "booked" class for custom styling
            if (bookedDates.includes(formatted)) {
                return "booked"; // Ensure global CSS styles this class as desired (e.g., background: #EFAA9F)
            }
        }
        return "";
    };

    // Handle date selection changes when interactive mode is enabled
    const handleDateChange = (date: Date, event: MouseEvent<HTMLButtonElement>) => {
        if (!interactive) return; // Prevent changes if not interactive
        console.log("CalendarView: new selected date", date);
        setSelectedDate(date); // Update local state
        setBookingDate(date);  // Update global booking date via context
        // Trigger optional callback if provided
        if (onSelectDate) {
            onSelectDate(date);
        }
    };

    return (
        <div className="booking-calendar bg-[#F6EEE8] rounded-lg p-4 shadow-lg">
            {interactive ? (
                // Render interactive calendar with onChange handling
                <Calendar
                    value={selectedDate || defaultDate}
                    onChange={(value, event) => {
                        let selected: Date | null = null;
                        // Determine the selected date from the value, which may be a single date or an array
                        if (value instanceof Date) {
                            selected = value;
                        } else if (Array.isArray(value)) {
                            selected = value[0] || null;
                        }
                        if (selected) {
                            handleDateChange(selected, event);
                        }
                    }}
                    tileClassName={tileClassName}
                    className="react-calendar bg-[#F8E1D9] rounded-lg"
                />
            ) : (
                // Render a non-interactive calendar with a default active start date
                <Calendar
                    defaultActiveStartDate={defaultDate}
                    tileClassName={tileClassName}
                    className="react-calendar bg-[#F8E1D9] rounded-lg"
                />
            )}
            {/* Display the selected date if interactive and a date is selected */}
            {interactive && selectedDate && (
                <div className="mt-2 text-center text-lg font-medium text-[#EFAA9F]">
                    Selected Date: {formatDate(selectedDate)}
                </div>
            )}
        </div>
    );
};

export default CalendarView;
