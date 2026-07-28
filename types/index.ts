export type UserRole = "patient" | "doctor" | "admin";
export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  status?: UserStatus;
  avatar?: string;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface Patient {
  id: string;
  userId: string; // Reference to user
  dob: string; // YYYY-MM-DD
  gender: string;
  address: string;
  medicalHistory: string[];
  allergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
}

export interface Doctor {
  id: string;
  userId: string; // Reference to user
  specialization: string;
  licenseNumber: string;
  experience: number; // in years
  rating: number;
  availability: {
    [dayOfWeek: string]: Array<{ start: string; end: string }>; // e.g., { "Monday": [{start: "09:00", end: "12:00"}] }
  };
  consultationFee: number;
  bio: string;
}

export interface Appointment {
  id: string;
  patientId: string; // Reference to patients/userId
  doctorId: string; // Reference to doctors/userId
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  reason: string;
  status: "pending" | "approved" | "rejected" | "completed";
  notes?: string;
  fee: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: string;
  appointmentId: string; // Reference to appointment
  patientId: string; // Reference to patient/userId
  amount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: string; // YYYY-MM-DD
  paidDate?: string | null; // YYYY-MM-DD
  paymentMethod: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string; // Reference to user
  type: "appointment" | "payment" | "reminder" | "alert";
  title: string;
  message: string;
  read: boolean;
  link?: string | null;
  createdAt: string;
  expiresAt: string;
}

export interface Specialization {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  createdAt: string;
}
