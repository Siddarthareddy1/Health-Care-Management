"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { usePatients, useDoctors } from "../../../hooks/useFirestore";
import { useToast } from "../../../hooks/useNotification";
import { updateUserPassword } from "../../../lib/auth";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema, ChangePasswordSchema } from "../../../lib/validators";
import { z } from "zod";
import { Phone, Mail, Award, Contact2, Heart, Key, Lock, Eye, EyeOff } from "lucide-react";

type ProfileInputs = z.infer<typeof ProfileSchema>;
type ChangePasswordInputs = z.infer<typeof ChangePasswordSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { patients, savePatient } = usePatients();
  const { doctors, saveDoctor } = useDoctors();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    setValue,
    formState: { errors: profileErrors },
  } = useForm<ProfileInputs>({
    resolver: zodResolver(ProfileSchema),
  });

  // Change Password Form
  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPassForm,
    formState: { errors: passErrors },
  } = useForm<ChangePasswordInputs>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  // Role form states
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  
  const [specialization, setSpecialization] = useState("");
  const [license, setLicense] = useState("");
  const [experience, setExperience] = useState<number>(0);
  const [bio, setBio] = useState("");

  const role = user?.role || "patient";

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("phone", user.phone);
      setValue("avatar", user.avatar || "");

      // Preload role details
      if (role === "patient") {
        const p = patients.find((pat) => pat.userId === user.id || pat.id === user.id);
        if (p) {
          setAddress(p.address || "");
          setDob(p.dob || "");
          setGender(p.gender || "");
          setEmergencyName(p.emergencyContact?.name || "");
          setEmergencyPhone(p.emergencyContact?.phone || "");
          setEmergencyRelation(p.emergencyContact?.relationship || "");
        }
      } else if (role === "doctor") {
        const d = doctors.find((doc) => doc.userId === user.id || doc.id === user.id);
        if (d) {
          setSpecialization(d.specialization || "");
          setLicense(d.licenseNumber || "");
          setExperience(d.experience || 0);
          setBio(d.bio || "");
        }
      }
    }
  }, [user, patients, doctors, role, setValue]);

  const onSubmitProfile = async (data: ProfileInputs) => {
    setLoading(true);
    try {
      // Save global user changes
      const allUsers = JSON.parse(localStorage.getItem("hms_users") || "[]");
      const index = allUsers.findIndex((u: any) => u.id === user?.id);
      if (index >= 0) {
        allUsers[index] = {
          ...allUsers[index],
          name: data.name,
          phone: data.phone,
          avatar: data.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("hms_users", JSON.stringify(allUsers));
        localStorage.setItem("hms_current_user", JSON.stringify(allUsers[index]));
      }

      // Save role details
      if (role === "patient" && user?.id) {
        await savePatient(user.id, {
          dob,
          gender,
          address,
          emergencyContact: {
            name: emergencyName,
            phone: emergencyPhone,
            relationship: emergencyRelation,
          },
        });
      } else if (role === "doctor" && user?.id) {
        await saveDoctor(user.id, {
          specialization,
          licenseNumber: license,
          experience: Number(experience),
          bio,
        });
      }

      showToast("success", "Profile Updated", "Your profile details have been successfully saved.");
    } catch (e: any) {
      showToast("error", "Update Failed", e.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitChangePassword = async (data: ChangePasswordInputs) => {
    if (!user) return;
    setPasswordLoading(true);
    try {
      await updateUserPassword(user.email, data.currentPassword, data.newPassword);
      showToast("success", "Password Changed Successfully", "Your account password has been updated.");
      resetPassForm();
    } catch (e: any) {
      showToast("error", "Password Change Failed", e.message || "Invalid current password or request failed.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 animate-fade-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-poppins tracking-tight">
          My Account Profile
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Review credentials, change contact information, and edit security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card View */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center py-8">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full border border-slate-200 object-cover mx-auto mb-4 shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-3xl mx-auto mb-4 font-poppins shadow-md">
                {user?.name ? user.name[0] : "U"}
              </div>
            )}
            <h3 className="text-lg font-bold text-slate-900 font-poppins">{user?.name}</h3>
            <span className="inline-block text-xs font-bold text-[#6366F1] bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider mt-1 border border-indigo-200">
              {user?.role} Account
            </span>
            
            <div className="border-t border-slate-100 mt-6 pt-6 text-left space-y-3 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-500" />
                <span>{user?.phone}</span>
              </div>
              {role === "doctor" && specialization && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#8B5CF6]" />
                  <span>{specialization} Specialist</span>
                </div>
              )}
            </div>
          </Card>

          {/* Change Password Card */}
          <Card title="Security & Password" subtitle="Update your login password">
            <form onSubmit={handleSubmitPass(onSubmitChangePassword)} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full pr-10 ${passErrors.currentPassword ? "!border-red-500" : ""}`}
                    {...registerPass("currentPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passErrors.currentPassword && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">{passErrors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
                  New Password (min 8 chars)
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full pr-10 ${passErrors.newPassword ? "!border-red-500" : ""}`}
                    {...registerPass("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passErrors.newPassword && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">{passErrors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full ${passErrors.confirmNewPassword ? "!border-red-500" : ""}`}
                  {...registerPass("confirmNewPassword")}
                />
                {passErrors.confirmNewPassword && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">{passErrors.confirmNewPassword.message}</p>
                )}
              </div>

              <Button type="submit" variant="primary" fullWidth loading={passwordLoading} className="gap-2">
                <Lock className="w-4 h-4" /> Change Password
              </Button>
            </form>
          </Card>
        </div>

        {/* Profile form */}
        <div className="lg:col-span-2">
          <Card title="Update Profile Settings" subtitle="Keep your details up to date">
            <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
              {/* Readonly Email Notice */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block font-poppins">Official Registered Email</span>
                  <span className="text-slate-500 font-mono">{user?.email}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white border px-2 py-1 rounded">Read-Only</span>
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">Full Name</label>
                  <input
                    type="text"
                    className={`w-full ${profileErrors.name ? "!border-red-500" : ""}`}
                    {...registerProfile("name")}
                  />
                  {profileErrors.name && <p className="text-xs text-red-500 mt-1 font-semibold">{profileErrors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">Phone Number</label>
                  <input
                    type="tel"
                    className={`w-full ${profileErrors.phone ? "!border-red-500" : ""}`}
                    {...registerProfile("phone")}
                  />
                  {profileErrors.phone && <p className="text-xs text-red-500 mt-1 font-semibold">{profileErrors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">Avatar Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className={`w-full ${profileErrors.avatar ? "!border-red-500" : ""}`}
                  {...registerProfile("avatar")}
                />
                {profileErrors.avatar && <p className="text-xs text-red-500 mt-1 font-semibold">{profileErrors.avatar.message}</p>}
              </div>

              {/* Patient Fields */}
              {role === "patient" && (
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <h4 className="text-sm font-bold text-slate-900 font-poppins flex items-center gap-1.5"><Heart className="w-4 h-4 text-[#6366F1]" /> Patient Medical Demographics</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full"
                      >
                        <option value="">-- Select Gender --</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">Residential Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Care Ave, Medical City"
                      className="w-full"
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <h5 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5 font-poppins"><Contact2 className="w-4 h-4 text-slate-400" /> Emergency Contact Sheet</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-poppins">Contact Name</label>
                        <input
                          type="text"
                          value={emergencyName}
                          onChange={(e) => setEmergencyName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-poppins">Phone Number</label>
                        <input
                          type="tel"
                          value={emergencyPhone}
                          onChange={(e) => setEmergencyPhone(e.target.value)}
                          placeholder="9876543215"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-poppins">Relationship</label>
                        <input
                          type="text"
                          value={emergencyRelation}
                          onChange={(e) => setEmergencyRelation(e.target.value)}
                          placeholder="Spouse / Mother"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Doctor Fields */}
              {role === "doctor" && (
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <h4 className="text-sm font-bold text-slate-900 font-poppins flex items-center gap-1.5"><Award className="w-4 h-4 text-[#8B5CF6]" /> Doctor Availability & Credentials</h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">Medical Specialization</label>
                      <input
                        type="text"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        placeholder="Cardiology / Pediatrics"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">License Code</label>
                      <input
                        type="text"
                        value={license}
                        onChange={(e) => setLicense(e.target.value)}
                        placeholder="LIC123456"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">Years of Experience</label>
                      <input
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">Professional Biography</label>
                    <textarea
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Share a summary of your clinical credentials, treatments offered, and professional history..."
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Save Profile Changes
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
