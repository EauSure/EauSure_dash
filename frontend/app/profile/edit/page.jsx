'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Phone, Building, Camera, CheckCircle, AlertCircle, Upload, ArrowLeft, AlertTriangle, X } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import CountryCodeSelector from '@/components/CountryCodeSelector';
import ImageCropper from '@/components/ImageCropper';
import { COUNTRY_CODES } from '@/lib/countries';
import { useAppearance } from '@/contexts/AppearanceContext';

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

export default function ProfileEditPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { t } = useAppearance();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    phone: '',
    countryCode: '+216',
    organization: '',
  });
  const [customAvatar, setCustomAvatar] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  
  const initialValues = useRef({
    name: '',
    avatar: '',
    phone: '',
    organization: '',
  });

  useEffect(() => {
    if (session?.user) {
      // Extract phone number and country code
      const phone = session.user.phone || '';
      let countryCode = '+216';
      let phoneNumber = phone;
      
      if (phone) {
        const matchedCode = COUNTRY_CODES.find(c => phone.startsWith(c.code));
        if (matchedCode) {
          countryCode = matchedCode.code;
          phoneNumber = phone.substring(matchedCode.code.length);
        }
      }

      const initialData = {
        name: session.user.name || '',
        avatar: session.user.avatar || AVATAR_OPTIONS[0],
        phone: phoneNumber,
        countryCode: countryCode,
        organization: session.user.organization || '',
      };

      setFormData(initialData);
      
      // Store initial values for comparison
      initialValues.current = {
        name: initialData.name,
        avatar: initialData.avatar,
        phone: phoneNumber,
        organization: initialData.organization,
      };

      // Check if avatar is custom (base64 or URL)
      if (session.user.avatar && !AVATAR_OPTIONS.includes(session.user.avatar)) {
        setCustomAvatar(session.user.avatar);
      }
    }
  }, [session]);

  // Track unsaved changes
  useEffect(() => {
    const changed = 
      formData.name !== initialValues.current.name ||
      formData.avatar !== initialValues.current.avatar ||
      formData.phone !== initialValues.current.phone ||
      formData.organization !== initialValues.current.organization;
    
    setHasUnsavedChanges(changed);
  }, [formData.name, formData.avatar, formData.phone, formData.organization]);

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleNavigation = (e, href) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      setPendingNavigation(href);
      setShowDiscardModal(true);
    }
  };

  const confirmDiscard = () => {
    setShowDiscardModal(false);
    setHasUnsavedChanges(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  const cancelDiscard = () => {
    setShowDiscardModal(false);
    setPendingNavigation(null);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = session?.user?.token;
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.put(
        `${API_URL}/auth/profile`,
        {
          name: formData.name,
          avatar: formData.avatar,
          phone: formData.phone ? `${formData.countryCode}${formData.phone}` : '',
          organization: formData.organization,
          isProfileComplete: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

      setSuccess(t('profile_save_success'));
      setHasUnsavedChanges(false);
      
      // Update initial values to current values
      initialValues.current = {
        name: formData.name,
        avatar: formData.avatar,
        phone: formData.phone,
        organization: formData.organization,
      };
      
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || t('profile_save_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/settings"
            onClick={(e) => handleNavigation(e, '/settings')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-cyan-600 font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            {t('profile_back_settings')}
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
            {t('profile_edit_title')}
          </h1>
          <p className="text-gray-600 mt-2">{t('profile_edit_subtitle')}</p>
        </div>

        {/* Edit Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-white p-8">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
              <p className="text-emerald-800 text-sm font-medium">{success}</p>
            </div>
          )}

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
                <span className="text-sm font-medium text-gray-700">{t('profile_upload_progress')}</span>
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

            {/* Submit Button */}
            {/* Unsaved Changes Warning */}
            {hasUnsavedChanges && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-yellow-800 mb-4">
                <AlertTriangle size={20} className="flex-shrink-0" />
                <span className="font-medium">Vous avez des modifications non enregistrées</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !hasUnsavedChanges}
              className={`w-full py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                hasUnsavedChanges && !loading
                  ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white hover:scale-105'
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  <span>{hasUnsavedChanges ? 'Enregistrer les modifications' : 'Tout est enregistré'}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Discard Changes Alert Banner */}
      {showDiscardModal && (
        <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
          <div className="max-w-4xl mx-auto m-4">
            <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <AlertTriangle className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    Modifications non enregistrées
                    <span className="text-sm font-normal text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Action requise</span>
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter cette page ?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={cancelDiscard}
                      className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={confirmDiscard}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      Quitter sans enregistrer
                    </button>
                  </div>
                </div>
                <button
                  onClick={cancelDiscard}
                  className="w-8 h-8 rounded-lg hover:bg-orange-100 flex items-center justify-center transition-colors flex-shrink-0"
                  title="Fermer"
                >
                  <X className="text-gray-500" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {showCropper && tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
