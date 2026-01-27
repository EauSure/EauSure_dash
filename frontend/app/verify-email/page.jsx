'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, CheckCircle, AlertCircle, Droplets } from 'lucide-react';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    if (!email) {
      router.push('/register');
    }
  }, [email, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code || code.length !== 6) {
      setError('Veuillez entrer un code à 6 chiffres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Code invalide ou expiré');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Code invalide ou expiré');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Impossible de renvoyer le code');
      }

      setResendMessage('Code renvoyé avec succès ! Vérifiez votre email.');
    } catch (err) {
      setError(err.message || 'Impossible de renvoyer le code');
    } finally {
      setResending(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
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
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Email vérifié !</h2>
              <p className="text-gray-600 mb-6">
                Votre adresse email a été vérifiée avec succès. Vous allez être redirigé vers la page de connexion...
              </p>
            </div>
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
          <p className="text-gray-600 text-lg">Vérification de votre email</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-white p-8 animate-fade-in">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-100 mb-4">
              <Mail size={32} className="text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Vérifiez votre email
            </h2>
            <p className="text-gray-600 text-sm">
              Un code de vérification à 6 chiffres a été envoyé à<br />
              <span className="font-semibold text-gray-800">{email}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-200 rounded-xl flex items-center gap-3 animate-fade-in">
              <AlertCircle className="text-rose-600 flex-shrink-0" size={20} />
              <p className="text-rose-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {resendMessage && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <p className="text-green-800 text-sm font-medium">{resendMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
                Code de vérification
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={handleCodeChange}
                required
                maxLength={6}
                placeholder="000000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all duration-200 bg-white text-gray-900 font-bold text-center text-2xl tracking-widest"
                disabled={loading}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Entrez le code à 6 chiffres reçu par email
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  <span>Vérifier l'email</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Vous n'avez pas reçu le code ?
            </p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? 'Envoi en cours...' : 'Renvoyer le code'}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          © 2026 Water Quality Monitoring System
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
