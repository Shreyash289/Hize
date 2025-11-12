import React, { useState, useRef } from 'react';
import { Upload, X, Eye, Loader2, Edit2, Lock, LogIn } from 'lucide-react';


// Login Dialog Component
export default function LoginDialog({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [regNo, setRegNo] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!email || !regNo) {
      alert('Please fill in both fields');
      return;
    }
    setLoading(true);
    await onLogin(email, regNo);
    setLoading(false);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <LogIn className="w-6 h-6" />
            Login to Edit
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="your.email@example.com"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Registration Number</label>
            <input
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="REG123456"
              disabled={loading}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Continue'
              )}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};