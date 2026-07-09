import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc,
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { Patient, Doctor, Appointment, Bill, Notification, ActivityLog, User } from "../types";

// Local storage helpers
const getLocalData = <T>(key: string): T[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveLocalData = <T>(key: string, items: T[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(items));
};

// Seed default records if empty in localStorage
const ensureSeedDb = () => {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem("hms_appointments")) {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    
    const seedAppointments: Appointment[] = [
      {
        id: "app-1",
        patientId: "patient-1",
        doctorId: "doctor-1",
        date: today,
        time: "10:00",
        reason: "Cardiology Routine Checkup",
        status: "scheduled",
        notes: "Follow up after previous medication adjustment",
        fee: 150,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "app-2",
        patientId: "patient-1",
        doctorId: "doctor-1",
        date: tomorrow,
        time: "14:30",
        reason: "Heart rate monitor analysis",
        status: "scheduled",
        fee: 150,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "app-3",
        patientId: "patient-1",
        doctorId: "doctor-1",
        date: yesterday,
        time: "09:15",
        reason: "Consultation - chest tightening issues",
        status: "completed",
        notes: "Patient is recovering well. Normal sinus rhythm.",
        fee: 150,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: yesterday,
      }
    ];
    saveLocalData("hms_appointments", seedAppointments);
  }

  if (!localStorage.getItem("hms_bills")) {
    const today = new Date().toISOString().split("T")[0];
    const tenDaysFromNow = new Date(Date.now() + 86400000 * 10).toISOString().split("T")[0];
    const fiveDaysAgo = new Date(Date.now() - 86400000 * 5).toISOString().split("T")[0];
    
    const seedBills: Bill[] = [
      {
        id: "bill-1",
        appointmentId: "app-3",
        patientId: "patient-1",
        amount: 150,
        status: "paid",
        dueDate: fiveDaysAgo,
        paidDate: fiveDaysAgo,
        paymentMethod: "Credit Card",
        description: "Consultation Fee for app-3",
        createdAt: fiveDaysAgo,
        updatedAt: fiveDaysAgo
      },
      {
        id: "bill-2",
        appointmentId: "app-1",
        patientId: "patient-1",
        amount: 150,
        status: "pending",
        dueDate: today,
        paidDate: null,
        paymentMethod: "Cash",
        description: "Upcoming Consultation for app-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "bill-3",
        appointmentId: "app-2",
        patientId: "patient-1",
        amount: 150,
        status: "pending",
        dueDate: tenDaysFromNow,
        paidDate: null,
        paymentMethod: "Insurance",
        description: "Heart monitoring session bill",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    saveLocalData("hms_bills", seedBills);
  }

  if (!localStorage.getItem("hms_notifications")) {
    const seedNotifications: Notification[] = [
      {
        id: "not-1",
        userId: "patient-1",
        type: "appointment",
        title: "Appointment Confirmed",
        message: "Your appointment with Dr. Sarah Jenkins is scheduled for today at 10:00 AM.",
        read: false,
        link: "/dashboard/appointments",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString()
      },
      {
        id: "not-2",
        userId: "patient-1",
        type: "payment",
        title: "Invoice Generated",
        message: "A new pending invoice for $150 has been generated. Due date is today.",
        read: false,
        link: "/dashboard/billing",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString()
      }
    ];
    saveLocalData("hms_notifications", seedNotifications);
  }

  if (!localStorage.getItem("hms_activity_logs")) {
    const seedLogs: ActivityLog[] = [
      {
        id: "log-1",
        userId: "patient-1",
        userName: "John Doe",
        action: "APPOINTMENT_BOOK",
        details: "Booked routine cardiology checkup.",
        createdAt: new Date().toISOString()
      },
      {
        id: "log-2",
        userId: "admin-1",
        userName: "Dr. Siddartha Reddy",
        action: "SYSTEM_INITIALIZE",
        details: "System successfully configured.",
        createdAt: new Date().toISOString()
      }
    ];
    saveLocalData("hms_activity_logs", seedLogs);
  }
};

if (typeof window !== "undefined") {
  ensureSeedDb();
}

// Activity Logging
export const logActivity = async (userId: string, userName: string, action: string, details: string): Promise<void> => {
  const newLog: ActivityLog = {
    id: "log-" + Date.now() + Math.random().toString(36).substr(2, 4),
    userId,
    userName,
    action,
    details,
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      await addDoc(collection(db, "activity_logs"), newLog);
    } catch (e) {
      console.warn("Failed to write activity log to firestore:", e);
    }
  } else {
    const logs = getLocalData<ActivityLog>("hms_activity_logs");
    logs.unshift(newLog);
    saveLocalData("hms_activity_logs", logs);
  }
};

export const getActivityLogs = async (): Promise<ActivityLog[]> => {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, "activity_logs"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const results: ActivityLog[] = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data() as ActivityLog);
    });
    return results;
  } else {
    return getLocalData<ActivityLog>("hms_activity_logs");
  }
};

