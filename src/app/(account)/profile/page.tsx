"use client";

import React, { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import { Icons } from "~/components/ui/icons";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { Badge } from "~/components/ui/badge";
import { formatDate } from "~/lib/date";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  emailVerified?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const session = await getSession();
        if (session?.user) {
          setUser(session.user as UserProfile);
          setFormData({
            name: session.user.name || "",
            email: session.user.email || "",
            phone: (session.user as UserProfile).phone || "",
          });
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error",
          description: "Failed to load profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, toast]);

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setUser({ ...user!, ...formData });
        setEditMode(false);
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating profile.",
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (res.ok) {
        setPasswordMode(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        toast({
          title: "Success",
          description: "Password changed successfully.",
        });
      } else {
        const data = await res.json();
        toast({
          title: "Error",
          description: data.error || "Failed to change password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description: "An error occurred while changing password.",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <main
      className="w-full min-h-screen text-white relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at top, #1a1a1a 0%, #000000 50%, #0a0a0a 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* 3D Grid Background Effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 214, 0, 0.15) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255, 214, 0, 0.15) 2px, transparent 2px)
          `,
          backgroundSize: "80px 80px",
          transform: "perspective(800px) rotateX(60deg) scale(2)",
          transformOrigin: "center top",
          animation: "gridMove 20s linear infinite",
        }}
      />

      {/* 3D Floating Geometric Shapes */}
      <div
        className="absolute top-20 left-[10%] w-32 h-32 opacity-10"
        style={{
          background: "linear-gradient(135deg, #FFD600 0%, transparent 100%)",
          transform: "rotateX(45deg) rotateY(45deg)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-40 right-[15%] w-40 h-40 opacity-10"
        style={{
          background: "linear-gradient(225deg, #FFD600 0%, transparent 100%)",
          transform: "rotateX(-45deg) rotateY(-45deg)",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      {/* Floating Orbs with 3D effect */}
      <div
        className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255, 214, 0, 0.15) 0%, transparent 70%)",
          animation: "pulse 4s ease-in-out infinite, float 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255, 214, 0, 0.1) 0%, transparent 70%)",
          animation: "pulse 5s ease-in-out infinite 1s, float 10s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "radial-gradient(circle, rgba(255, 214, 0, 0.08) 0%, transparent 70%)",
          animation: "pulse 6s ease-in-out infinite 2s",
        }}
      />

      {/* Animated particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle ${5 + Math.random() * 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 80px;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotateX(45deg) rotateY(45deg);
          }
          50% {
            transform: translateY(-20px) rotateX(50deg) rotateY(50deg);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.1);
          }
        }
        @keyframes particle {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(1);
            opacity: 0;
          }
        }
      `}</style>

      <div className="relative z-10 container mx-auto max-w-[1400px] pt-20 pb-12">
        {/* Header */}
        <section className="mb-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Badge variant="secondary" className="bg-yellow-400 text-black">
              {formatDate(new Date())}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400">Profile</h1>
            <p className="text-slate-300 text-sm">Manage your account information</p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-2xl">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Icons.spinner color="#fbbf24" width={32} height={32} />
            </div>
          ) : user ? (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="rounded-2xl border border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 via-black to-black backdrop-blur-lg p-8 shadow-lg">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-24 h-24 rounded-full border-2 border-yellow-400/40 object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-2 border-yellow-400/40 bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 flex items-center justify-center">
                        <span className="text-3xl font-bold text-yellow-400">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
                    <p className="text-yellow-400/70 text-sm mb-2">{user.email}</p>
                    {user.phone && (
                      <p className="text-gray-400 text-sm mb-4">📱 {user.phone}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {user.emailVerified && (
                        <Badge className="bg-green-500/30 text-green-300">Email Verified</Badge>
                      )}
                      <Badge className="bg-blue-500/30 text-blue-300">Active Account</Badge>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <div>
                    {!editMode && (
                      <Button
                        onClick={() => setEditMode(true)}
                        className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-6 py-3 rounded-xl"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              {editMode && (
                <div className="rounded-2xl border border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 via-black to-black backdrop-blur-lg p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-yellow-400 mb-6">Edit Profile</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-black/50 border border-yellow-400/20 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/60 transition"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-black/50 border border-yellow-400/20 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/60 transition"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Mobile Number <span className="text-gray-500 text-xs">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-black/50 border border-yellow-400/20 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/60 transition"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saveLoading}
                      className="flex-1 bg-green-500 text-white hover:bg-green-600 font-bold py-3 rounded-xl"
                    >
                      {saveLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      onClick={() => setEditMode(false)}
                      className="flex-1 bg-gray-700 text-white hover:bg-gray-600 font-bold py-3 rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Account Security Section */}
              <div className="rounded-2xl border border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 via-black to-black backdrop-blur-lg p-8 shadow-lg">
                <h3 className="text-xl font-bold text-yellow-400 mb-6">Account Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-yellow-400/10">
                    <div>
                      <p className="font-semibold text-white">Password</p>
                      <p className="text-sm text-gray-400">Keep your account secure</p>
                    </div>
                    <Button 
                      onClick={() => setPasswordMode(!passwordMode)}
                      className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-4 py-2 rounded-lg text-sm"
                    >
                      {passwordMode ? "Cancel" : "Change"}
                    </Button>
                  </div>
                </div>

                {/* Password Change Form */}
                {passwordMode && (
                  <div className="mt-6 p-6 bg-black/40 rounded-lg border border-yellow-400/10">
                    <h4 className="text-lg font-bold text-yellow-400 mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-lg bg-black/50 border border-yellow-400/20 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/60 transition"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-lg bg-black/50 border border-yellow-400/20 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/60 transition"
                          placeholder="Enter new password (min 8 characters)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-lg bg-black/50 border border-yellow-400/20 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/60 transition"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <Button
                        onClick={handleChangePassword}
                        disabled={passwordLoading}
                        className="w-full bg-green-500 text-white hover:bg-green-600 font-bold py-3 rounded-xl"
                      >
                        {passwordLoading ? "Changing..." : "Update Password"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Actions */}
              <div className="rounded-2xl border border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 via-black to-black backdrop-blur-lg p-8 shadow-lg">
                <h3 className="text-xl font-bold text-yellow-400 mb-6">Account Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleSignOut}
                    className="w-full bg-red-500/30 text-red-300 hover:bg-red-500/50 font-bold py-3 rounded-lg border border-red-400/20"
                  >
                    Sign Out
                  </Button>
                  <Button className="w-full bg-red-950/40 text-red-300 hover:bg-red-950/60 font-bold py-3 rounded-lg border border-red-900/30">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">Unable to load profile.</div>
          )}
        </section>
      </div>
    </main>
  );
}
