'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTranslation } from '@/lib/translations';

const AppearanceContext = createContext();

export function AppearanceProvider({ children }) {
  const [fontFamily, setFontFamily] = useState('inter');
  const [fontSize, setFontSize] = useState('medium');
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('blue');
  const [density, setDensity] = useState('comfortable');
  const [language, setLanguage] = useState('fr');

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedFontFamily = localStorage.getItem('fontFamily');
    const savedFontSize = localStorage.getItem('fontSize');
    const savedTheme = localStorage.getItem('theme');
    const savedAccentColor = localStorage.getItem('accentColor');
    const savedDensity = localStorage.getItem('density');
    const savedLanguage = localStorage.getItem('language');

    if (savedFontFamily) setFontFamily(savedFontFamily);
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedTheme) setTheme(savedTheme);
    if (savedAccentColor) setAccentColor(savedAccentColor);
    if (savedDensity) setDensity(savedDensity);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  // Apply font family to document
  useEffect(() => {
    const fontClasses = {
      inter: 'font-sans',
      system: 'font-system',
      mono: 'font-mono',
    };

    const fontClass = fontClasses[fontFamily] || 'font-sans';
    
    // Remove all font classes
    document.documentElement.classList.remove('font-sans', 'font-system', 'font-mono');
    
    // Add selected font class
    document.documentElement.classList.add(fontClass);
    
    // Save to localStorage
    localStorage.setItem('fontFamily', fontFamily);
  }, [fontFamily]);

  // Apply font size to document
  useEffect(() => {
    const sizeClasses = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
      xlarge: 'text-xl',
    };

    const sizeClass = sizeClasses[fontSize] || 'text-base';
    
    // Remove all size classes
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    
    // Add selected size class
    document.documentElement.classList.add(sizeClass);
    
    // Save to localStorage
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // Apply language to document (direction and lang attribute)
  useEffect(() => {
    // Set lang attribute
    document.documentElement.lang = language;
    
    // Set direction for RTL languages
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    
    // Save to localStorage
    localStorage.setItem('language', language);
  }, [language]);

  // Apply density to document
  useEffect(() => {
    const densityClasses = {
      compact: 'density-compact',
      comfortable: 'density-comfortable',
      spacious: 'density-spacious',
    };

    const densityClass = densityClasses[density] || 'density-comfortable';
    
    // Remove all density classes
    document.documentElement.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
    
    // Add selected density class
    document.documentElement.classList.add(densityClass);
    
    // Save to localStorage
    localStorage.setItem('density', density);
  }, [density]);

  // Apply accent color to document
  useEffect(() => {
    const accentClasses = {
      blue: 'accent-blue',
      purple: 'accent-purple',
      green: 'accent-green',
      orange: 'accent-orange',
      pink: 'accent-pink',
      indigo: 'accent-indigo',
      teal: 'accent-teal',
      red: 'accent-red',
    };

    const accentClass = accentClasses[accentColor] || 'accent-blue';
    
    // Remove all accent classes
    document.documentElement.classList.remove('accent-blue', 'accent-purple', 'accent-green', 'accent-orange', 'accent-pink', 'accent-indigo', 'accent-teal', 'accent-red');
    
    // Add selected accent class
    document.documentElement.classList.add(accentClass);
    
    // Save to localStorage
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  const savePreferences = () => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('accentColor', accentColor);
    localStorage.setItem('density', density);
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('language', language);
  };

  // Create translation function that depends on language state
  const t = useCallback((key) => {
    return getTranslation(language, key);
  }, [language]);

  const value = {
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    density,
    setDensity,
    language,
    setLanguage,
    savePreferences,
    t,
  };

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error('useAppearance must be used within AppearanceProvider');
  }
  return context;
}
