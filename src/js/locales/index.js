import i18n from 'i18next';
import en from './en.js';
import ru from './ru.js';

const newInstance = i18n.createInstance(
  {
    lng: 'ru',
    debug: true,
    resources: {
      en,
      ru,
    },
  },
  (err) => {
    if (err) return console.log('something went wrong loading', err);
  },
);

export default newInstance;
