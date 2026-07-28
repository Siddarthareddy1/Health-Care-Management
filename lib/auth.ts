import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  sendEmailVerification,
  updatePassword as firebaseUpdatePassword,
  deleteUser as firebaseDeleteUser
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";
import { User, UserRole, UserStatus, Doctor } from "../types";
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
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as User) : null;
    } catch {
      const users = getLocalUsers();
      return users.find(u => u.id === userId) || null;
    }
  } else {
    const users = getLocalUsers();
    return users.find(u => u.id === userId) || null;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const normalizedEmail = email.toLowerCase().trim();
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "users"), where("email", "==", normalizedEmail));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        return querySnap.docs[0].data() as User;
      }
    } catch {
      // Fallback
    }
  }
  const users = getLocalUsers();
  return users.find(u => u.email.toLowerCase() === normalizedEmail) || null;
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
        status: "active",
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
        status: "active",
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
        status: "active",
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
            "Thursday": [{ start: "09:00", end: "17:00" }],
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

export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  const user = await getUserById(userId);
  return user ? user.role : null;
};

// Public registration: ALWAYS assigns role "patient"
export const signUp = async (email: string, password: string, name: string, phone: string, roleInput?: UserRole): Promise<User> => {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check email uniqueness
  const existing = await getUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error("Email already exists. An account with this email is already registered.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  if (isFirebaseConfigured && auth && db) {
    const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    const userId = userCredential.user.uid;
    
    const userData: User = {
      id: userId,
      email: normalizedEmail,
      name,
      phone,
      role: "patient",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", userId), userData);
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

    try {
      await sendEmailVerification(userCredential.user);
    } catch (err) {
      console.warn("Failed to dispatch Firebase email verification:", err);
    }

    sendEmailNotification({
      template: "REGISTRATION_SUCCESS",
      recipientEmail: normalizedEmail,
      recipientName: name,
      variables: { role: "patient" }
    });

    return userData;
  } else {
    // Mock Signup
    const users = getLocalUsers();
    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error("Email already exists. An account with this email is already registered.");
    }

    const userId = "mock-" + Math.random().toString(36).substr(2, 9);
    const userData: User = {
      id: userId,
      email: normalizedEmail,
      name,
      phone,
      role: "patient",
      status: "active",
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(userData);
    saveLocalUsers(users);

    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || "{}");
    passwords[normalizedEmail] = password;
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));

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

    sendEmailNotification({
      template: "REGISTRATION_SUCCESS",
      recipientEmail: normalizedEmail,
      recipientName: name,
      variables: { role: "patient" }
    });

    return userData;
  }
};

export const registerPatient = async (email: string, password: string, name: string, phone: string): Promise<User> => {
  return signUp(email, password, name, phone, "patient");
};

// Admin ONLY: Create Doctor Account with custom Password
export interface CreateDoctorData {
  email: string;
  name: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  consultationFee: number;
  bio?: string;
}

