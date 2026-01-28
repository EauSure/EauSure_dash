// Script to pre-generate all translations using MyMemory Free API
// Run this once to translate all website text to all languages

const fs = require('fs');
const path = require('path');

// Import source translations
const sourceTranslations = {
  // Navigation
  nav_dashboard: 'Tableau de bord',
  nav_devices: 'Dispositifs',
  nav_alerts: 'Alertes',
  nav_settings: 'Paramètres',
  nav_profile: 'Profil',
  nav_logout: 'Déconnexion',
  nav_login: 'Connexion',
  nav_register: 'Inscription',
  
  // Common
  save: 'Enregistrer',
  cancel: 'Annuler',
  delete: 'Supprimer',
  edit: 'Modifier',
  back: 'Retour',
  close: 'Fermer',
  confirm: 'Confirmer',
  loading: 'Chargement...',
  search: 'Rechercher',
  filter: 'Filtrer',
  
  // Dashboard
  welcome: 'Bienvenue',
  water_quality: 'Surveillance de la Qualité de l\'Eau',
  iot_system_desc: 'Système IoT pour puits et réservoirs profonds',
  devices_online: 'Dispositifs en ligne',
  recent_alerts: 'Alertes récentes',
  device_online: 'En ligne',
  device_offline: 'Hors ligne',
  no_alerts: 'Aucune alerte active',
  
  // Profile
  profile_edit: 'Modifier le profil',
  profile_name: 'Nom',
  profile_email: 'Email',
  profile_phone: 'Téléphone',
  profile_organization: 'Organisation',
  profile_avatar: 'Avatar',
  profile_edit_title: 'Modifier mon profil',
  profile_edit_subtitle: 'Mettez à jour vos informations personnelles',
  profile_back_settings: 'Retour aux paramètres',
  profile_save_success: 'Profil mis à jour avec succès !',
  profile_save_error: 'Une erreur est survenue',
  profile_upload_progress: 'Upload en cours...',
  profile_unsaved_changes: 'Vous avez des modifications non enregistrées',
  profile_discard_message: 'Quitter sans enregistrer ?',
  profile_keep_editing: 'Continuer',
  profile_discard: 'Quitter',
  profile_select_avatar: 'Sélectionner un avatar',
  profile_upload_custom: 'Télécharger une image personnalisée',
  profile_choose_file: 'Choisir un fichier',
  profile_upload_info: 'JPG, PNG ou GIF (max 2 MB)',
  profile_crop_image: 'Recadrer l\'image',
  profile_crop_save: 'Enregistrer',
  profile_crop_cancel: 'Annuler',
  
  // Security
  security_title: 'Sécurité',
  security_subtitle: 'Protégez votre compte avec les paramètres de sécurité',
  security_back_settings: 'Retour aux paramètres',
  security_change_password: 'Changer le mot de passe',
  security_change_password_desc: 'Modifier votre mot de passe actuel',
  security_2fa: 'Authentification à deux facteurs',
  security_2fa_desc: 'Ajouter une couche de sécurité supplémentaire',
  security_sessions: 'Sessions actives',
  security_sessions_desc: 'Gérer les appareils connectés à votre compte',
  security_activity_log: 'Journal de sécurité',
  security_activity_log_desc: 'Voir l\'historique des activités de connexion',
  security_not_available: 'Non disponible',
  
  // Settings
  settings_appearance: 'Apparence',
  settings_security: 'Sécurité',
  settings_theme: 'Thème',
  settings_language: 'Langue',
  settings_title: 'Paramètres',
  settings_subtitle: 'Gérez vos préférences et paramètres du compte',
  settings_back_dashboard: 'Retour au tableau de bord',
  settings_profile: 'Profil',
  settings_profile_desc: 'Modifier votre photo, nom, téléphone et organisation',
  settings_notifications: 'Notifications',
  settings_notifications_desc: 'Gérer les alertes et notifications du système',
  settings_security_desc: 'Modifier le mot de passe et paramètres de sécurité',
  settings_appearance_desc: 'Personnaliser le thème et l\'affichage',
  settings_data: 'Données',
  settings_data_desc: 'Exporter ou supprimer vos données',
  settings_language_region: 'Langue et Région',
  settings_language_region_desc: 'Choisir la langue et le fuseau horaire',
  coming_soon: 'Bientôt disponible',
  
  // Alerts
  alert_critical: 'Critique',
  alert_warning: 'Avertissement',
  alert_info: 'Information',
  
  // Messages
  unsaved_changes: 'Modifications non enregistrées',
  save_success: 'Enregistré avec succès',
  error_occurred: 'Une erreur est survenue',
  
  // Appearance Page
  appearance_title: 'Apparence',
  appearance_subtitle: 'Personnalisez l\'interface selon vos préférences',
  appearance_back_settings: 'Retour aux paramètres',
  appearance_theme: 'Thème',
  appearance_accent_color: 'Couleur d\'accent',
  appearance_density: 'Densité de l\'interface',
  appearance_font_size: 'Taille du texte',
  appearance_font_family: 'Police de caractères',
  appearance_language: 'Langue',
  appearance_save_all: 'Enregistrer toutes les préférences',
  appearance_all_saved: 'Tout est enregistré',
  appearance_unsaved_warning: 'Vous avez des modifications non enregistrées',
  appearance_save_success: 'Préférences enregistrées avec succès !',
  
  // Theme options
  theme_light: 'Clair',
  theme_light_desc: 'Mode clair classique',
  theme_dark: 'Sombre',
  theme_dark_desc: 'Mode sombre élégant',
  theme_auto: 'Auto',
  theme_auto_desc: 'Adapté au système',
  
  // Density options
  density_compact: 'Compact',
  density_compact_desc: 'Plus d\'informations',
  density_comfortable: 'Confortable',
  density_comfortable_desc: 'Équilibré',
  density_spacious: 'Spacieux',
  density_spacious_desc: 'Plus d\'espace',
  
  // Font sizes
  font_small: 'Petit',
  font_medium: 'Moyen',
  font_large: 'Grand',
  font_xlarge: 'Très grand',
  
  // Colors
  color_blue: 'Bleu',
  color_purple: 'Violet',
  color_green: 'Vert',
  color_orange: 'Orange',
  color_pink: 'Rose',
  color_indigo: 'Indigo',
  color_teal: 'Turquoise',
  color_red: 'Rouge',
  
  // Discard modal
  discard_title: 'Modifications non enregistrées',
  discard_message: 'Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter cette page ?',
  discard_cancel: 'Annuler',
  discard_confirm: 'Quitter sans enregistrer',
  action_required: 'Action requise',
};