// Users queries (Admin features)
export const getUsers = async (): Promise<User[]> => {
  if (isFirebaseConfigured && db) {
    const querySnapshot = await getDocs(collection(db, "users"));
    const results: User[] = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data() as User);
    });
    return results;
  } else {
    return getLocalData<User>("hms_users");
  }
};

// Patient profiles CRUD
export const getPatients = async (): Promise<Patient[]> => {
  if (isFirebaseConfigured && db) {
    const querySnapshot = await getDocs(collection(db, "patients"));
    const results: Patient[] = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data() as Patient);
    });
    return results;
  } else {
    return getLocalData<Patient>("hms_patients");
  }
};

export const getPatientById = async (patientId: string): Promise<Patient | null> => {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "patients", patientId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Patient) : null;
  } else {
    const patients = getLocalData<Patient>("hms_patients");
    return patients.find(p => p.id === patientId || p.userId === patientId) || null;
  }
};

export const createOrUpdatePatient = async (patientId: string, patientData: Partial<Patient>): Promise<void> => {
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, "patients", patientId), {
      id: patientId,
      userId: patientId,
      ...patientData,
      createdAt: new Date().toISOString()
    }, { merge: true });
  } else {
    const patients = getLocalData<Patient>("hms_patients");
    const index = patients.findIndex(p => p.id === patientId || p.userId === patientId);
    const timestamp = new Date().toISOString();
    
    if (index >= 0) {
      patients[index] = { ...patients[index], ...patientData } as Patient;
    } else {
      patients.push({
        id: patientId,
        userId: patientId,
        dob: "",
        gender: "",
        address: "",
        medicalHistory: [],
        allergies: [],
        emergencyContact: { name: "", phone: "", relationship: "" },
        createdAt: timestamp,
        ...patientData
      } as Patient);
    }
    saveLocalData("hms_patients", patients);
  }
};

// Doctors CRUD
export const getDoctors = async (): Promise<Doctor[]> => {
  if (isFirebaseConfigured && db) {
    const querySnapshot = await getDocs(collection(db, "doctors"));
    const results: Doctor[] = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data() as Doctor);
    });
    return results;
  } else {
    return getLocalData<Doctor>("hms_doctors");
  }
};

export const getDoctorById = async (doctorId: string): Promise<Doctor | null> => {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "doctors", doctorId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Doctor) : null;
  } else {
    const doctors = getLocalData<Doctor>("hms_doctors");
    return doctors.find(d => d.id === doctorId || d.userId === doctorId) || null;
  }
};

export const createOrUpdateDoctor = async (doctorId: string, doctorData: Partial<Doctor>): Promise<void> => {
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, "doctors", doctorId), doctorData, { merge: true });
  } else {
    const doctors = getLocalData<Doctor>("hms_doctors");
    const index = doctors.findIndex(d => d.id === doctorId || d.userId === doctorId);
    if (index >= 0) {
      doctors[index] = { ...doctors[index], ...doctorData } as Doctor;
    } else {
      doctors.push({
        id: doctorId,
        userId: doctorId,
        specialization: "General Practice",
        licenseNumber: "",
        experience: 0,
        rating: 5.0,
        availability: {},
        consultationFee: 100,
        bio: "",
        ...doctorData
      } as Doctor);
    }
    saveLocalData("hms_doctors", doctors);
  }
};

// Appointments CRUD
export const getAppointments = async (): Promise<Appointment[]> => {
  if (isFirebaseConfigured && db) {
    const querySnapshot = await getDocs(collection(db, "appointments"));
    const results: Appointment[] = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data() as Appointment);
    });
    return results;
  } else {
    return getLocalData<Appointment>("hms_appointments");
  }
};

export const createAppointment = async (appData: Omit<Appointment, "id" | "createdAt" | "updatedAt">): Promise<Appointment> => {
  const id = "app-" + Date.now() + Math.random().toString(36).substr(2, 4);
  const now = new Date().toISOString();
  const appointment: Appointment = {
    ...appData,
    id,
    createdAt: now,
    updatedAt: now
  };

  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, "appointments", id), appointment);
  } else {
    const appointments = getLocalData<Appointment>("hms_appointments");
    appointments.push(appointment);
    saveLocalData("hms_appointments", appointments);

    // Auto-generate invoice when appointment is scheduled
    await createBill({
      appointmentId: id,
      patientId: appData.patientId,
      amount: appData.fee,
      status: "pending",
      dueDate: appData.date,
      paidDate: null,
      paymentMethod: "Cash",
      description: `Consultation Invoice - Appointment Reference ${id}`
    });

    // Create Notification for the Doctor and Patient
    await createNotification(appData.patientId, "appointment", "Appointment Confirmed", `Your appointment has been booked successfully for ${appData.date} at ${appData.time}.`);
    await createNotification(appData.doctorId, "appointment", "New Appointment Scheduled", `A patient booked a session on ${appData.date} at ${appData.time}.`);
  }

  return appointment;
};

