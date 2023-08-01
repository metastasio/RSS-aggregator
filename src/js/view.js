import { newInstance } from './index.js';
import { renderRSSFeed, renderRSSPosts } from './renderRssFeed.js';

const body = document.querySelector('body');
const errorMessage = document.querySelector('.feedback');
const interfaceLanguage = document.querySelectorAll('[data-i18n]');
const sumbitButton = document.querySelector('#submitButton');
const input = document.querySelector('input');

const langMap = { ru: 'en', eng: 'ru' };

const render = (path, value, prev) => {
  // switch (path) {
  //   case 'errors':
  //     errorMessage.textContent = value.message;
  // case 'state':
  //   if (value === 'valid') {
  //     errorMessage.textContent = value.message;
  //   }
  // case 'lng':
  //   newInstance.changeLanguage(langMap[value]).then((t) => {
  //     interfaceLanguage.forEach((item) => {
  //       item.textContent = t(item.dataset.i18n);
  //     });
  //   });
  // case 'feedList':
  //   RSSRender(value);
  // case 'status':
  //   value === 'pending'
  //     ? sumbitButton.setAttribute('disabled', true)
  //     : sumbitButton.removeAttribute('disabled');
  // }

  if (path === 'errors') {
    errorMessage.textContent = value.message;
  } else if (path === 'state' && value === 'valid') {
    errorMessage.textContent = value.message;
  } else if (path === 'lng') {
    newInstance.changeLanguage(langMap[value]).then((t) => {
      interfaceLanguage.forEach((item) => {
        item.textContent = t(item.dataset.i18n);
      });
    });
  } else if (path === 'feedList') {
    renderRSSFeed(value);
  } else if (path === 'feedListItems') {
    renderRSSPosts(value);
  } else if (path === 'feedListItems') {
    console.log('KEKEKEKEk');
  } else if (path === 'status') {
    value === 'pending'
      ? sumbitButton.setAttribute('disabled', true)
      : sumbitButton.removeAttribute('disabled');
  }
};

export default render;
