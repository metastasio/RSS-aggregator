import newInstance from './locales/index.js';
import { renderRSSFeed, renderRSSPosts } from './renderRssFeed.js';

const errorMessage = document.querySelector('.feedback');
const interfaceLanguage = document.querySelectorAll('[data-i18n]');
const sumbitButton = document.querySelector('#submitButton');
const input = document.querySelector('input');
const langMap = { ru: 'ru', eng: 'en' };

const render = (path, value, watchedState) => {
  switch (path) {
    case 'errors':
      input.classList.remove('is-valid');
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
        input.classList.add('is-valid');
        errorMessage.classList.remove('text-danger');
        errorMessage.classList.add('text-success');
        errorMessage.textContent = newInstance.t('success');
      }
      break;
    case 'lng':
      newInstance.changeLanguage(langMap[value]).then(() => {
        interfaceLanguage.forEach((item) => {
          item.textContent = newInstance.t(item.dataset.i18n);
        });
      });
      break;
    case 'feedList':
      renderRSSFeed(watchedState.feedList);
      break;
    case 'feedListItems':
    case 'openPost':
      renderRSSPosts(watchedState.feedListItems);
      watchedState.openPost.forEach((item) => {
        const openedPost = document.querySelector(`[data-post-id="${item}"]`);
        openedPost.classList.remove('fw-bold');
        openedPost.classList.add('fw-normal');
      });
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
