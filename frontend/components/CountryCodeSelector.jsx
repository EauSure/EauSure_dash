'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { COUNTRY_CODES } from '@/lib/countries';

export default function CountryCodeSelector({ value, onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const selectedCountry = COUNTRY_CODES.find(c => c.code === value) || COUNTRY_CODES[0];

  const filteredCountries = COUNTRY_CODES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.includes(searchTerm) ||
    country.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (country) => {
    onChange(country.code);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Value Display */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-48 px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all duration-200 bg-white text-gray-900 font-medium flex items-center justify-between gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2">
          <img 
            src={`https://flagcdn.com/24x18/${selectedCountry.country.toLowerCase()}.png`}
            alt={selectedCountry.name}
            className="w-6 h-4 object-cover rounded"
          />
          <span className="text-sm">{selectedCountry.country}</span>
          <span className="text-xs text-gray-500">{selectedCountry.code}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-[100] w-80 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un pays..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
              autoFocus
            />
          </div>

          {/* Countries List */}
          <div className="overflow-y-auto max-h-80">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code + country.country}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-cyan-50 transition-colors text-left ${
                    country.code === value ? 'bg-cyan-50 text-cyan-700' : 'text-gray-700'
                  }`}
                >
                  <img 
                    src={`https://flagcdn.com/24x18/${country.country.toLowerCase()}.png`}
                    alt={country.name}
                    className="w-6 h-4 object-cover rounded flex-shrink-0"
                  />
                  <span className="font-medium flex-1 text-sm">{country.name}</span>
                  <span className="text-xs text-gray-500">{country.code}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                Aucun pays trouvé
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
