import { supabase } from './supabaseClient'; // Import the Supabase client

/**
 * Fetches all bookings from the database.
 * @returns {Promise<Array>} An array of bookings or an empty array in case of an error.
 */
export async function fetchBookings() {
    const { data, error } = await supabase.from('bookings').select('*');
    if (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
    console.log('Fetched bookings:', data); // Log fetched bookings for debugging
    return data;
}

/**
 * Saves a booking into the Supabase database.
 * @param {number} productId - The ID of the product being booked.
 * @param {string} bookingDate - The selected booking date for the product.
 * @throws Will throw an error if the booking could not be saved.
 */
export async function saveBooking(productId: number, bookingDate: string) {
    const { data, error } = await supabase.from('bookings').insert([
        {
            product_id: productId, // Product ID related to the booking
            booking_date: bookingDate, // Date selected for the booking
        },
    ]);

    if (error) {
        console.error('Error saving booking:', error.message); // Log the error for debugging
        throw new Error('Failed to save booking'); // Throw an error to indicate failure
    }

    console.log('Booking saved:', data); // Log the saved booking for debugging
    return data; // Return the saved data (optional, based on usage)
}
