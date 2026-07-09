"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useBills, useUsers, useAppointments } from "../../../hooks/useFirestore";
import { useToast } from "../../../hooks/useNotification";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import BillForm from "../../../components/forms/BillForm";
import { CreditCard, Printer, Search, PlusCircle, AlertCircle, FileCheck2, Landmark, Check } from "lucide-react";
import { Bill, User } from "../../../types";

export default function BillingPage() {
  const { user } = useAuth();
  const { bills, updateBillStatus, refresh: refreshBills } = useBills();
  const { users } = useUsers();
  const { appointments } = useAppointments();
  const { showToast } = useToast();

  const [filter, setFilter] = useState<"all" | "pending" | "paid" | "overdue">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updatingBill, setUpdatingBill] = useState(false);

  const role = user?.role || "patient";

  // Filter bills by role and status
  const getFilteredBills = () => {
    let list = bills;
    if (role === "patient") {
      list = bills.filter((b) => b.patientId === user?.id);
    } else if (role === "doctor") {
      // Doctors see bills linked to their appointments
      const docAppIds = appointments.filter((a) => a.doctorId === user?.id).map((a) => a.id);
      list = bills.filter((b) => docAppIds.includes(b.appointmentId));
    }

    if (filter !== "all") {
      list = list.filter((b) => b.status === filter);
    }

    return list.map((b) => {
      const patientRecord = users.find((u) => u.id === b.patientId);
      return { bill: b, patient: patientRecord };
    }).filter((item) => {
      if (!item.patient) return false;
      const q = searchQuery.toLowerCase();
      return (
        item.patient.name.toLowerCase().includes(q) ||
        item.bill.id.toLowerCase().includes(q)
      );
    });
  };

  const filtered = getFilteredBills();

  const handlePrint = (bill: Bill) => {
    setSelectedBill(bill);
    // Give state a moment to update the print wrapper, then print
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleMarkPaid = async (billId: string) => {
    setUpdatingBill(true);
    try {
      await updateBillStatus(billId, { 
        status: "paid",
        paidDate: new Date().toISOString().split("T")[0]
      });
      showToast("success", "Invoice Cleared", `Invoice ${billId} has been marked as fully PAID.`);
      refreshBills();
    } catch (e: any) {
      showToast("error", "Update Failed", e.message || "Failed to update bill");
    } finally {
      setUpdatingBill(false);
    }
  };

  const getStatusBadge = (status: Bill["status"]) => {
    const styles = {
      pending: "bg-amber-50 text-healthcare-warning border border-amber-200",
      paid: "bg-emerald-50 text-healthcare-success border border-emerald-200",
      overdue: "bg-red-50 text-healthcare-error border border-red-200",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getPatientName = (patientId: string) => {
    return users.find((u) => u.id === patientId)?.name || "Demo Patient";
  };

  return (
    <div className="space-y-6 font-sans text-healthcare-textDark">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-healthcare-textDark font-display tracking-tight font-sans">Billing & Invoices</h1>
          <p className="text-sm text-healthcare-textMedium font-medium mt-1">Raise clinical invoices, update ledger balances, and print PDF receipts.</p>
        </div>
        {role === "admin" && (
          <Button onClick={() => setShowAddModal(true)} variant="primary" className="gap-2 self-start md:self-auto font-sans">
            <PlusCircle className="w-4 h-4" /> Raise Invoice
          </Button>
        )}
      </div>

      {/* Main invoices grid */}
      <div className="space-y-4 no-print font-sans">
        {/* Filters and search */}
        <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-1.5 border border-healthcare-border p-1 rounded-standard bg-healthcare-bgSecondary w-full md:w-auto">
            {(["all", "pending", "paid", "overdue"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wide transition-all ${
                  filter === status
                    ? "bg-white text-healthcare-primary shadow-subtle border border-healthcare-border"
                    : "text-healthcare-textMedium hover:text-healthcare-textDark"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-healthcare-textLight absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by patient name or bill ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-healthcare-bgSecondary focus:bg-white transition-all"
            />
          </div>
        </Card>

        {/* Invoice Grid Table */}
        <Card title="Billing Statements Ledger" subtitle={`${filtered.length} total invoice logs`}>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-healthcare-textMedium">
              <CreditCard className="w-10 h-10 text-healthcare-textLight mx-auto mb-3" />
              <p className="text-sm font-semibold">No bills matched the filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-healthcare-border text-xs text-healthcare-textMedium uppercase font-bold">
                    <th className="py-3 px-4">Invoice ID</th>
                    {role !== "patient" && <th className="py-3 px-4">Patient</th>}
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Paid Date</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-healthcare-border text-sm font-medium">
                  {filtered.map(({ bill, patient }) => (
                    <tr key={bill.id} className="hover:bg-healthcare-bgSecondary transition-all">
                      <td className="py-4 px-4 font-mono text-xs text-healthcare-primary">{bill.id}</td>
                      {role !== "patient" && (
                        <td className="py-4 px-4 font-bold text-healthcare-textDark">
                          {patient?.name || "Demo Patient"}
                        </td>
                      )}
                      <td className="py-4 px-4 text-healthcare-textMedium text-xs max-w-xs truncate">{bill.description}</td>
                      <td className="py-4 px-4 font-mono font-bold text-healthcare-textDark">${bill.amount}</td>
                      <td className="py-4 px-4 font-mono text-xs text-healthcare-textMedium">{bill.dueDate}</td>
                      <td className="py-4 px-4 font-mono text-xs text-healthcare-textMedium">{bill.paidDate || "-"}</td>
                      <td className="py-4 px-4 text-xs text-healthcare-textMedium">{bill.paymentMethod}</td>
                      <td className="py-4 px-4">{getStatusBadge(bill.status)}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {role === "admin" && bill.status !== "paid" && (
                            <button
                              onClick={() => handleMarkPaid(bill.id)}
                              className="p-1.5 rounded-md bg-healthcare-success hover:bg-emerald-600 text-white shadow-subtle transition-all"
                              title="Mark Paid"
                              disabled={updatingBill}
                            >
                              <Check className="w-4.5 h-4.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handlePrint(bill)}
                            className="p-1.5 rounded-md bg-healthcare-primary hover:bg-healthcare-secondary text-white shadow-subtle transition-all"
                            title="Print Invoice"
                          >
                            <Printer className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Printable Invoice Wrapper (hidden on screen, visible during window.print()) */}
      {selectedBill && (
        <div id="print-area-wrapper" className="hidden print:block font-sans p-10 bg-white text-healthcare-textDark">
          <div className="border border-gray-200 rounded-standard p-8 space-y-8">
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 text-white p-1 rounded">
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xl text-blue-600 font-display tracking-tight">CareFlow HMS</span>
                </div>
                <p className="text-xs text-gray-500 font-medium">100 Healthcare Parkway, Medical City, MC 90210</p>
                <p className="text-xs text-gray-500 font-medium">Phone: +1 (555) 019-2834 · support@careflow.com</p>
              </div>
              <div className="text-right space-y-1">
                <h2 className="text-2xl font-extrabold text-gray-800 font-display tracking-wide uppercase">Invoice Receipt</h2>
                <p className="text-xs text-gray-500 font-mono">Invoice Reference: {selectedBill.id}</p>
                <p className="text-xs text-gray-500 font-mono">Date Raised: {new Date(selectedBill.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Bill Details */}
            <div className="grid grid-cols-2 gap-8 text-xs leading-relaxed border-b border-gray-100 pb-6">
              <div>
                <h4 className="font-bold text-gray-500 uppercase tracking-wide mb-1.5">Billed Patient:</h4>
                <p className="font-bold text-gray-800 text-sm">{getPatientName(selectedBill.patientId)}</p>
                <p className="text-gray-500">Care ID Code: {selectedBill.patientId}</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-500 uppercase tracking-wide mb-1.5">Payment Terms:</h4>
                <p className="text-gray-800"><span className="font-bold">Due Date:</span> {selectedBill.dueDate}</p>
                <p className="text-gray-800"><span className="font-bold">Method:</span> {selectedBill.paymentMethod}</p>
                <p className="text-gray-800"><span className="font-bold">Status:</span> <span className="uppercase font-bold text-blue-600">{selectedBill.status}</span></p>
              </div>
            </div>

            {/* Charges Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 text-gray-500 font-bold uppercase">
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 text-gray-800 font-medium">
                    {selectedBill.description}
                    <p className="text-[10px] text-gray-500 mt-0.5">Appointment Ref Link: {selectedBill.appointmentId}</p>
                  </td>
                  <td className="py-4 text-right font-mono font-bold text-gray-800">${selectedBill.amount}</td>
                </tr>
              </tbody>
            </table>

            {/* Total */}
            <div className="border-t-2 border-gray-200 pt-6 flex justify-end">
              <div className="w-64 space-y-2 text-right">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal:</span>
                  <span className="font-mono">${selectedBill.amount}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Tax (0.00%):</span>
                  <span className="font-mono">$0.00</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-800">
                  <span>Total Charges Due:</span>
                  <span className="font-mono">${selectedBill.amount}</span>
                </div>
              </div>
            </div>

            {/* Guarantee footer */}
            <div className="text-center text-[10px] text-gray-400 border-t border-gray-100 pt-6 space-y-1 leading-normal font-sans">
              <p>This is a HIPAA-compliant medical transaction invoice generated by CareFlow Healthcare Management System.</p>
              <p>Thank you for choosing CareFlow for your health coordination. If you have insurance inquiries, contact the billing office.</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Billing Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Raise New Billing Invoice">
        <BillForm onSuccess={() => { setShowAddModal(false); refreshBills(); }} />
      </Modal>
    </div>
  );
}
