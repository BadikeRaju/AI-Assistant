import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, Clock, Edit2, Github, Globe, Mail, MapPin, Twitter, X, Trash2, Crop } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import Cropper from 'react-easy-crop';

// Utility to crop image using croppedAreaPixels from react-easy-crop
async function getCroppedImg(imageSrc: string, croppedAreaPixels: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Could not get canvas context');
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      canvas.toBlob((blob) => {
        if (!blob) return reject('Canvas is empty');
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      }, 'image/jpeg');
    };
    image.onerror = () => reject('Failed to load image');
  });
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const { user, updateUser } = useUser();

  // Cropping state
  const [cropModal, setCropModal] = useState<'avatar' | 'banner' | null>(null);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImage(reader.result as string);
        setCropModal('avatar');
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCoverPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImage(reader.result as string);
        setCropModal('banner');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!cropImage || !croppedAreaPixels) return;
    try {
      const croppedImg = await getCroppedImg(cropImage, croppedAreaPixels);
      if (cropModal === 'avatar') {
        updateUser({ avatar: croppedImg });
      } else {
        updateUser({ coverPhoto: croppedImg });
      }
      setCropModal(null);
      setCropImage(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } catch (e) {
      alert('Failed to crop image.');
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  // Remove avatar or banner
  const handleRemove = (type: 'avatar' | 'banner') => {
    if (type === 'avatar') updateUser({ avatar: '' });
    else updateUser({ coverPhoto: '' });
  };

  // Adjust (re-crop) avatar or banner
  const handleAdjust = (type: 'avatar' | 'banner') => {
    if (type === 'avatar' && user.avatar) {
      setCropImage(user.avatar);
      setCropModal('avatar');
    } else if (type === 'banner' && user.coverPhoto) {
      setCropImage(user.coverPhoto);
      setCropModal('banner');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto px-4 py-8"
    >
      {/* Crop Modal */}
      <AnimatePresence>
        {cropModal && cropImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-lg flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-4">Crop {cropModal === 'avatar' ? 'Profile Picture' : 'Banner'}</h2>
              <div className="relative w-full h-72 bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Cropper
                  image={cropImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={cropModal === 'avatar' ? 1 : 3.5}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                  cropShape={cropModal === 'avatar' ? 'round' : 'rect'}
                  showGrid={cropModal === 'banner' ? true : false}
                />
              </div>
              <div className="flex items-center gap-4 w-full mb-4">
                <label className="text-sm">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={e => setZoom(Number(e.target.value))}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
                  onClick={handleCropSave}
                >
                  Save
                </button>
                <button
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition"
                  onClick={() => { setCropModal(null); setCropImage(null); setZoom(1); setCrop({ x: 0, y: 0 }); }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your personal information and account preferences</p>
        </div>
        
        {/* Success Message */}
        <AnimatePresence>
          {showSavedMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-4 py-2 rounded-md flex items-center"
            >
              <Check className="h-4 w-4 mr-2" />
              Profile updated successfully
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
        {/* Cover Photo */}
        <div className="relative w-full" style={{ aspectRatio: '3.5 / 1' }}>
          {user.coverPhoto ? (
            <img
              src={user.coverPhoto}
              alt="Banner"
              className="w-full h-full object-cover rounded-t-lg"
              style={{ aspectRatio: '3.5 / 1' }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary-500 to-primary-700 rounded-t-lg" style={{ aspectRatio: '3.5 / 1' }} />
          )}
          {isEditing && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <label className="bg-white dark:bg-gray-900 p-2 rounded-full shadow-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                <Camera className="h-5 w-5" />
                <input type="file" className="hidden" onChange={handleCoverPhotoUpload} accept="image/*" />
              </label>
              {user.coverPhoto && (
                <>
                  <button
                    className="bg-white dark:bg-gray-900 p-2 rounded-full shadow-lg text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                    onClick={() => handleRemove('banner')}
                    title="Remove banner"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button
                    className="bg-white dark:bg-gray-900 p-2 rounded-full shadow-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    onClick={() => handleAdjust('banner')}
                    title="Adjust banner"
                  >
                    <Crop className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="relative flex justify-between items-start">
            <div className="flex items-end absolute -top-20">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                />
                {isEditing && (
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <label className="bg-primary-600 p-2 rounded-full shadow-lg text-white cursor-pointer">
                      <Camera className="h-4 w-4" />
                      <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                    </label>
                    {user.avatar && (
                      <>
                        <button
                          className="bg-primary-600 p-2 rounded-full shadow-lg text-white hover:text-red-300"
                          onClick={() => handleRemove('avatar')}
                          title="Remove profile picture"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          className="bg-primary-600 p-2 rounded-full shadow-lg text-white hover:text-yellow-300"
                          onClick={() => handleAdjust('avatar')}
                          title="Adjust profile picture"
                        >
                          <Crop className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Edit Profile Button - Moved to top right */}
            <div className="ml-auto pt-4">
              {isEditing ? (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1.5" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-full shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
                  >
                    <Check className="h-4 w-4 mr-1.5" />
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Name and Username Section - Moved below avatar */}
          <div className="mt-24 mb-4">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => updateUser({ name: e.target.value })}
                    className="w-full text-xl font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">@</span>
                    <input
                      type="text"
                      value={user.username}
                      onChange={(e) => updateUser({ username: e.target.value })}
                      className="w-full text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
              </>
            )}
          </div>

          {/* Bio and Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About</h3>
            {isEditing ? (
              <textarea
                value={user.bio}
                onChange={(e) => updateUser({ ...user, bio: e.target.value })}
                className="w-full p-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-500"
                rows={3}
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300 mb-4">{user.bio}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                {isEditing ? (
                  <input
                    type="text"
                    value={user.location}
                    onChange={(e) => updateUser({ ...user, location: e.target.value })}
                    className="bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <span>{user.location}</span>
                )}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                {isEditing ? (
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => updateUser({ ...user, email: e.target.value })}
                    className="bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <span>{user.email}</span>
                )}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Globe className="h-4 w-4 mr-2" />
                {isEditing ? (
                  <input
                    type="text"
                    value={user.website}
                    onChange={(e) => updateUser({ ...user, website: e.target.value })}
                    className="bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                    {user.website}
                  </a>
                )}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Github className="h-4 w-4 mr-2" />
                {isEditing ? (
                  <input
                    type="text"
                    value={user.github}
                    onChange={(e) => updateUser({ ...user, github: e.target.value })}
                    className="bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                    @{user.github}
                  </a>
                )}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Twitter className="h-4 w-4 mr-2" />
                {isEditing ? (
                  <input
                    type="text"
                    value={user.twitter}
                    onChange={(e) => updateUser({ ...user, twitter: e.target.value })}
                    className="bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                    @{user.twitter}
                  </a>
                )}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <span className="text-sm">{user.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Skills</h3>
              {isEditing && (
                <button 
                  onClick={() => {
                    const skill = prompt('Add a new skill:');
                    if (skill && !user.skills.includes(skill)) {
                      updateUser({...user, skills: [...user.skills, skill]});
                    }
                  }}
                  className="text-primary-600 dark:text-primary-400 flex items-center"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Add Skill
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full flex items-center"
                >
                  {skill}
                  {isEditing && (
                    <button 
                      onClick={() => {
                        const newSkills = [...user.skills];
                        newSkills.splice(index, 1);
                        updateUser({...user, skills: newSkills});
                      }}
                      className="ml-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-col space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <Github className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Completed "Advanced React Patterns" challenge</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday at 2:30 PM</p>
                </div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Completed a 90-minute Pomodoro session</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile; 