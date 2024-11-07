import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    welcome: 'Welcome to the Home page!',
    facilities: 'Facilities',
    history: 'History',
    settings: 'Settings',
    language: 'Language',
    searchPlaceholder: 'Search',
  },
  fil: {
    welcome: 'Maligayang pagdating sa Home page!',
    facilities: 'Pasilidad',
    history: 'Kasaysayan',
    settings: 'Mga Setting',
    language: 'Wika',
    searchPlaceholder: 'Hanapin',
  },
};

const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
});

export default i18n;
