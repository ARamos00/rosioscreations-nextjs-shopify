"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styles
import { useBookingDate } from "./bookingDateContext";
import { MouseEvent } from "react";

interface CalendarViewProps {
    bookedDates: string[];
    month?: number; // Optional, 0-indexed (0 = January)
    year?: number;
    onSelectDate?: (date: Date) => void; // Optional callback for selected date
}

const CalendarView: React.FC<CalendarViewProps> = ({
                                                       bookedDates,
                                                       month,
                                                       year,
                                                       onSelectDate,
                                                   }) => {
    const now = new Date();
    const defaultDate = new Date(year || now.getFullYear(), month ?? now.getMonth(), 1);

    const [selectedDate, setSelectedDate] = useState<Date | null>(defaultDate);
    const { setBookingDate } = useBookingDate();

    // Helper to format a Date as "YYYY-MM-DD"
    const formatDate = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    // Custom tile class to mark booked dates
    const tileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month") {
            const formatted = formatDate(date);
            if (bookedDates.includes(formatted)) {
                return "booked";
            }
        }
        return null;
    };

    // Handle onChange from react-calendar by extracting a single Date
    const handleDateChange = (date: Date, event: MouseEvent<HTMLButtonElement>) => {
        console.log("CalendarView: new selected date", date);
        setSelectedDate(date);
        setBookingDate(date);
        if (onSelectDate) {
            onSelectDate(date);
        }
    };

    return (
        <div>
            <Calendar
                value={selectedDate || defaultDate}
                onChange={(value, event) => {
                    let selected: Date | null = null;
                    // If value is a single Date, use it.
                    if (value instanceof Date) {
                        selected = value;
                    }
                    // If it's an array (range), pick the first date.
                    else if (Array.isArray(value)) {
                        selected = value[0] || null;
                    }
                    if (selected) {
                        handleDateChange(selected, event);
                    }
                }}
                tileClassName={tileClassName}
            />
            {selectedDate && (
                <div className="mt-2 text-center">
                    Selected Date: {formatDate(selectedDate)}
                </div>
            )}
        </div>
    );
};

export default CalendarView;
