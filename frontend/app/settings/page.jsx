'use client';

import { useState } from 'react';
import { User, Bell, Shield, Palette, Database, Globe, ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function SettingsPage() {
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  const settingsCategories = [
    {
      icon: User,
      title: 'Profil',
      description: 'Modifier votre photo, nom, téléphone et organisation',
      href: '/profile/edit',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Gérer les alertes et notifications du système',
      href: '/settings/notifications',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      icon: Shield,
      title: 'Sécurité',
      description: 'Modifier le mot de passe et paramètres de sécurité',
      href: '/settings/security',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      icon: Palette,
      title: 'Apparence',
      description: 'Personnaliser le thème et l\'affichage',
      href: '/settings/appearance',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      icon: Database,
      title: 'Données',
      description: 'Exporter ou supprimer vos données',
      href: '/settings/data',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      icon: Globe,
      title: 'Langue et Région',
      description: 'Choisir la langue et le fuseau horaire',
      href: '/settings/language',
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Retour au tableau de bord</span>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Paramètres
          </h1>
          <p className="text-gray-600">
            Gérez vos préférences et paramètres du compte
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsCategories.map((category, index) => {
            const Icon = category.icon;
            const isAvailable = category.href === '/profile/edit' || category.href === '/settings/security';

            return (
              <Link
                key={index}
                href={isAvailable ? category.href : '#'}
                className={`group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 ${
                  !isAvailable ? 'opacity-60 cursor-not-allowed' : 'hover:border-blue-200'
                }`}
                onClick={(e) => {
                  if (!isAvailable) {
                    e.preventDefault();
                  }
                }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${category.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={category.textColor} size={28} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-between">
                    {category.title}
                    {isAvailable ? (
                      <ChevronRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
                    ) : (
                      <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        Bientôt
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </div>

                {/* Gradient Border on Hover */}
                {isAvailable && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                    style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-bold mb-2">💡 Besoin d'aide ?</h3>
          <p className="text-blue-50 text-sm">
            Si vous rencontrez des difficultés ou avez des questions, contactez l'administrateur du système.
          </p>
        </div>
      </div>
    </div>
  );
}
