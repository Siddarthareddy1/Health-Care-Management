import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SignupSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const CreateDoctorSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  specialization: z.string().min(2, "Please select or enter a specialization"),
  licenseNumber: z.string().min(3, "License number is required"),
  experience: z.coerce.number().min(0, "Years of experience must be 0 or more"),
  consultationFee: z.coerce.number().min(0, "Consultation fee must be 0 or more"),
  bio: z.string().optional(),
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
