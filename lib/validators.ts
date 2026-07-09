import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.enum(["patient", "doctor", "admin"], {
    required_error: "Please select a user role",
  }),
});

export const PatientSchema = z.object({
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  gender: z.string().min(1, "Please select gender"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  medicalHistory: z.string().transform((val) => 
    val.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
  ),
  allergies: z.string().transform((val) => 
    val.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
  ),
  emergencyContact: z.object({
    name: z.string().min(2, "Emergency contact name required"),
    phone: z.string().min(10, "Emergency contact phone required"),
    relationship: z.string().min(2, "Relationship details required"),
  }),
});

export const AppointmentSchema = z.object({
  doctorId: z.string().min(1, "Please select a doctor"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
  notes: z.string().optional(),
});

export const BillSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  appointmentId: z.string().min(1, "Please select an appointment"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid due date format"),
  description: z.string().min(3, "Description required"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  status: z.enum(["pending", "paid", "overdue"]),
});

export const ProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  avatar: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
});
