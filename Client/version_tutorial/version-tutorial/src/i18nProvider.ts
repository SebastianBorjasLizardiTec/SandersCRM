import PolyglotI18nProvider from 'ra-i18n-polyglot';
import spanishMessages from './translations';



export const i18nProvider = PolyglotI18nProvider(
    locale => spanishMessages, 'es');