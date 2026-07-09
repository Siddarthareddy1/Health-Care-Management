"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { usePatients, useDoctors, useUsers } from "../../../hooks/useFirestore";
import { useToast } from "../../../hooks/useNotification";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema } from "../../../lib/validators";
import { z } from "zod";
import { User as UserIcon, Phone, Mail, Award, Calendar, Contact2, Heart } from "lucide-react";

type ProfileInputs = z.infer<typeof ProfileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { patients, savePatient } = usePatients();
  const { doctors, saveDoctor } = useDoctors();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Forms
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileInputs>({
    resolver: zodResolver(ProfileSchema),
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

  const onSubmit = async (data: ProfileInputs) => {
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

      showToast("success", "Profile Updated", "Your medical profile settings have been successfully saved.");
    } catch (e: any) {
      showToast("error", "Update Failed", e.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-healthcare-textDark">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-healthcare-textDark font-display tracking-tight font-sans">My Account Profile</h1>
        <p className="text-sm text-healthcare-textMedium font-medium mt-1">Review credentials, change contact information, and edit clinical fields.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card View */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center py-8">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full border border-healthcare-border object-cover mx-auto mb-4"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-healthcare-primary text-white flex items-center justify-center font-bold text-3xl mx-auto mb-4 font-display">
                {user?.name ? user.name[0] : "U"}
              </div>
            )}
            <h3 className="text-lg font-bold text-healthcare-textDark font-display">{user?.name}</h3>
            <p className="text-xs text-healthcare-textMedium font-semibold uppercase tracking-wider mt-0.5">{user?.role}</p>
            
            <div className="border-t border-healthcare-border mt-6 pt-6 text-left space-y-3 text-xs font-semibold text-healthcare-textMedium">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-healthcare-textLight" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-healthcare-textLight" />
                <span>{user?.phone}</span>
              </div>
              {role === "doctor" && specialization && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-healthcare-textLight" />
                  <span>{specialization} Specialist</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Profile form */}
        <div className="lg:col-span-2">
          <Card title="Update Profile Settings" subtitle="Keep your clinic documentation parameters accurate">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-healthcare-textMedium mb-1">Full Name</label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
                      errors.name ? "border-healthcare-error" : "border-healthcare-border"
                    }`}
                    {...register("name")}
                  />
                  {errors.name && <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-healthcare-textMedium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
                      errors.phone ? "border-healthcare-error" : "border-healthcare-border"
                    }`}
                    {...register("phone")}
                  />
                  {errors.phone && <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-healthcare-textMedium mb-1">Avatar Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
                    errors.avatar ? "border-healthcare-error" : "border-healthcare-border"
                  }`}
                  {...register("avatar")}
                />
                {errors.avatar && <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.avatar.message}</p>}
              </div>

              {/* Patient Fields */}
              {role === "patient" && (
                <div className="space-y-4 border-t border-healthcare-border pt-4">
                  <h4 className="text-sm font-bold text-healthcare-textDark font-display flex items-center gap-1.5"><Heart className="w-4 h-4 text-healthcare-primary" /> Patient Medical Demographics</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-healthcare-textMedium mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-healthcare-textMedium mb-1">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2 border border-healthcare-border rounded-standard bg-white text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
                      >
                        <option value="">-- Select Gender --</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-healthcare-textMedium mb-1">Residential Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Care Ave, Medical City"
                      className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
                    />
                  </div>

                  <div className="border-t border-healthcare-border pt-4">
                    <h5 className="text-xs font-bold text-healthcare-textDark mb-3 flex items-center gap-1.5"><Contact2 className="w-4 h-4 text-healthcare-textLight" /> Emergency Contact Sheet</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-healthcare-textMedium mb-1">Contact Name</label>
                        <input
                          type="text"
                          value={emergencyName}
                          onChange={(e) => setEmergencyName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-healthcare-textMedium mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={emergencyPhone}
                          onChange={(e) => setEmergencyPhone(e.target.value)}
                          placeholder="9876543215"
                          className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-healthcare-textMedium mb-1">Relationship</label>
                        <input
                          type="text"
                          value={emergencyRelation}
                          onChange={(e) => setEmergencyRelation(e.target.value)}
                          placeholder="Spouse / Mother"
                          className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Doctor Fields */}
              {role === "doctor" && (
                <div className="space-y-4 border-t border-healthcare-border pt-4">
                  <h4 className="text-sm font-bold text-healthcare-textDark font-display flex items-center gap-1.5"><Award className="w-4 h-4 text-healthcare-primary" /> Doctor Availability & Credentials</h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-healthcare-textMedium mb-1">Medical Specialization</label>
                      <input
                        type="text"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        placeholder="Cardiology / Pediatrics"
                        className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-healthcare-textMedium mb-1">License Code</label>
                      <input
                        type="text"
                        value={license}
                        onChange={(e) => setLicense(e.target.value)}
                        placeholder="LIC123456"
                        className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-healthcare-textMedium mb-1">Years of Experience</label>
                      <input
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-healthcare-textMedium mb-1">Professional Biography</label>
                    <textarea
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Share a summary of your clinical credentials, treatments offered, and professional history..."
                      className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
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
