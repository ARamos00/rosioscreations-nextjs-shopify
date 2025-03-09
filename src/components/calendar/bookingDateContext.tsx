"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the context type for booking date management
interface BookingDateContextType {
    bookingDate: Date | null;
    setBookingDate: (date: Date | null) => void;
}

// Create a context with an undefined default value
const BookingDateContext = createContext<BookingDateContextType | undefined>(undefined);

// Provider component that manages the booking date state and logs updates
export const BookingDateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // State to store the current booking date
    const [bookingDate, setBookingDate] = useState<Date | null>(null);

    // Log booking date updates for debugging purposes
    useEffect(() => {
        console.log("BookingDateContext updated: bookingDate =", bookingDate);
    }, [bookingDate]);

    // Provide the booking date state and updater to child components
    return (
        <BookingDateContext.Provider value={{ bookingDate, setBookingDate }}>
            {children}
        </BookingDateContext.Provider>
    );
};

// Custom hook to access the booking date context
export const useBookingDate = () => {
    const context = useContext(BookingDateContext);
    // Throw an error if the hook is used outside of the BookingDateProvider
    if (!context) {
        throw new Error("useBookingDate must be used within a BookingDateProvider");
    }
    return context;
};
