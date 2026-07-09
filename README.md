# CareFlow HMS - Healthcare Management System

CareFlow is a full-stack, production-ready Healthcare Management System built using **Next.js 14** (App Router), **React 18**, **TypeScript**, and **Firebase Firestore & Authentication**.

It is fully responsive and designed with a professional, high-contrast healthcare aesthetic (no dim layouts or dark mode confusion), optimized for clinical administrators, medical practitioners, and patients.

---

## 🚀 Key Features

### 1. Unified Authentication & RBAC (Role-Based Access Control)
- **Roles**: Patient, Doctor, and System Administrator.
- **Secure Authentication**: Built-in support for Firebase Auth (Email/Password) with secure session handling.
- **Role Redirection**: Dynamic routing based on user status (Patient, Doctor, Admin).

### 2. Patient Ledger Directory
- Full patient registrations, DOB cataloging, residential records, and emergency contact details.
- Comprehensive medical health records tracking diagnosed history conditions and penicillin/allergy flags.

### 3. Interactive Scheduling Calendar
- Schedule, complete, or cancel checkups using an interactive calendar grid (powered by `react-big-calendar` and `date-fns`).
- Automated notification dispatching and doctor availability weekdays planner.

### 4. Billing Ledger & PDF Invoicing
- Automatic invoice generation upon scheduling consultations.
- Ledger tracking payment status (`pending`, `paid`, `overdue`).
- Click-to-print invoices utilizing specialized CSS print rules designed for standard browser-to-PDF layout formats.

### 5. Advanced Analytics Dashboard
- Live dashboard welcome banner showing role-based quick-action shortcuts.
- Monthly revenue area charts and patient speciality bar graphs (powered by `recharts`).
- Admin audit log logs system events in real-time.

---

## 🛠️ Tech Stack

- **Core**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Database / Backend**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Icons**: Lucide React
- **Validation**: Zod + React Hook Form
- **Calendar**: React Big Calendar
- **Charts**: Recharts
- **Date Handling**: Date-fns

---

## 📦 Installation & Setup

### 1. Prerequisites
- **Node.js**: v18.x or v20.x
- **npm** or **yarn**

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/healthcare-management-system.git
cd healthcare-management-system
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file at the root of the project. You can copy the template from `.env.example`:
```bash
cp .env.example .env.local
```

Fill in your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

> [!IMPORTANT]  
> **Development / Sandbox Mode**: If you leave the Firebase credentials in `.env.local` empty, the system automatically detects this and falls back to a **high-fidelity LocalStorage Mock Data environment**. All CRUD and login operations will function perfectly in the browser using pre-seeded sandbox accounts!

### 5. Run the Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Seeded Development Credentials (LocalStorage Sandbox Mode)

If you are running the app without Firebase keys configured, you can log in using the following credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Administrator** | `admin@healthcare.com` | `password123` |
| **Doctor / Medical Staff** | `doctor@healthcare.com` | `password123` |
| **Patient** | `patient@healthcare.com` | `password123` |

---

## 📁 Project Structure

```
healthcare-management-system/
├── app/
│   ├── layout.tsx (Root layout)
│   ├── page.tsx (Landing page)
│   ├── auth/ (Login, Signup, Forgot password, Verify email)
│   └── dashboard/ (Layout, Unified stats, Calendar, Patients, Billing, Profile, Settings)
├── components/
│   ├── common/ (Buttons, Cards, Modals, Toasts, Header, Sidebar)
│   ├── auth/ (Forms validation resolutions)
│   ├── dashboard/ (StatCard KPIs, charts, schedules)
│   └── forms/ (Appointment checkups, medical history, bill creation)
├── lib/
│   ├── firebase.ts (Firebase connection SDK init)
│   ├── auth.ts (Authentication adapter)
│   ├── firestore.ts (Firestore CRUD operations & mock seeds)
│   └── validators.ts (Zod inputs schemas)
├── hooks/
│   ├── useAuth.ts (Auth context hooks)
│   ├── useFirestore.ts (Patients/Billing/Appointments sync hooks)
│   └── useNotification.ts (Alert toasts & in-app updates)
├── types/
│   └── index.ts (TS interfaces)
└── styles/
    └── globals.css (Base styles, calendar custom CSS, print rules)
```

---

## 🌎 Deployment (Vercel)

1. Push your code changes to a GitHub repository.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your repository and configure the environment variables inside the Vercel dashboard.
4. Click **Deploy**. Vercel will build and host the application.

---

## 🤝 Contributing

We welcome community suggestions and bug fixes:
1. Fork this project repo.
2. Create a feature branch: `git checkout -b feature/clinical-analytics`.
3. Commit changes: `git commit -m "Add clinical analytics charts"`.
4. Push to branch: `git push origin feature/clinical-analytics`.
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 📞 Support & Contacts

For clinical workspace support, inquiries, or custom modifications:
- **Developer**: Siddartha Reddy
- **Email**: siddartha@healthcare-hms.com
- **Website**: [http://careflow-hms.com](http://careflow-hms.com)