const targetLanguages = ['en', 'ar', 'es'];

async function translateText(text, targetLang) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|${targetLang}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.responseData.translatedText;
  } catch (error) {
    console.error(`Error translating to ${targetLang}:`, error);
    return text;
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateTranslations() {
  console.log('🌍 Starting translation generation...\n');
  
  const translations = {
    fr: sourceTranslations
  };

  for (const lang of targetLanguages) {
    console.log(`\n📝 Translating to ${lang.toUpperCase()}...`);
    translations[lang] = {};
    
    const keys = Object.keys(sourceTranslations);
    let count = 0;
    
    for (const key of keys) {
      const sourceText = sourceTranslations[key];
      console.log(`  [${++count}/${keys.length}] ${key}: "${sourceText}"`);
      
      const translated = await translateText(sourceText, lang);
      translations[lang][key] = translated;
      
      console.log(`    → "${translated}"`);
      
      // Wait 250ms between requests to respect rate limits (4 requests/second)
      await sleep(250);
    }
    
    console.log(`✅ Completed ${lang.toUpperCase()} (${count} translations)`);
  }

  // Save to file
  const outputPath = path.join(__dirname, '..', 'lib', 'generatedTranslations.json');
  fs.writeFileSync(outputPath, JSON.stringify(translations, null, 2), 'utf-8');
  
  console.log(`\n✨ All translations generated successfully!`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`   - Languages: ${Object.keys(translations).length}`);
  console.log(`   - Keys per language: ${Object.keys(sourceTranslations).length}`);
  console.log(`   - Total translations: ${Object.keys(translations).length * Object.keys(sourceTranslations).length}`);
}

// Run if called directly
if (require.main === module) {
  generateTranslations().catch(console.error);
}

module.exports = { generateTranslations };