export const createDoctorAccount = async (
  adminUID: string,
  data: CreateDoctorData
): Promise<{ doctor: User; passwordAssigned: string }> => {
  const normalizedEmail = data.email.toLowerCase().trim();

  // Validate Email Uniqueness
  const existingUser = await getUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new Error("Email already exists. A doctor or user with this email is already registered.");
  }

  // Password validation
  const passwordAssigned = data.password && data.password.trim() !== "" 
    ? data.password 
    : `Doc#${Math.floor(100000 + Math.random() * 900000)}!`;

  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    throw new Error("Passwords do not match. Please verify password entries.");
  }

  if (passwordAssigned.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  if (isFirebaseConfigured && auth && db) {
    const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, passwordAssigned);
    const doctorUid = userCredential.user.uid;

    const doctorUserData: User & { createdByAdmin?: string } = {
      id: doctorUid,
      email: normalizedEmail,
      name: data.name,
      phone: data.phone,
      role: "doctor",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByAdmin: adminUID,
    };

    await setDoc(doc(db, "users", doctorUid), doctorUserData);

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

    return { doctor: doctorUserData, passwordAssigned };
  } else {
    // Mock Doctor Creation
    const users = getLocalUsers();
    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error("Email already exists. A doctor with this email is already registered.");
    }

    const doctorUid = "doc-" + Math.random().toString(36).substr(2, 9);
    const doctorUserData: User & { createdByAdmin?: string } = {
      id: doctorUid,
      email: normalizedEmail,
      name: data.name,
      phone: data.phone,
      role: "doctor",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByAdmin: adminUID,
    };

    users.push(doctorUserData);
    saveLocalUsers(users);

    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || "{}");
    passwords[normalizedEmail] = passwordAssigned;
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

    return { doctor: doctorUserData, passwordAssigned };
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  const normalizedEmail = email.toLowerCase().trim();

  if (isFirebaseConfigured && auth && db) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const userId = userCredential.user.uid;
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("User record not found in database.");
      }
      const userData = docSnap.data() as User;
      
      // Check status
      if (userData.status === "inactive") {
        await firebaseSignOut(auth);
        throw new Error("Your account has been deactivated by administration. Please contact support.");
      }

      return userData;
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

        const matchingSeed = seedUsers.find(u => u.email === normalizedEmail && u.password === password);
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
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user || passwords[normalizedEmail] !== password) {
      throw new Error("Invalid email or password.");
    }

    if (user.status === "inactive") {
      throw new Error("Your account has been deactivated by administration. Please contact support.");
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

// Reset / Change Password functions
export const updateUserPassword = async (email: string, currentPass: string, newPass: string): Promise<void> => {
  const normalizedEmail = email.toLowerCase().trim();
  if (newPass.length < 8) {
    throw new Error("New password must be at least 8 characters long.");
  }

  if (isFirebaseConfigured && auth && auth.currentUser) {
    await firebaseUpdatePassword(auth.currentUser, newPass);
  } else {
    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || "{}");
    if (passwords[normalizedEmail] && passwords[normalizedEmail] !== currentPass) {
      throw new Error("Current password is incorrect.");
    }
    passwords[normalizedEmail] = newPass;
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
  }
};

// Admin Reset Password for any user/doctor
export const adminResetUserPassword = async (email: string, newPass: string): Promise<void> => {
  const normalizedEmail = email.toLowerCase().trim();
  if (newPass.length < 8) {
    throw new Error("New password must be at least 8 characters long.");
  }

  if (isFirebaseConfigured && auth) {
    await sendPasswordResetEmail(auth, normalizedEmail);
  } else {
    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || "{}");
    passwords[normalizedEmail] = newPass;
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
  }
};

// Toggle Doctor/User Status (Active / Inactive)
export const toggleUserStatus = async (userId: string, status: UserStatus): Promise<void> => {
  if (isFirebaseConfigured && db) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { status, updatedAt: new Date().toISOString() });
  } else {
    const users = getLocalUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx >= 0) {
      users[idx].status = status;
      users[idx].updatedAt = new Date().toISOString();
      saveLocalUsers(users);
    }
  }
};

// Delete Doctor Account
export const deleteDoctorAccount = async (doctorId: string): Promise<void> => {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, "users", doctorId));
    await deleteDoc(doc(db, "doctors", doctorId));
  } else {
    const users = getLocalUsers().filter(u => u.id !== doctorId);
    saveLocalUsers(users);

    const doctors = JSON.parse(localStorage.getItem("hms_doctors") || "[]").filter((d: any) => d.id !== doctorId && d.userId !== doctorId);
    localStorage.setItem("hms_doctors", JSON.stringify(doctors));
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  const normalizedEmail = email.toLowerCase().trim();
  if (isFirebaseConfigured && auth) {
    await sendPasswordResetEmail(auth, normalizedEmail);
    sendEmailNotification({
      template: "PASSWORD_RESET",
      recipientEmail: normalizedEmail,
      recipientName: "User",
      variables: {}
    });
  } else {
    const users = getLocalUsers();
    const userRecord = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!userRecord) {
      throw new Error("User with this email does not exist.");
    }
    sendEmailNotification({
      template: "PASSWORD_RESET",
      recipientEmail: normalizedEmail,
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
        status: "active",
        phone: fbUser.phoneNumber || "",
        avatar: fbUser.photoURL || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, userData);
      
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
    let user = users.find(u => u.email === "patient@healthcare.com");
    if (!user) {
      user = {
        id: "patient-1",
        email: "patient@healthcare.com",
        name: "John Doe",
        role: "patient",
        status: "active",
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
            status: "active",
            phone: phoneNumber,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          users.push(user);
          saveLocalUsers(users);

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
        status: "active",
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
