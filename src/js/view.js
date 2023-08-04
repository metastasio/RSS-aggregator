import newInstance from './locales/index.js';
import { renderRSSFeed, renderRSSPosts } from './renderRssFeed.js';

const errorMessage = document.querySelector('.feedback');
const sumbitButton = document.querySelector('#submitButton');
const input = document.querySelector('input');
const langMap = { ru: 'ru', eng: 'en' };

const render = (path, value, watchedState) => {
  const interfaceLanguage = document.querySelectorAll('[data-i18n]');
  switch (path) {
    case 'errors':
      input.classList.add('is-invalid');
      errorMessage.classList.remove('text-success');
      errorMessage.classList.add('text-danger');
      errorMessage.textContent = value.message;
      break;
    case 'state':
      if (value === 'valid') {
        document.querySelector('form').reset();
        input.focus();
        input.classList.remove('is-invalid');
        errorMessage.classList.remove('text-danger');
        errorMessage.classList.add('text-success');
        errorMessage.setAttribute('data-i18n', 'success');
        errorMessage.textContent = newInstance.t('success');
      }
      break;
    case 'lng':
      newInstance.changeLanguage(langMap[value]).then(() => {
        interfaceLanguage.forEach((item) => {
          const lngItem = item;
          lngItem.textContent = newInstance.t(item.dataset.i18n);
        });
      });
      break;
    case 'feedList':
      renderRSSFeed(watchedState.feedList);
      break;
    case 'feedListItems':
    case 'openPost':
      renderRSSPosts(watchedState);
      break;
    case 'status':
      if (value === 'pending') {
        sumbitButton.setAttribute('disabled', true);
      } else {
        sumbitButton.removeAttribute('disabled');
      }
      break;
    default:
      break;
  }
};

export default render;
