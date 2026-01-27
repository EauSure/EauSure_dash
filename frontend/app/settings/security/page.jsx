'use client';

import { useState } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import axios from 'axios';

export default function SecurityPage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < minLength) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (!hasUpperCase || !hasLowerCase) {
      return 'Le mot de passe doit contenir des majuscules et des minuscules';
    }
    if (!hasNumber) {
      return 'Le mot de passe doit contenir au moins un chiffre';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.currentPassword) {
      setError('Veuillez entrer votre mot de passe actuel');
      setLoading(false);
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('Le nouveau mot de passe doit être différent de l\'ancien');
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put('/api/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess('Mot de passe modifié avec succès !');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 1, label: 'Faible', color: 'bg-red-500' };
    if (strength <= 3) return { strength: 2, label: 'Moyen', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength: 3, label: 'Fort', color: 'bg-green-500' };
    return { strength: 4, label: 'Très fort', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-3xl mx-auto">
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
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <Shield className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Sécurité
              </h1>
              <p className="text-gray-600">
                Modifier votre mot de passe et gérer la sécurité de votre compte
              </p>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Lock size={24} />
              Changer le mot de passe
            </h2>
            <p className="text-green-50 mt-2">
              Assurez-vous d'utiliser un mot de passe fort et unique
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Alerts */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
                <AlertCircle size={20} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700">
                <CheckCircle size={20} className="flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe actuel
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="Entrez votre mot de passe actuel"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="Entrez votre nouveau mot de passe"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Force du mot de passe:</span>
                    <span className={`text-xs font-bold ${
                      passwordStrength.strength === 1 ? 'text-red-600' :
                      passwordStrength.strength === 2 ? 'text-yellow-600' :
                      passwordStrength.strength === 3 ? 'text-green-600' :
                      'text-emerald-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold text-gray-700">Le mot de passe doit contenir:</p>
                <ul className="text-xs text-gray-600 space-y-1 ml-4">
                  <li className={`flex items-center gap-2 ${formData.newPassword.length >= 6 ? 'text-green-600' : ''}`}>
                    {formData.newPassword.length >= 6 ? '✓' : '○'} Au moins 6 caractères
                  </li>
                  <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.newPassword) && /[a-z]/.test(formData.newPassword) ? 'text-green-600' : ''}`}>
                    {/[A-Z]/.test(formData.newPassword) && /[a-z]/.test(formData.newPassword) ? '✓' : '○'} Majuscules et minuscules
                  </li>
                  <li className={`flex items-center gap-2 ${/\d/.test(formData.newPassword) ? 'text-green-600' : ''}`}>
                    {/\d/.test(formData.newPassword) ? '✓' : '○'} Au moins un chiffre
                  </li>
                </ul>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="Confirmez votre nouveau mot de passe"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="text-xs text-red-600 mt-2">Les mots de passe ne correspondent pas</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Modification en cours...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Changer le mot de passe
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Shield size={20} />
            Conseils de sécurité
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Utilisez un mot de passe unique pour ce compte</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Évitez d'utiliser des informations personnelles (nom, date de naissance, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Changez votre mot de passe régulièrement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Ne partagez jamais votre mot de passe avec qui que ce soit</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
