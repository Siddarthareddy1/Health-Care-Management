import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";
import { User, UserRole } from "../types";
import { sendEmailNotification } from "./email";

const USERS_KEY = "hms_users";
const CURRENT_USER_KEY = "hms_current_user";
const PASSWORDS_KEY = "hms_passwords";

// Helpers
export const getLocalUsers = (): User[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLocalUsers = (users: User[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getLocalCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const getUserById = async (userId: string): Promise<User | null> => {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as User) : null;
  } else {
    const users = getLocalUsers();
    return users.find(u => u.id === userId) || null;
  }
};

// Seed demo users
const ensureSeedUsers = () => {
  if (typeof window === "undefined") return;
  const users = getLocalUsers();
  if (users.length === 0) {
    const seed: User[] = [
      {
        id: "admin-1",
        email: "admin@healthcare.com",
        name: "Dr. Siddartha Reddy",
        role: "admin",
        phone: "9876543210",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "doctor-1",
        email: "doctor@healthcare.com",
        name: "Dr. Sarah Jenkins",
        role: "doctor",
        phone: "9876543211",
        avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "patient-1",
        email: "patient@healthcare.com",
        name: "John Doe",
        role: "patient",
        phone: "9876543212",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    const passwords = {
      "admin@healthcare.com": "password123",
      "doctor@healthcare.com": "password123",
      "patient@healthcare.com": "password123"
    };

    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
    saveLocalUsers(seed);

    // Seed empty patients list, doctors, etc. if empty
    if (!localStorage.getItem("hms_patients")) {
      localStorage.setItem("hms_patients", JSON.stringify([
        {
          id: "patient-1",
          userId: "patient-1",
          dob: "1990-05-15",
          gender: "Male",
          address: "123 Healthcare Ave, Medical City",
          medicalHistory: ["Hypertension", "Mild Asthma"],
          allergies: ["Penicillin"],
          emergencyContact: {
            name: "Jane Doe",
            phone: "9876543215",
            relationship: "Spouse"
          },
          createdAt: new Date().toISOString()
        }
      ]));
    }

    if (!localStorage.getItem("hms_doctors")) {
      localStorage.setItem("hms_doctors", JSON.stringify([
        {
          id: "doctor-1",
          userId: "doctor-1",
          specialization: "Cardiology",
          licenseNumber: "LIC123456",
          experience: 12,
          rating: 4.8,
          availability: {
            "Monday": [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }],
            "Tuesday": [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }],
            "Wednesday": [{ start: "09:00", end: "12:00" }],
            "Thursday": [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }],
            "Friday": [{ start: "09:00", end: "12:00" }]
          },
          consultationFee: 150,
          bio: "Dr. Jenkins is a board-certified cardiologist with over 12 years of experience managing complex heart conditions."
        }
      ]));
    }
  }
};

if (typeof window !== "undefined") {
  ensureSeedUsers();
}

// Helper to fetch user role from Firestore
export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  const user = await getUserById(userId);
  return user ? user.role : null;
};

// Authentication API methods
// Public registration: ALWAYS assigns role "patient" (hardcoded for security)
export const signUp = async (email: string, password: string, name: string, phone: string, roleInput?: UserRole): Promise<User> => {
  // Public registration is ALWAYS forced to "patient" regardless of input
  const role: UserRole = "patient";

  if (isFirebaseConfigured && auth && db) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    
    const userData: User = {
      id: userId,
      email,
      name,
      phone,
      role: "patient",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in Firestore
    await setDoc(doc(db, "users", userId), userData);

    // Seed patient profile record in Firestore
    await setDoc(doc(db, "patients", userId), {
      id: userId,
      userId,
      dob: "",
      gender: "",
      address: "",
      medicalHistory: [],
      allergies: [],
      emergencyContact: { name: "", phone: "", relationship: "" },
      createdAt: new Date().toISOString(),
    });

    // Try sending email verification
    try {
      await sendEmailVerification(userCredential.user);
    } catch (err) {
      console.warn("Failed to dispatch Firebase email verification:", err);
    }

    // Trigger Registration Email Notification
    sendEmailNotification({
      template: "REGISTRATION_SUCCESS",
      recipientEmail: email,
      recipientName: name,
      variables: { role: "patient" }
    });

    return userData;
  } else {
    // Mock Signup
    const users = getLocalUsers();
    if (users.some(u => u.email === email)) {
      throw new Error("Email already in use");
    }

    const userId = "mock-" + Math.random().toString(36).substr(2, 9);
    const userData: User = {
      id: userId,
      email,
      name,
      phone,
      role: "patient",
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(userData);
    saveLocalUsers(users);

    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || "{}");
    passwords[email] = password;
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));

    // Seed patient in localStorage
    const patients = JSON.parse(localStorage.getItem("hms_patients") || "[]");
    patients.push({
      id: userId,
      userId,
      dob: "1990-01-01",
      gender: "Male",
      address: "Enter your address",
      medicalHistory: [],
      allergies: [],
      emergencyContact: { name: "Contact Person", phone: "0000000000", relationship: "Relation" },
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("hms_patients", JSON.stringify(patients));

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));

    // Trigger Registration Email Notification for Mock mode
    sendEmailNotification({
      template: "REGISTRATION_SUCCESS",
      recipientEmail: email,
      recipientName: name,
      variables: { role: "patient" }
    });

    return userData;
  }
};

