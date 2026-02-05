import { useMemo } from 'react';
import translations from './AppealFormTranslations.json';

export const useTranslation = () => {
  const t = useMemo(() => {
    return (key, params = {}) => {
      let translation = translations[key] || key;
      
      // Replace parameters in the translation
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
      
      return translation;
    };
  }, []);

  return { t };
};