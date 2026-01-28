'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Palette, Sun, Moon, Monitor, Type, Globe, CheckCircle, Layout, AlertTriangle, X } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useAppearance } from '@/contexts/AppearanceContext';

export default function AppearancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    density,
    setDensity,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    language,
    setLanguage,
    savePreferences,
    t,
  } = useAppearance();
  
  const [saved, setSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  
  // Store initial values
  const initialValues = useRef({
    theme,
    accentColor,
    density,
    fontSize,
    fontFamily,
    language,
  });

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  // Track unsaved changes
  useEffect(() => {
    const changed = 
      theme !== initialValues.current.theme ||
      accentColor !== initialValues.current.accentColor ||
      density !== initialValues.current.density ||
      fontSize !== initialValues.current.fontSize ||
      fontFamily !== initialValues.current.fontFamily ||
      language !== initialValues.current.language;
    
    setHasUnsavedChanges(changed);
  }, [theme, accentColor, density, fontSize, fontFamily, language]);

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
    // Reset all values to initial state
    setTheme(initialValues.current.theme);
    setAccentColor(initialValues.current.accentColor);
    setDensity(initialValues.current.density);
    setFontSize(initialValues.current.fontSize);
    setFontFamily(initialValues.current.fontFamily);
    setLanguage(initialValues.current.language);
    
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

  const handleSave = () => {
    savePreferences();
    setSaved(true);
    setHasUnsavedChanges(false);
    // Update initial values
    initialValues.current = {
      theme,
      accentColor,
      density,
      fontSize,
      fontFamily,
      language,
    };
    setTimeout(() => setSaved(false), 3000);
  };

  const themes = [
    { 
      id: 'light', 
      name: t('theme_light'), 
      icon: Sun, 
      description: t('theme_light_desc'),
      preview: 'bg-white border-gray-300'
    },
    { 
      id: 'dark', 
      name: t('theme_dark'), 
      icon: Moon, 
      description: t('theme_dark_desc'),
      preview: 'bg-gray-900 border-gray-700'
    },
    { 
      id: 'auto', 
      name: t('theme_auto'), 
      icon: Monitor, 
      description: t('theme_auto_desc'),
      preview: 'bg-gradient-to-r from-white to-gray-900'
    },
  ];

  const accentColors = [
    { id: 'blue', name: t('color_blue'), color: 'bg-blue-500', ring: 'ring-blue-500', text: 'text-blue-600', brand: t('brand_github') },
    { id: 'purple', name: t('color_purple'), color: 'bg-purple-500', ring: 'ring-purple-500', text: 'text-purple-600', brand: t('brand_twitch') },
    { id: 'green', name: t('color_green'), color: 'bg-green-500', ring: 'ring-green-500', text: 'text-green-600', brand: t('brand_whatsapp') },
    { id: 'orange', name: t('color_orange'), color: 'bg-orange-500', ring: 'ring-orange-500', text: 'text-orange-600', brand: t('brand_soundcloud') },
    { id: 'pink', name: t('color_pink'), color: 'bg-pink-500', ring: 'ring-pink-500', text: 'text-pink-600', brand: t('brand_dribbble') },
    { id: 'indigo', name: t('color_indigo'), color: 'bg-indigo-500', ring: 'ring-indigo-500', text: 'text-indigo-600', brand: t('brand_facebook') },
    { id: 'teal', name: t('color_teal'), color: 'bg-teal-500', ring: 'ring-teal-500', text: 'text-teal-600', brand: t('brand_tailwind') },
    { id: 'red', name: t('color_red'), color: 'bg-red-500', ring: 'ring-red-500', text: 'text-red-600', brand: t('brand_youtube') },
  ];

  const densityOptions = [
    { id: 'compact', name: t('density_compact'), description: t('density_compact_desc'), spacing: 'py-1', brand: t('brand_gmail') },
    { id: 'comfortable', name: t('density_comfortable'), description: t('density_comfortable_desc'), spacing: 'py-2', brand: t('brand_notion') },
    { id: 'spacious', name: t('density_spacious'), description: t('density_spacious_desc'), spacing: 'py-4', brand: t('brand_apple') },
  ];

  const fontSizes = [
    { id: 'small', name: t('font_small'), size: 'text-sm', example: '14px' },
    { id: 'medium', name: t('font_medium'), size: 'text-base', example: '16px' },
    { id: 'large', name: t('font_large'), size: 'text-lg', example: '18px' },
    { id: 'xlarge', name: t('font_xlarge'), size: 'text-xl', example: '20px' },
  ];

  const fontFamilies = [
    { id: 'inter', name: 'Inter', class: 'font-sans', brand: t('brand_github') },
    { id: 'system', name: 'System', class: 'font-system', brand: t('brand_apple') },
    { id: 'mono', name: 'Monospace', class: 'font-mono', brand: t('brand_vscode') },
  ];

  const languages = [
    { id: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
    { id: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
    { id: 'ar', name: 'العربية', flag: '🇹🇳', nativeName: 'العربية' },
    { id: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/settings"
            onClick={(e) => handleNavigation(e, '/settings')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">{t('appearance_back_settings')}</span>
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
              <Palette className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                {t('appearance_title')}
              </h1>
              <p className="text-gray-600">
                {t('appearance_subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Sun size={24} className="text-orange-600" />
                {t('appearance_theme')}
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{t('inspired_by')} {t('brand_github')}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                return (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                      theme === themeOption.id
                        ? 'border-orange-500 bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    <Icon className={`mx-auto mb-3 ${theme === themeOption.id ? 'text-orange-600' : 'text-gray-400'}`} size={32} />
                    <h3 className="font-bold text-gray-800 mb-1">{themeOption.name}</h3>
                    <p className="text-xs text-gray-600">{themeOption.description}</p>
                    <div className={`mt-3 h-8 rounded-lg border-2 ${themeOption.preview}`}></div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Colors */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Palette size={24} className="text-orange-600" />
                {t('appearance_accent_color')}
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{t('inspired_by')} {t('brand_github')}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {accentColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setAccentColor(color.id)}
                  className={`preserve-color group relative p-3 rounded-xl border-2 transition-all duration-300 ${
                    accentColor === color.id
                      ? `border-${color.id}-500 bg-${color.id}-50 shadow-md`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`preserve-color w-10 h-10 ${color.color} rounded-lg mx-auto mb-2 shadow-sm ${
                    accentColor === color.id ? `ring-2 ${color.ring}` : ''
                  }`}></div>
                  <p className="text-xs font-semibold text-gray-800 text-center">{color.name}</p>
                  <p className="text-[10px] text-gray-500 text-center mt-1">{color.brand}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Density */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Layout size={24} className="text-orange-600" />
                {t('appearance_density')}
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{t('inspired_by')} {t('brand_gmail')}/{t('brand_notion')}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {densityOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setDensity(option.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    density === option.id
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300 bg-white'
                  }`}
                >
                  <div className="space-y-1 mb-3">
                    <div className={`bg-gray-300 rounded h-3 w-full ${option.spacing}`}></div>
                    <div className={`bg-gray-300 rounded h-3 w-3/4 ${option.spacing}`}></div>
                    <div className={`bg-gray-300 rounded h-3 w-1/2 ${option.spacing}`}></div>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{option.name}</h3>
                  <p className="text-xs text-gray-600 mb-1">{option.description}</p>
                  <p className="text-[10px] text-gray-500">{option.brand}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Type size={24} className="text-orange-600" />
                {t('appearance_font_size')}
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{t('inspired_by')} {t('brand_apple')}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {fontSizes.map((sizeOption) => (
                <button
                  key={sizeOption.id}
                  onClick={() => setFontSize(sizeOption.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    fontSize === sizeOption.id
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300 bg-white'
                  }`}
                >
                  <div className={`font-bold text-gray-800 mb-2 ${sizeOption.size}`}>Aa</div>
                  <h3 className="font-bold text-gray-800 text-sm">{sizeOption.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{sizeOption.example}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Type size={24} className="text-orange-600" />
                {t('appearance_font_family')}
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{t('inspired_by')} {t('brand_vscode')}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fontFamilies.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setFontFamily(font.id)}
                  className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                    fontFamily === font.id
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300 bg-white'
                  }`}
                >
                  <div className={`${font.class} text-2xl font-bold text-gray-800 mb-3`}>
                    The quick brown fox
                  </div>
                  <h3 className="font-bold text-gray-800">{font.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{font.brand}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Globe size={24} className="text-orange-600" />
                {t('appearance_language')}
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{t('inspired_by')} {t('brand_apple')}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {languages.map((langOption) => (
                <button
                  key={langOption.id}
                  onClick={() => setLanguage(langOption.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    language === langOption.id
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300 bg-white'
                  }`}
                >
                  <div className="text-4xl mb-3">{langOption.flag}</div>
                  <h3 className="font-bold text-gray-800 mb-1">{langOption.name}</h3>
                  <p className="text-xs text-gray-600">{langOption.nativeName}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 mb-3 animate-fade-in">
              <CheckCircle size={20} className="flex-shrink-0" />
              <span className="font-semibold">{t('appearance_save_success')}</span>
            </div>
          )}

          {/* Unsaved Changes Warning */}
          {hasUnsavedChanges && (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-yellow-800 mb-3">
              <AlertTriangle size={20} className="flex-shrink-0" />
              <span className="font-medium">{t('appearance_unsaved_warning')}</span>
            </div>
          )}
          
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className={`w-full font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
              hasUnsavedChanges
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white scale-100 hover:scale-[1.02]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle size={20} />
            {hasUnsavedChanges ? t('appearance_save_all') : t('appearance_all_saved')}
          </button>
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
                      {t('discard_title')}
                      <span className="text-sm font-normal text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">{t('action_required')}</span>
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {t('discard_message')}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={cancelDiscard}
                        className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow"
                      >
                        {t('discard_cancel')}
                      </button>
                      <button
                        onClick={confirmDiscard}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                      >
                        {t('discard_confirm')}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={cancelDiscard}
                    className="w-8 h-8 rounded-lg hover:bg-orange-100 flex items-center justify-center transition-colors flex-shrink-0"
                    title={t('close')}
                  >
                    <X className="text-gray-500" size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
