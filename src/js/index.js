import '../scss/styles.scss';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty.js';
import render from './view.js';
import onChange from 'on-change';
import i18n from 'i18next';
import resources from './locales/index.js';
import aggregator from './aggregator.js';
import update from './RSSUpdate.js';
import _ from 'lodash';

const errorMessage = document.querySelector('.feedback');
const input = document.querySelector('input');

const newInstance = i18n.createInstance(
  {
    lng: 'en',
    debug: true,
    resources,
  },
  (err, t) => {
    if (err) return console.log('something went wrong loading', err);
  },
);

const schema = yup.object().shape({
  url: yup.string().required().url(),
});

const validate = (input) => {
  try {
    schema.validateSync(input, { abortEarly: false });
    return {};
  } catch (e) {
    return e;
  }
};

const app = () => {
  const state = {
    status: 'notSubmitted',
    feed: [],
    errors: {},
    state: '',
    lng: '',
    feedList: [],
    feedListItems: [],
  };

  const watchedState = onChange(state, render);

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const URL = formData.get('url');
    const objectData = Object.fromEntries(formData);
    if (watchedState.feed.includes(URL)) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      errorMessage.classList.remove('text-success');
      errorMessage.classList.add('text-danger');
      watchedState.state = 'invalid';
      watchedState.errors = { message: newInstance.t('double') };
    } else {
      watchedState.errors = validate(objectData);
      if (isEmpty(watchedState.errors)) {
        watchedState.status = 'pending';
        aggregator(URL)
          .then((result) => {
            if (result.message) {
              watchedState.errors = result;
              watchedState.status = 'notSubmitted';
            } else {
              const feedID = _.uniqueId();
              const { items, ...rest } = result;
              const formattedResult = {
                ...rest,
                id: feedID,
              };
              watchedState.feedListItems = items.map((item) => {
                return { ...item, feedID: feedID, postID: _.uniqueId() };
              });
              document.querySelector('form').reset();
              input.focus();
              input.classList.remove('is-invalid');
              input.classList.add('is-valid');
              errorMessage.classList.remove('text-danger');
              errorMessage.classList.add('text-success');
              watchedState.state = 'valid';
              watchedState.feed.push(URL);
              watchedState.errors = { message: newInstance.t('success') };
              watchedState.feedList.push(formattedResult);
              watchedState.status = 'notSubmitted';
              let timerId = setTimeout(function tick() {
                update(watchedState);
                timerId = setTimeout(tick, 5000);
              }, 5000);
            }
          })
          // .catch(() => (watchedState.errors = 'Network error'));
      } else {
        watchedState.state = 'invalid';
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        errorMessage.classList.remove('text-success');
        errorMessage.classList.add('text-danger');
        watchedState.errors = { message: newInstance.t('incorrectURL') };
      }
    }
  });

  const lngButton = document.querySelector('#lng');
  lngButton.addEventListener('click', () => {
    watchedState.lng === 'eng'
      ? (watchedState.lng = 'ru')
      : (watchedState.lng = 'eng');
  });
};
app();
export { newInstance };
