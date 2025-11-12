"use client"

import { useState } from "react"
import { useUserAPI } from "@/hooks/useUserAPI"
import LoginDialog from "./LoginPopup";
import { Edit2, Lock, Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

// Main Registration Form
export default function RegisterForm() {
  const { loading, registerUser, updateUser, getUser } = useUserAPI();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    email: '',
    department: '',
    college: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleFileChange = (newFile) => {
    setFile(newFile);
  };
  
  const handleLogin = async (email, regNo) => {
    const user = await getUser(email, regNo)
    console.log(user)
        if (user) {
            setUserData(user)
            setFormData({
            name: user.name,
            regNo: user.regNo,
            email: user.email,
            department: user.department,
            college: user.college,
            })
            // keep the stored image URL
            setFile(null)
            setIsEditMode(true)
            setIsEditable(true)
            setShowLogin(false)
        } else {
            alert("User not found. Please check your credentials.")
        }
    }

  
  const handleSubmit = async () => {
    if (!formData.name || !formData.regNo || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    setUploading(true);
    
    if (isEditMode && userData?._id) {
      const updated = await updateUser(userData._id, formData, file || undefined);
      if (updated) {
        alert('✅ Profile updated successfully!');
        setUserData(updated);
        setIsEditable(false);
      }
    } else {
      const registered = await registerUser(formData, file);
      if (registered) {
        alert('✅ Registered successfully!');
        setUserData(registered);
        setIsEditMode(true);
        setIsEditable(false);
      }
    }
    
    setUploading(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Event Registration</h1>
              <p className="text-gray-400 text-sm">
                {isEditMode ? 'Update your information' : 'Fill in your details to register'}
              </p>
            </div>
            
            {isEditMode && (
              <div className="flex gap-2">
                {!isEditable ? (
                  <button
                    onClick={() => setIsEditable(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditable(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium"
                  >
                    <Lock className="w-4 h-4" />
                    Lock
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Login Link */}
          {!isEditMode && (
            <div className="mb-6 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-gray-300">
                Already registered?{' '}
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-blue-400 hover:text-blue-300 font-semibold underline"
                >
                  Login to edit your information
                </button>
              </p>
            </div>
          )}
          
          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditable}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                name="regNo"
                placeholder="Enter your registration number"
                value={formData.regNo}
                onChange={handleChange}
                disabled={!isEditable}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditable}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Department
              </label>
              <input
                name="department"
                placeholder="Enter your department"
                value={formData.department}
                onChange={handleChange}
                disabled={!isEditable}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                College Name
              </label>
              <input
                name="college"
                placeholder="Enter your college name"
                value={formData.college}
                onChange={handleChange}
                disabled={!isEditable}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Upload College ID Card
              </label>
              <ImageUpload
                value={userData?.idCard || null}
                onChange={handleFileChange}
                disabled={!isEditable}
                uploading={uploading}
            />

            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              {isEditMode && isEditable && (
                <button
                  onClick={() => {
                    setIsEditable(false);
                    setFormData({
                      name: userData.name,
                      regNo: userData.regNo,
                      email: userData.email,
                      department: userData.department,
                      college: userData.college,
                    });
                    setFile(null);
                  }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
              )}
              
              {isEditable && (
                <button
                  onClick={handleSubmit}
                  disabled={loading || uploading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                >
                  {loading || uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {uploading ? 'Uploading...' : 'Submitting...'}
                    </>
                  ) : (
                    isEditMode ? 'Update Profile' : 'Register Now'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <LoginDialog
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}