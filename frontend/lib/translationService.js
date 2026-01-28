// Translation Service using MyMemory Free Translation API
// Completely FREE - No API key required, no registration needed!

// Cache translations in memory to avoid repeated API calls
const translationCache = new Map();

/**
 * Translate text using MyMemory Free Translation API
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (en, ar, es, etc.)
 * @param {string} sourceLang - Source language code (default: 'fr')
 * @returns {Promise<string>} Translated text
 */
export async function translateText(text, targetLang, sourceLang = 'fr') {
  // Return original text if same language
  if (sourceLang === targetLang) {
    return text;
  }

  // Check cache first
  const cacheKey = `${text}:${sourceLang}:${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    // MyMemory Free API - No API key needed!
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.responseData.translatedText;

    // Cache the translation
    translationCache.set(cacheKey, translatedText);

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text on error
  }
}

/**
 * Translate multiple texts at once (batch translation)
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLang - Target language code
 * @param {string} sourceLang - Source language code (default: 'fr')
 * @returns {Promise<string[]>} Array of translated texts
 */
export async function translateBatch(texts, targetLang, sourceLang = 'fr') {
  if (sourceLang === targetLang) {
    return texts;
  }

  // MyMemory API doesn't support batch, so translate one by one
  // But with delay to respect rate limits (5 requests/second)
  const results = [];
  
  for (let i = 0; i < texts.length; i++) {
    const translated = await translateText(texts[i], targetLang, sourceLang);
    results.push(translated);
    
    // Add small delay between requests (200ms = 5 requests/second max)
    if (i < texts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return results;
}

/**
 * Get translation with localStorage caching
 * This prevents API calls on every render
 */
export function getCachedTranslation(key, targetLang, defaultText) {
  const cacheKey = `translation_${key}_${targetLang}`;
  
  // Check localStorage cache
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return cached;
    }
  }
  
  return defaultText;
}

/**
 * Save translation to localStorage cache
 */
export function setCachedTranslation(key, targetLang, translatedText) {
  if (typeof window !== 'undefined') {
    const cacheKey = `translation_${key}_${targetLang}`;
    localStorage.setItem(cacheKey, translatedText);
  }
}

/**
 * Clear translation cache
 */
export function clearTranslationCache() {
  translationCache.clear();
  
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('translation_')) {
        localStorage.removeItem(key);
      }
    });
  }
}
