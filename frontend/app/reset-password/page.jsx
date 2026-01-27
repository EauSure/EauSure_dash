'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Droplets } from 'lucide-react';
import axios from 'axios';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    if (!token) {
      setError('Lien invalide ou expiré');
      setValidating(false);
      return;
    }

    // Validate token
    const validateToken = async () => {
      try {
        await axios.post('/api/auth/validate-reset-token', { token });
        setValidating(false);
      } catch (err) {
        setError('Lien invalide ou expiré');
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/auth/reset-password', {
        token,
        newPassword: formData.password,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Validation du lien...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 shadow-2xl mb-4">
              <Droplets size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Water Quality
            </h1>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-white p-8 animate-fade-in">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Mot de passe modifié !</h2>
              <p className="text-gray-600 mb-6">
                Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 shadow-2xl mb-4">
              <Droplets size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Water Quality
            </h1>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-white p-8 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Lien invalide</h2>
              <p className="text-gray-600">
                Ce lien est invalide ou a expiré. Veuillez demander un nouveau lien de réinitialisation.
              </p>
            </div>

            <Link
              href="/forgot-password"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Demander un nouveau lien
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 shadow-2xl mb-4">
            <Droplets size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Water Quality
          </h1>
          <p className="text-gray-600 text-lg">Nouveau mot de passe</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-white p-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Créer un nouveau mot de passe
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-200 rounded-xl flex items-center gap-3 animate-fade-in">
              <AlertCircle className="text-rose-600 flex-shrink-0" size={20} />
              <p className="text-rose-800 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPasswords.password ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all duration-200 bg-white text-gray-900 font-medium"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, password: !showPasswords.password })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.password ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
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
                  <li className={`flex items-center gap-2 ${formData.password.length >= 6 ? 'text-green-600' : ''}`}>
                    {formData.password.length >= 6 ? '✓' : '○'} Au moins 6 caractères
                  </li>
                  <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                    {/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? '✓' : '○'} Majuscules et minuscules
                  </li>
                  <li className={`flex items-center gap-2 ${/\d/.test(formData.password) ? 'text-green-600' : ''}`}>
                    {/\d/.test(formData.password) ? '✓' : '○'} Au moins un chiffre
                  </li>
                </ul>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all duration-200 bg-white text-gray-900 font-medium"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-600 mt-2">Les mots de passe ne correspondent pas</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Réinitialisation...</span>
                </>
              ) : (
                <>
                  <Lock size={20} />
                  <span>Réinitialiser le mot de passe</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          © 2026 Water Quality Monitoring System
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
