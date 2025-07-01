import { supabase } from './supabaseClient';

export async function addAppointment(client_name: string, date: string, time: string, notes: string) {
    const { data, error } = await supabase
        .from('appointments')
        .insert([{ client_name, date, time, notes }]);

    if (error) {
        console.error('Error adding appointment:', error.message);
        throw error;
    }

    return data;
}

export async function getAppointments() {
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

    if (error) {
        console.error('Error fetching appointments:', error.message);
        throw error;
    }

    return data;
}

export async function deleteAppointment(id: number) {
    const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting appointment:', error.message);
        throw error;
    }
}
