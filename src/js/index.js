import '../scss/styles.scss';
import 'bootstrap/js/dist/modal.js';
import * as yup from 'yup';
import render from './view.js';
import onChange from 'on-change';
import i18n from 'i18next';
import resources from './locales/index.js';
import aggregator from './aggregator.js';
import update from './RSSUpdate.js';
import _ from 'lodash';

const newInstance = i18n.createInstance(
  {
    lng: 'ru',
    debug: true,
    resources,
  },
  (err) => {
    if (err) return console.log('something went wrong loading', err);
  },
);

const app = () => {
  const state = {
    status: 'notSubmitted',
    feed: [],
    errors: {},
    state: '',
    lng: 'ru',
    feedList: [],
    feedListItems: [],
    openPost: [],
  };

  const watchedState = onChange(state, (path, value) => {
    render(path, value, watchedState);
  });

  const schema = yup.object().shape({
    url: yup
      .string(newInstance.t('incorrectURL'))
      .required(newInstance.t('empty'))
      .url(newInstance.t('incorrectURL'))
      .oneOf(watchedState.feed, newInstance.t('double')),
  });

  const validate = (input) => {
    try {
      schema.validateSync(input, { abortEarly: false });
      return {};
    } catch (e) {
      return e;
    }
  };

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const URL = formData.get('url');
    const objectData = Object.fromEntries(formData);

    const validation = validate(objectData);
    switch (_.isEmpty(validation)) {
      case true:
        watchedState.status = 'pending';
        console.log(watchedState.feed);
        aggregator(URL)
          .then((result) => {
            if (result.message) {
              watchedState.errors = result;
              watchedState.state = 'invalid';
              watchedState.status = 'notSubmitted';
            } else {
              watchedState.feed.push(URL);
              watchedState.status = 'notSubmitted';
              watchedState.state = 'valid';
              const feedID = _.uniqueId();
              const { items, ...rest } = result;
              const formattedResult = {
                ...rest,
                id: feedID,
              };
              watchedState.feedListItems = items.map((item) => {
                return { ...item, feedID: feedID, postID: _.uniqueId() };
              });
              watchedState.feedList.push(formattedResult);
              let timerId = setTimeout(function tick() {
                update(watchedState);
                timerId = setTimeout(tick, 5000);
              }, 5000);
            }
          })
          .catch(() => (watchedState.errors = 'Network error'));
      case false:
        watchedState.state = 'invalid';
        watchedState.errors = validation;
    }
  });

  const lngButton = document.querySelector('#lng');
  lngButton.addEventListener('click', () => {
    watchedState.lng === 'eng'
      ? (watchedState.lng = 'ru')
      : (watchedState.lng = 'eng');
  });

  const modal = document.getElementById('modal');
  modal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const title = button.getAttribute('data-bs-title');
    const link = button.getAttribute('data-bs-link');
    const description = button.getAttribute('data-bs-description');
    const id = button.getAttribute('data-post-id');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const modalFooter = modal.querySelector('.modal-footer');
    const modalFooterLink = modalFooter.querySelector('a');
    modalFooterLink.setAttribute('href', link);
    modalTitle.textContent = title;
    modalBody.textContent = description;
    watchedState.openPost.push(id);
  });
};
app();
export { newInstance };
