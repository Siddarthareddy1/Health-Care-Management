"use client";

import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth } from "../../../hooks/useAuth";
import { useAppointments, useDoctors, useUsers } from "../../../hooks/useFirestore";
import { useToast } from "../../../hooks/useNotification";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import AppointmentForm from "../../../components/forms/AppointmentForm";
import { Calendar, Plus, Clock, HelpCircle, User, Activity } from "lucide-react";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { appointments, updateAppStatus, refresh } = useAppointments();
  const { doctors, saveDoctor } = useDoctors();
  const { users } = useUsers();
  const { showToast } = useToast();

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Doctor Availability form states
  const [availabilityDays, setAvailabilityDays] = useState<string[]>([]);
  const [savingAvailability, setSavingAvailability] = useState(false);

  const role = user?.role || "patient";

  // Filter appointments by role
  const userAppointments = appointments.filter((app) => {
    if (role === "admin") return true;
    if (role === "doctor") return app.doctorId === user?.id;
    return app.patientId === user?.id;
  });

  // Load calendar events
  useEffect(() => {
    const mapped = userAppointments.map((app) => {
      const patientName = users.find((u) => u.id === app.patientId)?.name || "Patient";
      const doctorName = users.find((u) => u.id === app.doctorId)?.name || "Doctor";
      
      const startDateTime = new Date(`${app.date}T${app.time}`);
      const endDateTime = new Date(startDateTime.getTime() + 45 * 60 * 1000); // 45 min slots

      const statusColors = {
        scheduled: " border-blue-500 bg-blue-100 text-blue-800",
        completed: "border-emerald-500 bg-emerald-100 text-emerald-800",
        cancelled: "border-red-500 bg-red-100 text-red-800",
      };

      return {
        id: app.id,
        title: role === "doctor" ? `Consult: ${patientName}` : `Dr. ${doctorName}`,
        start: startDateTime,
        end: endDateTime,
        resource: app,
        status: app.status
      };
    });
    setEvents(mapped);
  }, [appointments, users, role, user?.id]);

  // Load active doctor availability
  useEffect(() => {
    if (role === "doctor") {
      const docRecord = doctors.find((d) => d.userId === user?.id);
      if (docRecord && docRecord.availability) {
        setAvailabilityDays(Object.keys(docRecord.availability));
      }
    }
  }, [doctors, role, user?.id]);

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
  };

  const handleUpdateStatus = async (status: "completed" | "cancelled") => {
    if (!selectedEvent) return;
    setUpdatingStatus(true);
    try {
      await updateAppStatus(selectedEvent.id, { status });
      showToast("success", `Appointment ${status === 'completed' ? 'Completed' : 'Cancelled'}`, `Appointment has been set to ${status}.`);
      setSelectedEvent(null);
      refresh();
    } catch (e: any) {
      showToast("error", "Update Failed", e.message || "Failed to update appointment");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveAvailability = async () => {
    if (!user?.id) return;
    setSavingAvailability(true);
    try {
      const newAvail: any = {};
      availabilityDays.forEach((day) => {
        newAvail[day] = [{ start: "09:00", end: "17:00" }];
      });
      await saveDoctor(user.id, { availability: newAvail });
      showToast("success", "Availability Updated", "Your scheduling availability settings have been saved.");
    } catch (e: any) {
      showToast("error", "Save Failed", e.message || "Failed to update availability");
    } finally {
      setSavingAvailability(false);
    }
  };

  const toggleDay = (day: string) => {
    setAvailabilityDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="space-y-6 font-sans text-healthcare-textDark">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-healthcare-textDark font-display tracking-tight">Appointments Calendar</h1>
          <p className="text-sm text-healthcare-textMedium font-medium mt-1">Book consultations and coordinate active clinical slots.</p>
        </div>
        {role === "patient" && (
          <Button onClick={() => setShowBookingModal(true)} variant="primary" className="gap-2 self-start md:self-auto">
            <Plus className="w-4 h-4" /> Book Appointment
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Availability Controls or Calendar Guidelines */}
        <div className="xl:col-span-1 space-y-6">
          {role === "doctor" && (
            <Card title="Manage Schedule" subtitle="Check working days for patients booking">
              <div className="space-y-4">
                <p className="text-xs text-healthcare-textMedium leading-relaxed">
                  Select the weekdays you are open for clinic appointments. Standard consultation slots are auto-generated from 09:00 AM to 05:00 PM.
                </p>
                <div className="space-y-2 pt-2">
                  {daysOfWeek.map((day) => {
                    const isChecked = availabilityDays.includes(day);
                    return (
                      <label key={day} className="flex items-center gap-3 p-2 border border-healthcare-border rounded bg-healthcare-bgSecondary hover:bg-white transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleDay(day)}
                          className="rounded border-healthcare-border text-healthcare-primary focus:ring-healthcare-primary"
                        />
                        <span className="text-xs font-semibold text-healthcare-textDark">{day}</span>
                      </label>
                    );
                  })}
                </div>
                <Button 
                  onClick={handleSaveAvailability} 
                  variant="primary" 
                  fullWidth 
                  loading={savingAvailability}
                  className="mt-2"
                >
                  Save Active Days
                </Button>
              </div>
            </Card>
          )}

          <Card title="Appointment Legend" subtitle="Calendar status color indicators">
            <div className="space-y-3 pt-2 text-xs font-semibold text-healthcare-textMedium">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded bg-blue-100 border border-blue-400 block flex-shrink-0" />
                <span>Scheduled (Upcoming)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded bg-emerald-100 border border-emerald-400 block flex-shrink-0" />
                <span>Completed (Session Finished)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded bg-red-100 border border-red-400 block flex-shrink-0" />
                <span>Cancelled (Void Slot)</span>
              </div>
              <div className="border-t border-healthcare-border pt-4 mt-2">
                <div className="flex gap-2.5 items-start">
                  <HelpCircle className="w-4 h-4 text-healthcare-accent mt-0.5 flex-shrink-0" />
                  <p className="font-normal text-[11px] leading-relaxed">
                    Click on any appointment card in the grid to view details, notes, diagnostic comments, and payment statuses.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Big Calendar Wrapper */}
        <div className="xl:col-span-3">
          <Card className="p-4 bg-white border border-healthcare-border rounded-standard shadow-subtle min-h-[600px]">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
              style={{ height: 600 }}
              views={["month", "week", "day"]}
              defaultView="month"
              eventPropGetter={(event) => {
                let colorClass = "bg-healthcare-primary text-white";
                if (event.status === "completed") colorClass = "bg-healthcare-success text-white";
                if (event.status === "cancelled") colorClass = "bg-healthcare-error text-white";
                return {
                  className: `${colorClass} font-sans rounded border-0 text-xs px-2 py-1 shadow-subtle`
                };
              }}
            />
          </Card>
        </div>
      </div>

      {/* Appointment Detail Popup */}
      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Appointment Ledger Details">
        {selectedEvent && (
          <div className="space-y-4 font-sans text-healthcare-textDark">
            <div className="p-4 bg-healthcare-bgSecondary border border-healthcare-border rounded-standard space-y-3">
              <div className="flex items-center justify-between border-b border-healthcare-border pb-2.5">
                <span className="text-sm font-bold text-healthcare-primary font-display">{selectedEvent.title}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  selectedEvent.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  selectedEvent.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedEvent.status}
                </span>
              </div>
              <div className="space-y-2 text-xs font-semibold text-healthcare-textMedium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-healthcare-textLight" />
                  <span>Date: <span className="text-healthcare-textDark font-mono">{selectedEvent.resource.date}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-healthcare-textLight" />
                  <span>Time Slot: <span className="text-healthcare-textDark font-mono">{selectedEvent.resource.time} (45 mins)</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-healthcare-textLight" />
                  <span>Reason: <span className="text-healthcare-textDark">{selectedEvent.resource.reason}</span></span>
                </div>
                {selectedEvent.resource.notes && (
                  <div className="border-t border-healthcare-border pt-2 mt-1">
                    <p className="font-bold text-[10px] uppercase text-healthcare-textLight">Clinical Notes:</p>
                    <p className="text-healthcare-textDark font-normal mt-0.5 leading-relaxed">{selectedEvent.resource.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {selectedEvent.status === "scheduled" && role !== "patient" && (
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => handleUpdateStatus("completed")} 
                  variant="success" 
                  fullWidth 
                  loading={updatingStatus}
                >
                  Mark Completed
                </Button>
                <Button 
                  onClick={() => handleUpdateStatus("cancelled")} 
                  variant="danger" 
                  fullWidth 
                  loading={updatingStatus}
                >
                  Cancel Session
                </Button>
              </div>
            )}
            
            {selectedEvent.status === "scheduled" && role === "patient" && (
              <Button 
                onClick={() => handleUpdateStatus("cancelled")} 
                variant="danger" 
                fullWidth 
                loading={updatingStatus}
              >
                Cancel My Appointment
              </Button>
            )}

            <Button onClick={() => setSelectedEvent(null)} variant="outline" fullWidth>
              Close Details
            </Button>
          </div>
        )}
      </Modal>

      {/* Booking Form Dialog */}
      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title="Book Clinical Appointment">
        <AppointmentForm patientId={user?.id || ""} onSuccess={() => { setShowBookingModal(false); refresh(); }} />
      </Modal>
    </div>
  );
}
