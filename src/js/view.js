import { newInstance } from './index.js';
// import RSSRender from './RSSRender';
import { renderRSSFeed, renderRSSPosts } from './RenderRssFeed.js';

const errorMessage = document.querySelector('.feedback');
const interfaceLanguage = document.querySelectorAll('[data-i18n]');
const sumbitButton = document.querySelector('#submitButton');

const langMap = { ru: 'en', eng: 'ru' };

const render = (path, value) => {
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
  } else if (path.startsWith('feedList')) {
    // console.log(value);
    renderRSSFeed(value);
    renderRSSPosts(value);
    // RSSRender(value);
  } else if (path === 'status') {
    value === 'pending'
      ? sumbitButton.setAttribute('disabled', true)
      : sumbitButton.removeAttribute('disabled');
  }
};

export default render;
