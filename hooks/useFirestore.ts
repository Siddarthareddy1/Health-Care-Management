"use client";

import { useState, useCallback, useEffect } from "react";
import { 
  getAppointments, createAppointment, updateAppointment,
  getPatients, getPatientById, createOrUpdatePatient,
  getBills, createBill, updateBill,
  getDoctors, getDoctorById, createOrUpdateDoctor,
  getUsers, getActivityLogs
} from "../lib/firestore";
import { Appointment, Patient, Bill, Doctor, User, ActivityLog } from "../types";

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (e: any) {
      setError(e.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  const addAppointment = async (appData: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => {
    setError(null);
    try {
      const app = await createAppointment(appData);
      await fetchAppointments();
      return app;
    } catch (e: any) {
      setError(e.message || "Failed to book appointment");
      throw e;
    }
  };

  const updateAppStatus = async (id: string, updateData: Partial<Appointment>) => {
    setError(null);
    try {
      await updateAppointment(id, updateData);
      await fetchAppointments();
    } catch (e: any) {
      setError(e.message || "Failed to update appointment");
      throw e;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { appointments, loading, error, refresh: fetchAppointments, addAppointment, updateAppStatus };
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (e: any) {
      setError(e.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }, []);

  const savePatient = async (id: string, patientData: Partial<Patient>) => {
    setError(null);
    try {
      await createOrUpdatePatient(id, patientData);
      await fetchPatients();
    } catch (e: any) {
      setError(e.message || "Failed to save patient details");
      throw e;
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return { patients, loading, error, refresh: fetchPatients, savePatient };
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (e: any) {
      setError(e.message || "Failed to load doctors list");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveDoctor = async (id: string, doctorData: Partial<Doctor>) => {
    setError(null);
    try {
      await createOrUpdateDoctor(id, doctorData);
      await fetchDoctors();
    } catch (e: any) {
      setError(e.message || "Failed to update doctor details");
      throw e;
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return { doctors, loading, error, refresh: fetchDoctors, saveDoctor };
}

export function useBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBills();
      setBills(data);
    } catch (e: any) {
      setError(e.message || "Failed to load billing invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  const addBill = async (billData: Omit<Bill, "id" | "createdAt" | "updatedAt">) => {
    setError(null);
    try {
      const bill = await createBill(billData);
      await fetchBills();
      return bill;
    } catch (e: any) {
      setError(e.message || "Failed to create invoice");
      throw e;
    }
  };

  const updateBillStatus = async (id: string, updateData: Partial<Bill>) => {
    setError(null);
    try {
      await updateBill(id, updateData);
      await fetchBills();
    } catch (e: any) {
      setError(e.message || "Failed to update bill payment");
      throw e;
    }
  };

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  return { bills, loading, error, refresh: fetchBills, addBill, updateBillStatus };
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (e: any) {
      setError(e.message || "Failed to load users database");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refresh: fetchUsers };
}

export function useActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActivityLogs();
      setLogs(data);
    } catch (e: any) {
      setError(e.message || "Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, refresh: fetchLogs };
}
