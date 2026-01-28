'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Building, Camera, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import axios from 'axios';
import CountryCodeSelector from '@/components/CountryCodeSelector';
import ImageCropper from '@/components/ImageCropper';
import { COUNTRY_CODES } from '@/lib/countries';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/9.x/glass/svg?seed=Felix',
  'https://api.dicebear.com/9.x/glass/svg?seed=Aneka',
  'https://api.dicebear.com/9.x/glass/svg?seed=Bella',
  'https://api.dicebear.com/9.x/glass/svg?seed=Charlie',
  'https://api.dicebear.com/9.x/glass/svg?seed=Max',
  'https://api.dicebear.com/9.x/glass/svg?seed=Luna',
  'https://api.dicebear.com/9.x/glass/svg?seed=Oliver',
  'https://api.dicebear.com/9.x/glass/svg?seed=Sophie',
];

export default function ProfileSetupPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    avatar: AVATAR_OPTIONS[0],
    phone: '',
    countryCode: '+216',
    organization: '',
  });
  const [customAvatar, setCustomAvatar] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarSelect = (avatar) => {
    setFormData({ ...formData, avatar });
    setCustomAvatar(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage) => {
    setCustomAvatar(croppedImage);
    setFormData({ ...formData, avatar: croppedImage });
    setShowCropper(false);
    setTempImage(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSkip = () => {
    router.push('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.put(
        '/api/auth/profile',
        {
          name: formData.name,
          avatar: formData.avatar,
          phone: formData.phone ? `${formData.countryCode}${formData.phone}` : '',
          organization: formData.organization,
          isProfileComplete: true,
        },
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        }
      );

      // Update session with new user data
      await update({
        ...session,
        user: {
          ...session.user,
          ...response.data.user,
        },
      });

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 shadow-xl mb-4">
            <User size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Personnalisez votre profil
          </h1>
          <p className="text-gray-600">Complétez vos informations pour commencer</p>
        </div>

        {/* Setup Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-white p-8 animate-fade-in">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="text-rose-600 flex-shrink-0" size={20} />
              <p className="text-rose-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Upload en cours...</span>
                <span className="text-sm text-gray-500">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Camera size={18} className="inline mr-2" />
                Photo de profil
              </label>
              
              {/* Upload Button */}
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-cyan-500 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-cyan-600 font-medium"
                >
                  <Upload size={20} />
                  {customAvatar ? 'Changer la photo' : 'Importer une photo'}
                </button>
              </div>

              {/* Custom Avatar Preview */}
              {customAvatar && (
                <div className="mb-4 flex justify-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-cyan-500">
                    <img src={customAvatar} alt="Avatar personnalisé" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* Predefined Avatars */}
              {!customAvatar && (
                <>
                  <p className="text-sm text-gray-500 mb-3 text-center">Ou choisissez un avatar</p>
                  <div className="grid grid-cols-4 gap-3">
                    {AVATAR_OPTIONS.map((avatar, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleAvatarSelect(avatar)}
                        className={`p-2 rounded-xl transition-all ${
                          formData.avatar === avatar
                            ? 'ring-4 ring-cyan-500 bg-cyan-50'
                            : 'ring-2 ring-gray-200 hover:ring-cyan-300'
                        }`}
                      >
                        <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-auto" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nom complet *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all duration-200 bg-white text-gray-900 font-medium"
                  placeholder="Votre nom"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Téléphone
              </label>
              <div className="flex gap-2">
                {/* Country Code Selector */}
                <CountryCodeSelector
                  value={formData.countryCode}
                  onChange={(code) => setFormData({ ...formData, countryCode: code })}
                  disabled={loading}
                />
                
                {/* Phone Number Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all duration-200 bg-white text-gray-900 font-medium"
                    placeholder="XX XXX XXX"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Organization */}
            <div>
              <label htmlFor="organization" className="block text-sm font-semibold text-gray-700 mb-2">
                Organisation
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building size={20} className="text-gray-400" />
                </div>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all duration-200 bg-white text-gray-900 font-medium"
                  placeholder="Votre entreprise ou organisation"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleSkip}
                disabled={loading}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Passer
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Terminer</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && tempImage && (
        <ImageCropper
          imageSrc={tempImage}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
