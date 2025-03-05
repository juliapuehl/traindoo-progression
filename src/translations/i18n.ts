import detectBrowserLanguage from 'detect-browser-language';
import I18n from 'i18n-js';
import moment from 'moment';
import 'moment/locale/de';
import {useSelector} from 'react-redux';
import {getUserDateFormat, getUserLang} from '../logic/firestore';
import de from './de.json';
import en from './en.json';

export const useInitLocales = () => {
  const userLang = useSelector(getUserLang);
  const userDateFormat = useSelector(getUserDateFormat);
  return () => {
    // Use Language from appSettings. If thats not defined use device language
    const lang = userLang ? userLang : detectBrowserLanguage();
    I18n.locale = lang;
    I18n.defaultLocale = 'de-DE';
    I18n.fallbacks = true;
    I18n.translations = {en, de};
    // set moment's locale & add custom "l" && "ll" format
    if (userDateFormat === 'us') {
      const localeData = moment.localeData('en');
      moment.updateLocale('en', {
        longDateFormat: {
          LT: localeData.longDateFormat('LT'),
          LTS: localeData.longDateFormat('LTS'),
          L: localeData.longDateFormat('L'),
          l: 'MM/DD',
          LL: localeData.longDateFormat('LL'),
          ll: 'ddd M/D',
          LLL: localeData.longDateFormat('LLL'),
          LLLL: localeData.longDateFormat('LLLL'),
        },
      });
    } else {
      const localeData = moment.localeData('de');
      moment.updateLocale('de', {
        longDateFormat: {
          LT: localeData.longDateFormat('LT'),
          LTS: localeData.longDateFormat('LTS'),
          L: localeData.longDateFormat('L'),
          l: 'DD.MM.',
          LL: localeData.longDateFormat('LL'),
          ll: 'ddd D.M.',
          LLL: localeData.longDateFormat('LLL'),
          LLLL: localeData.longDateFormat('LLLL'),
        },
      });
    }
  };
};
