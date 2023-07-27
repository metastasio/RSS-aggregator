import { newInstance } from './index.js';
import RSSRender from './RSSRender';

const errorMessage = document.querySelector('.feedback');
const interfaceLanguage = document.querySelectorAll('[data-i18n]');

const langMap = { ru: 'en', eng: 'ru' };

const render = (path, value) => {
  if (path === 'errors') {
    errorMessage.textContent = value.message;
  } else if (path === 'state' && value === 'valid') {
    errorMessage.textContent = value.message;
    // console.log(watchedState)
  } else if (path === 'lng') {
    newInstance.changeLanguage(langMap[value]).then((t) => {
      interfaceLanguage.forEach((item) => {
        item.textContent = t(item.dataset.i18n);
      });
    });
  } else if (path === 'feedList'){
    RSSRender(value)
  }
};

export default render;
