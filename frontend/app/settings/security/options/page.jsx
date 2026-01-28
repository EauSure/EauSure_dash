'use client';

import { ArrowLeft, Lock, Shield, Key, Smartphone, AlertTriangle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function SecurityOptionsPage() {
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  const securityOptions = [
    {
      icon: Lock,
      title: 'Changer le mot de passe',
      description: 'Modifier votre mot de passe actuel',
      href: '/settings/security/change-password',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      available: true,
    },
    {
      icon: Smartphone,
      title: 'Authentification à deux facteurs',
      description: 'Ajouter une couche de sécurité supplémentaire',
      href: '/settings/security/2fa',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      available: false,
    },
    {
      icon: Key,
      title: 'Sessions actives',
      description: 'Gérer les appareils connectés à votre compte',
      href: '/settings/security/sessions',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      available: false,
    },
    {
      icon: AlertTriangle,
      title: 'Journal de sécurité',
      description: 'Voir l\'historique des activités de connexion',
      href: '/settings/security/activity-log',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-4xl mx-auto">
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
                Protégez votre compte avec les paramètres de sécurité
              </p>
            </div>
          </div>
        </div>

        {/* Security Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityOptions.map((option, index) => {
            const Icon = option.icon;

            return (
              <Link
                key={index}
                href={option.available ? option.href : '#'}
                className={`group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 ${
                  !option.available ? 'opacity-60 cursor-not-allowed' : 'hover:border-green-200'
                }`}
                onClick={(e) => {
                  if (!option.available) {
                    e.preventDefault();
                  }
                }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${option.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={option.textColor} size={28} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-between">
                    {option.title}
                    {option.available ? (
                      <ChevronRight className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" size={20} />
                    ) : (
                      <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        Bientôt
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {option.description}
                  </p>
                </div>

                {/* Gradient Border on Hover */}
                {option.available && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Security Tips */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Shield size={20} />
            Conseils de sécurité
          </h3>
          <ul className="text-green-50 text-sm space-y-2">
            <li>• Utilisez un mot de passe unique et fort pour votre compte</li>
            <li>• Changez votre mot de passe régulièrement</li>
            <li>• Ne partagez jamais vos informations de connexion</li>
            <li>• Vérifiez régulièrement les activités suspectes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
