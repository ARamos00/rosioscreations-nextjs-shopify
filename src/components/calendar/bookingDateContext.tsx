"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface BookingDateContextType {
    bookingDate: Date | null;
    setBookingDate: (date: Date | null) => void;
}

const BookingDateContext = createContext<BookingDateContextType | undefined>(undefined);

export const BookingDateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [bookingDate, setBookingDate] = useState<Date | null>(null);

    useEffect(() => {
        console.log("BookingDateContext updated: bookingDate =", bookingDate);
    }, [bookingDate]);

    return (
        <BookingDateContext.Provider value={{ bookingDate, setBookingDate }}>
            {children}
        </BookingDateContext.Provider>
    );
};

export const useBookingDate = () => {
    const context = useContext(BookingDateContext);
    if (!context) {
        throw new Error("useBookingDate must be used within a BookingDateProvider");
    }
    return context;
};
