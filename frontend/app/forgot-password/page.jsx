'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle, Droplets } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

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
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Email envoyé !</h2>
              <p className="text-gray-600">
                Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>📧 Vérifiez votre boîte mail</strong><br />
                Le lien est valide pendant 1 heure. Si vous ne voyez pas l'email, vérifiez vos spams.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft size={20} />
              Retour à la connexion
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
          <p className="text-gray-600 text-lg">Mot de passe oublié</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-white p-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Réinitialiser votre mot de passe
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Entrez votre email et nous vous enverrons un lien de réinitialisation
          </p>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-200 rounded-xl flex items-center gap-3 animate-fade-in">
              <AlertCircle className="text-rose-600 flex-shrink-0" size={20} />
              <p className="text-rose-800 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all duration-200 bg-white text-gray-900 font-medium"
                  placeholder="votre@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Envoyer le lien</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Retour à la connexion</span>
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          © 2026 Water Quality Monitoring System
        </p>
      </div>
    </div>
  );
}
