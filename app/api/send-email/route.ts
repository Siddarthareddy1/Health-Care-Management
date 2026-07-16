import { NextRequest, NextResponse } from "next/server";

// Dynamic require for nodemailer to avoid crash if not installed when Resend is used
let nodemailer: any = null;
try {
  nodemailer = require("nodemailer");
} catch {
  // Ignored, will error if SMTP is explicitly requested
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { template, recipientEmail, recipientName, variables = {} } = body;

    if (!recipientEmail || !template) {
      return NextResponse.json(
        { message: "Missing recipientEmail or template parameter" },
        { status: 400 }
      );
    }

    // Config from Environment Variables
    const resendApiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
    const smtpHost = process.env.SMTP_HOST || process.env.VITE_SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || process.env.VITE_SMTP_PORT;
    const smtpUser = process.env.SMTP_USER || process.env.VITE_SMTP_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.VITE_SMTP_PASS;
    
    const emailFrom = process.env.EMAIL_FROM || process.env.VITE_EMAIL_FROM || "CareFlow HMS <onboarding@resend.dev>";
    const adminEmail = process.env.ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL || "admin@healthcare.com";

    // 1. Generate Email Content based on Template
    let subject = "CareFlow HMS Update";
    let htmlContent = "";

    const dateStr = variables.date ? new Date(variables.date).toLocaleDateString() : "";

    switch (template) {
      case "REGISTRATION_SUCCESS":
        subject = "Welcome to CareFlow - Registration Successful!";
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px border #eaeaea; border-radius: 8px;">
            <h2 style="color: #2563eb; font-weight: bold;">Account Configured Successfully</h2>
            <p>Hello <strong>${recipientName}</strong>,</p>
            <p>Welcome to CareFlow! Your account has been registered successfully as a <strong>${variables.role || "patient"}</strong>.</p>
            <p>You can now log in to the portal using your credentials to view records, book appointments, and coordinate clinical sessions.</p>
            <hr style="border: 0; border-top: 1px border #eaeaea; margin: 20px 0;" />
            <p style="font-size: 11px; color: #666;">This is an automated clinical notification from CareFlow HMS.</p>
          </div>
        `;
        break;

      case "PASSWORD_RESET":
        subject = "CareFlow HMS - Password Reset Requested";
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px border #eaeaea; border-radius: 8px;">
            <h2 style="color: #ea4335; font-weight: bold;">Password Reset Link</h2>
            <p>Hello <strong>${recipientName}</strong>,</p>
            <p>We received a request to reset your CareFlow account password. If you initiated this request, please use the link inside your Firebase application to set a new password.</p>
            <p>If you did not request a password reset, please secure your account credentials immediately.</p>
            <hr style="border: 0; border-top: 1px border #eaeaea; margin: 20px 0;" />
            <p style="font-size: 11px; color: #666;">This is an automated security notification from CareFlow HMS.</p>
          </div>
        `;
        break;

      case "APPOINTMENT_BOOKED_ADMIN":
        subject = "NEW APPOINTMENT - Awaiting Administrative Review";
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px border #eaeaea; border-radius: 8px;">
            <h2 style="color: #fb8c00; font-weight: bold;">Appointment Booking Requested</h2>
            <p>System Administrator,</p>
            <p>A new clinical consultation has been booked and is awaiting approval:</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 15px 0;">
              <tr><td style="padding: 6px 0; color: #666;"><strong>Patient Name:</strong></td><td><strong>${variables.patientName}</strong></td></tr>
              <tr><td style="padding: 6px 0; color: #666;"><strong>Assigned Doctor:</strong></td><td>${variables.doctorName}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;"><strong>Date & Time:</strong></td><td>${dateStr} @ ${variables.time || ""}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;"><strong>Reason:</strong></td><td><em>${variables.reason || "-"}</em></td></tr>
            </table>
            <p>Please log in to your Admin Dashboard to Approve or Reject this request.</p>
            <hr style="border: 0; border-top: 1px border #eaeaea; margin: 20px 0;" />
            <p style="font-size: 11px; color: #666;">This is a system notification from CareFlow HMS database logs.</p>
          </div>
        `;
        break;

      case "APPOINTMENT_BOOKED_PATIENT":
        subject = "Appointment Request Submitted - CareFlow";
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px border #eaeaea; border-radius: 8px;">
            <h2 style="color: #2563eb; font-weight: bold;">Consultation Request Received</h2>
            <p>Hello <strong>${recipientName}</strong>,</p>
            <p>Your appointment request with <strong>${variables.doctorName}</strong> on <strong>${dateStr} @ ${variables.time || ""}</strong> has been submitted successfully.</p>
            <p>Your appointment status is currently <strong>PENDING</strong> awaiting administrator review. We will notify you as soon as it is approved.</p>
            <hr style="border: 0; border-top: 1px border #eaeaea; margin: 20px 0;" />
            <p style="font-size: 11px; color: #666;">This is an automated patient transaction receipt from CareFlow HMS.</p>
          </div>
        `;
        break;

      case "APPOINTMENT_STATUS_UPDATE":
        const isApproved = variables.status === "approved";
        const isCompleted = variables.status === "completed";
        const isDoctorAssigned = variables.status === "assigned";
        
        let headerColor = "#ea4335";
        let statusTitle = "Appointment Rejected / Cancelled";
        
        if (isApproved) {
          headerColor = "#2563eb";
          statusTitle = "Appointment Approved!";
        } else if (isCompleted) {
          headerColor = "#10b981";
          statusTitle = "Consultation Session Completed";
        } else if (isDoctorAssigned) {
          headerColor = "#2563eb";
          statusTitle = "New Patient Session Assigned";
        }

        subject = `Appointment Update: ${statusTitle}`;
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px border #eaeaea; border-radius: 8px;">
            <h2 style="color: ${headerColor}; font-weight: bold;">${statusTitle}</h2>
            <p>Hello <strong>${recipientName}</strong>,</p>
            
            ${isDoctorAssigned ? `
              <p>You have been assigned to a new patient appointment:</p>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 15px 0;">
                <tr><td style="padding: 6px 0; color: #666;"><strong>Patient Name:</strong></td><td><strong>${variables.patientName}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #666;"><strong>Date & Time:</strong></td><td>${dateStr} @ ${variables.time}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;"><strong>Reason:</strong></td><td><em>${variables.reason}</em></td></tr>
              </table>
              <p>Please review patient record details on your dashboard prior to the consultation slot.</p>
            ` : `
              <p>The status of your appointment reference <strong>${variables.appointmentId}</strong> with <strong>${variables.doctorName}</strong> has been updated:</p>
              <p style="font-size: 16px; font-weight: bold; color: ${headerColor};">Status: ${variables.status?.toUpperCase()}</p>
              <p>Slot details: <strong>${dateStr} @ ${variables.time}</strong></p>
              ${isCompleted ? `<p>Consultation charges have been posted to your ledger account. Please visit the billing directory to view and clear your invoice statement.</p>` : ""}
            `}
            
            <hr style="border: 0; border-top: 1px border #eaeaea; margin: 20px 0;" />
            <p style="font-size: 11px; color: #666;">This is an automated database event message from CareFlow HMS.</p>
          </div>
        `;
        break;

      default:
        subject = "CareFlow HMS Alert";
        htmlContent = `<p>${JSON.stringify(variables)}</p>`;
    }

    // 2. Dispatch Email
    const targetRecipient = template === "APPOINTMENT_BOOKED_ADMIN" ? adminEmail : recipientEmail;

    // A. Resend API Flow
    if (resendApiKey) {
      console.log(`[Email] Dispatching via Resend API to: ${targetRecipient}`);
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [targetRecipient],
          subject: subject,
          html: htmlContent,
        }),
      });

      if (!resendRes.ok) {
        const err = await resendRes.json();
        console.error("Resend API rejected transmission:", err);
        return NextResponse.json(
          { message: "Resend failed", error: err },
          { status: 502 }
        );
      }
      return NextResponse.json({ message: "Email sent successfully via Resend" });
    }

    // B. SMTP Flow
    if (smtpHost && smtpUser && smtpPass) {
      if (!nodemailer) {
        console.error("[Email] SMTP variables set, but nodemailer package is not loaded.");
        return NextResponse.json(
          { message: "SMTP requires nodemailer dependency" },
          { status: 500 }
        );
      }

      console.log(`[Email] Dispatching via SMTP to: ${targetRecipient}`);
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || "587"),
        secure: smtpPort === "465",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: emailFrom,
        to: targetRecipient,
        subject: subject,
        html: htmlContent,
      });

      return NextResponse.json({ message: "Email sent successfully via SMTP" });
    }

    // C. Fallback logs (local development)
    console.log(`[Local Simulation Email Sent]
      To: ${targetRecipient}
      From: ${emailFrom}
      Subject: ${subject}
      Body Snippet: ${htmlContent.substring(0, 300).trim()}...
    `);
    
    return NextResponse.json({
      message: "Email simulated successfully (missing API keys in local development environment)",
      simulated: true,
    });
  } catch (error: any) {
    console.error("Error inside send-email api endpoint:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
