/**
 * Client-side utility to trigger serverless email notifications via Next.js API Routes.
 */
export const sendEmailNotification = async (payload: {
  template: "REGISTRATION_SUCCESS" | "PASSWORD_RESET" | "APPOINTMENT_BOOKED_ADMIN" | "APPOINTMENT_BOOKED_PATIENT" | "APPOINTMENT_STATUS_UPDATE" | "APPOINTMENT_CANCELLED_DOCTOR";
  recipientEmail: string;
  recipientName: string;
  variables: Record<string, any>;
}): Promise<boolean> => {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      console.warn("Email API response warning:", err.message || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error invoking send-email API:", error);
    return false;
  }
};
