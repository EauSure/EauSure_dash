'use client';

import { useState } from 'react';
import { ArrowLeft, Palette, Sun, Moon, Monitor, Type, Globe, CheckCircle, Zap, Layout, Contrast } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function AppearancePage() {
  const { data: session, status } = useSession();
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('blue');
  const [density, setDensity] = useState('comfortable');
  const [fontSize, setFontSize] = useState('medium');
  const [fontFamily, setFontFamily] = useState('inter');
  const [language, setLanguage] = useState('fr');
  const [saved, setSaved] = useState(false);

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  const handleSave = () => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('accentColor', accentColor);
    localStorage.setItem('density', density);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('language', language);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const themes = [
    { 
      id: 'light', 
      name: 'Clair', 
      icon: Sun, 
      description: 'Mode clair classique',
      preview: 'bg-white border-gray-300'
    },
    { 
      id: 'dark', 
      name: 'Sombre', 
      icon: Moon, 
      description: 'Mode sombre élégant',
      preview: 'bg-gray-900 border-gray-700'
    },
    { 
      id: 'auto', 
      name: 'Auto', 
      icon: Monitor, 
      description: 'Adapté au système',
      preview: 'bg-gradient-to-r from-white to-gray-900'
    },
  ];

  const accentColors = [
    { id: 'blue', name: 'Bleu', color: 'bg-blue-500', ring: 'ring-blue-500', text: 'text-blue-600', brand: 'GitHub' },
    { id: 'purple', name: 'Violet', color: 'bg-purple-500', ring: 'ring-purple-500', text: 'text-purple-600', brand: 'Twitch' },
    { id: 'green', name: 'Vert', color: 'bg-green-500', ring: 'ring-green-500', text: 'text-green-600', brand: 'WhatsApp' },
    { id: 'orange', name: 'Orange', color: 'bg-orange-500', ring: 'ring-orange-500', text: 'text-orange-600', brand: 'SoundCloud' },
    { id: 'pink', name: 'Rose', color: 'bg-pink-500', ring: 'ring-pink-500', text: 'text-pink-600', brand: 'Dribbble' },
    { id: 'indigo', name: 'Indigo', color: 'bg-indigo-500', ring: 'ring-indigo-500', text: 'text-indigo-600', brand: 'Facebook' },
    { id: 'teal', name: 'Turquoise', color: 'bg-teal-500', ring: 'ring-teal-500', text: 'text-teal-600', brand: 'Tailwind' },
    { id: 'red', name: 'Rouge', color: 'bg-red-500', ring: 'ring-red-500', text: 'text-red-600', brand: 'YouTube' },
  ];

  const densityOptions = [
    { id: 'compact', name: 'Compact', description: 'Plus d\'informations', spacing: 'py-1', brand: 'Gmail' },
    { id: 'comfortable', name: 'Confortable', description: 'Équilibré', spacing: 'py-2', brand: 'Notion' },
    { id: 'spacious', name: 'Spacieux', description: 'Plus d\'espace', spacing: 'py-4', brand: 'Apple' },
  ];

  const fontSizes = [
    { id: 'small', name: 'Petit', size: 'text-sm', example: '14px' },
    { id: 'medium', name: 'Moyen', size: 'text-base', example: '16px' },
    { id: 'large', name: 'Grand', size: 'text-lg', example: '18px' },
    { id: 'xlarge', name: 'Très grand', size: 'text-xl', example: '20px' },
  ];

  const fontFamilies = [
    { id: 'inter', name: 'Inter', class: 'font-sans', brand: 'GitHub' },
    { id: 'system', name: 'System', class: 'font-system', brand: 'Apple' },
    { id: 'mono', name: 'Monospace', class: 'font-mono', brand: 'VS Code' },
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
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Retour aux paramètres</span>
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
              <Palette className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Apparence
              </h1>
              <p className="text-gray-600">
                Personnalisez l'interface selon vos préférences
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
                Thème
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Inspiré de GitHub</span>
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
                Couleur d'accent
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Sites populaires</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {accentColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setAccentColor(color.id)}
                  className={`group relative p-3 rounded-xl border-2 transition-all duration-300 ${
                    accentColor === color.id
                      ? `border-${color.id}-500 bg-${color.id}-50 shadow-md`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 ${color.color} rounded-lg mx-auto mb-2 shadow-sm ${
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
                Densité de l'interface
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Style Gmail/Notion</span>
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
                Taille du texte
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Accessibilité</span>
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
                Police de caractères
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Style VS Code</span>
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
                Langue
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Multilingue</span>
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

          {/* Save Button */}
          <div className="sticky bottom-6 z-10">
            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Enregistrer toutes les préférences
            </button>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 animate-pulse">
              <CheckCircle size={20} className="flex-shrink-0" />
              <span className="font-semibold">Préférences enregistrées avec succès !</span>
            </div>
          )}
        </div>

        {/* Preview Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Zap size={20} />
              Prochainement
            </h3>
            <ul className="text-blue-50 text-sm space-y-2">
              <li>• Mode sombre complet</li>
              <li>• Thèmes personnalisés</li>
              <li>• Export/Import des préférences</li>
              <li>• Synchronisation multi-appareils</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Contrast size={20} />
              Inspirations
            </h3>
            <p className="text-purple-50 text-sm">
              Interface inspirée des meilleurs sites : GitHub, Linear, Notion, Gmail, VS Code, Apple, Tailwind et plus encore.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
