import { supabase } from './supabaseClient';

export async function fetchBookings() {
    const { data, error } = await supabase.from('bookings').select('*');
    if (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
    console.log('Fetched bookings:', data); // Add this line
    return data;
}