export const updateAppointment = async (id: string, updateData: Partial<Appointment>): Promise<void> => {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "appointments", id);
    await updateDoc(docRef, { ...updateData, updatedAt: new Date().toISOString() });
  } else {
    const appointments = getLocalData<Appointment>("hms_appointments");
    const index = appointments.findIndex(a => a.id === id);
    if (index >= 0) {
      appointments[index] = { 
        ...appointments[index], 
        ...updateData, 
        updatedAt: new Date().toISOString() 
      };
      saveLocalData("hms_appointments", appointments);

      // Trigger notifications for status change
      if (updateData.status) {
        const app = appointments[index];
        await createNotification(app.patientId, "appointment", `Appointment ${updateData.status.toUpperCase()}`, `Your appointment on ${app.date} has been marked as ${updateData.status}.`);
      }
    }
  }
};

// Billing CRUD
export const getBills = async (): Promise<Bill[]> => {
  if (isFirebaseConfigured && db) {
    const querySnapshot = await getDocs(collection(db, "bills"));
    const results: Bill[] = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data() as Bill);
    });
    return results;
  } else {
    return getLocalData<Bill>("hms_bills");
  }
};

export const createBill = async (billData: Omit<Bill, "id" | "createdAt" | "updatedAt">): Promise<Bill> => {
  const id = "bill-" + Date.now() + Math.random().toString(36).substr(2, 4);
  const now = new Date().toISOString();
  const bill: Bill = {
    ...billData,
    id,
    createdAt: now,
    updatedAt: now
  };

  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, "bills", id), bill);
  } else {
    const bills = getLocalData<Bill>("hms_bills");
    bills.push(bill);
    saveLocalData("hms_bills", bills);

    await createNotification(billData.patientId, "payment", "New Invoice Generated", `Invoice ${id} for $${billData.amount} has been raised. Due: ${billData.dueDate}.`);
  }

  return bill;
};

export const updateBill = async (id: string, updateData: Partial<Bill>): Promise<void> => {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "bills", id);
    await updateDoc(docRef, { ...updateData, updatedAt: new Date().toISOString() });
  } else {
    const bills = getLocalData<Bill>("hms_bills");
    const index = bills.findIndex(b => b.id === id);
    if (index >= 0) {
      bills[index] = { 
        ...bills[index], 
        ...updateData, 
        updatedAt: new Date().toISOString() 
      };
      saveLocalData("hms_bills", bills);

      if (updateData.status === "paid") {
        await createNotification(bills[index].patientId, "payment", "Payment Confirmed", `Thank you! Your payment of $${bills[index].amount} for bill ${id} has been processed.`);
      }
    }
  }
};

// Notifications CRUD
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, "notifications"), where("userId", "==", userId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const results: Notification[] = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data() as Notification);
    });
    return results;
  } else {
    const allNotif = getLocalData<Notification>("hms_notifications");
    return allNotif.filter(n => n.userId === userId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};

export const createNotification = async (userId: string, type: Notification["type"], title: string, message: string, link: string | null = null): Promise<void> => {
  const newNotif: Notification = {
    id: "not-" + Date.now() + Math.random().toString(36).substr(2, 4),
    userId,
    type,
    title,
    message,
    read: false,
    link,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString() // 7 days expiry
  };

  if (isFirebaseConfigured && db) {
    try {
      await addDoc(collection(db, "notifications"), newNotif);
    } catch (e) {
      console.warn("Failed to save Firestore notification:", e);
    }
  } else {
    const notifs = getLocalData<Notification>("hms_notifications");
    notifs.unshift(newNotif);
    saveLocalData("hms_notifications", notifs);
  }
};

export const markNotificationRead = async (id: string): Promise<void> => {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "notifications", id);
    await updateDoc(docRef, { read: true });
  } else {
    const notifs = getLocalData<Notification>("hms_notifications");
    const index = notifs.findIndex(n => n.id === id);
    if (index >= 0) {
      notifs[index].read = true;
      saveLocalData("hms_notifications", notifs);
    }
  }
};

// Settings (Mock configuration storage)
export interface SystemSettings {
  allowSignups: boolean;
  alertOnEmergency: boolean;
  backupInterval: string;
}

export const getSystemSettings = (): SystemSettings => {
  if (typeof window === "undefined") return { allowSignups: true, alertOnEmergency: true, backupInterval: "daily" };
  const settings = localStorage.getItem("hms_settings");
  return settings ? JSON.parse(settings) : { allowSignups: true, alertOnEmergency: true, backupInterval: "daily" };
};

export const saveSystemSettings = (settings: SystemSettings) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("hms_settings", JSON.stringify(settings));
};
