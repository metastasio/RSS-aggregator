import { newInstance } from './index.js';
import { renderRSSFeed, renderRSSPosts } from './renderRssFeed.js';

const errorMessage = document.querySelector('.feedback');
const interfaceLanguage = document.querySelectorAll('[data-i18n]');
const sumbitButton = document.querySelector('#submitButton');
// const input = document.querySelector('input');

const langMap = { ru: 'en', eng: 'ru' };

const render = (path, value, watchedState) => {
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
  } else if (path === 'feedListItems' || path === 'openPost') {
    console.log(watchedState.openPost);
    renderRSSPosts(watchedState.feedListItems);
    watchedState.openPost.forEach((item) => {
      const openedPost = document.querySelector(`[data-post-id="${item}"]`);
      openedPost.classList.remove('fw-bold');
      openedPost.classList.add('fw-normal');
    });
  } else if (path === 'status') {
    value === 'pending'
      ? sumbitButton.setAttribute('disabled', true)
      : sumbitButton.removeAttribute('disabled');
  }
};

export default render;
