"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useBookingDate } from "./bookingDateContext";
import { MouseEvent } from "react";

interface CalendarViewProps {
    bookedDates: string[];
    month?: number;
    year?: number;
    onSelectDate?: (date: Date) => void;
    interactive?: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({
                                                       bookedDates,
                                                       month,
                                                       year,
                                                       onSelectDate,
                                                       interactive = true,
                                                   }) => {
    const now = new Date();
    const defaultDate = new Date(
        year || now.getFullYear(),
        month ?? now.getMonth(),
        1
    );
    const [selectedDate, setSelectedDate] = useState<Date | null>(defaultDate);
    const { setBookingDate } = useBookingDate();

    const formatDate = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const tileClassName = ({
                               date,
                               view,
                           }: {
        date: Date;
        view: string;
    }) => {
        if (view === "month") {
            const formatted = formatDate(date);
            if (bookedDates.includes(formatted)) {
                return "booked";
            }
        }
        return "";
    };

    const handleDateChange = (
        date: Date,
        event: MouseEvent<HTMLButtonElement>
    ) => {
        if (!interactive) return;
        setSelectedDate(date);
        setBookingDate(date);
        if (onSelectDate) {
            onSelectDate(date);
        }
    };

    return (
        <div className="booking-calendar bg-secondary rounded-lg p-4 shadow-lg">
            {interactive ? (
                <Calendar
                    value={selectedDate || defaultDate}
                    onChange={(value, event) => {
                        let selected: Date | null = null;
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
                    className="react-calendar bg-secondary rounded-lg"
                />
            ) : (
                <Calendar
                    defaultActiveStartDate={defaultDate}
                    tileClassName={tileClassName}
                    className="react-calendar bg-secondary rounded-lg"
                />
            )}
            {interactive && selectedDate && (
                <div className="mt-2 text-center text-lg font-medium text-primary">
                    Selected Date: {formatDate(selectedDate)}
                </div>
            )}
        </div>
    );
};

export default CalendarView;