export const registerPatient = async (email: string, password: string, name: string, phone: string): Promise<User> => {
  return signUp(email, password, name, phone, "patient");
};

// Admin ONLY: Create Doctor Account
export interface CreateDoctorData {
  email: string;
  name: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  consultationFee: number;
  bio?: string;
}

export const createDoctorAccount = async (
  adminUID: string,
  data: CreateDoctorData
): Promise<{ doctor: User; temporaryPassword: string }> => {
  // Generate random strong temporary password
  const temporaryPassword = `Doc#${Math.floor(100000 + Math.random() * 900000)}!`;

  if (isFirebaseConfigured && auth && db) {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, temporaryPassword);
    const doctorUid = userCredential.user.uid;

    const doctorUserData: User & { createdByAdmin?: string } = {
      id: doctorUid,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: "doctor",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByAdmin: adminUID,
    };

    // Store in Firestore users collection
    await setDoc(doc(db, "users", doctorUid), doctorUserData);

    // Store in Firestore doctors collection
    await setDoc(doc(db, "doctors", doctorUid), {
      id: doctorUid,
      userId: doctorUid,
      specialization: data.specialization,
      licenseNumber: data.licenseNumber,
      experience: Number(data.experience),
      rating: 5.0,
      availability: {
        "Monday": [{ start: "09:00", end: "17:00" }],
        "Tuesday": [{ start: "09:00", end: "17:00" }],
        "Wednesday": [{ start: "09:00", end: "17:00" }],
        "Thursday": [{ start: "09:00", end: "17:00" }],
        "Friday": [{ start: "09:00", end: "17:00" }]
      },
      consultationFee: Number(data.consultationFee),
      bio: data.bio || `Dr. ${data.name} is a specialist in ${data.specialization}.`,
      createdByAdmin: adminUID,
      createdAt: new Date().toISOString()
    });

    return { doctor: doctorUserData, temporaryPassword };
  } else {
    // Mock Doctor Creation
    const users = getLocalUsers();
    if (users.some(u => u.email === data.email)) {
      throw new Error("Doctor email already in use");
    }

    const doctorUid = "doc-" + Math.random().toString(36).substr(2, 9);
    const doctorUserData: User & { createdByAdmin?: string } = {
      id: doctorUid,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: "doctor",
      avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByAdmin: adminUID,
    };

    users.push(doctorUserData);
    saveLocalUsers(users);

    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || "{}");
    passwords[data.email] = temporaryPassword;
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));

    const doctors = JSON.parse(localStorage.getItem("hms_doctors") || "[]");
    doctors.push({
      id: doctorUid,
      userId: doctorUid,
      specialization: data.specialization,
      licenseNumber: data.licenseNumber,
      experience: Number(data.experience),
      rating: 5.0,
      availability: {
        "Monday": [{ start: "09:00", end: "17:00" }],
        "Tuesday": [{ start: "09:00", end: "17:00" }],
        "Wednesday": [{ start: "09:00", end: "17:00" }],
        "Thursday": [{ start: "09:00", end: "17:00" }],
        "Friday": [{ start: "09:00", end: "17:00" }]
      },
      consultationFee: Number(data.consultationFee),
      bio: data.bio || `Dr. ${data.name} is a specialist in ${data.specialization}.`,
      createdByAdmin: adminUID,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("hms_doctors", JSON.stringify(doctors));

    return { doctor: doctorUserData, temporaryPassword };
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  if (isFirebaseConfigured && auth && db) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("User record not found in Firestore database");
      }
      return docSnap.data() as User;
    } catch (e: any) {
      if (e.code === "auth/user-not-found" || e.code === "auth/invalid-credential" || e.code === "auth/wrong-password" || e.message?.includes("not found")) {
        const seedUsers = [
          {
            email: "admin@healthcare.com",
            password: "password123",
            name: "Dr. Siddartha Reddy",
            role: "admin" as UserRole,
            phone: "9876543210"
          },
          {
            email: "doctor@healthcare.com",
            password: "password123",
            name: "Dr. Sarah Jenkins",
            role: "doctor" as UserRole,
            phone: "9876543211"
          },
          {
            email: "patient@healthcare.com",
            password: "password123",
            name: "John Doe",
            role: "patient" as UserRole,
            phone: "9876543212"
          }
        ];

        const matchingSeed = seedUsers.find(u => u.email === email && u.password === password);
        if (matchingSeed) {
          try {
            const user = await signUp(matchingSeed.email, matchingSeed.password, matchingSeed.name, matchingSeed.phone, matchingSeed.role);
            return user;
          } catch (signUpError) {
            console.error("Failed to auto-seed credentials:", signUpError);
          }
        }
      }
      throw e;
    }
  } else {
    // Mock Login
    const users = getLocalUsers();
    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || "{}");
    const user = users.find(u => u.email === email);
    if (!user || passwords[email] !== password) {
      throw new Error("Invalid email or password");
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
};

