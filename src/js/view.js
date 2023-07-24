import { newInstance } from './index.js';
import {
  lngButton,
  addButton,
  header,
  desc,
  label,
  example,
} from './lngRender.js';

const errorMessage = document.querySelector('.feedback');

const langMap = { ru: 'en', eng: 'ru' };

const render = (path, value) => {
  if (path === 'errors') {
    errorMessage.textContent = value.message;
  } else if (path === 'state' && value === 'valid') {
    errorMessage.textContent = value.message;
  } else if (path === 'lng') {
    console.log(value);
    newInstance.changeLanguage(langMap[value]).then((t) => {
      lngButton.textContent = t('lngButtonText');
      addButton.textContent = t('addButton');
      header.textContent = t('header');
      desc.textContent = t('desc');
      label.textContent = t('placeholder');
      example.textContent = t('example');
    });
  }
};

export default render;
