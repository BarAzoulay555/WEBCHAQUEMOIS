import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type Appointment = {
    id: number;
    client_name: string;
    date: string;
    time: string;
    notes: string;
    confirmed: boolean;
    created_at?: string;
};

export default function Appointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [clientName, setClientName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");

    const fetchAppointments = async () => {
        const { data, error } = await supabase
            .from("appointments")
            .select("*")
            .order("date", { ascending: true })
            .order("time", { ascending: true });
        if (!error && data) setAppointments(data as Appointment[]);
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleAddAppointment = async () => {
        if (!clientName || !date || !time) {
            alert("יש למלא שם, תאריך ושעה לפחות");
            return;
        }
        const { error } = await supabase.from("appointments").insert([
            { client_name: clientName, date, time, notes, confirmed: false },
        ]);
        if (error) {
            console.error(error);
            alert("שגיאה בהוספת פגישה");
        } else {
            setClientName("");
            setDate("");
            setTime("");
            setNotes("");
            fetchAppointments();
        }
    };

    const handleDeleteAppointment = async (id: number) => {
        const { error } = await supabase
            .from("appointments")
            .delete()
            .eq("id", id);
        if (error) {
            console.error(error);
            alert("שגיאה במחיקת פגישה");
        } else {
            fetchAppointments();
        }
    };

    const handleConfirmAppointment = async (id: number) => {
        const { error } = await supabase
            .from("appointments")
            .update({ confirmed: true })
            .eq("id", id);
        if (error) {
            console.error(error);
            alert("שגיאה באישור הפגישה");
        } else {
            fetchAppointments();
        }
    };

    return (
        <div className="container py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <h2 className="text-center mb-4 fw-bold">יומן פגישות</h2>

            <div className="card shadow p-4 mb-4" style={{ maxWidth: "500px", margin: "0 auto", borderRadius: "10px" }}>
                <div className="mb-3">
                    <input type="text" placeholder="שם לקוח/ספק" className="form-control mb-2" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                    <input type="date" className="form-control mb-2" value={date} onChange={(e) => setDate(e.target.value)} />
                    <input type="time" className="form-control mb-2" value={time} onChange={(e) => setTime(e.target.value)} />
                    <input type="text" placeholder="הערות" className="form-control mb-3" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    <button className="btn btn-primary w-100 fw-semibold" onClick={handleAddAppointment}>
                        הוסף פגישה
                    </button>
                </div>
            </div>

            <div className="table-responsive" style={{ maxWidth: "900px", margin: "0 auto" }}>
                <table className="table table-bordered bg-white shadow-sm">
                    <thead className="table-light text-center">
                        <tr>
                            <th className="text-center">שם</th>
                            <th className="text-center">תאריך</th>
                            <th className="text-center">שעה</th>
                            <th className="text-center">הערות</th>
                            <th className="text-center">סטטוס</th>
                            <th className="text-center">פעולות</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {appointments.map((app) => (
                            <tr key={app.id}>
                                <td>{app.client_name}</td>
                                <td>{app.date}</td>
                                <td>{app.time}</td>
                                <td>{app.notes}</td>
                                <td>
                                    {app.confirmed ? (
                                        <span className="badge bg-success">מאושר</span>
                                    ) : (
                                        <span className="badge bg-secondary">ממתין</span>
                                    )}
                                </td>
                                <td>
                                    {!app.confirmed && (
                                        <button
                                            className="btn btn-success btn-sm me-2"
                                            onClick={() => handleConfirmAppointment(app.id)}
                                        >
                                            אשר
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => handleDeleteAppointment(app.id)}
                                    >
                                        מחק
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {appointments.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-muted">
                                    אין פגישות להצגה כרגע.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
