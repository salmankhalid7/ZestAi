import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { User, Mail, Save, ArrowLeft, Edit2, Loader2 } from "lucide-react";
import { 
  getCurrentUser, 
  updateUserProfile
} from "../services/Api/userService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: ""
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res);
      setFormData({
        name: res.name || ""
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateProfile = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (formData.name.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateUserProfile(formData);
      setUser(res);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getFirstLetter = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm mb-2 sm:mb-3"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Manage your account information</p>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="self-start sm:self-center inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Avatar Section - First Letter Only */}
          <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 h-20 sm:h-24">
            <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 shadow-md">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                  {getFirstLetter(formData.name)}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-10 sm:pt-12 pb-6 px-4 sm:px-6">
            {isEditing ? (
              /* Edit Form */
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm sm:text-base"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 text-sm sm:text-base">
                    <Mail size={16} className="flex-shrink-0" />
                    <span className="break-all">{user?.email}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">Email cannot be changed</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={updateProfile}
                    disabled={isSaving}
                    className="order-2 sm:order-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || ""
                      });
                    }}
                    className="order-1 sm:order-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all text-sm sm:text-base font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 break-words">
                  {formData.name || "No name set"}
                </h2>
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-3 break-all">
                  <Mail size={14} className="flex-shrink-0" />
                  <span>{user?.email}</span>
                </div>

                {!formData.name && (
                  <div className="mt-6 py-6 sm:py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm">No profile information yet</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium inline-flex items-center gap-1"
                    >
                      Add your name
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;