export const signOut = async (): Promise<void> => {
  if (isFirebaseConfigured && auth) {
    await firebaseSignOut(auth);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  if (isFirebaseConfigured && auth) {
    await sendPasswordResetEmail(auth, email);
    sendEmailNotification({
      template: "PASSWORD_RESET",
      recipientEmail: email,
      recipientName: "User",
      variables: {}
    });
  } else {
    const users = getLocalUsers();
    const userRecord = users.find(u => u.email === email);
    if (!userRecord) {
      throw new Error("User with this email does not exist");
    }
    // Simulation: Log to console
    console.log(`[Mock Reset] Password reset email sent to ${email}`);
    sendEmailNotification({
      template: "PASSWORD_RESET",
      recipientEmail: email,
      recipientName: userRecord.name,
      variables: {}
    });
  }
};

export const subscribeToAuth = (callback: (user: User | null) => void): (() => void) => {
  if (isFirebaseConfigured && auth && db) {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const docSnap = await getDoc(doc(db, "users", fbUser.uid));
          if (docSnap.exists()) {
            callback(docSnap.data() as User);
          } else {
            callback(null);
          }
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  } else {
    // Mock Listener
    let lastUser = getLocalCurrentUser();
    callback(lastUser);

    const interval = setInterval(() => {
      const currentUser = getLocalCurrentUser();
      if (JSON.stringify(currentUser) !== JSON.stringify(lastUser)) {
        lastUser = currentUser;
        callback(currentUser);
      }
    }, 1000);

    return () => clearInterval(interval);
  }
};

export const signInWithGoogle = async (): Promise<User> => {
  if (isFirebaseConfigured && auth && db) {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;
    
    const docRef = doc(db, "users", fbUser.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      const userData: User = {
        id: fbUser.uid,
        email: fbUser.email || "",
        name: fbUser.displayName || "Google User",
        role: "patient",
        phone: fbUser.phoneNumber || "",
        avatar: fbUser.photoURL || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, userData);
      
      // Seed patient profile
      await setDoc(doc(db, "patients", fbUser.uid), {
        id: fbUser.uid,
        userId: fbUser.uid,
        dob: "1990-01-01",
        gender: "Male",
        address: "Enter address",
        medicalHistory: [],
        allergies: [],
        emergencyContact: { name: "", phone: "", relationship: "" },
        createdAt: new Date().toISOString(),
      });

      // Trigger Registration Email Notification
      sendEmailNotification({
        template: "REGISTRATION_SUCCESS",
        recipientEmail: userData.email,
        recipientName: userData.name,
        variables: { role: userData.role }
      });
      
      return userData;
    }
  } else {
    // Mock Google Sign-In
    const users = getLocalUsers();
    let user = users.find(u => u.email === "patient@healthcare.com");
    if (!user) {
      user = {
        id: "patient-1",
        email: "patient@healthcare.com",
        name: "John Doe",
        role: "patient",
        phone: "9876543212",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
};

export const sendPhoneOtp = async (phoneNumber: string, verifier: any): Promise<any> => {
  if (isFirebaseConfigured && auth) {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    return confirmationResult;
  } else {
    // Mock Phone SMS code
    console.log(`[Mock OTP] SMS verification code sent to ${phoneNumber}`);
    return {
      confirm: async (code: string) => {
        if (code !== "123456") {
          throw new Error("Invalid code. Enter '123456' to pass the mockup verification.");
        }
        const users = getLocalUsers();
        let user = users.find(u => u.phone === phoneNumber);
        if (!user) {
          user = {
            id: "mock-phone-" + Date.now(),
            email: "phoneuser@healthcare.com",
            name: "SMS User",
            role: "patient",
            phone: phoneNumber,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          users.push(user);
          saveLocalUsers(users);

          // Trigger Registration Email Notification for Mock
          sendEmailNotification({
            template: "REGISTRATION_SUCCESS",
            recipientEmail: user.email,
            recipientName: user.name,
            variables: { role: user.role }
          });
        }
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return { user: { uid: user.id } };
      }
    };
  }
};

export const verifyPhoneOtpProfile = async (uid: string, phoneNumber: string): Promise<User> => {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      const userData: User = {
        id: uid,
        email: "phoneuser@healthcare.com",
        name: "SMS User",
        role: "patient",
        phone: phoneNumber,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, userData);
      await setDoc(doc(db, "patients", uid), {
        id: uid,
        userId: uid,
        dob: "1990-01-01",
        gender: "Male",
        address: "Enter address",
        medicalHistory: [],
        allergies: [],
        emergencyContact: { name: "", phone: "", relationship: "" },
        createdAt: new Date().toISOString(),
      });

      // Trigger Registration Email Notification
      sendEmailNotification({
        template: "REGISTRATION_SUCCESS",
        recipientEmail: userData.email,
        recipientName: userData.name,
        variables: { role: userData.role }
      });

      return userData;
    }
  } else {
    const users = getLocalUsers();
    return users.find(u => u.phone === phoneNumber || u.id === uid) as User;
  }
};
