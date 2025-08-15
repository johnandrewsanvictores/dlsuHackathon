import React, { useState, useEffect } from "react";
import Navbar from "../components/navigation/nav";
import api from "../../axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  });
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/profile');
      const userData = response.data;
      
      setUser(userData);
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        username: userData.username || ''
      });

      // Check if user has resume
      if (userData.resumeContext && userData.resumeContext.length > 0) {
        setResumeInfo({
          fileName: 'Resume.pdf', // Default name since we don't store filename
          uploadDate: userData.updatedAt || userData.createdAt,
          hasResume: true,
          resumeLength: userData.resumeContext.length
        });
      }
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // Fallback to localStorage for development
      const storedUser = localStorage.getItem("authUser");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            username: userData.username || ''
          });
        } catch (err) {
          console.error('Error parsing user data:', err);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/user/profile', formData);
      
      // Update local state
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      setIsEditing(false);
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF file only.');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 10MB.');
      return;
    }

    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // Update resume info
      setResumeInfo({
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        fileSize: file.size,
        hasResume: true,
        resumeLength: response.data?.text?.length || 0
      });

      alert('Resume uploaded successfully! Your job matches will be updated.');
      
      // Refresh user profile to get updated resume context
      await fetchUserProfile();
      
    } catch (error) {
      console.error('Error uploading resume:', error);
      
      let errorMessage = 'Failed to upload resume. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      alert(errorMessage);
    } finally {
      setUploadingResume(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleResumeDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your resume? This action cannot be undone.')) {
      return;
    }

    setUploadingResume(true);
    try {
      // Since there's no delete endpoint, we'll call the profile update to clear resume context
      // This might need to be implemented in the backend
      await api.delete('/resume');
      
      setResumeInfo(null);
      alert('Resume deleted successfully.');
      
      // Refresh user profile
      await fetchUserProfile();
      
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume. You can upload a new one to replace it.');
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-slate-200 rounded-lg"></div>
              </div>
              <div>
                <div className="h-32 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-poppins text-3xl font-bold text-slate-900">
            Profile Settings
          </h1>
          <p className="font-roboto mt-2 text-slate-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Form */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-poppins text-lg font-semibold text-slate-900">
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-lg bg-brand-honey px-4 py-2 text-sm font-medium text-brand-bee transition-colors hover:bg-brand-honey-600"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          firstName: user.firstName || '',
                          lastName: user.lastName || '',
                          email: user.email || '',
                          username: user.username || ''
                        });
                      }}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-lg bg-brand-honey px-4 py-2 text-sm font-medium text-brand-bee transition-colors hover:bg-brand-honey-600 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-honey disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-honey disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-honey disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-honey disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-poppins text-lg font-semibold text-slate-900 mb-4">
                Resume
              </h3>
              
              {resumeInfo ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-green-100 p-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-900">
                          Resume uploaded successfully
                        </p>
                        <p className="text-xs text-green-600">
                          Uploaded {new Date(resumeInfo.uploadDate).toLocaleDateString()}
                          {resumeInfo.resumeLength && ` • ${Math.round(resumeInfo.resumeLength / 1000)}k characters`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block w-full cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeUpload}
                        disabled={uploadingResume}
                        className="hidden"
                      />
                      <div className={`rounded-lg border border-dashed border-slate-300 p-3 text-center transition-colors ${
                        uploadingResume 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:border-brand-honey hover:bg-brand-honey-50 cursor-pointer'
                      }`}>
                        {uploadingResume ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-brand-honey border-t-transparent rounded-full animate-spin mr-2"></div>
                            <span className="text-sm font-medium text-slate-700">Uploading...</span>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-slate-700">Update Resume</span>
                        )}
                      </div>
                    </label>
                    
                    <button
                      onClick={handleResumeDelete}
                      disabled={uploadingResume}
                      className={`rounded-lg border border-red-300 p-3 text-center transition-colors ${
                        uploadingResume 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:border-red-400 hover:bg-red-50 text-red-700'
                      }`}
                    >
                      <span className="text-sm font-medium">Delete Resume</span>
                    </button>
                  </div>
                </div>
              ) : (
                <label className={`block w-full ${uploadingResume ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    disabled={uploadingResume}
                    className="hidden"
                  />
                  <div className={`rounded-lg border border-dashed border-slate-300 p-6 text-center transition-colors ${
                    uploadingResume 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:border-brand-honey hover:bg-brand-honey-50'
                  }`}>
                    {uploadingResume ? (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 mb-3 rounded-lg bg-brand-honey-50 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-brand-honey border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          Uploading Resume...
                        </span>
                        <p className="text-xs text-slate-500 mt-1">
                          Please wait while we process your file
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="mx-auto w-12 h-12 mb-3 rounded-lg bg-brand-honey-50 flex items-center justify-center">
                          <svg className="w-6 h-6 text-brand-honey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          Upload Resume
                        </span>
                        <p className="text-xs text-slate-500 mt-1">
                          PDF files only (max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              )}
            </div>

            {/* Account Stats */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-poppins text-lg font-semibold text-slate-900 mb-4">
                Account Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Member since</span>
                  <span className="font-medium text-slate-900">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Total applications</span>
                  <span className="font-medium text-slate-900">-</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Jobs viewed</span>
                  <span className="font-medium text-slate-900">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
